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
    wallet_balance:{
      type:String,
      required:true
  },
    password:{
        type: String,
        required:true,
    },
isAdmin:{
    type:Boolean,
    default:false,
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

 wallent_address:{
    type:String,
 },

  pin:{
    type:String,
 },


},
  
{
    timestamps:true
}  
)

const User = mongoose.model("User",UserSchema);
export default User;