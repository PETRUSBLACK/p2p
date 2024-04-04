import mongoose from 'mongoose'
const schema = mongoose.Schema;

const PaymentAccountSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const PaymentAccount = mongoose.model('PaymentAccount', PaymentAccountSchema);
export default PaymentAccount