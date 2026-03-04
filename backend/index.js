import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config({
    path: ".env",
});

const app = express();

// middlewares
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));

// connect db before handling requests
app.use(async (req, res, next) => {
    await databaseConnection();
    next();
});

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// only listen when not on Vercel
if (process.env.VERCEL !== "1") {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server listen at port ${process.env.PORT || 8080}`);
    });
}

export default app;