import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoutes.js";
import { globalError, notFound } from "../middleware/globalerrorhandler.js";
import coinRoutes from "../routes/coinRoute.js";
import sellListRoutes from "../routes/sellListRoute.js";
import paymentAccountRoutes from "../routes/paymentAccountRoute.js";
import buyListRoutes from "../routes/buyListRoute.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import orderRoutes from "../routes/orderRoute.js";
dbConnect();

const app = express();
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/coins",isLoggedIn, coinRoutes);
app.use("/api/v1/sellList",isLoggedIn, sellListRoutes);
app.use("/api/v1/buyList",isLoggedIn, buyListRoutes);
app.use("/api/v1/paymentAccount",isLoggedIn, paymentAccountRoutes);
app.use("/api/v1/order",isLoggedIn, orderRoutes);

app.use(notFound);
app.use(globalError);
export default app;
