import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createSellList, createSellListValidationRules, updateSellList, updateSellListValidationRules } from "../controllers/sellListController.js";

const sellListRoutes = express.Router();

sellListRoutes.post("/",isLoggedIn, createSellListValidationRules(), createSellList);
sellListRoutes.put("/:id", isLoggedIn, updateSellListValidationRules(), updateSellList);

export default sellListRoutes;