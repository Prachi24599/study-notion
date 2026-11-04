import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("DB is connected successfully!");
    }).catch((err) => {
        console.log(err);
        console.log("DB connection failed!");
        process.exit(1);
    })
} 

export default dbConnect;

