import express from "express";
import isAmin from "../middleware/isAdmin.js";
import { createCoin, deleteCoin, editCoin, getAllCoin, getCoin } from "../controllers/coinController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import upload from '../config/fileUpload.js'

const coinRoutes = express.Router();

coinRoutes.post("/create",isLoggedIn, isAmin, upload.single('coin'), createCoin);
coinRoutes.put("/:id", isLoggedIn, isAmin, editCoin);
coinRoutes.get("/:id", getCoin);
coinRoutes.get("/", getAllCoin);
coinRoutes.delete("/:id",isLoggedIn, isAmin, deleteCoin);

export default coinRoutes;
