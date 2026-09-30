const express = require("express");

const {
    getProfile,
    changePassword
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// GET USER PROFILE
// =====================================

router.get(
    "/profile",
    protect,
    getProfile
);


// =====================================
// CHANGE PASSWORD
// =====================================

router.patch(
    "/change-password",
    protect,
    changePassword
);


module.exports = router;