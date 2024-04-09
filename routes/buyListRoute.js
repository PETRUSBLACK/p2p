import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createBuyList, createBuyListValidationRules, deleteBuyList, getAllBuyListing, getUserBuyListing, updateBuyList, updateBuyListValidationRules } from "../controllers/buyListController.js";

const buyListRoutes = express.Router();

buyListRoutes.post("/", isLoggedIn, createBuyListValidationRules(), createBuyList);
buyListRoutes.put("/:id", isLoggedIn, updateBuyListValidationRules(), updateBuyList);
buyListRoutes.delete("/:id/delete", isLoggedIn, deleteBuyList);
buyListRoutes.get("/", isLoggedIn, getAllBuyListing);
buyListRoutes.get("/user", isLoggedIn, getUserBuyListing);

export default buyListRoutes;