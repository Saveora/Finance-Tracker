// backend/routes/paymentScheduleRoutes.js
const express = require("express");
const {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
} = require("../controllers/paymentScheduleController.js");

const router = express.Router();

// All handlers assume req.user is set by requireAuth (mounted in index.js)
router.post("/", createSchedule);
router.get("/", getSchedules);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.patch("/:id/toggle", toggleSchedule);

module.exports = router;
