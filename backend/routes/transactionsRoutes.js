// backend/routes/transactionsRoutes.js
const express = require("express");
const { listTransactions } = require("../controllers/transactionsController");
const router = express.Router();

// GET /api/transactions
router.get("/", listTransactions);

module.exports = router;
