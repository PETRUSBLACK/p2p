import express from "express";
import {
  loginUserContrl,
  registerUserContrl,
  userProfile,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAmin from "../middleware/isAdmin.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserContrl);
userRoutes.post("/login", loginUserContrl);
userRoutes.get("/profile", isLoggedIn, userProfile);

export default userRoutes;
