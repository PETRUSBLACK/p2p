import express from "express";
import {getAllUsers,blockUser,unBlockUser,addAdmin,removeAdmin,getSuccessfulTransactions,getUnSuccessfulTransactions} from "../controllers/adminController.js"
import dotenv from "dotenv";
dotenv.config();

const adminRoutes = express.Router();

adminRoutes.get("/allUsers",getAllUsers );
adminRoutes.post("/addAdmin/:id", addAdmin);
adminRoutes.post("/removeAdmin/:id",removeAdmin);
adminRoutes.post("/blockUser/:id",blockUser);
adminRoutes.post("/unBlockUser/:id",unBlockUser);
adminRoutes.get("/getSuccessfulTransactions",getSuccessfulTransactions );
adminRoutes.get("/getUnSuccessfulTransactions",getUnSuccessfulTransactions);


export default adminRoutes;