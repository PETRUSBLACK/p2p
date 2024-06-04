import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createBuyList, createBuyListValidationRules, deleteBuyList, getAllBuyListing, getUserBuyListing, updateBuyList, updateBuyListValidationRules } from "../controllers/buyListController.js";

const buyListRoutes = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Create otp for user registration
 *     description: This is the endpoint to create an otp for a user which the user will verify and be registered succesfully
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Please check your email and sms for your otp's
 *       '400':
 *         description: Bad request. Invalid email format.
 *       '409':
 *         description: Conflict. User with provided email already exists.
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         fullname:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
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
buyListRoutes.delete("/buylist/:id", isLoggedIn, deleteBuyList);
buyListRoutes.get("/buylist/list", isLoggedIn, getAllBuyListing);
buyListRoutes.get("/buylist/get", isLoggedIn, getUserBuyListing);

export default buyListRoutes;