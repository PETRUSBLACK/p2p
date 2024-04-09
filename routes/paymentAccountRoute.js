import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createPaymentAccount, deletePaymentAccount, getAllPaymentAccounts, updatePaymentAccount } from "../controllers/paymentAccountController.js";

const paymentAccountRoutes = express.Router();

paymentAccountRoutes.post("/", isLoggedIn,  createPaymentAccount);
paymentAccountRoutes.put("/:id/update", isLoggedIn,  updatePaymentAccount);
paymentAccountRoutes.get("/", isLoggedIn,  getAllPaymentAccounts);
paymentAccountRoutes.post("/:id/delete", isLoggedIn,  deletePaymentAccount);

export default paymentAccountRoutes;