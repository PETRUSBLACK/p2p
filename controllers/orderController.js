import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import SellList from "../models/SellList.js";
import Coin from "../models/coin.js";
import Transactions from "../models/Transactions.js";
import PaymentAccount from "../models/paymentAccount.js";
import Notification from "../models/Notification.js";
import Wallet from "../models/Wallet.js";

export const createOrder = asyncHandler(async (req, res) => {
    const { totalFiatAmountToPay, totalQuantityOfCryptoBought } = req.body;
    const sellListId = req.params.id;

    try {
        const sellList = await SellList.findById(sellListId);

        if (!sellList) {
            return res.status(404).json({ message: "Sell Listing could not be found" });
        }

        if(totalQuantityOfCryptoBought < sellList.range.min || totalQuantityOfCryptoBought > sellList.range.max) {
            return res.status(404).json({ message: "You are out of range "})
        }          

        const coin = await Coin.findById(sellList.cryptoCurrency);
        if (!coin) {
            return res.status(404).json({ message: "Cryptocurrency not found" });
        }

        if(totalFiatAmountToPay < sellList.range.min || totalFiatAmountToPay > sellList.range.max ){
            return res.status(404).json({ message: "Fiat amount is more than the range specified." });
        }

        const account = await PaymentAccount.findById(sellList.accountInfoForTransaction);
        if (!account) {
            return res.status(404).json({ message: "Payment account not found" });
        }

        const wallet = await Wallet.findOne({ userId: sellList.user });
        if (!wallet) {
            return res.status(404).json({ message: "Seller's wallet not found" });
        }

        const coinInWallet = wallet.coins.find(coinItem => coinItem.coin.toString() === coin._id.toString());
        if (!coinInWallet || coinInWallet.quantity < totalQuantityOfCryptoBought) {
            return res.status(400).json({ message: "Seller does not have enough coins for the order" });
        }

        // deducting the coin from the seller's account
        coinInWallet.quantity -= totalQuantityOfCryptoBought

        await coinInWallet.save()
        const reserve = coinInWallet.quantity - totalQuantityOfCryptoBought;

        coinInWallet.quantity -= totalQuantityOfCryptoBought;
        await wallet.save();

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
            details: sellList.details,
            reserve: reserve
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
