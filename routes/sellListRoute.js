import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createSellList, createSellListValidationRules, deleteSellList, getAllSellListing, getUserSellListing, updateSellList, updateSellListValidationRules } from "../controllers/sellListController.js";

const sellListRoutes = express.Router();

sellListRoutes.post("/",isLoggedIn, createSellListValidationRules(), createSellList);
sellListRoutes.put("/:id/update", isLoggedIn, updateSellListValidationRules(), updateSellList);
sellListRoutes.delete("/:id/delete", isLoggedIn, deleteSellList);
sellListRoutes.get("/", isLoggedIn, getAllSellListing);
sellListRoutes.get("/user", isLoggedIn, getUserSellListing);

export default sellListRoutes;