import mongoose from 'mongoose';
const schema = mongoose.Schema;

const CurrencySchema = new schema({
    name: {
        type: String,
        required: true,
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

const Currency = mongoose.model("Currency", CurrencySchema);
export default Currency;