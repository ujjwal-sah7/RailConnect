const express = require("express");

const {
    getAllStations,
    searchStations
} = require("../controllers/stationController");

const router = express.Router();

// Get all stations
router.get("/", getAllStations);

// Search stations
router.get("/search", searchStations);

module.exports = router;