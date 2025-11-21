// routes/setuRoutes.js
const express = require("express");
const {
  createConsent,
  handleNotifications,
  createDataSession,
  fetchFIBySession,
  revokeConsent,
} = require("../controllers/setuController.js");
const { verifySetuSignatureMiddleware } = require("../middlewares/verifySetuSignature.js");
const requireAuth = require("../middlewares/requireAuth.js");

const router = express.Router();

router.post("/consents",requireAuth,createConsent);

// Capture raw body only for notifications route so other JSON endpoints behave normally
router.post(
  "/notifications",
  express.raw({ type: "*/*" }),
  (req, res, next) => {
    try {
      req.setuRawBody = req.body; // keep raw version
      next();
    } catch (e) {
      next(e);
    }
  },
  handleNotifications
);

router.post("/data-sessions", createDataSession);
router.get("/data-sessions/:sessionId/fetch", fetchFIBySession);
router.post("/consents/:consentId/revoke", revokeConsent);

module.exports = router;
