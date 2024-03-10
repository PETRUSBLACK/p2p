import mongoose from 'mongoose';
const schema = mongoose.Schema;

const BuySchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    crypto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coin",
        required: true
    },
    fiatCurrency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Currency",
        required: true
    },
    price: {
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
        default: 600 // 10 minutes in seconds
    },
    fee: {
        type: Number
    }
},
    {
        timestamps: true
    }
)

BuySchema.virtual('paymentTimeLimitRealTime').get(function() {
    const minutes = Math.floor(this.paymentTimeLimit / 60);
    const seconds = this.paymentTimeLimit % 60;
    return `${minutes} minutes ${seconds} seconds`;
});

const BuyList = mongoose.model("BuyList", BuySchema);
export default BuyList;