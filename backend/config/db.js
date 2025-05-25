import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try {
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => console.log("Database connected successfully".bgGreen.white))
    } catch (error) {
        console.log("Error connection to mongodb".bgRed.white, error)
    }
}

export default connectDB;