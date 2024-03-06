const schema = mongoose.Schema;

const sellerSchema = new schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Seller must be a user"],
      },

    coin:  [ {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "coin",
    }], 
     
    no_of_trades:   {
        type: Number,
        required: true,
    }, 
    no_completed_order: {
        type: Number,
        required: true,
    },
    no_failed_order: {
        type: Number,
        required: true,
    },
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
    currency: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Currency",
        },
      ],
      
 
},

{
    timestamps:true
}
)

const Order = mongoose.model("Order",OrderSchema);
export default Order;