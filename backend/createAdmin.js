const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

const createAdmin = async () => {
    try {

        // =====================================
        // CONNECT TO DATABASE
        // =====================================

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected"
        );


        // =====================================
        // ADMIN DETAILS
        // =====================================

        const name =
            "RailConnect Admin";

        const email =
            "admin@railconnect.com";

        const password =
            "Admin@123";


        // =====================================
        // CHECK EXISTING ADMIN
        // =====================================

        const existingUser =
            await User.findOne({ email });


        if (existingUser) {

            existingUser.role =
                "admin";

            await existingUser.save();

            console.log(
                "Existing user converted to admin."
            );

        } else {

            // =====================================
            // HASH PASSWORD
            // =====================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // =====================================
            // CREATE ADMIN
            // =====================================

            await User.create({

                name,

                email,

                password:
                    hashedPassword,

                role: "admin"

            });


            console.log(
                "Admin created successfully."
            );

        }


        // =====================================
        // DISPLAY ADMIN LOGIN
        // =====================================

        console.log(
            "Admin Email:",
            email
        );

        console.log(
            "Admin Password:",
            password
        );


        // =====================================
        // CLOSE DATABASE CONNECTION
        // =====================================

        await mongoose.connection.close();

        console.log(
            "Database connection closed."
        );

    } catch (error) {

        console.error(
            "Create admin error:",
            error.message
        );

        process.exit(1);

    }
};


createAdmin();