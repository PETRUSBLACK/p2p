import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createBuyList, createBuyListValidationRules, updateBuyList, updateBuyListValidationRules } from "../controllers/buyListController.js";

const buyListRoutes = express.Router();

buyListRoutes.post("/", isLoggedIn, createBuyListValidationRules(), createBuyList);
buyListRoutes.put("/:id", isLoggedIn, updateBuyListValidationRules(), updateBuyList);

export default buyListRoutes;