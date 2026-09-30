const Station = require("../models/Station");


// =====================================
// GET ALL STATIONS
// =====================================

const getAllAdminStations = async (req, res) => {
    try {

        const stations = await Station.find()
            .sort({ stationCode: 1 });

        res.status(200).json({
            success: true,
            count: stations.length,
            stations
        });

    } catch (error) {

        console.error(
            "Get admin stations error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch stations"
        });
    }
};


// =====================================
// ADD NEW STATION
// =====================================

const createAdminStation = async (req, res) => {
    try {

        const {
            stationCode,
            stationName,
            city,
            state
        } = req.body;


        if (
            !stationCode ||
            !stationName ||
            !city ||
            !state
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All station fields must be provided"
            });

        }


        const existingStation =
            await Station.findOne({
                stationCode
            });


        if (existingStation) {

            return res.status(400).json({
                success: false,
                message:
                    "Station with this code already exists"
            });

        }


        const station =
            await Station.create({

                stationCode,
                stationName,
                city,
                state

            });


        res.status(201).json({

            success: true,

            message:
                "Station created successfully",

            station

        });

    } catch (error) {

        console.error(
            "Create admin station error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to create station"

        });

    }
};


// =====================================
// UPDATE STATION
// =====================================

const updateAdminStation = async (req, res) => {
    try {

        const stationId =
            req.params.id;


        const updatedStation =
            await Station.findByIdAndUpdate(

                stationId,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedStation) {

            return res.status(404).json({

                success: false,

                message:
                    "Station not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Station updated successfully",

            station:
                updatedStation

        });

    } catch (error) {

        console.error(
            "Update admin station error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to update station"

        });

    }
};


// =====================================
// DELETE STATION
// =====================================

const deleteAdminStation = async (req, res) => {
    try {

        const stationId =
            req.params.id;


        const deletedStation =
            await Station.findByIdAndDelete(
                stationId
            );


        if (!deletedStation) {

            return res.status(404).json({

                success: false,

                message:
                    "Station not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Station deleted successfully",

            station:
                deletedStation

        });

    } catch (error) {

        console.error(
            "Delete admin station error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to delete station"

        });

    }
};


// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {

    getAllAdminStations,
    createAdminStation,
    updateAdminStation,
    deleteAdminStation

};