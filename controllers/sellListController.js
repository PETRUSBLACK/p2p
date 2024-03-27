import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import SellList from "../models/SellList.js";
import User from "../models/User.js";

export const createSellListValidationRules = () => {
    return [
        body("crypto").exists().withMessage("Crypto is required"),
        body("fiatCurrency").exists().withMessage("Fiat currency is required"),
        body("price").isNumeric().withMessage("Price must be a number").exists().withMessage("Price is required"),
        body("totalAmountOfCrypto").isNumeric().withMessage("Total amount of crypto must be a number").exists().withMessage("Total amount of crypto is required"),
        body("rangeMin").isNumeric().withMessage("Min range must be a number").exists().withMessage("Min range is required"),
        body("rangeMax").isNumeric().withMessage("Max range must be a number").exists().withMessage("Max range is required"),
        body("paymentTimeLimit").isNumeric().withMessage("Payment time limit must be a number"),
        body("fee").optional().isNumeric().withMessage("Fee must be a number"),
    ];
};

export const updateSellListValidationRules = () => {
    return [
        body("crypto").optional(),
        body("fiatCurrency").optional(),
        body("price").optional().isNumeric().withMessage("Price must be a number"),
        body("totalAmountOfCrypto").optional().isNumeric().withMessage("Total amount of crypto must be a number"),
        body("rangeMin").optional().isNumeric().withMessage("Min range must be a number"),
        body("rangeMax").optional().isNumeric().withMessage("Max range must be a number"),
        body("paymentTimeLimit").optional().isNumeric().withMessage("Payment time limit must be a number"),
        body("fee").optional().isNumeric().withMessage("Fee must be a number"),
    ];
};

export const createSellList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { crypto, fiatCurrency, price, totalAmountOfCrypto, rangeMin, rangeMax, paymentTimeLimit, fee } = req.body;

    const user = await User.findById(req.userAuth);

    const sellList = await SellList.create({
        user: user._id,
        crypto,
        fiatCurrency,
        price,
        totalAmountOfCrypto,
        range: {
            min: rangeMin,
            max: rangeMax
        },
        paymentTimeLimit,
        fee
    });

    res.status(201).json({
        status: "success",
        message: " List Created Successfully",
        data: sellList
    });
})


export const updateSellList = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { crypto, fiatCurrency, price, totalAmountOfCrypto, rangeMin, rangeMax, paymentTimeLimit, fee } = req.body;

    const findSellList = await SellList.findById(req.params.id)

    if (!findSellList) {
        throw new Error("The Listing was not found");
    }

    const sellList = await SellList.findByIdAndUpdate(
        req.params.id,
        {
            user: req.userAuth,
            crypto,
            fiatCurrency,
            price,
            totalAmountOfCrypto,
            range: {
                min: rangeMin,
                max: rangeMax
            },
            paymentTimeLimit,
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
})