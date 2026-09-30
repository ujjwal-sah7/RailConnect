// =========================
// STATION CONTROLLER
// =========================


// =========================
// GET ALL STATIONS
// =========================
const getAllStations = async (req, res) => {
    try {

        const apiKey =
            process.env.RAILRADAR_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "RailRadar API key is missing"
            });
        }

        const response = await fetch(
            "https://api.railradar.in/v1/lookup/stations",
            {
                method: "GET",
                headers: {
                    "Authorization":
                        `Bearer ${apiKey}`
                }
            }
        );

        const data =
            await response.json();

        console.log(
            "RailRadar Station API Status:",
            response.status
        );

        if (!response.ok) {
            console.error(
                "RailRadar Station API Error:",
                data
            );

            return res.status(
                response.status
            ).json({
                success: false,
                message:
                    data?.error?.message ||
                    "Unable to fetch stations from RailRadar"
            });
        }

        const stationDictionary =
            data?.data || {};

        const stations =
            Object.entries(
                stationDictionary
            )
            .map(
                ([stationCode, stationName]) => ({
                    _id: stationCode,

                    stationCode:
                        stationCode,

                    stationName:
                        stationName,

                    city: "",

                    state: ""
                })
            )
            .sort(
                (a, b) =>
                    a.stationName.localeCompare(
                        b.stationName
                    )
            );

        console.log(
            "Total RailRadar Stations:",
            stations.length
        );

        res.status(200).json({
            success: true,
            count: stations.length,
            stations
        });

    } catch (error) {

        console.error(
            "Get stations error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch stations"
        });
    }
};


// =========================
// SEARCH STATIONS
// =========================
const searchStations = async (req, res) => {
    try {

        const { query } =
            req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message:
                    "Search query is required"
            });
        }

        const apiKey =
            process.env.RAILRADAR_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message:
                    "RailRadar API key is missing"
            });
        }

        const url =
            `https://api.railradar.in/v1/lookup/search/stations` +
            `?q=${encodeURIComponent(query)}` +
            `&limit=50`;

        const response =
            await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization":
                        `Bearer ${apiKey}`
                }
            });

        const data =
            await response.json();

        console.log(
            "RailRadar Station Search Status:",
            response.status
        );

        if (!response.ok) {
            return res.status(
                response.status
            ).json({
                success: false,
                message:
                    data?.error?.message ||
                    "Unable to search stations"
            });
        }

        const stationResults =
            Array.isArray(data?.data)
                ? data.data
                : [];

        const stations =
            stationResults
                .map(station => ({
                    _id:
                        station.code,

                    stationCode:
                        station.code,

                    stationName:
                        station.name,

                    city:
                        station.city || "",

                    state: ""
                }))
                .sort(
                    (a, b) =>
                        a.stationName.localeCompare(
                            b.stationName
                        )
                );

        res.status(200).json({
            success: true,
            count: stations.length,
            stations
        });

    } catch (error) {

        console.error(
            "Search stations error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to search stations"
        });
    }
};


module.exports = {
    getAllStations,
    searchStations
};