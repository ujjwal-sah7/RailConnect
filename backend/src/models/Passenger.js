const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 1,
            max: 120
        },

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },

        berthPreference: {
            type: String,
            enum: [
                "No Preference",
                "Lower",
                "Middle",
                "Upper",
                "Side Lower",
                "Side Upper"
            ],
            default: "No Preference"
        }
    },
    {
        timestamps: true
    }
);

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports = Passenger;