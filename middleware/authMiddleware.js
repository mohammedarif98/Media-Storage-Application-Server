import { verifyToken } from "../utils/jwtUtils.js";
import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";



export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-token"] || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return next(new ApiError("You are not logged in. Please log.", 401));
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new ApiError('User not found', 404));

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError("Invalid or expired token. Please log in again.", 401));
  }
};