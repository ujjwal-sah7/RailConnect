
const express = require("express");

const {
  getAllAdminBookings,
  updateAdminBookingStatus
} = require("../controllers/adminBookingController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all bookings
router.get(
  "/",
  protect,
  adminMiddleware,
  getAllAdminBookings
);

// Update a booking's status
router.patch(
  "/:id/status",
  protect,
  adminMiddleware,
  updateAdminBookingStatus
);

module.exports = router;
