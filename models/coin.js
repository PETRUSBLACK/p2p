import mongoose from 'mongoose';
const schema = mongoose.Schema;

const coinSchema = new schema({
    name: {
        type: String,
        required: true,
        enum: ['Bitcoin', 'Ethereum', 'Dogecoin', 'Litecoin', 'Ripple', 'Bitcoin Cash', 'Solana']
    },
    symbol: {
        symbol_public_id: {
            type: String,
            required: true
        },
        symbol_url: {
            type: String,
            required: true
        }
    }
});

const Coin = mongoose.model("Coin", coinSchema);
export default Coin;