
const jwt = require('jsonwebtoken');
const Users=require('../model/Users')
const refreshScecret=process.env.JWT_REFRESH_TOKEN_SECRET;
const secret=process.env.JWT_SECRET;
const attemptToRefreshToken =async (refreshToken)=>{
    try{  

        const decoded = await jwt.verify(refreshToken,refreshScecret);
        //fetch the latest user data from DB as across 7 daysof refreshToken lifecycle user details like credits,subscriptions
        //can change
        const data=await Users.findById({_id: decoded.id})
        const user={
            id:data._id,
            username:data.email,
            name:data.name,
            role:data.role?data.role:'admin',
            credits:data.credits,
            subscription:data.Subscription
        };

        //change expiry to 1 hr after testig
        const newAccessToken = jwt.sign(user,secret,{expiresIn:'1m'});
        return {user,newAccessToken};

    }catch(error){
        console.log(error);
        throw error;
    }
};
module.exports={attemptToRefreshToken}