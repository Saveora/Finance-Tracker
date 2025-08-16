// index.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { runMigrations } = require('./db'); // optional
const { query } = require('./db');

const app = express();

// Basic security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting (basic)
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// body parser limits
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// CORS - for local dev allow your frontend origin (set in env)
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

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
    // optional migrations (disabled by default - implement runMigrations if you want it)
    if (process.env.RUN_MIGRATIONS === 'true') {
      await runMigrations();
    }

    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start app', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
