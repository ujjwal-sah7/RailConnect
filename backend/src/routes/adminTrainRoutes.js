const express = require("express");

const {
    getAllAdminTrains,
    createAdminTrain,
    updateAdminTrain,
    deleteAdminTrain
} = require("../controllers/adminTrainController");

const protect =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// =====================================
// GET ALL TRAINS
// =====================================

router.get(
    "/",
    protect,
    adminMiddleware,
    getAllAdminTrains
);


// =====================================
// ADD NEW TRAIN
// =====================================

router.post(
    "/",
    protect,
    adminMiddleware,
    createAdminTrain
);


// =====================================
// UPDATE TRAIN
// =====================================

router.put(
    "/:id",
    protect,
    adminMiddleware,
    updateAdminTrain
);


// =====================================
// DELETE TRAIN
// =====================================

router.delete(
    "/:id",
    protect,
    adminMiddleware,
    deleteAdminTrain
);


module.exports = router;