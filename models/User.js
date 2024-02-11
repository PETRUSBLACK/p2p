import mongoose from 'mongoose'
const schema = mongoose.Schema;

const UserSchema = new schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true,
    },
    order:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Order",
        },
    ],
    wishLists:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"WishList",
        },
    
],
isAdmin:{
    type:Boolean,
    default:false,
},
hasShippingAddress:{
type:Boolean,
default: false,
},
shippingAddress:{
 firstName:{
    type:String
 },
 address:{
    type:String
 },
 city:{
    type:String,
 },
 postalCode:{
    type:String,
 },
 state:{
  type:String,
 },
 country:{
    type:String,
 },
 phone:{
    type:String,
 },

},
  
},
{
    timestamps:true
}  
)

const User = mongoose.model("User",UserSchema);
export default User;