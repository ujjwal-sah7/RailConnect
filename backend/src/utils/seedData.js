const { MongoClient } = require("mongodb");
require("dotenv").config();

const stations = [
    {
        stationCode: "NDLS",
        stationName: "New Delhi",
        city: "New Delhi",
        state: "Delhi"
    },
    {
        stationCode: "BBS",
        stationName: "Bhubaneswar",
        city: "Bhubaneswar",
        state: "Odisha"
    },
    {
        stationCode: "HWH",
        stationName: "Howrah Junction",
        city: "Howrah",
        state: "West Bengal"
    },
    {
        stationCode: "PNBE",
        stationName: "Patna Junction",
        city: "Patna",
        state: "Bihar"
    },
    {
        stationCode: "CSMT",
        stationName: "Chhatrapati Shivaji Maharaj Terminus",
        city: "Mumbai",
        state: "Maharashtra"
    }
];

const trains = [
    {
        trainNumber: "12301",
        trainName: "Rajdhani Express",
        source: "New Delhi",
        destination: "Howrah",
        departureTime: "16:55",
        arrivalTime: "10:05",
        duration: "17h 10m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        classes: ["1A", "2A", "3A"]
    },
    {
        trainNumber: "12802",
        trainName: "Purushottam Express",
        source: "New Delhi",
        destination: "Bhubaneswar",
        departureTime: "22:35",
        arrivalTime: "20:45",
        duration: "22h 10m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        classes: ["1A", "2A", "3A", "SL"]
    },
    {
        trainNumber: "12801",
        trainName: "Purushottam Express",
        source: "Bhubaneswar",
        destination: "New Delhi",
        departureTime: "22:10",
        arrivalTime: "20:10",
        duration: "22h 00m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        classes: ["1A", "2A", "3A", "SL"]
    },
    {
        trainNumber: "12309",
        trainName: "Rajdhani Express",
        source: "New Delhi",
        destination: "Bhubaneswar",
        departureTime: "17:00",
        arrivalTime: "10:00",
        duration: "17h 00m",
        runningDays: ["Tue", "Thu", "Sat"],
        classes: ["1A", "2A", "3A"]
    },
    {
        trainNumber: "12310",
        trainName: "Rajdhani Express",
        source: "Bhubaneswar",
        destination: "New Delhi",
        departureTime: "17:30",
        arrivalTime: "10:30",
        duration: "17h 00m",
        runningDays: ["Wed", "Fri", "Sun"],
        classes: ["1A", "2A", "3A"]
    }
];

const seedData = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();

        console.log("MongoDB connected for seeding");

        const db = client.db("railconnect");

        const stationCollection = db.collection("stations");
        const trainCollection = db.collection("trains");

        // Seed stations
        for (const station of stations) {
            await stationCollection.updateOne(
                { stationCode: station.stationCode },
                { $set: station },
                { upsert: true }
            );
        }

        // Seed trains
        for (const train of trains) {
            await trainCollection.updateOne(
                { trainNumber: train.trainNumber },
                { $set: train },
                { upsert: true }
            );
        }

        console.log("Stations seeded successfully");
        console.log("Trains seeded successfully");
        console.log("Seed operation completed");

    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await client.close();
    }
};

seedData();