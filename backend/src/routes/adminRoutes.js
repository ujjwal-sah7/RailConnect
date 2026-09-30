const express = require("express");

const protect =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// =====================================
// ADMIN TEST ROUTE
// =====================================

router.get(
    "/test",
    protect,
    adminMiddleware,
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Admin API access successful",

            admin: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }

        });

    }
);


module.exports = router;