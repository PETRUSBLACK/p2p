import express from "express";
import { passport } from "../config/oauth.js";
import { googleCallBack } from "../controllers/oauthController.js";

const oauthRoutes = express.Router();

oauthRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

oauthRoutes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), 
  googleCallBack
);

export default oauthRoutes;
