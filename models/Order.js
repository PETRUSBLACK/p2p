import mongoose from 'mongoose';
const schema = mongoose.Schema;

const OrderSchema = new schema({
    seller:   {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    }, 
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    },
    cryptoCurrency:   {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Coin",
    }, 
    totalQuantityOfCryptoBought: {
        type: Number
    },
    totalFiatAmountToPay: {
        type: Number,
        required: true
    }, 
    pricePerCoin: {
        type: String,
        required: true
    },
    tradeType:{
        type:String,
        required:true
    },
    orderNumber: {
        type: Number
    },
    paymentTimeLimit: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    status:{
        type:String,
        enum: ["Pending","cancelled","Successful"],
        required:true
    },
    reserve: {
        type: Number,
        required: true
    }
},

{
    timestamps:true
}
)

const Order = mongoose.model("Order",OrderSchema);
export default Order;