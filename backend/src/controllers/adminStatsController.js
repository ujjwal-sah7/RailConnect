const User = require("../models/User");
const Train = require("../models/Train");
const Station = require("../models/Station");
const Booking = require("../models/Booking");


// =====================================
// GET ADMIN STATISTICS
// =====================================

const getAdminStats = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalTrains =
            await Train.countDocuments();

        const totalStations =
            await Station.countDocuments();

        const totalBookings =
            await Booking.countDocuments();


        const confirmedBookings =
            await Booking.countDocuments({
                status: {
                    $in: ["Confirmed", "confirmed"]
                }
            });


        const cancelledBookings =
            await Booking.countDocuments({
                status: {
                    $in: ["Cancelled", "cancelled"]
                }
            });


        const revenueResult =
            await Booking.aggregate([

                {
                    $match: {
                        status: {
                            $in: ["Confirmed", "confirmed"]
                        }
                    }
                },

                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$totalFare"
                        }
                    }
                }

            ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        res.status(200).json({

            success: true,

            stats: {

                totalUsers,

                totalTrains,

                totalStations,

                totalBookings,

                confirmedBookings,

                cancelledBookings,

                totalRevenue

            }

        });


    } catch (error) {

        console.error(
            "Get admin stats error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to fetch admin statistics"

        });

    }

};


// =====================================
// EXPORT CONTROLLER
// =====================================

module.exports = {
    getAdminStats
};