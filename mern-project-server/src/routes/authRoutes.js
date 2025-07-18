const express = require('express');
const authController = require('../controller/authController');
const router = express.Router(); // instance of  Router
const {body} = require('express-validator');

//----------------------------------------------------------------------- // this is are middleware function using express-validator

const loginValidator = [                     
    body('username')                                                        //validation chains :- body().().()
      .notEmpty().withMessage('Username is required')
      .isEmail().withMessage('Username must be a valid email'),

    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min: 4}).withMessage('Password Length must be atleast 4 character'),


];

//----------------------------------------------------------------------------------------------------------------------------------

router.post('/login',loginValidator,authController.login); // POST request to /login  // here we are passing our middleware in route 
router.post('/logout', authController.logout);
router.post('/isUserLoggedIn', authController.isUserLoggedIn); // POST request to /isUserLoggedIn
router.post('/register', authController.register); // 
router.post('/google-auth', authController.googleAuth);

router.post("/forgot-password", authController.sendResetPassowrdToken);
router.post("/reset-password", authController.resetPassowrd);
module.exports = router;