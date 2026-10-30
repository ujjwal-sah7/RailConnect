
const Booking = require("../models/Booking");

const getAllAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("train", "trainNumber trainName source destination")
      .populate("passengers")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Get admin bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings"
    });
  }
};

const updateAdminBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Confirmed",
      "Pending",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: {
        _id: booking._id,
        pnr: booking.pnr,
        status: booking.status
      }
    });
  } catch (error) {
    console.error("Update admin booking status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update booking status"
    });
  }
};

module.exports = {
  getAllAdminBookings,
  updateAdminBookingStatus
};
