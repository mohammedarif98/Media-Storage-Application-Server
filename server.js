import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoutes.js';
import logger from "morgan"
import dbConnection from "./config/dbConnect.js";
import helmet from "helmet"


// ----------- db connection and load env variables --------------
dotenv.config()
dbConnection();

const app = express();

// ----------- Middleware setup --------------- 
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
 
// ------------ api Routes --------------
app.use("/api/auth", authRouter);

//----------- sever --------------
const PORT = process.env.PORT || 5000
app.listen(PORT,() => {
    console.log(`server running on port : ${PORT}`);
})

 
