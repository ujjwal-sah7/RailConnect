const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Train",
            required: true
        },

        trainNumber: {
            type: String,
            required: true
        },

        trainName: {
            type: String,
            required: true
        },

        source: {
            type: String,
            required: true
        },

        destination: {
            type: String,
            required: true
        },

        journeyDate: {
            type: String,
            required: true
        },

        travelClass: {
            type: String,
            required: true,
            enum: ["SL", "3A", "2A", "1A"]
        },

        passengers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Passenger"
            }
        ],

        passengerCount: {
            type: Number,
            required: true,
            min: 1
        },

        farePerPassenger: {
            type: Number,
            required: true,
            min: 0
        },

        totalFare: {
            type: Number,
            required: true,
            min: 0
        },

        pnr: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: [
                "Confirmed",
                "Cancelled",
                "Pending"
            ],
            default: "Confirmed"
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;