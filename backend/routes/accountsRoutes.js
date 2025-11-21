// backend/routes/accountsRoutes.js
const express = require("express");
// const { listAccounts, getAccount, listTransactions } = require("../controllers/accountsController");
const { listAccounts, getAccount} = require("../controllers/accountsController");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/", requireAuth,listAccounts); // GET /api/accounts?consentId=...
// router.get("/:id", requireAuth, getAccount); // GET /api/accounts/:id
// router.get("/transactions/all", listTransactions); // GET /api/accounts/transactions/all?limit=50&offset=0

module.exports = router;
