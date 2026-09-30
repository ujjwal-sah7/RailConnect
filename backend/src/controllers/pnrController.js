const {
    getPNRStatus
} = require("../services/pnrService");


// =====================================
// CHECK PNR STATUS
// =====================================

const checkPNRStatus = async (req, res) => {

    try {

        const { pnr } = req.params;


        // =====================================
        // VALIDATION
        // =====================================

        if (!pnr) {

            return res.status(400).json({

                success: false,

                message: "PNR is required"

            });
        }


        // =====================================
        // PNR FORMAT
        // =====================================

        if (!/^\d{10}$/.test(pnr)) {

            return res.status(400).json({

                success: false,

                message: "PNR must be a 10-digit number"

            });
        }


        // =====================================
        // GET PNR DATA
        // =====================================

        const pnrData = await getPNRStatus(pnr);


        // =====================================
        // NOT FOUND
        // =====================================

        if (!pnrData) {

            return res.status(404).json({

                success: false,

                message: "PNR not found"

            });
        }


        // =====================================
        // RESPONSE
        // =====================================

        return res.status(200).json({

            success: true,

            message: "PNR status fetched successfully",

            pnrStatus: pnrData

        });

    } catch (error) {

        console.error(
            "Check PNR status error:",
            error.message
        );


        return res.status(500).json({

            success: false,

            message: "Unable to fetch PNR status"

        });

    }
};


module.exports = {
    checkPNRStatus
};