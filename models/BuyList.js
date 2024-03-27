import mongoose from 'mongoose';
const schema = mongoose.Schema;

const BuySchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cryptoCurrency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coin",
        required: true
    },
    fiatCurrency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Currency",
        required: true
    },
    pricePerCoin: {
        type: Number,
        required: true
    },
    totalAmountOfCrypto: {
        type: Number,
        required: true
    },
    range: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    paymentTimeLimit: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Bought'],
        default: 'Pending'
    }
},
    {
        timestamps: true
    }
)

const BuyList = mongoose.model("BuyList", BuySchema);
export default BuyList;