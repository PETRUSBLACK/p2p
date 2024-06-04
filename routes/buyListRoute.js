import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createBuyList, createBuyListValidationRules, deleteBuyList, getAllBuyListing, getUserBuyListing, updateBuyList, updateBuyListValidationRules } from "../controllers/buyListController.js";

const buyListRoutes = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     BuyList:
 *       type: object
 *       properties:
 *         cryptoCurrencyName:
 *           type: string
 *         fiatCurrency:
 *           type: string
 *         pricePerCoin:
 *           type: string
 *         totalAmountOfCrypto:
 *           type: string
 *         rangeMin:
 *           type: string
 *         rangeMax:
 *           type: string
 *         paymentTimeLimit:
 *           type: string
 *         fee:
 *           type: string
 *         details:
 *           type: string
 * 
 * /api/v1/buyList/:
 *   post:
 *     summary: Permits users to create a buy list
 *     description: This is the endpoint to create a buy list
 *     tags:
 *       - buyList
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyList'
 *     responses:
 *       '201':
 *         description: Successful
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: Conflict
 *       '500':
 *         description: Internal server error
 */

buyListRoutes.post("/", isLoggedIn, createBuyListValidationRules(), createBuyList);

buyListRoutes.put("/buylist/:id", isLoggedIn, updateBuyListValidationRules(), updateBuyList);
buyListRoutes.delete("/buylist/:id", isLoggedIn, deleteBuyList);
buyListRoutes.get("/buylist/list", isLoggedIn, getAllBuyListing);
buyListRoutes.get("/buylist/get", isLoggedIn, getUserBuyListing);

export default buyListRoutes;