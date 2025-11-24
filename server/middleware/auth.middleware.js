import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { User } from "../models/user.model.js";
import jwt, { decode } from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return res.status(401).json({
            success : false,
            message : "User not authenticated. Please sign in!!"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, )
    if(!decoded) {
        return res.status(401).json({
            success : false,
            message : "Token verification Failed. Please sign in again!!"
        });
    }

    // console.log("decodeddd :  ", decode);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
})