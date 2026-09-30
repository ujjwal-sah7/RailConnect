const express = require("express");

const {
    createBooking,
    getMyBookings,
    cancelBooking
} = require("../controllers/bookingController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// GET MY BOOKINGS
// GET /api/bookings/my
// =====================================

router.get(
    "/my",
    protect,
    getMyBookings
);


// =====================================
// CANCEL BOOKING
// PATCH /api/bookings/:id/cancel
// =====================================

router.patch(
    "/:id/cancel",
    protect,
    cancelBooking
);


// =====================================
// CREATE BOOKING
// POST /api/bookings
// =====================================

router.post(
    "/",
    protect,
    createBooking
);


module.exports = router;