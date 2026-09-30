const express = require("express");

const {
    checkPNRStatus
} = require("../controllers/pnrController");

const router = express.Router();


// =====================================
// CHECK PNR STATUS
// GET /api/pnr/:pnr
// =====================================

router.get("/:pnr", checkPNRStatus);


module.exports = router;