import express from "express";
import isAdmin from "../middleware/isAdmin.js";
import {getAllUsers,addAdmin,removeAdmin} from "../controllers/adminController.js"
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import dotenv from "dotenv";
dotenv.config();

const adminRoutes = express.Router();

adminRoutes.get("/allUsers", getAllUsers );
adminRoutes.post("/addAdmin/:id", addAdmin);
adminRoutes.post("/removeAdmin/:id", removeAdmin);


export default adminRoutes;