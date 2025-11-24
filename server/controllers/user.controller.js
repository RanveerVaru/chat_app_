import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js"
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateJWTToken } from "../utils/jwtToken.js";
import {v2 as cloudinary} from "cloudinary";


export const signUp = catchAsyncError(async (req,res,next) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json({
            message : "Please provide all details!!!",
            success : false
        })
    }

    const emailRegex = /^\S+@\S+\.\S+$/;    
    if(!emailRegex.test(email)) {
        return res.status(400).json({
            message : "Invalid Email Format !!!",
            success : false
        });
    } 

    if(password.length < 8) {
         return res.status(400).json({
            message : "Password length must be more then 8 characters!!",
            success : false
         });
    }

    const isEmailAlreadyUsed = await User.findOne({email});
    if(isEmailAlreadyUsed) {
        return res.status(400).json({
            message : "Email Alredy Exist!!",
            success : false
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password : hashedPassword,
        avatar : {
            public_id : "",
            url : "",
        }
    });
    generateJWTToken(user, "user registered successfully", 201, res);
});;


export const signIn = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({success : false, message : "Please Enter All Input Feilds!!"});
    }

    const emailRegex = /^\S+@\S+\.\S+$/;    
    if(!emailRegex.test(email)) {
        return res.status(400).json({message : "Invalid Email!!" , success : false});
    }

    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({
            message : "Invalid Cedentials!!",
            success : false,
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
        return res.status(400).json({
            message : "Invalid Cedentials!!",
            success : false,
        })
    }

    generateJWTToken(user, "User Logged in Successfully", 200, res);
}); 


export const signOut = catchAsyncError(async (req,res,next) => {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", 
      })
      .json({
        success: true,
        message: "user logged out successfully",
      });
});



export const getUser = catchAsyncError(async (req,res,next) => {
    const user = req.user
    return res.status(200).json({
            success : true,
            user,
        })

}); 


export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { fullName, email } = req.body;

    if (
        !fullName || 
        !email || 
        fullName?.trim().length === 0 || 
        email?.trim().length === 0
    ) {
        return res.status(400).json({
            message: "email and fullname can't be empty!!!",
            success: false,
        });
    }

    const avatar = req?.files?.avatar;

    let cloudinaryResponse;

    if (avatar) {
        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id;
            if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
                await cloudinary.uploader.destroy(oldAvatarPublicId);
            }

            cloudinaryResponse = await cloudinary.uploader.upload(
                avatar.tempFilePath,
                {
                    folder: "CHAT_APP_USERS_AVATAR",
                    transformation: [
                        {
                            width: 300,
                            height: 300,
                            crop: "limit",
                            quality: "auto",
                            fetch_format: "auto",
                        },
                    ],
                }
            );
        } catch (error) {
            console.log("Cloudinary error:", error);
            return res.status(500).json({
                message: "Failed to upload avatar. Please try again!!!",
                success: false,
            });
        }
    }

    const data = { fullName, email };

    if (cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url) {
        data.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,          // return updated user
        runValidators: true // run schema validators
    });

    return res.status(200).json({
        message: "Profile Updated Succesfully",
        success: true,
        user, 
    });
});