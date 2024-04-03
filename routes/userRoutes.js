import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";
import { otpVerification, loginUserContrl, userProfile, registerUser, updatePassword, resendOTP } from "../controllers/userController.js"


const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verifyotp", otpVerification);
userRoutes.get('/resendOtp', resendOTP)
userRoutes.put("/update-password", isLoggedIn, updatePassword);
userRoutes.post("/login", loginUserContrl);
userRoutes.get("/profile", isLoggedIn, userProfile);

export default userRoutes;
