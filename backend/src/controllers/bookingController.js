const Booking = require("../models/Booking");
const Passenger = require("../models/Passenger");
const Train = require("../models/Train");


// =====================================
// TEMPORARY DEVELOPMENT FARE
// =====================================

const fareMap = {
    SL: 500,
    "3A": 1000,
    "2A": 1400,
    "1A": 2200
};


// =====================================
// GENERATE UNIQUE PNR
// =====================================

const generatePNR = async () => {

    let pnr;
    let existingBooking;

    do {

        pnr = Math.floor(
            1000000000 + Math.random() * 9000000000
        ).toString();

        existingBooking =
            await Booking.findOne({ pnr });

    } while (existingBooking);

    return pnr;
};


// =====================================
// CREATE BOOKING
// POST /api/bookings
// =====================================

const createBooking = async (req, res) => {

    try {

        const {
            trainId,
            journeyDate,
            travelClass,
            passengers
        } = req.body;


        // =====================================
        // BASIC VALIDATION
        // =====================================

        if (
            !trainId ||
            !journeyDate ||
            !travelClass ||
            !passengers ||
            !Array.isArray(passengers) ||
            passengers.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Train, journey date, class and passengers are required"

            });
        }


        // =====================================
        // NORMALIZE CLASS
        // =====================================

        const normalizedClass =
            String(travelClass).toUpperCase();


        // =====================================
        // VALIDATE CLASS
        // =====================================

        if (!fareMap[normalizedClass]) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid travel class"

            });
        }


        // =====================================
        // PASSENGER LIMIT
        // =====================================

        if (passengers.length > 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Maximum 6 passengers are allowed per booking"

            });
        }


        // =====================================
        // FIND TRAIN
        // =====================================

        let train;


        // =====================================
        // LIVE RAILRADAR TRAIN
        // =====================================

        if (
            typeof trainId === "string" &&
            trainId.startsWith("railradar-")
        ) {

            const railRadarTrainNumber =
                trainId.replace(
                    "railradar-",
                    ""
                );


            console.log(
                "Live RailRadar train detected:",
                railRadarTrainNumber
            );


            // =====================================
            // CHECK API KEY
            // =====================================

            if (!process.env.RAILRADAR_API_KEY) {

                return res.status(500).json({

                    success: false,

                    message:
                        "RailRadar API key is not configured"

                });
            }


            // =====================================
            // FETCH LIVE TRAIN DETAILS
            // =====================================

            const apiUrl =
                `https://api.railradar.in/v1/legacy/trains/${encodeURIComponent(railRadarTrainNumber)}?dataType=full`;


            console.log(
                "RailRadar Booking Train URL:",
                apiUrl
            );


            const response =
                await fetch(apiUrl, {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${process.env.RAILRADAR_API_KEY}`,

                        "Accept":
                            "application/json"

                    }

                });


            const data =
                await response.json();


            console.log(
                "RailRadar Booking Train Status:",
                response.status
            );


            if (
                !response.ok ||
                !data.success
            ) {

                console.error(
                    "RailRadar Booking Train Error:",
                    data?.error || data
                );


                return res.status(
                    response.status || 502
                ).json({

                    success: false,

                    message:
                        data?.error?.message ||
                        "Unable to fetch live train details"

                });
            }


            // =====================================
            // EXTRACT RAILRADAR DATA
            // =====================================

            const railData =
                data?.data || {};

            const railTrain =
                railData?.train || {};

            const route =
                Array.isArray(
                    railData?.route
                )
                    ? railData.route
                    : [];


            // =====================================
            // SOURCE / DESTINATION
            // =====================================

            const source =
                railTrain?.sourceStationCode ||
                route[0]?.stationCode ||
                "";


            const destination =
                railTrain?.destinationStationCode ||
                route[route.length - 1]?.stationCode ||
                "";


            // =====================================
            // SOURCE / DESTINATION STATIONS
            // =====================================

            const sourceStation =
                route.find(
                    station =>
                        station?.stationCode === source
                );


            const destinationStation =
                route.find(
                    station =>
                        station?.stationCode === destination
                );


            // =====================================
            // DEPARTURE / ARRIVAL
            // =====================================

            const departureTime =
                sourceStation?.scheduledDeparture ??
                sourceStation?.actualDeparture ??
                "";


            const arrivalTime =
                destinationStation?.scheduledArrival ??
                destinationStation?.actualArrival ??
                "";


            // =====================================
            // RUNNING DAYS
            // =====================================

            const runningDays =
                Array.isArray(
                    railTrain?.runningDays?.days
                )
                    ? railTrain.runningDays.days
                    : [];


            // =====================================
            // DURATION
            // =====================================

            const travelTimeMinutes =
                Number(
                    railTrain?.travelTimeMinutes || 0
                );


            const durationHours =
                Math.floor(
                    travelTimeMinutes / 60
                );


            const durationMinutes =
                travelTimeMinutes % 60;


            const duration =
                durationMinutes === 0
                    ? `${durationHours}h`
                    : `${durationHours}h ${durationMinutes}m`;


            // =====================================
            // FIND EXISTING TRAIN
            // =====================================

            train =
                await Train.findOne({

                    trainNumber:
                        String(
                            railTrain?.trainNumber ||
                            railTrain?.number ||
                            railRadarTrainNumber
                        )

                });


            // =====================================
            // CREATE TRAIN IN MONGODB
            // =====================================

            if (!train) {

                train =
                    await Train.create({

                        trainNumber:
                            String(
                                railTrain?.trainNumber ||
                                railTrain?.number ||
                                railRadarTrainNumber
                            ),

                        trainName:
                            railTrain?.trainName ||
                            railTrain?.name ||
                            "Live Railway Train",

                        source,

                        destination,

                        departureTime,

                        arrivalTime,

                        duration,

                        runningDays,

                        classes: [
                            normalizedClass
                        ]

                    });


                console.log(
                    "Live train saved to MongoDB:",
                    train._id
                );

            } else {

                // =====================================
                // ADD SELECTED CLASS IF MISSING
                // =====================================

                if (
                    !Array.isArray(train.classes)
                ) {

                    train.classes = [];

                }


                if (
                    !train.classes.includes(
                        normalizedClass
                    )
                ) {

                    train.classes.push(
                        normalizedClass
                    );

                    await train.save();

                }


                console.log(
                    "Existing MongoDB train used:",
                    train._id
                );
            }

        } else {

            // =====================================
            // EXISTING MONGODB TRAIN
            // =====================================

            train =
                await Train.findById(trainId);


            if (!train) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Train not found"

                });
            }


            // =====================================
            // CHECK CLASS
            // =====================================

            if (
                Array.isArray(train.classes) &&
                !train.classes.includes(
                    normalizedClass
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `${normalizedClass} class is not available on this train`

                });
            }
        }


        // =====================================
        // CREATE PASSENGERS
        // =====================================

        const passengerDocuments = [];


        for (
            const passengerData of passengers
        ) {

            if (
                !passengerData.name ||
                !passengerData.age ||
                !passengerData.gender
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Passenger name, age and gender are required"

                });
            }


            const passenger =
                await Passenger.create({

                    name:
                        passengerData.name,

                    age:
                        passengerData.age,

                    gender:
                        passengerData.gender,

                    berthPreference:
                        passengerData.berthPreference ||
                        "No Preference"

                });


            passengerDocuments.push(
                passenger
            );
        }


        // =====================================
        // CALCULATE FARE
        // =====================================

        const farePerPassenger =
            fareMap[normalizedClass];


        const passengerCount =
            passengerDocuments.length;


        const totalFare =
            farePerPassenger *
            passengerCount;


        // =====================================
        // GENERATE PNR
        // =====================================

        const pnr =
            await generatePNR();


        // =====================================
        // CREATE BOOKING
        // =====================================

        const booking =
            await Booking.create({

                user:
                    req.user._id,

                train:
                    train._id,

                trainNumber:
                    train.trainNumber,

                trainName:
                    train.trainName,

                source:
                    train.source,

                destination:
                    train.destination,

                journeyDate,

                travelClass:
                    normalizedClass,

                passengers:
                    passengerDocuments.map(
                        passenger =>
                            passenger._id
                    ),

                passengerCount,

                farePerPassenger,

                totalFare,

                pnr,

                status:
                    "Confirmed"

            });


        // =====================================
        // RESPONSE
        // =====================================

        res.status(201).json({

            success: true,

            message:
                "Booking created successfully",

            booking: {

                id:
                    booking._id,

                pnr:
                    booking.pnr,

                trainNumber:
                    booking.trainNumber,

                trainName:
                    booking.trainName,

                source:
                    booking.source,

                destination:
                    booking.destination,

                journeyDate:
                    booking.journeyDate,

                travelClass:
                    booking.travelClass,

                passengerCount:
                    booking.passengerCount,

                farePerPassenger:
                    booking.farePerPassenger,

                totalFare:
                    booking.totalFare,

                status:
                    booking.status

            }

        });

    } catch (error) {

        console.error(
            "Create booking error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to create booking"

        });
    }
};


// =====================================
// GET MY BOOKINGS
// GET /api/bookings/my
// =====================================

const getMyBookings = async (req, res) => {

    try {

        const bookings =
            await Booking.find({

                user:
                    req.user._id

            })
            .populate("passengers")
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            message:
                "Bookings fetched successfully",

            bookings

        });

    } catch (error) {

        console.error(
            "Get my bookings error:",
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
// CANCEL BOOKING
// PATCH /api/bookings/:id/cancel
// =====================================

const cancelBooking = async (req, res) => {

    try {

        const bookingId =
            req.params.id;


        // =====================================
        // FIND USER'S BOOKING
        // =====================================

        const booking =
            await Booking.findOne({

                _id:
                    bookingId,

                user:
                    req.user._id

            });


        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found"

            });
        }


        // =====================================
        // CHECK ALREADY CANCELLED
        // =====================================

        if (
            booking.status?.toLowerCase() ===
            "cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking is already cancelled"

            });
        }


        // =====================================
        // CANCEL BOOKING
        // =====================================

        booking.status =
            "Cancelled";


        await booking.save();


        // =====================================
        // RESPONSE
        // =====================================

        res.status(200).json({

            success: true,

            message:
                "Booking cancelled successfully",

            booking: {

                id:
                    booking._id,

                pnr:
                    booking.pnr,

                status:
                    booking.status

            }

        });

    } catch (error) {

        console.error(
            "Cancel booking error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to cancel booking"

        });
    }
};


// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {

    createBooking,

    getMyBookings,

    cancelBooking

};