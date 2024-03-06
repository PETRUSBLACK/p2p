// id
// transaction_id
// user_id
// coin_id
// transaction_time_stamp
// amonunt
// status
import mongoose from 'mongoose';
const schema = mongoose.Schema;

const transactionSchema = new schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    coin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coin',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Transactions = mongoose.model("Transactions", transactionSchema);
export default Transactions;