import mongoose from 'mongoose';
import { generateOrderNumber } from '../util/generateRandomNumber.js';
const schema = mongoose.Schema;

const OrderSchema = new schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    cryptoCurrency: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Coin",
    },
    totalQuantityOfCryptoBought: {
        type: Number,
        required: true
    },
    fiatCurrency: {
        type: String,
        required: true
    },
    totalFiatAmountToPay: {
        type: Number,
        required: true
    },
    pricePerCoin: {
        type: String,
        required: true
    },
    accountInfoForTransaction: {
        type: Object,
        required: true
    },
    tradeType: {
        type: String,
        required: true
    },
    orderNumber: {
        type: Number,
        default: generateOrderNumber()
    },
    paymentTimeLimit: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transactions",
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        }
    ],
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Successful"],
        default: "Pending"
    },
    reserve: {
        type: Number
    }
},

    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", OrderSchema);
export default Order;