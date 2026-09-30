const mongoose = require("mongoose");

const connectDB = async () => {

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            await mongoose.connect(
                process.env.MONGODB_URI,
                {
                    serverSelectionTimeoutMS: 10000,
                    connectTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    family: 4
                }
            );

            console.log(
                "MongoDB connected successfully"
            );

            return;

        } catch (error) {

            console.error(
                `MongoDB connection attempt ${attempt} failed:`,
                error.message
            );

            if (attempt < maxRetries) {

                console.log(
                    "Retrying MongoDB connection in 5 seconds..."
                );

                await new Promise(
                    resolve => setTimeout(resolve, 5000)
                );

            } else {

                console.error(
                    "MongoDB connection failed after all retries."
                );

                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;