import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnect } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { erorMiddlewere } from "./middleweres/errorMiddlewere.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();
config({ path: "./config/config.env" });
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
//middlewere
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTEmpFiles: true,
        tempFileDir: "./temp",
    })
);

// Mount messageRouter on /api/v1/message route
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

//connect to database
dbConnect();

//error middlewere
app.use(erorMiddlewere);

export default app;