import mongoose from 'mongoose';
import { generateSerialNumber } from '../util/generateRandomNumber';
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
    totalNumberOfCoin: {
        type: Number,
        required: true
    },
    wallet_Address: {
        type: String,
        required: true
    },
    transcationDate: {
        type: Date
    },
    serial_number: {
        type: String,
        default: generateSerialNumber()
    }
}, { timestamps: true });

const p2pSystemTransaction = mongoose.model("p2pSystemTransaction", p2pSystemTransactionSchema);
export default p2pSystemTransaction;