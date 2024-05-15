import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import SellList from "../models/SellList.js";
import User from "../models/User.js";
import Coin from "../models/coin.js";
import PaymentAccount from "../models/paymentAccount.js";

export const createSellListValidationRules = () => {
    return [
        body("cryptoCurrencyName").exists().withMessage("Crypto Currency is required"),
        body("fiatCurrency").exists().withMessage("Fiat currency is required"),
        body("pricePerCoin").isNumeric().withMessage("Invalid Price").exists().withMessage("Price is required"),
        body("totalAmountOfCrypto").isNumeric().withMessage("Invalid Amount").exists().withMessage("Amount is required"),
        body("rangeMin").isNumeric().withMessage("Invalid Min range").exists().withMessage("Min range is required"),
        body("rangeMax").isNumeric().withMessage("Invalid Max range").exists().withMessage("Max range is required"),
        body("paymentTimeLimit").isNumeric().withMessage("Invalid Payment time limit"),
        body("fee").optional().isNumeric().withMessage("Invalid Fee"),
        body("details").exists().withMessage("Listing Details currency is required"),
        body("accountNumber").exists().withMessage("Provide an account")
    ];
};

export const updateSellListValidationRules = () => {
    return [
        body("cryptoCurrencyName").optional(),
        body("fiatCurrency").optional(),
        body("pricePerCoin").optional().isNumeric().withMessage("Invalid Price"),
        body("totalAmountOfCrypto").optional().isNumeric().withMessage("Invalid Amount"),
        body("rangeMin").optional().isNumeric().withMessage("Invalid Min range"),
        body("rangeMax").optional().isNumeric().withMessage("Invalid Max range"),
        body("paymentTimeLimit").optional().isNumeric().withMessage("Invalid Payment time limit"),
        body("fee").optional().isNumeric().withMessage("Invalid Fee"),
        body("details").optional().exists().withMessage("Listing Details currency is required"),
        body("accountNumber").optional().exists().withMessage("Provide an account")
    ];
};

export const createSellList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }

    const { cryptoCurrencyName, fiatCurrency, pricePerCoin, totalAmountOfCrypto, rangeMin, rangeMax, paymentTimeLimit, fee, details, accountNumber } = req.body;

    try {
        const coin = await Coin.findOne({ name: cryptoCurrencyName });

        if (!coin) {
            return res.status(400).json({ message: `Cryptocurrency ${cryptoCurrencyName} does not exist` });
        }

        if (pricePerCoin > coin.limit) {
            return res.status(400).json({ message: `Price per coin exceeds the limit for ${cryptoCurrencyName}` });
        }

        const account = await PaymentAccount.findOne({ user: req.userAuth, accountNumber })

        if (!account) {
            return res.status(400).json({ message: `Account could not be found` });
        }

        const sellList = await SellList.create({
            user: req.userAuth,
            cryptoCurrency: coin._id,
            fiatCurrency,
            pricePerCoin,
            totalAmountOfCrypto,
            range: {
                min: rangeMin,
                max: rangeMax
            },
            paymentTimeLimit,
            accountInfoForTransaction: account._id,
            details,
            fee
        });

        res.status(201).json({
            status: "success",
            message: " List Created Successfully",
            data: sellList
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})


export const updateSellList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }

    const { cryptoCurrencyName, fiatCurrency, pricePerCoin, totalAmountOfCrypto, rangeMin, rangeMax, paymentTimeLimit, fee, details, accountNumber } = req.body;
    const sellListId = req.params.id;
    
    try {
        const coin = await Coin.findOne({ name: cryptoCurrencyName });

        if (!coin) {
            return res.status(400).json({ message: `Cryptocurrency ${cryptoCurrencyName} does not exist` });
        }

        if (pricePerCoin > coin.limit) {
            return res.status(400).json({ message: `Price per coin exceeds the limit for ${cryptoCurrencyName}` });
        }

        const account = await PaymentAccount.findOne({ user: req.userAuth, accountNumber })

        if (!account) {
            return res.status(400).json({ message: `Account could not be found` });
        }

        const findSellList = await SellList.findById(sellListId)

        if (!findSellList) {
            throw new Error("The Listing was not found");
        }

        const sellList = await SellList.findByIdAndUpdate(
            sellListId,
            {
                cryptoCurrency: coin._id,
                fiatCurrency,
                pricePerCoin,
                totalAmountOfCrypto,
                range: {
                    min: rangeMin,
                    max: rangeMax
                },
                paymentTimeLimit,
                accountInfoForTransaction: account._id,
                details,
                fee
            },
            {
                new: true
            }
        );

        res.status(201).json({
            status: "success",
            message: " List updated Successfully",
            data: sellList
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

export const deleteSellList = asyncHandler(async (req, res) => {
    const sellListId = req.params.id;
    
    try {
        const sellList = await SellList.findById(sellListId);

        if (!sellList) {
            return res.status(404).json({ message: 'Sell Listing not found' });
        }

        if (sellList.user.toString() !== req.userAuth.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const sellListDeleted = await SellList.findByIdAndDelete(sellListId);

        res.status(200).json({
            status: "success",
            message: "Sell Listing deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

export const getAllSellListing = asyncHandler(async (req, res) => {
    try {
        const sellLists = await SellList.find().populate('user cryptoCurrency');

        res.status(200).json({
            status: "success",
            message: "Sell Listing retrieved successfully",
            data: sellLists
        }); 
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

export const getUserSellListing = asyncHandler(async (req, res) => {
    try {
        const sellList = await SellList.find({ user: req.userAuth });
    
        res.status(200).json({
            status: "success",
            message: "Sell Listing retrieved successfully",
            data: sellList
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})