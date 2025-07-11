const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const { attemptToRefreshToken } = require('../util/authUtil');

const secret = process.env.JWT_SECRET;
const refreshSecret=process.env.JWT_REFRESH_TOKEN_SECRET

const authController = {

    // ------------------ LOGIN ------------------
    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(401).json({ errors: errors.array() });
            }

            const { username, password } = request.body;

            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email,
                role :data.role? data.role:'admin', // why we doing this in role only because erlier also users registered so they use registered page to login so they will be default admin only
                adminId:data.adminId,
                credits:data.credits,
                subscription:data.subscription
               
            };
//----------------------------------------------------------------------------------
            const token = jwt.sign(user, secret, { expiresIn: '1m' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
//---------------------------------------------------------------------------RefreshToken
            const refreshToken= jwt.sign(user, refreshSecret, { expiresIn: '7d' });
            //store it in the datbase if you want! storing in db will make refresh token secure  
            // exmaple of refreshtoken , some website gives us one tick box that tick to be logged in
            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });

            response.json({ user, message: 'User authenticated' });

        } catch (error) {
            console.error('Login error:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    },

    // ------------------ LOGOUT ------------------
    logout: (request, response) => {
        try{
             response.clearCookie('jwtToken');
        response.status(200).json({ message: 'User is logged out' });

        }catch(error){
                 console.log(error);
                 response.status(500).json({message:"Somthing went wrong please try again!!"})
        }
       
    },

    // ------------------ IS USER LOGGED IN ------------------
    isUserLoggedIn: async(request, response) => {
        const token = request.cookies.jwtToken;
        if (!token) {
            return response.status(401).json({ message: 'User is not logged in' });
        }
        jwt.verify(token, secret, async(err, user) => {
            if (err) {
                // if somthing went wrong means jwt token is expired , so we will check in error that 
               // reffreshtoken is present then we will make use of that other wise it will be error only bottm on
                const refreshToken =request.cookies?.refreshToken;
                    if(refreshToken){;
                        const {newAccessToken,user}=await attemptToRefreshToken(refreshToken);
                        response.cookie('jwtToken',newAccessToken,{
                            httpOnly:true,
                            secure:true,
                            domain:'localhost',
                            path:'/'
                        });
                        console.log("refresh token  did it's job")
                        return response.json({message:'User is logged in',user:user})
                    }
                return response.status(401).json({ message: 'Invalid token' });
            } else {
                const latestUserDeatils = await Users.findById({_id:user.id});
                return response.status(200).json({ user, message: 'User is logged in' });
            }
        });
    },

    // ------------------ REGISTER ------------------
    register: async (request, response) => {
        try {
            const { username, password, name } = request.body;

            const data = await Users.findOne({ email: username });
            if (data) {
                return response.status(401).json({ message: 'User already exists' });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = new Users({
                email: username,
                password: encryptedPassword,
                name: name,
                role :'admin',// This ensure backward compatibility why we doing this in role only because erlier also users registered so they use registered page to login so they will be default admin only
                credits:0
            });

            await user.save();

            // ✅ New: create userDetails object
            const userDetails = {
                id: user._id,
                name: user.name,
                email: user.email,
                role:user.role
            };

            // ✅ New: generate token
            const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });

            // ✅ New: send token in cookie
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });

            // ✅ New: send user object as part of response
            response.status(201).json({ message: 'User registered', user: userDetails });

        } catch (error) {
            console.log(error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    },

    // ------------------ GOOGLE AUTH ------------------
    googleAuth: async (request, response) => {
        try {
            const { idToken } = request.body;
            if (!idToken) {
                return response.status(401).json({ message: 'Invalid request' });
            }

            const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const googleResponse = await googleClient.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = googleResponse.getPayload();
            const { sub: googleId, name, email } = payload;

            let data = await Users.findOne({ email: email });

            if (!data) {
                data = new Users({
                    email: email,
                    name: name,
                    isGoogleUser: true,
                    googleId: googleId
                });
                await data.save();
            }

            // ✅ Updated: cleaner user object
            const user = {
                id: data._id ? data._id : googleId,
                username: email,
                name: name,
                role :data.role? data.role:'admin',   // why we doing this in role only because erlier also users registered so they use registered page to login so they will be default admin only
                credits:data.credits
            };

            // ✅ Reuse token logic
            const token = jwt.sign(user, secret, { expiresIn: '1m' });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
//------------------------------------------------------------------RefreshToken
           const refreshToken= jwt.sign(user, refreshSecret, { expiresIn: '7d' });
            //store it in the datbase if you want! storing in db will make refresh token secure  
            // exmaple of refreshtoken , some website gives us one tick box that tick to be logged in
            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user, message: 'User authenticated' });

        } catch (e) {
            console.log(e);
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authController;






//-----------------------------------last changes 27-06-25
// const jwt = require('jsonwebtoken');
// const Users = require('../model/Users');
// const bcrypt = require('bcryptjs');
// const {OAuth2Client} = require('google-auth-library');
// const { validationResult} = require('express-validator');  // For that we want this to validate the request come from the server


// const secret = process.env.JWT_SECRET;

// const authController = {
//     // ------------------ LOGIN ------------------
//     login: async (request, response) => {
//         try {

// //--------------------------------------------------------------------------------------------------------This part we are using express validator to log the errors
//             const errors = validationResult(request);
//             if (!errors.isEmpty()) {
//                  return response.status(401).json({ errors: errors.array() });
//             }
// //----------------------------------------------------------------------------------------------------------
//             const { username, password } = request.body;
//              console.log(username, password);// 
//             // Find user by email (username)
//             const data = await Users.findOne({ email: username });

//             if (!data) {
//                 return response.status(401).json({ message: 'Invalid credentials' });
//             }
             

//             // Compare hashed password
//             const isMatch = await bcrypt.compare(password, data.password);
//             if (!isMatch) {
//                 return response.status(401).json({ message: 'Invalid credentials' });
//             }

//             const user = {
//                 id: data._id,
//                 name: data.name,
//                 email: data.email
//             };

//             // Sign token
//             const token = jwt.sign(user, secret, { expiresIn: '1h' });

//             // Set cookie
//             response.cookie('jwtToken', token, {
//                 httpOnly: true,
//                 secure: true,
//                 domain: 'localhost',
//                 path: '/'
//             });

//             response.json({ user: user, message: 'User authenticated' });

//         } catch (error) {
//             console.error('Login error:', error);
//             response.status(500).json({ error: 'Internal server error' });
//         }
//     },

//     // ------------------ LOGOUT ------------------
//     logout: (request, response) => {
//         response.clearCookie('jwtToken');
//         response.status(200).json({ message: 'User is logged out' });
//     },

//     // ------------------ IS USER LOGGED IN ------------------
//     isUserLoggedIn: (request, response) => {
//         const token = request.cookies.jwtToken;
//         if (!token) {
//             return response.status(401).json({ message: 'User is not logged in' });
//         }

//         jwt.verify(token, secret, (err, user) => {
//             if (err) {
//                 return response.status(401).json({ message: 'Invalid token' });
//             } else {
//                 return response.status(200).json({ user: user, message: 'User is logged in' });
//             }
//         });
//     },

//     //---------------------Register end point method

//     register: async (request, response) => {
//         try{
            
//             const {username,password,name} = request.body;
//             const data = await Users.findOne({email: username});
//             if(data){
//                 return response.status(401).json({ message: 'User already exists' });
//             }
//             // Hash the password, before savinng it to dtatbase
//             const encryptedPassword = await bcrypt.hash(password, 10);
        
//             // creating user object to save it on data base or creteing a mongoose model object and set the record values
//             const user = new Users({
//                 email: username,
//                 password: encryptedPassword,
//                 name : name
//             });
//             await user.save();
//             response.status(201).json({ message: 'User registered successfully' });

//         }catch(error){
//               console.log(error);
//               return response.status(500).json({ error: 'Internal server error' });
//         }

//     },

//     //-------------------------------------------------------Google Authentication  (OAUTH and OCID)

//     googleAuth: async (request,response) =>{
//         try{
//                 const {idToken} = request.body;
//                 if(!idToken){
//                     return response.status(401).json
//                 }
//                 const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//                 const googleResponse = await googleClient.verifyIdToken({
//                     idToken:idToken,
//                     audience: process.env.GOOGLE_CLIENT_ID

//                 });

//                 const payload = googleResponse.getPayload();
//                 const {sub: googleId,name,email} = payload;

//                 let data= await Users.findOne({email:email});
//                 if(!data){
//                     data = new Users({
//                         email:email,
//                         name:name,
//                         isGoogleUser:true,
//                         googleId: googleId
//                     });
//                     await data.save();
//                 }
//                 const user = {
//                     id: data._id? data._id:googleId,
//                     username:email,
//                     name:name
//                 };
//                 const token = jwt.sign(user,secret,{
//                     expiresIn:'1h'
//                 });
//                 response.cookie('jwtToken',token,{
//                     httpOnly:true,
//                     secure:true,
//                     domain:'localhost',
//                     path:'/'
//                 });
//                 response.json({user:user,message:'User authenticated'});

//         }catch(e){
//             console.log(e);
//             return response.status(500).json({message:'Internal server error'});
//         }
//     },
    
// };

// module.exports = authController;































// affiliate link sharing project


// const jwt = require('jsonwebtoken');
// const Users = require('../model/Users');
// const bcrypt = require('bcryptjs'); // to hash the password

// const secret ="9fbd60ec-764d-40f1-adf9-e318e807b024";
// const authController={

//     //---------------------------------------login function to authenticate user
//     login: async (request, response) =>{

//         try {
//         const { username, password } = request.body;
   
//          const data= await Users.findOne({ email:username});
//          if(!data){
//             return response.status(401).json({ message: 'Invalid Credentials' });
//          }

//         const isMatch = await bcrypt.compare(password, data.paswword);

//         if(!isMatch){
//             return response.status(401).json({ message: 'Invalid Credentials' });
//         }
      
//         const user = {
//             id:data._id,
//             name:data.name,
//             email:data.email        
//         };
         
//         if( username === 'admin' && password === 'admin') {
//               const user={
//                 name:'john cena',
//                 email:'john@gmail.com'

//               };

//               const token = jwt.sign(user,secret,{expiresIn:'1h'})   // This function jet.sign ceates token by combining user data and secret key
//                response.cookie('jwtToken',token,{
//                 httpOnly: true,  // this means only server can read and write this cookie
//                 secure: true, // this means cookie will be sent only over HTTPS
//                 domain:'localhost', // specify the domain for the cookie
//                 path:'/' // specify the path for the cookie , who can access this cookies , '/' this means all the our react pages can access this path
//                });
//                response.status(200).json({user: user,message: 'User is Authenticated'});
//             }else{
//             response.status(401).json({ message: 'Invalid Credentials' });
//         }

//     }catch (error) {
//         console.error('Error during login:', error);    }
//     },



//    // --------------------------------------------------------------logout function to clear the cookie
//     logout: (request, response) => {
//         response.clearCookie('jwtToken');
//         response.status(200).json({ message: 'User is logged out' });
//     },



//     // --------------------------------------------------------------isUserLoggedIn function to check if user is logged in
//    // how to know user is logid in if in request in cookies if jwt token is present that means user is logged in
//     isUserLoggedIn: (request, response) => {
//            const token = request.cookies.jwtToken; // get the token from cookies
//            if(!token) {
//                return response.status(401).json({ message: 'User is not logged in' });
//            }

//            jwt.verify(token, secret, (err, user)=>{
//                  if(err){
//                     return response.status(401).json({ message: 'Invalid Token' });            
//                 }else{
//                     return response.status(200).json({ user: user, message: 'User is logged in' });
//                 }
//            });
           
//     },
        
// };
// module.exports = authController;