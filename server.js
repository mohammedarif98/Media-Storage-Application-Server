import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js';
import logger from "morgan"
import dbConnection from "./config/dbConnect.js";
import helmet from "helmet"
import globalErrorHandler from "./utils/errorHandler.js";
 

// ----------- db connection and load env variables --------------
dotenv.config()
dbConnection();

const app = express();

// ----------- Middleware setup --------------- 
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(helmet());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
 
// ------------ api Routes --------------
app.use("/api/auth/user", authRouter);


// ------------ global Error Handling midleware -------------- 
app.use(globalErrorHandler);

//----------- sever --------------
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`server running on port : ${PORT}`);
})

 
