import asyncHandler from "express-async-handler";
import Coin from "../models/Coin.js";
import { v2 as cloudinary } from "cloudinary";

export const createCoin = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const coinImage = req?.file.path
    const publicID = req?.file.filename

    const coinExits = await Coin.findOne({ name });
    if (coinExits) {
        throw new Error(`Coin with ${name} already exists`);
    }

    const createCoin = await Coin.create({
        name,
        symbol: {
            symbol_public_id: publicID,
            symbol_url: coinImage
        }
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
    console.log(req)
    const coinImage = req?.file.path
    const publicID = req?.file.filename

    let coinToEdit = await Coin.findById(req.params.id);
    if (!coinToEdit) {
        throw new Error("Coin does not exist");
    }

    const result = await cloudinary.uploader.destroy(coinToEdit.symbol.symbol_public_id);

    if(!result.result == 'ok'){
        throw new Error("Error updating coin");
    }

    const updatedCoin = await Coin.findByIdAndUpdate(
        req.params.id,
        {
            name,
            symbol: {
                symbol_public_id: publicID,
                symbol_url: coinImage
            }
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

    const result = await cloudinary.uploader.destroy(coin.symbol.symbol_public_id);

    if(result.result == 'ok'){
        coin = await Coin.findByIdAndDelete(req.params.id);
    } else {
        throw new Error("Error deleting coin");
    }

    res.json({
        status: "success",
        message: "Coin deleted successfully",
    });
});