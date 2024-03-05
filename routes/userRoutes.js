import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";
import { otpVerification, registerUserLevel1, registerUserLevel3, loginUserContrl, userProfile } from "../controllers/userController.js"


const userRoutes = express.Router();

userRoutes.post("/register/l1", registerUserLevel1);
userRoutes.post("/register/l2", otpVerification);
userRoutes.post("/register/l3", registerUserLevel3);
userRoutes.post("/login", loginUserContrl);
userRoutes.get("/profile", isLoggedIn, userProfile);

export default userRoutes;
