const Train = require("../models/Train");


// =====================================
// GET ALL TRAINS
// =====================================

const getAllAdminTrains = async (req, res) => {
    try {

        const trains = await Train.find()
            .sort({ trainNumber: 1 });

        res.status(200).json({
            success: true,
            count: trains.length,
            trains
        });

    } catch (error) {

        console.error(
            "Get admin trains error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch trains"
        });
    }
};


// =====================================
// ADD NEW TRAIN
// =====================================

const createAdminTrain = async (req, res) => {
    try {

        const {
            trainNumber,
            trainName,
            source,
            destination,
            departureTime,
            arrivalTime,
            duration,
            runningDays,
            classes
        } = req.body;


        // Check required fields

        if (
            !trainNumber ||
            !trainName ||
            !source ||
            !destination ||
            !departureTime ||
            !arrivalTime ||
            !duration
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All required train fields must be provided"
            });

        }


        // Check duplicate train number

        const existingTrain =
            await Train.findOne({
                trainNumber
            });


        if (existingTrain) {

            return res.status(400).json({
                success: false,
                message:
                    "Train with this train number already exists"
            });

        }


        // Create train

        const train =
            await Train.create({

                trainNumber,
                trainName,
                source,
                destination,
                departureTime,
                arrivalTime,
                duration,
                runningDays,
                classes

            });


        res.status(201).json({

            success: true,

            message:
                "Train created successfully",

            train

        });

    } catch (error) {

        console.error(
            "Create admin train error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to create train"

        });

    }
};


// =====================================
// UPDATE TRAIN
// =====================================

const updateAdminTrain = async (req, res) => {
    try {

        const trainId =
            req.params.id;


        const updatedTrain =
            await Train.findByIdAndUpdate(

                trainId,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedTrain) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Train updated successfully",

            train:
                updatedTrain

        });

    } catch (error) {

        console.error(
            "Update admin train error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to update train"

        });

    }
};


// =====================================
// DELETE TRAIN
// =====================================

const deleteAdminTrain = async (req, res) => {
    try {

        const trainId =
            req.params.id;


        const deletedTrain =
            await Train.findByIdAndDelete(
                trainId
            );


        if (!deletedTrain) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Train deleted successfully",

            train:
                deletedTrain

        });

    } catch (error) {

        console.error(
            "Delete admin train error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to delete train"

        });

    }
};


// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {

    getAllAdminTrains,

    createAdminTrain,

    updateAdminTrain,

    deleteAdminTrain

};