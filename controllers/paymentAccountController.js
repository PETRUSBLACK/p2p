import asyncHandler from "express-async-handler";
import PaymentAccount from "../models/paymentAccount.js";

export const createPaymentAccount = asyncHandler(async (req, res) => {
    const { bankName, accountName, accountNumber } = req.body;

    try {
        const existingPaymentAccount = await PaymentAccount.findOne({
            user: req.userAuth,
            bankName,
            accountName,
            accountNumber
        })

        if (existingPaymentAccount) {
            return res.status(400).json({ message: 'Payment method already exists' });
        }

        const paymentAccount = await PaymentAccount.create({
            user: req.userAuth,
            bankName,
            accountName,
            accountNumber
        });

        res.status(201).json({
            status: "success",
            message: " Payment Account Created Successfully",
            data: paymentAccount
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})


export const updatePaymentAccount = asyncHandler(async (req, res) => {
    const { bankName, accountName, accountNumber } = req.body;
    const paymentId = req.params.id;
    
    try {
        const paymentAccount = await PaymentAccount.findById(paymentId);

        if (!paymentAccount) {
            return res.status(404).json({ message: 'Payment Account not found' });
        }

        if (paymentAccount.user.toString() !== req.userAuth.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedPaymentAccount = await PaymentAccount.findByIdAndUpdate(
            paymentId,
            {
                bankName,
                accountName,
                accountNumber
            },
            {
                new: true
            }
        )

        res.status(200).json({
            status: "success",
            message: "Payment Account updated successfully",
            data: updatedPaymentAccount
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export const getAllPaymentAccounts = asyncHandler(async (req, res) => {
    try {
        const paymentAccounts = await PaymentAccount.find({ user: req.userAuth });

        res.status(200).json({
            status: "success",
            message: "Payment Accounts retrieved successfully",
            data: paymentAccounts
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export const deletePaymentAccount = asyncHandler(async (req, res) => {
    const paymentId = req.params.id;
    
    try {
        const paymentAccount = await PaymentAccount.findById(paymentId);

        if (!paymentAccount) {
            return res.status(404).json({ message: 'Payment Account not found' });
        }

        if (paymentAccount.user.toString() !== req.userAuth.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const paymentAccountDeleted = await PaymentAccount.findByIdAndDelete(paymentId);

        res.status(200).json({
            status: "success",
            message: "Payment Account deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
