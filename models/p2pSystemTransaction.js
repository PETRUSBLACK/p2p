import mongoose from 'mongoose';
const schema = mongoose.Schema;

const p2pSystemTransactionSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coin',
        required: true
    },
    totalNumberOfCoinByUser: {
        type: Number,
    },
    wallet_Address: {
        type: String
    },
    serial_number: {
        type: String,
        ref: 'Transactions'
    }
}, { timestamps: true });

const p2pSystemTransaction = mongoose.model("p2pSystemTransaction", p2pSystemTransactionSchema);
export default p2pSystemTransaction;