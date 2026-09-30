const express = require("express");

const {
    getAdminStats
} = require("../controllers/adminStatsController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// GET ADMIN STATISTICS
router.get(
    "/",
    protect,
    adminMiddleware,
    getAdminStats
);


module.exports = router;