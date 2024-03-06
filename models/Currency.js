// name
import mongoose from 'mongoose';
const schema = mongoose.Schema;

const CurrencySchema = new schema({
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    }

});

const Currency = mongoose.model("Currency", CurrencySchema);
export default Currency;