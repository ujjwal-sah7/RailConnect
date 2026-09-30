const Booking = require("../models/Booking");


// =====================================
// GET PNR STATUS
// =====================================

const getPNRStatus = async (pnr) => {

    const booking = await Booking.findOne({
        pnr: pnr.trim()
    })
        .populate(
            "passengers",
            "name age gender berthPreference"
        )
        .populate(
            "train",
            "trainNumber trainName source destination"
        );


    if (!booking) {
        return null;
    }


    const passengers = booking.passengers.map(
        (passenger) => ({
            name: passenger.name,
            age: passenger.age,
            gender: passenger.gender,
            berthPreference: passenger.berthPreference,

            // Temporary values.
            // Real coach/seat data will come
            // from railway API later.
            status: booking.status,
            coach: "Not Assigned",
            seat: "Not Assigned"
        })
    );


    return {
        pnr: booking.pnr,

        status: booking.status,

        train: {
            trainNumber: booking.trainNumber,
            trainName: booking.trainName,
            source: booking.source,
            destination: booking.destination
        },

        journeyDate: booking.journeyDate,

        travelClass: booking.travelClass,

        passengerCount: booking.passengerCount,

        passengers,

        fare: {
            farePerPassenger: booking.farePerPassenger,
            totalFare: booking.totalFare
        }
    };
};


module.exports = {
    getPNRStatus
};