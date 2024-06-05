import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  createBuyList,
  createBuyListValidationRules,
  deleteBuyList,
  getAllBuyListing,
  getUserBuyListing,
  updateBuyList,
  updateBuyListValidationRules
} from "../controllers/buyListController.js";

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
 */

/**
 * @swagger
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

/**
 * @swagger
 * /api/v1/buyList/buylist/{id}:
 *   put:
 *     summary: Update a buy list by ID
 *     tags: [buyList]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The buy list ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyList'
 *     responses:
 *       '200':
 *         description: Successful
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Internal server error
 */
buyListRoutes.put("/buylist/:id", isLoggedIn, updateBuyListValidationRules(), updateBuyList);

/**
 * @swagger
 * /api/v1/buyList/buylist/{id}:
 *   delete:
 *     summary: Delete a buy list by ID
 *     tags: [buyList]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The buy list ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: No content
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Internal server error
 */
buyListRoutes.delete("/buylist/:id", isLoggedIn, deleteBuyList);

/**
 * @swagger
 * /api/v1/buyList/buylist/list:
 *   get:
 *     summary: Get all buy lists
 *     tags: [buyList]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal server error
 */
buyListRoutes.get("/buylist/list", isLoggedIn, getAllBuyListing);

/**
 * @swagger
 * /api/v1/buyList/buylist/get:
 *   get:
 *     summary: Get user's buy lists
 *     tags: [buyList]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal server error
 */
buyListRoutes.get("/buylist/get", isLoggedIn, getUserBuyListing);

export default buyListRoutes;
