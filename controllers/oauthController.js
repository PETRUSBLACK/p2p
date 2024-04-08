import asyncHandler from "express-async-handler";
import { generateToken } from "../util/jwtUtils.js";

export const googleCallBack = asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new Error("Login Failed");
    }

    res.json({
      status: "success",
      message: "User logged in successfully",
      token: generateToken(req.user._id)
    });
})