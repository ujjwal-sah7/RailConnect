const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema(
    {
        trainNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        trainName: {
            type: String,
            required: true,
            trim: true
        },

        source: {
            type: String,
            required: true,
            trim: true
        },

        destination: {
            type: String,
            required: true,
            trim: true
        },

        departureTime: {
            type: String,
            required: true
        },

        arrivalTime: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        runningDays: {
            type: [String],
            required: true
        },

        classes: {
            type: [String],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Train = mongoose.model("Train", trainSchema);

module.exports = Train;