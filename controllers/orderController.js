import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import SellList from "../models/SellList.js";
import Coin from "../models/coin.js";
import Transactions from "../models/Transactions.js";
import PaymentAccount from "../models/paymentAccount.js";

export const createOrder = asyncHandler(async (req, res) => {
    const { totalFiatAmountToPay, totalQuantityOfCryptoBought } = req.body;
    const sellListId = req.params.id;

    try {
        const sellList = await SellList.findById(sellListId);

        if (!sellList) {
            return res.status(404).json({ message: "Sell Listing Could not be found" });
        }

        const coin = await Coin.findById(sellList.cryptoCurrency);

        const account = await PaymentAccount.findById(sellList.accountInfoForTransaction)

        const order = await Order.create({
            seller: sellList.user,
            buyer: req.userAuth,
            cryptoCurrency: sellList.cryptoCurrency,
            totalQuantityOfCryptoBought,
            fiatCurrency: sellList.fiatCurrency,
            totalFiatAmountToPay,
            pricePerCoin: sellList.pricePerCoin,
            accountInfoForTransaction: account,
            tradeType: `Buy ${coin.name}`,
            paymentTimeLimit: sellList.paymentTimeLimit,
            details: sellList.details
        });

        res.status(201).json({
            status: "success",
            message: "Order created successfully",
            data: order,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getSingleOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order could not be found" });
        }

        res.status(200).json({
            status: "success",
            message: "Order fetched successfully",
            data: order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.userAuth });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "Orders could not be found" });
        }

        res.status(200).json({
            status: "success",
            message: "User buyer orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const cancelOrder = asyncHandler(async (req, res) => {
    const orderId = req.params.id

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order could not be found" });
        }

        order.status = "Cancelled";
        await order.save();

        res.status(200).json({
            status: "success",
            message: "Order Cancelled successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const markOrderAsPaid = asyncHandler(async (req, res) => {
    const orderId = req.params.id

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order could not be found" });
        }

        const transaction = await Transactions.create({
            amount: order.totalFiatAmountToPay,
            currency: order.fiatCurrency,
            cryptocurrency: order.cryptoCurrency,
            cryptocurrencyName: order.tradeType.split(' ')[1],
            sender: order.buyer,
            receiver: order.seller,
            status: 'Completed'
        });

        const notification = await Notification.create({
            message: `${order.buyer} has made payment`,
            recipient: order.seller,
        });

        order.status = 'Successful';
        order.transactions.push(transaction._id);
        order.notifications.push(notification._id);
        await order.save();

        res.status(200).json({
            status: 'success',
            message: 'Order marked as paid successfully',
            data: order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
