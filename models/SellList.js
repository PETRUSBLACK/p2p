import mongoose from 'mongoose';
const schema = mongoose.Schema;

const SellSchema = new schema({
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
    accountInfoForTransaction:{
        type: String
    },
    details: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Sold'],
        default: 'Pending'
    }
},
    {
        timestamps: true
    }
)

const SellList = mongoose.model("SellList", SellSchema);
export default SellList;