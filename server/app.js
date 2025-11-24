import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbConnection } from "./database/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";


const app = express();

config({ path : "./config/config.env" });

//Allows your backend to accept requests from your frontend (React).
//Without it, browser blocks the request.
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE"]
}));

app.use(cookieParser()); //req.cookie becames empty, read cookies, convert into js obj
app.use(express.json()); //req.body becames empty, it convert json in js obj
app.use(express.urlencoded({ extended : true})); // form data in ..

app.use(
    fileUpload({
        useTempFiles : true,
        tempFileDir : "./temp/",
    })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);




app.use((err, req, res, next) => {

    res.status(400).json({
        success: false,
        message: err.message,
    });
});

dbConnection();

export default app;