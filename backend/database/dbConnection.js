import mongoose from "mongoose";

export const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME,
        });
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process with a non-zero status code
    }
};