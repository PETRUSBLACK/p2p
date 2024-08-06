import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { cancelOrder, createOrder, getSingleOrder, getUserOrders, markOrderAsPaid } from "../controllers/orderController.js";

const orderRoutes = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Order:
 *      type: object
 *      properties:
 *        totalQuantityOfCryptoBought:
 *          type: number
 *        totalFiatAmountToPay:
 *          type: number
 *        pricePerCoin:
 *          type: string
 *        accountInfoForTransaction:
 *          type: object
 *        tradeType:
 *          type: string
 *        paymentTimeLimit:
 *          type: number
 *        details:
 *          type: string
 *        cryptoCurrency:
 *          type: ref
 *          $ref: '#/components/schemas/Coin'
 *        fiatCurrency:
 *          type: string
 *          example: "USD"
 *        seller:
 *          type: ref
 *          $ref: '#/components/schemas/User'
 *        buyer:
 *          type: ref
 *          $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/v1/order/{id}:
 *  post:
 *    summary: Permits users to order for coins
 *    description: This is the endpoint to manage orders in the P2P system
 *    tags:
 *      - orders
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *    responses:
 *      '201':
 *        description: Successful
 *      '400':
 *        description: Bad Request
 *      '409':
 *        description: Conflict
 *      '500':
 *        description: Internal Server Error
 */
orderRoutes.post("/:id", createOrder);

/**
 * @swagger
 * /api/v1/order/{id}:
 *  get:
 *    summary: Retrieves an order by specified ID
 *    description: This endpoint allows users to retrieve a single order by the order's unique identifier
 *    tags:
 *      - orders
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Success
 *      '400':
 *        description: Bad Request
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
orderRoutes.get("/:id", getSingleOrder);

/**
 * @swagger
 * /api/v1/order:
 *  get:
 *    summary: Retrieves all orders for the logged-in user
 *    description: This endpoint allows users to retrieve all orders they have placed
 *    tags:
 *      - orders
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Successful
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Order'
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: Internal Server Error
 */
orderRoutes.get("/", isLoggedIn, getUserOrders);

/**
 * @swagger
 * /api/v1/order/{id}/cancel:
 *  put:
 *    summary: Cancel an order
 *    description: This endpoint allows users to cancel an existing order
 *    tags:
 *      - orders
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID to cancel
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description: Bad Request
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
orderRoutes.put("/:id/cancel", isLoggedIn, cancelOrder);

/**
 * @swagger
 * /api/v1/order/{id}/mark-order-paid:
 *  put:
 *    summary: Mark an order as paid
 *    description: This endpoint allows users to mark an order as paid
 *    tags:
 *      - orders
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID to mark as paid
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description: Bad Request
 *      '404':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 */
orderRoutes.put("/:id/mark-order-paid", isLoggedIn, markOrderAsPaid);

export default orderRoutes;
