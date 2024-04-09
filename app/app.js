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
import oauthRoutes from "../routes/oauthRoutes.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import orderRoutes from "../routes/orderRoute.js";
dbConnect();
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use("/api/v1/auth", oauthRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/coins", isLoggedIn, coinRoutes);
app.use("/api/v1/sellList", isLoggedIn, sellListRoutes);
app.use("/api/v1/buyList", isLoggedIn, buyListRoutes);
app.use("/api/v1/paymentAccount", isLoggedIn, paymentAccountRoutes);
app.use("/api/v1/order", isLoggedIn, orderRoutes);

app.use(notFound);
app.use(globalError);
export default app;
