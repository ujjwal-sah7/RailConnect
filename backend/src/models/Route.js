const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
    {
        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Train",
            required: true
        },

        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true
        },

        stationOrder: {
            type: Number,
            required: true
        },

        arrivalTime: {
            type: String,
            required: true
        },

        departureTime: {
            type: String,
            required: true
        },

        distanceFromSource: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;