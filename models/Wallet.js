import mongoose from 'mongoose';
const schema = mongoose.Schema;

const WalletSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    coinsOwned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UsersCoin",
        }
    ],
    currencyOwned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UsersCurrency",
        },
    ],
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserTransactions",
        }
    ]
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;