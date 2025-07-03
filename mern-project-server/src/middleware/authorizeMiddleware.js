// ----------------- we have create this middleware for the ROLE BASED ACCESS CONTROLE(RBAC)

const permissions = require("../constants/permissions")

const authorize = (requirePermission)=>{
    return (request,response,next)=>{
        const user = request.user;

        if(!user){
            return response.status(401).json({
                message:'Unauthorized access'
            });
        }

        const userPermissions = permissions[user.role] || [];
        
        if(!userPermissions.includes(requirePermission)){
            return response.status(403).json({
                message:'Forbidden: Insufficient permission'
            });
        }
        next();
    };
};

module.exports = authorize;