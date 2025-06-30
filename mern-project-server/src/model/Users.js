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
      isGoogleUser:{
         type:String,
         required:false
      },
      googleId:{
         type:String,
         required:false
      }
});

module.exports = mongoose.model('Users', UsersSchema);