import mongoose from 'mongoose';
import Coin from './coin.js';
const schema = mongoose.Schema;

const WalletSchema = new schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    coins: [{
        coin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coin'
        },
        quantity: {
            type: Number,
            default: 0
        },
        totalCoinValue: {
            type: Number,
            default: 0
        }
    }],
    totalNetValue: {
        type: Number,
        default: 0
    }
});

WalletSchema.pre('save', async function(next) {
    try {
        let totalNetValue = 0;
        for (const coin of this.coins) {
            const coinDocument = await Coin.findById(coin.coin);
            if (coinDocument) {
                coin.totalCoinValue = coin.quantity * coinDocument.limit;
                totalNetValue += coin.totalCoinValue;
            }
        }
        this.totalNetValue = totalNetValue;
        next();
    } catch (error) {
        next(error);
    }
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
