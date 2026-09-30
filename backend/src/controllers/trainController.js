const Train = require("../models/Train");

// =========================
// GET ALL TRAINS
// =========================
const getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find().sort({
            trainNumber: 1
        });

        res.status(200).json({
            success: true,
            count: trains.length,
            trains
        });

    } catch (error) {
        console.error("Get trains error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// SEARCH TRAINS - RAILRADAR
// =========================
const searchTrains = async (req, res) => {
    try {
        const {
            source,
            destination,
            date,
            class: travelClass
        } = req.query;

        // =========================
        // REQUIRED FIELDS
        // =========================
        if (!source || !destination || !date || !travelClass) {
            return res.status(400).json({
                success: false,
                message: "Source, destination, date and class are required"
            });
        }


        // =========================
        // VALIDATE DATE
        // DD/MM/YYYY
        // =========================
        const dateParts = date.split("/");

        if (dateParts.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "Date must be in DD/MM/YYYY format"
            });
        }

        const day = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const year = Number(dateParts[2]);

        const selectedDate = new Date(
            Date.UTC(year, month - 1, day)
        );

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate.getUTCDate() !== day ||
            selectedDate.getUTCMonth() !== month - 1 ||
            selectedDate.getUTCFullYear() !== year
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            });
        }


        // =========================
        // Convert DD/MM/YYYY → YYYY-MM-DD
        // =========================
        const railRadarDate =
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        // =========================
        // STATION CODES
        // =========================
        const fromStation =
            source.trim().toUpperCase();

        const toStation =
            destination.trim().toUpperCase();


        // =========================
        // CLASS NORMALIZATION
        // =========================
        const classMap = {
            sleeper: "SL",
            sl: "SL",
            "3a": "3A",
            "2a": "2A",
            "1a": "1A"
        };

        const normalizedClass =
            classMap[String(travelClass).toLowerCase()] ||
            String(travelClass).toUpperCase();


        // =========================
        // CHECK API KEY
        // =========================
        if (!process.env.RAILRADAR_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "RailRadar API key is not configured"
            });
        }


        // =========================
        // RAILRADAR SEARCH API
        // =========================
        const apiUrl =
            `https://api.railradar.in/v1/trains/between/${encodeURIComponent(fromStation)}/${encodeURIComponent(toStation)}?date=${railRadarDate}`;

        console.log(
            "RailRadar Search URL:",
            apiUrl
        );

        const response = await fetch(apiUrl, {
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
            "RailRadar API Status:",
            response.status
        );


        if (!response.ok || !data.success) {

            console.error(
                "RailRadar API error:",
                data?.error || data
            );

            return res.status(
                response.status || 502
            ).json({
                success: false,

                message:
                    data?.error?.message ||
                    "Unable to fetch trains from RailRadar"
            });
        }


        // =========================
        // TRANSFORM DATA
        // =========================
        const railRadarTrains =
            data?.data?.trains || [];

        const trains =
            railRadarTrains.map((item) => {

                const train =
                    item.train || {};

                const from =
                    item.from || {};

                const to =
                    item.to || {};

                return {

                    _id:
                        `railradar-${train.number}`,

                    trainNumber:
                        train.number || "",

                    trainName:
                        train.name || "",

                    source:
                        from.code || fromStation,

                    destination:
                        to.code || toStation,

                    departureTime:
                        from.departure || "",

                    arrivalTime:
                        to.arrival || "",

                    duration:
                        formatDuration(
                            item.duration
                        ),

                    runningDays:
                        Array.isArray(train.runDays)
                            ? train.runDays.map(day =>
                                day.charAt(0).toUpperCase() +
                                day.slice(1)
                            )
                            : [],

                    classes:
                        [normalizedClass],

                    distance:
                        item.distance || 0,

                    totalHaltsBetween:
                        item.totalHaltsBetween || 0,

                    liveData:
                        true
                };
            });


        // =========================
        // RESPONSE
        // =========================
        res.status(200).json({

            success: true,

            count:
                trains.length,

            search: {
                source,
                destination,
                date,
                class:
                    normalizedClass
            },

            sourceStation:
                data?.data?.from || null,

            destinationStation:
                data?.data?.to || null,

            trains
        });

    } catch (error) {

        console.error(
            "Search trains error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch live railway data"
        });
    }
};


// =========================
// FORMAT DURATION
// =========================
const formatDuration = (minutes) => {

    if (
        minutes === undefined ||
        minutes === null ||
        Number.isNaN(Number(minutes))
    ) {
        return "";
    }

    const totalMinutes =
        Number(minutes);

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const remainingMinutes =
        totalMinutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
};


// =========================
// FORMAT RAILWAY TIME
// =========================
const formatRailTime = (time) => {

    if (
        time === undefined ||
        time === null ||
        time === ""
    ) {
        return "";
    }

    const totalMinutes =
        Number(time);

    if (Number.isNaN(totalMinutes)) {
        return String(time);
    }

    const hours =
        Math.floor(totalMinutes / 60) % 24;

    const minutes =
        totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};


// =========================
// GET TRAIN BY ID
// =========================
const getTrainById = async (req, res) => {

    try {

        const { id } = req.params;


        // =========================
        // RAILRADAR TRAIN
        // =========================
        if (id.startsWith("railradar-")) {

            const trainNumber =
                id.replace("railradar-", "");


            if (!process.env.RAILRADAR_API_KEY) {

                return res.status(500).json({
                    success: false,
                    message:
                        "RailRadar API key is not configured"
                });
            }


            // =========================
            // RAILRADAR TRAIN DETAILS
            // =========================
            const apiUrl =
                `https://api.railradar.in/v1/legacy/trains/${encodeURIComponent(trainNumber)}?dataType=full`;

            console.log(
                "RailRadar Train Details URL:",
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
                "RailRadar Train Details Status:",
                response.status
            );


            if (
                !response.ok ||
                !data.success
            ) {

                console.error(
                    "RailRadar Train Details Error:",
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


            // =========================
            // RAILRADAR DATA
            // =========================
            const railData =
                data?.data || {};

            const railTrain =
                railData?.train || {};

            const route =
                Array.isArray(railData?.route)
                    ? railData.route
                    : [];


            // =========================
            // RUNNING DAYS
            // =========================
            const runningDays =
                Array.isArray(
                    railTrain?.runningDays?.days
                )
                    ? railTrain.runningDays.days
                    : [];


            // =========================
            // DURATION
            // =========================
            const duration =
                formatDuration(
                    railTrain?.travelTimeMinutes
                );


            // =========================
            // DEPARTURE / ARRIVAL
            // =========================
            let departureTime = "";

            let arrivalTime = "";


            if (route.length > 0) {

                const sourceStation =
                    route.find(
                        station =>
                            station?.stationCode ===
                            railTrain?.sourceStationCode
                    );


                const destinationStation =
                    route.find(
                        station =>
                            station?.stationCode ===
                            railTrain?.destinationStationCode
                    );


                departureTime =
                    formatRailTime(
                        sourceStation?.scheduledDeparture ??
                        sourceStation?.actualDeparture
                    );


                arrivalTime =
                    formatRailTime(
                        destinationStation?.scheduledArrival ??
                        destinationStation?.actualArrival
                    );
            }


            // =========================
            // RETURN EXISTING FORMAT
            // =========================
            const train = {

                _id:
                    id,

                trainNumber:
                    railTrain?.trainNumber ||
                    trainNumber,

                trainName:
                    railTrain?.trainName ||
                    "Live Railway Train",

                source:
                    railTrain?.sourceStationCode ||
                    "",

                destination:
                    railTrain?.destinationStationCode ||
                    "",

                departureTime,

                arrivalTime,

                duration,

                runningDays,

                classes: [],

                liveData:
                    true,

                distance:
                    railTrain?.distanceKm || 0,

                totalHaltsBetween:
                    railTrain?.totalHalts || 0,

                route
            };


            console.log(
                "Mapped Live Train Details:",
                train
            );


            return res.status(200).json({

                success: true,

                train
            });
        }


        // =========================
        // EXISTING MONGODB TRAIN
        // =========================
        const train =
            await Train.findById(id);


        if (!train) {

            return res.status(404).json({
                success: false,
                message:
                    "Train not found"
            });
        }


        res.status(200).json({

            success: true,

            train
        });

    } catch (error) {

        console.error(
            "Get train by ID error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Invalid train ID or server error"
        });
    }
};


// =========================
// EXPORT
// =========================
module.exports = {

    getAllTrains,

    searchTrains,

    getTrainById
};