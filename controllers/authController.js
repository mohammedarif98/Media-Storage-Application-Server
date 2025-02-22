import Media from '../models/mediaModel.js';
import User from '../models/userModel.js';
import ApiError from '../utils/apiError.js';
import { generateToken } from '../utils/jwtUtils.js';
import { comparePassword } from '../utils/passwordUtils.js';
import mongoose from 'mongoose';


//----------------- user registration ------------------
export const userRegistration = async(req, res, next) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        if(!username || !email || !password || !confirmPassword ){
            return next( new ApiError("All fields are required!", 400))
        }
        
        if( password !== confirmPassword ){
            return next( new ApiError("Password do not match", 400));
        }

        const user = await User.findOne({ email });
        if(user) return next(new ApiError("User already exist", 400));

        const newUser = new User({ username, email, password });
        await newUser.save();

        const { password: userPassword, ...userData } = newUser.toObject();

        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: userData
        })
    }catch(error){
        next(error);
        console.log(error.message);
    }
}


//----------------- user login ------------------
export const userLogin = async(req, res, next) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new ApiError("Email and Password are required", 400));
        }
    
        const user = await User.findOne({ email }).select("+password");
        if(!user) return next(new ApiError("Invalid email or password", 401));
    
        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid) return next(new ApiError("Invalid email or password", 401));
    
        const token = generateToken(user._id);

        res.cookie("jwt-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
            maxAge: Number(process.env.COOKIE_EXPIRES_IN),
          });      

        const { password: userPassword, ...userData } = user.toObject();

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: { user: userData, token },
        });
    }catch (error) {
        console.log(error.message);
        next(error);
    }
}


//----------------- user logout ------------------
export const userLogout = async(req, res, next) => {
    res.clearCookie("jwt-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
    });
    
      res.status(200).json({
        status: "success",
        message: "User logged out successfully",
    });
}


//----------------- user profile details ------------------
export const getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      const user = await User.findById(userId).select("-password");
  
      const mediaStats = await Media.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalMedia: { $sum: 1 },
            totalImages: { 
              $sum: { $cond: [{ $eq: ["$fileType", "image"] }, 1, 0] }
            },
            totalVideos: { 
              $sum: { $cond: [{ $eq: ["$fileType", "video"] }, 1, 0] }
            }
          }
        }
      ]);
  
      res.status(200).json({
        status: "success",
        data: {
          user,
          mediaStats: mediaStats[0] || { totalMedia: 0, totalImages: 0, totalVideos: 0 }
        }
      });
    } catch (error) {
      next(error);
    }
  };


//--------------- user home page --------------------
export const getDashboard = async(req, res, next) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        if(!user) return next(new ApiError("user is not found", 404));

        res.status(201).json({
            status: "success",
            message: "Welcome to your home",
            data: user
        })
    }catch(error){
        console.log("Error in user home", error.message);
        next(error)
    }
}