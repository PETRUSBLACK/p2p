const schema = mongoose.Schema;

const orderSchema = new schema({

    seller:   {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    }, 
    coin:   {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "coin",
    }, 
     
    amount:   {
        type:String,
        required:true
    }, 
    price: {
        type:String,
        required:true
    },
    
    status:{
        type:String,
        enum: ["Pending","cancelled","Successful"],
        required:true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    },
 
},

{
    timestamps:true
}
)

const Order = mongoose.model("Order",OrderSchema);
export default Order;