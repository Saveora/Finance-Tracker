// backend/index.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const app = express();
// app.js or index.js (before routes)
app.set('trust proxy', 1); // 1 = trust the first proxy
const setuRoutes = require("./routes/setuRoutes.js");
const { initDb, runMigrations } = require("./db");
const accountsRoutes = require("./routes/accountsRoutes");
const transactionsRoutes = require("./routes/transactionsRoutes");
const paymentScheduleRoutes = require("./routes/paymentScheduleRoutes.js");
// Basic security headers
const helmet = require("helmet");
app.use(helmet());

// JSON parsing for normal endpoints
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// CORS - allow Authorization and cookies
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with', 'Accept'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}));

// Rate limiting (basic)
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// Passport (if used)
const passport = require("passport");
app.use(passport.initialize());
const requireAuth = require("./middlewares/requireAuth");
// routes
app.use("/", authRoutes);
app.use("/api/setu", setuRoutes);
app.use("/api/accounts", accountsRoutes); // list and get accounts + transactions
app.use("/api/transactions",requireAuth, transactionsRoutes);


app.use('/api/payment-schedules', requireAuth, paymentScheduleRoutes);

// health and test routes
app.get("/api/me", requireAuth, (req, res) => res.json({ ok: true, user: req.user }));
app.get("/health", (req, res) => res.json({ ok: true }));
// after other route imports
const dashboardRoutes = require('./routes/dashboardRoutes');

// ... later where other routes are mounted:
app.use('/api/dashboard', dashboardRoutes);

const tokenManager = require('./tokenManager');
tokenManager.init({
  authUrl: process.env.SETU_AUTH_URL,
  clientId: process.env.SETU_CLIENT_ID,
  clientSecret: process.env.SETU_CLIENT_SECRET,
  refreshBeforeMs: 60 * 1000
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
    const shouldRunMigrations = process.env.NODE_ENV !== "production" || process.env.RUN_MIGRATIONS === "true";
    if (shouldRunMigrations) {
      console.log("Running DB migrations...");
      await runMigrations();
      console.log("Migrations finished.");
    } else {
      console.log("Skipping automatic migrations (production mode).");
    }
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Failed to start app", err && err.message ? err.message : err);
    process.exit(1);
  }
})();
