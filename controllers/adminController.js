import asyncHandler from "express-async-handler";

import User from "../models/User.js";
import Transactions from "../models/Transactions.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    try {

        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "Users could not be found" });
        }

        res.json({
            status: "success",
            message: "List of users",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

});

export const addAdmin = asyncHandler(async (req, res) => {

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User could not be found" });
        }

        const updatedToAdmin = await User.findByIdAndUpdate(
            userId,
            { isAdmin: true },
            { new: true }
        )
        res.status(200).json({
            status: "success",
            message: "User updated to admin successfully",
            data: updatedToAdmin
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const removeAdmin = asyncHandler(async (req, res) => {

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User could not be found" });
        }

        const updatedToAdmin = await User.findByIdAndUpdate(
            userId,
            { isAdmin: false },
            { new: true }
        )
        res.status(200).json({
            status: "success",
            message: "Successfully removed user from admin",
            data: updatedToAdmin
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getSuccessfulTransactions = asyncHandler(async (req, res) => {


    try {
        const SuccessfulTransactions = await Transactions.find({ status: "Completed" });
        // const transactions = await Transactions.find({status:{
        //     $and: [{status: "Pending"}, {status: "Failed"}]
        // }});        

        if (!SuccessfulTransactions) {
            return res.status(404).json({ message: "User could not be found" });
        }
        res.status(200).json({
            status: "success",
            message: "List of Successful transactions",
            SuccessfulTransactions,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getUnSuccessfulTransactions = asyncHandler(async (req, res) => {


    try {
       const unSuccessfulTransactions = await Transactions.find({
            $or: [{status: "Pending"}, {status: "Failed"}]
        });        

        if (!unSuccessfulTransactions) {
            return res.status(404).json({ message: "User could not be found" });
        }
        res.status(200).json({
            status: "success",
            message: "List of unSuccessful transactions",
            unSuccessfulTransactions,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export const blockUser = asyncHandler(async (req, res) => {

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User could not be found" });
        }

        const blockedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        )
        res.status(200).json({
            status: "success",
            message: "User blocked successfully",
            data:  blockedUser 
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const unBlockUser = asyncHandler(async (req, res) => {

    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User could not be found" });
        }

        const  unblockedUser = await User.findByIdAndUpdate(
            userId,
            { isBlocked:false },
            { new: true }
        )
        res.status(200).json({
            status: "success",
            message: "User unBlocked successfully",
            data: unblockedUser 
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});