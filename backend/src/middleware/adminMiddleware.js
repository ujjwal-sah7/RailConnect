const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {

        // =====================================
        // CHECK AUTHENTICATED USER
        // =====================================

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }


        // =====================================
        // FIND USER
        // =====================================

        const user = await User.findById(req.user._id);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // =====================================
        // CHECK ADMIN ROLE
        // =====================================

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }


        // =====================================
        // ADMIN VERIFIED
        // =====================================

        next();

    } catch (error) {

        console.error(
            "Admin middleware error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to verify admin access"
        });

    }
};

module.exports = adminMiddleware;