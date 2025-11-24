import app from "./app.js";
import {v2 as cloudinary} from "cloudinary";
import { initSocket } from "./utils/socket.js";
import http from "http";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 4000;
const MODE = process.env.NODE_ENV || "development";

server.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT} in ${MODE} mode `);
});