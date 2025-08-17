// db/index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

// parse DB name from URL safely
const dbUrl = new URL(connectionString);
const dbName = dbUrl.pathname.replace(/^\//, ''); // remove leading slash

let pool = null;

/**
 * Ensure DB exists by connecting to the 'postgres' admin DB and checking pg_database.
 */
async function ensureDatabase() {
  const adminUrl = new URL(connectionString);
  adminUrl.pathname = '/postgres';

  const client = new Client({ connectionString: adminUrl.toString() });
  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // CREATE DATABASE cannot be parametrized, but dbName was parsed from URL
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully!`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } finally {
    await client.end();
  }
}

/**
 * Initialize pool (call this before starting the server).
 * Options:
 *  - max: max clients in pool
 *  - idleTimeoutMillis, connectionTimeoutMillis
 *  - ssl: optional ssl object for hosted DBs
 */
async function initDb({
  max = 10,
  idleTimeoutMillis = 30000,
  connectionTimeoutMillis = 5000,
  ssl = null,
} = {}) {
  await ensureDatabase();

  const poolOpts = {
    connectionString,
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  };

  if (ssl) poolOpts.ssl = ssl;

  pool = new Pool(poolOpts);

  pool.on('error', (err) => {
    console.error('Unexpected PG pool error', err);
    // In many apps you may want to continue, but here we exit to make failures explicit.
    process.exit(-1);
  });

  // export updated references so other modules that read db.pool after init get the live pool
  module.exports.pool = pool;
  module.exports.query = query;

  console.log('Postgres pool initialized');
  return pool;
}

// Query helper (safe wrapper around pool.query)
async function query(text, params) {
  if (!pool) throw new Error('Database pool not initialized yet');
  return pool.query(text, params);
}

function getPool() {
  if (!pool) throw new Error('Database pool not initialized yet');
  return pool;
}

/**
 * Run migrations with tracking.
 * - Checks both db/migrations and ./migrations (project root).
 * - Uses a schema_migrations table to track applied files (filename unique).
 * - Runs each new migration inside a transaction and records it on success.
 */
async function runMigrations() {
  if (!pool) throw new Error('Database pool not initialized yet');

  // candidate dirs, first found is used
  const candidateDirs = [
    path.join(__dirname, 'migrations'),        // db/migrations
    path.join(process.cwd(), 'migrations'),    // <project-root>/migrations
  ];

  let migrationsDir = null;
  for (const d of candidateDirs) {
    if (fs.existsSync(d)) {
      migrationsDir = d;
      break;
    }
  }

  if (!migrationsDir) {
    console.log('No migrations folder found (checked db/migrations and ./migrations). Skipping migrations.');
    return;
  }

  console.log(`Running migrations from: ${migrationsDir}`);

  // ensure schema_migrations table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // get list of already applied migrations
  const appliedRes = await pool.query(`SELECT filename FROM schema_migrations`);
  const applied = new Set(appliedRes.rows.map(r => r.filename));

  // read migration files (sorted)
  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping already-applied migration: ${file}`);
      continue;
    }

    const fullPath = path.join(migrationsDir, file);
    console.log(`Applying migration: ${file}`);

    const sql = fs.readFileSync(fullPath, 'utf8');

    // Run migration in transaction, then record it in schema_migrations
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Execute SQL file. Note: Postgres accepts multiple statements separated by semicolons.
      // If your SQL files have special needs (psql meta-commands), consider using a dedicated tool.
      await client.query(sql);
      await client.query(
        `INSERT INTO schema_migrations (filename) VALUES ($1)`,
        [file]
      );
      await client.query('COMMIT');
      console.log(`Applied migration: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error(`Migration ${file} failed:`, err && err.message ? err.message : err);
      client.release();
      throw err; // stop processing further migrations
    } finally {
      client.release();
    }
  }

  console.log('Migrations complete.');
}

// Graceful shutdown helper
async function closePool() {
  if (pool) {
    try {
      await pool.end();
      console.log('Postgres pool closed');
    } catch (err) {
      console.error('Error while closing pool', err);
    } finally {
      pool = null;
    }
  }
}

// Listen for termination signals and close pool
process.on('SIGINT', () => {
  console.log('SIGINT received - closing pool');
  closePool().then(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received - closing pool');
  closePool().then(() => process.exit(0));
});
process.on('exit', () => {
  if (pool) pool.end();
});

module.exports = {
  initDb,
  pool,        // note: updated inside initDb by assigning module.exports.pool = pool
  query,
  runMigrations,
  getPool,
  closePool,
};
