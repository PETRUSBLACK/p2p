import express from "express";
import dotenv from "dotenv";
dotenv.config();
dbConnect();
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/userRoutes.js";
import { globalError, notFound } from "../middleware/globalerrorhandler.js";
import coinRoutes from "../routes/coinRoute.js";
import sellListRoutes from "../routes/sellListRoute.js";
import paymentAccountRoutes from "../routes/paymentAccountRoute.js";
import buyListRoutes from "../routes/buyListRoute.js";
import oauthRoutes from "../routes/oauthRoutes.js";
import adminRoutes from "../routes/adminRoute.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import orderRoutes from "../routes/orderRoute.js";
import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from "swagger-jsdoc";
import isAdmin from "../middleware/isAdmin.js";

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

const /* `swaggerOptions` is an object that defines the configuration options for generating Swagger
  documentation for the API. It includes information such as the title, version, description,
  contact details, server URL, and supported schemes. Additionally, it specifies the location of
  the API routes that should be included in the Swagger documentation. This object is then used
  to generate the Swagger documentation using `swaggerJsdoc` and is served using `swaggerUi`
  middleware on the "/api-docs" endpoint in the Express application. */


  swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "P2P Cryptocurrency Exchange",
        version: "1.0.0",
        description:
          "This is a backend api documentation for P2P Cryptocurrency application",
        contact: {
          name: "Stringcode Limited",
        },
        server: ["http://localhost:3000"],
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-KEY',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          customHeaderAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-CUSTOM-HEADER',
          },
        },
      },
      security: [
        {
          ApiKeyAuth: [],
          bearerAuth: [],
          customHeaderAuth: [],
        },
      ],
      
      schemes: ["http", "https"],

    },
    apis: ["./routes/*.js"],
  };
  
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use("/api/v1/auth", oauthRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/coins", isLoggedIn, coinRoutes);
app.use("/api/v1/sellList", isLoggedIn, sellListRoutes);
app.use("/api/v1/buyList", isLoggedIn, buyListRoutes);
app.use("/api/v1/paymentAccount", isLoggedIn, paymentAccountRoutes);
app.use("/api/v1/order", isLoggedIn, orderRoutes);
app.use("/api/v1/admin" ,isLoggedIn, isAdmin,adminRoutes);

app.use(notFound);
app.use(globalError);
export default app;
