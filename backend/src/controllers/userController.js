const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ===============================
// GET USER PROFILE
// ===============================

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(
            req.user._id
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch profile"
        });
    }
};



// ===============================
// CHANGE PASSWORD
// ===============================

const changePassword = async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;


        // Check required fields

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required"
            });
        }


        // Check password length

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters long"
            });
        }


        // Find logged-in user

        const user = await User.findById(
            req.user._id
        );


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // Verify current password

        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect"
            });
        }


        // Generate salt

        const salt =
            await bcrypt.genSalt(10);


        // Hash new password

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                salt
            );


        // Save new password

        user.password =
            hashedPassword;

        await user.save();


        // Success response

        res.status(200).json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {

        console.error(
            "Change password error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to change password"
        });
    }
};



// ===============================
// EXPORT CONTROLLERS
// ===============================

module.exports = {
    getProfile,
    changePassword
};