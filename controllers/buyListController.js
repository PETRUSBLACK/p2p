import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import BuyList from "../models/BuyList.js";
import Coin from "../models/coin.js";

export const createBuyListValidationRules = () => {
    return [
        body("cryptoCurrencyName").exists().withMessage("Crypto Currency is required"),
        body("fiatCurrency").exists().withMessage("Fiat currency is required"),
        body("pricePerCoin").isNumeric().withMessage("Invalid Price").exists().withMessage("Price is required"),
        body("totalAmountOfCrypto").isNumeric().withMessage("Invalid Amount").exists().withMessage("Amount is required"),
        body("rangeMin").isNumeric().withMessage("Invalid Min range").exists().withMessage("Min range is required"),
        body("rangeMax").isNumeric().withMessage("Invalid Max range").exists().withMessage("Max range is required"),
        body("paymentTimeLimit").isNumeric().withMessage("Invalid Payment time limit"),
        body("fee").optional().isNumeric().withMessage("Invalid Fee"),
        body("details").exists().withMessage("Listing Details currency is required")
    ];
};

export const updateBuyListValidationRules = () => {
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

// {
//     "cryptoCurrencyName": "btc",
//     "fiatCurrency": "10000",
//     "pricePerCoin": "1200",
//     "totalAmountOfCrypto": "12000",
//     "rangeMin": "100",
//     "rangeMax": "10000",
//     "paymentTimeLimit" :"2",
//     "fee": "120",
//     "details" : "This is details"

// }

export const createBuyList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }

    const { cryptoCurrencyName, 
            fiatCurrency, 
            pricePerCoin, 
            totalAmountOfCrypto, 
            rangeMin, 
            rangeMax, 
            paymentTimeLimit, 
            fee, 
            details } = req.body;

    try {
        const coin = await Coin.findOne({ name: cryptoCurrencyName });

        if (!coin) {
            return res.status(400).json({ message: `Cryptocurrency ${cryptoCurrencyName} does not exist` });
        };

        // console.log(req.userAuth)

        const buyList = await BuyList.create({
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
            details,
            fee
        });

        res.status(201).json({
            status: "success",
            message: "Buy List Created Successfully",
            data: buyList
        });
    }catch (error) {
        res.status(500).json({ message: error });
    }
})

export const updateBuyList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg
        });
    }

    const { cryptoCurrencyName, fiatCurrency, pricePerCoin, totalAmountOfCrypto, rangeMin, rangeMax, paymentTimeLimit, fee, details } = req.body;
    const buyListId = req.params.id;

    try {
        const coin = await Coin.findOne({ name: cryptoCurrencyName });

        if (!coin) {
            return res.status(400).json({ message: `Cryptocurrency ${cryptoCurrencyName} does not exist` });
        }

        const findBuyList = await BuyList.findById(buyListId)

        if (!findBuyList) {
            throw new Error("The Buy Listing was not found");
        }

        const buyList = await BuyList.findByIdAndUpdate(
            buyListId,
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
                details,
                fee
            },
            {
                new: true
            }
        );

        res.status(201).json({
            status: "success",
            message: "Buy List updated Successfully",
            data: buyList
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

export const deleteBuyList = asyncHandler(async (req, res) => {
    const buyListId = req.params.id;

    try {
        const buyList = await BuyList.findById(buyListId);

        if (!buyList) {
            return res.status(404).json({ message: 'Buy Listing not found' });
        }

        if (buyList.user.toString() !== req.userAuth.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // const buyListDeleted = await BuyList.findByIdAndDelete(buyListId);

        res.status(200).json({
            status: "success",
            message: "Buy Listing deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getAllBuyListing = asyncHandler(async (req, res) => {
    try {
        const buyLists = await BuyList.find().populate('user cryptoCurrency');

        res.status(200).json({
            status: "success",
            message: "Buy Listing retrieved successfully",
            data: buyLists
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getUserBuyListing = asyncHandler(async (req, res) => {
    try {
        const buyList = await BuyList.find({ user: req.userAuth }).populate('cryptoCurrency');

        res.status(200).json({
            status: "success",
            message: "Buy Listing retrieved successfully",
            data: buyList
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});