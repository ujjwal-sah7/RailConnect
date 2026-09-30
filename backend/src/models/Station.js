const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
    {
        stationCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        stationName: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;