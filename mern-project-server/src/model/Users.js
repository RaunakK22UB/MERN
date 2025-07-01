const mongoose = require('mongoose');

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
   }
});

module.exports = mongoose.model('Users', UsersSchema);