import asyncHandler from "express-async-handler";
import Coin from "../models/Coin";
const cloudinary = require('cloudinary').v2;

export const createCoin = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const coinImage = req.coin.path

    const coinExits = await Coin.findOne({ name });
    if (coinExits) {
        throw new Error(`Coin with ${name} already exists`);
    }

    const createCoin = await Coin.create({
        name,
        symbol: coinImage
    });

    res.status(201).json({
        status: "success",
        message: "Coin created successfully",
        createCoin,
    });
})

export const getCoin = asyncHandler(async (req, res) => {
    const coinFound = await Coin.findById(req.params.id)

    if (!coinFound) {
        throw new Error("Coin does not exist");
    }

    res.json({
        status: "success",
        message: "Coin found",
        coinFound,
    });
});

export const getAllCoin = asyncHandler(async (req, res) => {
    const coinFound = await Coin.find()

    if (!coinFound) {
        throw new Error("Something went wrong");
    }

    res.json({
        status: "success",
        message: "Coins found",
        coinFound,
    });
});

export const editCoin = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const coinImage = req.coin.path

    let coinToEdit = await Coin.findById(id);
    if (!coinToEdit) {
        throw new Error("Coin does not exist");
    }

    const result = await cloudinary.uploader.destroy(coinToEdit.symbol);

    if(!result){
        throw new Error("Problem updating coin");
    }

    const updatedCoin = await Coin.findByIdAndUpdate(
        req.params.id,
        {
            name,
            symbol: coinImage
        },
        {
            new: true,
        }
    );

    res.json({
        status: "success",
        message: "Coin edited successfully",
        updatedCoin,
    });
});

export const deleteCoin = asyncHandler(async (req, res) => {
    let coin;
    coin = await Coin.findById(req.params.id);

    if (!Coin) {
        throw new Error("Couldn't find coin");
    }

    const result = await cloudinary.uploader.destroy(deleteCoin.symbol);

    if(result){
        coin = await Coin.findByIdAndDelete(req.params.id);
    } else {
        throw new Error("Error deleting coin");
    }

    res.json({
        status: "success",
        message: "Coin deleted successfully",
    });
})