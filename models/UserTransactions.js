import mongoose from 'mongoose';
const schema = mongoose.Schema;

const userTransactionSchema = new schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    coin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersCoin',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    transactionFee: {
        type: Number,
        required: true
    },
    confirmations:{
        type: String
    },
    transactionStatus: {
        type: String,
        enum: ['Pending', 'Successful', 'Failed'],
        default: 'Pending'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const UserTransactions = mongoose.model("UserTransactions", userTransactionSchema);
export default UserTransactions;