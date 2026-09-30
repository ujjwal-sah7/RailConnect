const User = require("../models/User");


// =====================================
// GET ALL USERS
// =====================================

const getAllAdminUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: users.length,

            users

        });


    } catch (error) {

        console.error(
            "Get admin users error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to fetch users"

        });

    }

};


// =====================================
// EXPORT CONTROLLER
// =====================================

module.exports = {
    getAllAdminUsers
};