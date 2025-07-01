const {USER_ROLES} = require("../constants/userConstants");
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const send = require("../service/emailService");



const generateTemporaryPassword = ()=>{
    const chars ='abcdefghijklmnopqrstuvwxyz0123456789';
    let result='';
    for(let i=0;i<6;i++){
        result+=chars.charAt(Math.floor(Math.random()*chars.length))
    }
    return result;
};

const userController={

//-----------------------------------------------------------------------------------------------------

create: async(request,response)=>{


    try{

        const{name,email,role}=request.body;

        if(!USER_ROLES.includes(role)){              // we will check here that role is valid or not in request
            return response.status(400).json({
                message:'INvalid role'
            });
        }

        const temporaryPassword=generateTemporaryPassword();
        //encrypt it
        const hashedPassword= await bcrypt.hash(temporaryPassword,10);

        const user = await Users.create({
            email:  email,
            password:  hashedPassword,
            name:   name,
            role:  role,
            adminId:  request.user.id
        });
        try{
            await send(email,'Affilated++ Temporary Password',`yousr password is ${temporaryPassword}`);

        }catch(error){
            console.log(error);
            console.log(`Error occured while sending the password:${temporaryPassword}`);

        }
        response.json(user);

    }catch(error){
        console.log(err);
        response.status(500).json({
            message:"internal server error!!"
        })

    }
},

//-------------------------------------------------------------------------------------------------------------------------

getAll:async(request,response)=>{               // this function will helps us to get all the users using ther adminId
    try{

        const users = await Users.find({adminId: request.user.id});
        response.json(users);

    }catch(error){
        console.log(error);
        response.status(500).json({
            message:"internal server error!!"
        });
    }
},




//----------------------------------------------------------------------------------------


update:async(request ,response)=>{
     try{

        const {id} = request.patrams;
        const {name,role}=request.body;

        if(role && !USER_ROLE.includes(role)){
            return response.status(400).json({
                message:"Invalid role"
            });
        }
        const user = await Users.find({_id: id ,adminId : request.users.id});
        if(!user){
            return response.status(404).json({
                message:'User does not exist'
            });
        }

        if(name) user.name = name;
        if(role) user.role = role;
        await user.save();
        response.json(user);
     }catch(error){
        console.log(error);
        response.status(500).json({
            message:"Internal server error"
        })
     }
},

//---------------------------------------------------------

delete:async (respoonse,request)=>{
    try{

        const {id} = request.params;

        const user = await Users.findByIdAndDelete({
            _id : id,
            adminId: request.user.id
        });

        if(!user){
            return response.status(404).json({message:"User does not exist"});
        }
        response.json({message:'User deleted'})

    }catch(error){
        console.log(error);
        respoonse.status(500).json({
            message:"Internal Server error"
        });
        
    }
}


};
module.exports=userController;