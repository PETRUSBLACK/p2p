import express from "express";
import isAdmin from "../middleware/isAdmin.js";
import { createCoin, deleteCoin, editCoin, getAllCoin, getCoin } from "../controllers/coinController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import upload from '../config/fileUpload.js'

const coinRoutes = express.Router();

coinRoutes.post("/create",isLoggedIn, isAdmin, upload.single('coin'), createCoin);
coinRoutes.put("/:id", isLoggedIn, isAdmin, upload.single('coin'), editCoin);
coinRoutes.get("/:id", isLoggedIn, getCoin);
coinRoutes.get("/", getAllCoin);
coinRoutes.delete("/:id",isLoggedIn, isAdmin, deleteCoin);

export default coinRoutes;
