const express = require("express");

const {
    getAllAdminUsers
} = require("../controllers/adminUserController");

const protect =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// =====================================
// GET ALL USERS
// =====================================

router.get(
    "/",
    protect,
    adminMiddleware,
    getAllAdminUsers
);


module.exports = router;