const mongoose = require('mongoose');

//-------------------------------------------------------For asyncronous payment method
const SubscriptionSchema = new mongoose.Schema({
   id: {type:String}, /// Razorpay subscription ID
   planId:{type:String},
   status:{type:String},
   start:{type:Date},
   end:{type:Date},
   lastBillDate:{type:Date},
   nextBillDate:{type:Date},
   paymentsMade:{type:Number},
   paymentsRemaining:{type:Number},

});

const UsersSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: false
   },
   name: {
      type: String,
      required: true
   },
   isGoogleUser: {
      type: String,
      required: false
   },
   googleId: {
      type: String,
      required: false
   },
   role: {
      type: String,
      default: 'admin'
   },
   adminId: {
      // why we we have create this aadminID , this adminId is given to the users ctreated by the admin(viwers,developer) 
      // so same adminId will be given to all the user created by admin so for searching we will use adminId to search the users, 
      // that's why we have used the index:true for searching 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
   },
   credits:{                      // this are the creditud users are going to buy from out website
      type:Number,
      default:0
   }, 
   Subscription:{                   // we are not creating separate table for this subscription we are adding the whole schema here only and default we are taking empty object 
      type:SubscriptionSchema,
      default:()=>({})
   },
   PasswordToken:{
      type:String,
   },
   PasswordTokenExpiry:{
      type:Date
   }

});

module.exports = mongoose.model('Users', UsersSchema);