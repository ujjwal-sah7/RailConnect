const express = require("express");

const {
    getAllAdminStations,
    createAdminStation,
    updateAdminStation,
    deleteAdminStation
} = require("../controllers/adminStationController");

const protect =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// =====================================
// GET ALL STATIONS
// =====================================

router.get(
    "/",
    protect,
    adminMiddleware,
    getAllAdminStations
);


// =====================================
// ADD NEW STATION
// =====================================

router.post(
    "/",
    protect,
    adminMiddleware,
    createAdminStation
);


// =====================================
// UPDATE STATION
// =====================================

router.put(
    "/:id",
    protect,
    adminMiddleware,
    updateAdminStation
);


// =====================================
// DELETE STATION
// =====================================

router.delete(
    "/:id",
    protect,
    adminMiddleware,
    deleteAdminStation
);


module.exports = router;