import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createBuyList, createBuyListValidationRules, deleteBuyList, getAllBuyListing, getUserBuyListing, updateBuyList, updateBuyListValidationRules } from "../controllers/buyListController.js";

const buyListRoutes = express.Router();

/**
 * @swagger
 * /api/v1/u:
 *   post:
 *     summary: The permits users to log in
 *     description: This is the endpoint to log in
 *  *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Buy'
 *      responses:
 *        '201':
 *          description: Please check your email and sms for your otp's
 *        '400':
 *          description: Bad request. Invalid email format.
 *        '409':
 *          description: Conflict. User with provided email already exists.
 *        '500':
 *          description: Internal server error
 *  * components:
    *   schemas:
    *     User:
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
 */

buyListRoutes.post("/buylist", isLoggedIn, createBuyListValidationRules(), createBuyList);

buyListRoutes.put("/buylist/:id", isLoggedIn, updateBuyListValidationRules(), updateBuyList);
buyListRoutes.delete("/buylist/:id", isLoggedIn, deleteBuyList);
buyListRoutes.get("/buylist/list", isLoggedIn, getAllBuyListing);
buyListRoutes.get("/buylist/get", isLoggedIn, getUserBuyListing);

export default buyListRoutes;