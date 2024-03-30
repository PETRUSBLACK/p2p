import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { cancelOrder, createOrder, getSingleOrder, getUserOrders, markOrderAsPaid } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post("/:id", createOrder);
orderRoutes.get("/:id", getSingleOrder);
orderRoutes.get("/", getUserOrders);
orderRoutes.put("/:id/cancel",  cancelOrder);
orderRoutes.put("/:id/mark-order-paid",  markOrderAsPaid);

export default orderRoutes;