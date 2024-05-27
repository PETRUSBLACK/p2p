import mongoose from 'mongoose';
const schema = mongoose.Schema;

const CoinSchema = new schema({
    name: {
        type: String,
        required: true
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
    }, 
    limit: Number
});

const Coin = mongoose.model("Coin", CoinSchema);
export default Coin;
