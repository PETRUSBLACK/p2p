import asyncHandler from "express-async-handler";
import { generateToken } from "../util/jwtUtils.js";

export const googleCallBack = asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new Error("Login Failed");
    }

    const token = generateToken(req.user.__id);

    res.redirect(`https://p2p-system.netlify.app/login?token=${token}`);
});