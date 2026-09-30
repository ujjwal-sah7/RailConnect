const express = require("express");

const {
    getAllAdminBookings
} = require("../controllers/adminBookingController");

const protect =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// =====================================
// GET ALL BOOKINGS
// =====================================

router.get(
    "/",
    protect,
    adminMiddleware,
    getAllAdminBookings
);


module.exports = router;