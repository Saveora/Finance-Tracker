require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const { initDb, runMigrations } = require('./db'); // <- initDb + runMigrations

const app = express();

// Basic security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting (basic)
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// body parser limits
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// CORS
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ✅ Google OAuth - add passport
const passport = require('passport');
app.use(passport.initialize());

// routes
app.use('/', authRoutes);

// test protected route
const requireAuth = require('./middlewares/requireAuth');
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // initialize DB (with default pool options)
    await initDb();

    // Run migrations automatically in development OR if explicitly requested.
    // - Runs if NODE_ENV !== 'production' (typical dev) OR if RUN_MIGRATIONS=true
    // - This is safe for dev; for production prefer RUN_MIGRATIONS=true only with tested migrations.
    const shouldRunMigrations = process.env.NODE_ENV !== 'production' || process.env.RUN_MIGRATIONS === 'true';
    if (shouldRunMigrations) {
      console.log('Running DB migrations...');
      await runMigrations();
      console.log('Migrations finished.');
    } else {
      console.log('Skipping automatic migrations (production mode).');
    }

    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start app', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
