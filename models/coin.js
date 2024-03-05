// name
import mongoose from 'mongoose';
const schema = mongoose.Schema;

const coinSchema = new schema({
    name: {
        type: String,
        required: true,
        enum: ['Bitcoin', 'Ethereum', 'Dogecoin', 'Litecoin', 'Ripple', 'Bitcoin Cash', 'Solana']
    },
    symbol: {
        type: String,
        required: true
    }
});

const coin = mongoose.model("coin", coinSchema);
export default coin;