import express from "express";
import isAdmin from "../middleware/isAdmin.js";
import {
  createCoin,
  deleteCoin,
  editCoin,
  getAllCoin,
  getCoin,
} from "../controllers/coinController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Coin:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: The name of the coin
 *          required: true
 *        symbol:
 *          type: string
 *          description: The symbol of the coin
 *          required: true
 *        symbol_public_id:
 *          type: string
 *          description: The public ID of the coin symbol
 *          required: true
 *        symbol_url:
 *          type: string
 *          description: The URL of the coin symbol image
 *          required: true
 *        limit:
 *          type: number
 *          description: The maximum limit for the coin
 *          required: true
 */

const coinRoutes = express.Router();

/**
 * @swagger
 * /api/v1/coin:
 *  post:
 *    summary: Permits users to create a new coin
 *    description: This is the endpoint to manage coins in the P2P system
 *    tags:
 *      - coins
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *                description: The name of the coin
 *              symbol:
 *                type: string
 *                required: true
 *                description: The symbol of the coin
 *              limit:
 *                type: number
 *                required: true
 *                description: The maximum limit for the coin
 *                example: 100
 *    responses:
 *      '201':
 *        description: Coin created successfully
 *      '400':
 *        description: Bad Request
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '500':
 *        description: Internal Server Error
 */
coinRoutes.post("/", isLoggedIn, isAdmin, upload.single("coin"), createCoin);

/**
 * @swagger
 * /api/v1/coin/{id}:
 *  put:
 *    summary: Permits users to edit a coin
 *    description: This is the endpoint to manage coins in the P2P system
 *    tags:
 *      - coins
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The coin ID
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The updated name of the coin
 *              symbol:
 *                type: string
 *                description: The updated symbol of the coin
 *              limit:
 *                type: number
 *                description: The updated maximum limit for the coin
 *    responses:
 *      '200':
 *        description: Coin updated successfully
 *      '400':
 *        description: Bad Request
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
coinRoutes.put("/:id", isLoggedIn, isAdmin, upload.single("coin"), editCoin);

/**
 * @swagger
 * /api/v1/coin/{id}:
 *  get:
 *    summary: Retrieves a specific coin by ID
 *    description: This endpoint allows users to retrieve a coin by its unique identifier
 *    tags:
 *      - coins
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The coin ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Coin'
 *      '401':
 *        description: Unauthorized
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
coinRoutes.get("/:id", isLoggedIn, getCoin);

/**
 * @swagger
 * /api/v1/coin:
 *  get:
 *    summary: Retrieves all coins
 *    description: This endpoint allows users to retrieve all coins available in the P2P system
 *    tags:
 *      - coins
 *    responses:
 *      '200':
 *        description: Successful
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Coin'
 *      '500':
 *        description: Internal Server Error
 */
coinRoutes.get("/", getAllCoin);

/**
 * @swagger
 * /api/v1/coin/{id}:
 *  delete:
 *    summary: Permits users to delete a specific coin
 *    description: This endpoint allows admins to delete a coin by its unique identifier
 *    tags:
 *      - coins
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The coin ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Coin deleted successfully
 *      '400':
 *        description: Bad Request
 *      '401':
 *        description: Unauthorized
 *      '403':
 *        description: Forbidden
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
coinRoutes.delete("/:id", isLoggedIn, isAdmin, deleteCoin);

export default coinRoutes;
