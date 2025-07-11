const jwt = require('jsonwebtoken');
const { attemptToRefreshToken } = require('../util/authUtil');


const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            const token = request.cookies?.jwtToken;
            if (!token) {
                return response.status(401).json({
                    error: 'Unauthorized access'
                });
            }
            try{
            const user = jwt.verify(token, process.env.JWT_SECRET);
            request.user = user;
            next();
            }catch(error){        // if somthing went wrong means jwt token is expired , so we will check in error that 
                                  // reffreshtoken is present then we will make use of that other wise it will be error only bottm on
                    const refreshToken =request.cookies?.refreshToken;
                    if(refreshToken){;
                        const {user,newAccessToken}=await attemptToRefreshToken(refreshToken);
                        response.cookie('refreshToken',newAccessToken,{
                            httpOnly:true,
                            secure:true,
                            domain:'localhost',
                            path:'/'
                        });

                        request.user=user;
                        next();

                    }

                     return response.status(401).json({
                        error:'Unauthorised access'
                     });
            }

            
        } catch (error) {
            console.log(error);
            response.status(500).json({
                error: 'Internal server error'
            });
        }
    },
};

module.exports = authMiddleware;