const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const trainRoutes = require("./routes/trainRoutes");
const stationRoutes = require("./routes/stationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const pnrRoutes = require("./routes/pnrRoutes");
const userRoutes = require("./routes/userRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminTrainRoutes = require("./routes/adminTrainRoutes");
const adminStationRoutes = require("./routes/adminStationRoutes");
const adminBookingRoutes = require("./routes/adminBookingRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");


const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// API ROUTES
// =====================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/trains",
    trainRoutes
);

app.use(
    "/api/stations",
    stationRoutes
);

app.use(
    "/api/bookings",
    bookingRoutes
);

app.use(
    "/api/pnr",
    pnrRoutes
);

app.use(
    "/api/users",
    userRoutes
);


// =====================================
// ADMIN API ROUTES
// =====================================

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/admin/trains",
    adminTrainRoutes
);

app.use(
    "/api/admin/stations",
    adminStationRoutes
);

app.use(
    "/api/admin/bookings",
    adminBookingRoutes
);

app.use(
    "/api/admin/users",
    adminUserRoutes
);

app.use(
    "/api/admin/stats",
    adminStatsRoutes
);


// =====================================
// HEALTH CHECK
// =====================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "RailConnect API is running"

        });

    }
);


// =====================================
// START SERVER
// =====================================

const PORT =
    process.env.PORT || 5000;


const startServer = async () => {

    try {

        await connectDB();


        app.listen(
            PORT,
            () => {

                console.log(
                    `RailConnect server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Server failed to start:",
            error.message
        );

    }

};


startServer();