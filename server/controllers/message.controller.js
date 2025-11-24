import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary"
import { getReceiverSocketId } from "../utils/socket.js";
import { io } from "../utils/socket.js";
export const getAllUsers = catchAsyncError(async (req,res,next) => {
    const user = req.user;
    const filteredUsers = await User.find({_id : {$ne : user._id}}).select("-password");
    if(!filteredUsers) {
        return res.status(400).json({
            success : false,
            message : "No users found"
        })
    }
    return res.status(200).json({
        success : true,
        message : "Users fetched successfully",
        users : filteredUsers
    })
})

    export const getMessages = catchAsyncError(async (req,res,next) => {
        const receiverId = req.params.id;
        const myId = req.user._id;
        if(!receiverId) {
            return res.status(400).json({
                success : false,
                message : "Receiver ID is required"
            })
        }
        const messages = await Message.find({
            $or : [
                {senderId : myId, receiverId : receiverId},
                {senderId : receiverId, receiverId : myId},
            ]
        }).sort({createdAt : 1});
        return res.status(200).json({
            success : true,
            messages
        })
    })


export const sendMessage = catchAsyncError(async (req,res,next) => {
    const {text} = req.body;
    const media = req?.files?.media;
    const senderId = req.user._id;
    const receiverId = req.params.id;
    if(!receiverId) {
        return res.status(400).json({
            success : false,
            message : "Receiver ID is required"
        })
    }

    const senitizedText = text ? text.trim() : "";
    if(!senitizedText && !media) {
        return res.status(400).json({
            success : false,
            message : "Text or media is required"
        })
    }

    let mediaUrl = "";
    if(media) {
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(media.tempFilePath, {
                folder : "CHAT_APP_MESSAGES_MEDIA",
                resource_type : "auto",
                transformation : [
                    {
                        width : 300,
                        height : 300,
                        crop : "limit",
                        quality : "auto",
                        fetch_format : "auto",
                    }
                ]
            })
            mediaUrl = cloudinaryResponse.secure_url;
        } catch (error) {
            console.log("Cloudinary error:", error);
            return res.status(500).json({
                success : false,
                message : "Failed to upload media"
            })
        }
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text : senitizedText,
        media : mediaUrl
    })


    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage); //Send a message to a specific user using their socket ID.
    }
    return res.status(200).json({
        success : true,
        message : "Message sent successfully",
        newMessage
    })
})