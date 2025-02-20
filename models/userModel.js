import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";


const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    profilePhoto: {
      type: String,
      default:
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.svg",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    media: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media', 
  }],
  },
  { timestamps: true }
);



// ------------ pre hook to Hash password before saving -------------
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    try {
      this.password = await hashPassword(this.password);
      next();
    } catch (error) {
      next(error);
    }
});


// ------------ Compare password -------------
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await comparePassword(enteredPassword, this.password);
// };


const User = mongoose.model("User", userSchema);
export default User;
