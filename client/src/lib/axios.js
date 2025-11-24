import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-jps9.onrender.com/api/v1",
    withCredentials: true,
});


