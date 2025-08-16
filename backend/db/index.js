// db/index.js
require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

// If the pool emits an error, exit (this is typical for simple apps)
pool.on('error', (err) => {
  console.error('Unexpected PG error', err);
  process.exit(-1);
});

async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Optional helper: run SQL migrations from migrations folder.
 * Implement a small migration runner or hook your preferred tool (node-pg-migrate, umzug, flyway).
 * For now this is a placeholder so index.js can safely require ./db and optionally run migrations.
 */
async function runMigrations() {
  // implement migration runner if you want automatic migrations at startup.
  // For safety in production, prefer manual CLI-run migrations.
  return;
}

module.exports = { pool, query, runMigrations };
