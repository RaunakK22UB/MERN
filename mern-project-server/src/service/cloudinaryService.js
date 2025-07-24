const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECERET,

   
})
 const generateUploadSignature =()=>{
                 const timestamp = Math.floor(Date.now()/1000); // convert it to seconds

                 // timestamp and other attributies that we will send from client will be used
                 // by cloudinary to reconstruct the signature and compare it with the the signature 
                 // we are passing
                 const signature = cloudinary.utils.api_sign_request(
                    {timestamp},
                    process.env.CLOUDINARY_API_SECRET
                 );

                 return {signature, timestamp}
    }


module.exports={ generateUploadSignature }