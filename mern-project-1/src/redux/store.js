import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './user/reducer';


export const store = configureStore({               // This takes js object as input here we will define our reducer 
  
    reducer:{

         userDetails: userReducer,

        // userDetails:(state = null , action)=>{   //1st parameter "state":- old value of state and new value is "action"

        //          switch (action.type){
        //             case 'SET_USER':          // this case will help in supporting login case
        //                 return action.payload

        //             case 'CLEAR_USER':       // this case will help in supporting logout usecase
        //                 return null

        //             default:                // it will run when redux runs all the reducer function in that case if sate that changed but that state is not ours then, we will run this
        //                 return state;  
        //          }

        // },
    }



});

// {
//     type:'SET_USER',
//     payload: newValue
// }