const Booking = require("../models/Booking");


// =====================================
// GET ALL BOOKINGS
// =====================================

const getAllAdminBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate(
                "train",
                "trainNumber trainName source destination"
            )
            .populate("passengers")
            .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,

            count: bookings.length,

            bookings

        });


    } catch (error) {

        console.error(
            "Get admin bookings error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to fetch bookings"

        });

    }

};


// =====================================
// EXPORT CONTROLLER
// =====================================

module.exports = {
    getAllAdminBookings
};