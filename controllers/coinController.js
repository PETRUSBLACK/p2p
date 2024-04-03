import asyncHandler from "express-async-handler";
import Coin from "../models/coin.js";
import cloudinary from "cloudinary";
import Wallet from "../models/Wallet.js";

export const createCoin = asyncHandler(async (req, res) => {
    const { name, limit, symbol } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(symbol, {
        folder: "p2p Coin"
    })

    const coinExits = await Coin.findOne({ name });
    if (coinExits) {
        throw new Error(`Coin with ${name} already exists`);
    }

    const createCoin = await Coin.create({
        name,
        symbol: {
            symbol_public_id: myCloud.public_id,
            symbol_url: myCloud.secure_url
        },
        limit
    });

    const wallet = await Wallet.find()

    if(wallet.length === 0){
        res.status(201).json({
            status: "success",
            message: "Coin created successfully",
            createCoin
        });
    }else{
        const updatedWallets = await wallet.updateMany({}, {
            $push: {
                coins: {
                    coin: createCoin._id,
                    quantity: 0,
                    totalCoinValue: 0
                }
            }
        });

        res.status(201).json({
            status: "success",
            message: "Coin created successfully and all wallets have been updated",
            createCoin
        });
    }
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
    const { name, limit, symbol } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(symbol, {
        folder: "p2p Coin"
    })

    let coinToEdit = await Coin.findById(req.params.id);
    if (!coinToEdit) {
        throw new Error("Coin does not exist");
    }

    const result = await cloudinary.v2.uploader.destroy(coinToEdit.symbol.symbol_public_id);

    if (!result.result == 'ok') {
        throw new Error("Error updating coin");
    }

    const updatedCoin = await Coin.findByIdAndUpdate(
        req.params.id,
        {
            name,
            symbol: {
                symbol_public_id: myCloud.public_id,
                symbol_url: myCloud.secure_url
            },
            limit
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

    const result = await cloudinary.v2.uploader.destroy(coin.symbol.symbol_public_id);

    if (result.result == 'ok') {
        coin = await Coin.findByIdAndDelete(req.params.id);
    } else {
        throw new Error("Error deleting coin");
    }

    res.json({
        status: "success",
        message: "Coin deleted successfully",
    });
});