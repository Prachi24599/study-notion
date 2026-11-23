import express from "express";
const app = express();
//Import Routes
import userRoutes from "./routes/User.js";
import profileRoutes from "./routes/Profile.js";
import courseRoutes from "../routes/Course.js";
import paymentRoutes from "../routes/Payments.js";

import dbConnect from "./config/database.js";
import cloudinaryConnect from "cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

//database connect
dbConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin : "http://localhost:3000",
        credentials : true
    })
)
app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : "/temp"
    })
)

//cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//default routes
app.get("/", (req, res) => {
    return res.json({
        success : true,
        message : "Your server is up and running..."
    })
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})