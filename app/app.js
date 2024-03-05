import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoutes.js";
import { globalError, notFound } from "../middleware/globalerrorhandler.js";
dbConnect();

const app = express();
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/coin", userRoutes);
app.use(notFound);
app.use(globalError);
export default app;
