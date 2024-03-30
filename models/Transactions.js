import mongoose from 'mongoose';
const schema = mongoose.Schema;

const transactionSchema = new schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    cryptocurrency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coin',
        required: true
    },
    cryptocurrencyName:{
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
}, { timestamps: true });

const Transactions = mongoose.model("Transactions", transactionSchema);
export default Transactions;