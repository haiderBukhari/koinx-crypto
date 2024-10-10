const mongoose = require("mongoose")

const connectDB = async () => {
    const connectionString = process.env.MONGODB_CONNECTION_STRING || '';
    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB Connected Successfully...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };