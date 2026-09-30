const express = require("express");

const {
    getAllTrains,
    searchTrains,
    getTrainById
} = require("../controllers/trainController");

const router = express.Router();

// Get all trains
router.get("/", getAllTrains);

// Search trains
router.get("/search", searchTrains);

// Get train by ID
router.get("/:id", getTrainById);

module.exports = router;