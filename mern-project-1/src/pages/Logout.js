// src/pages/Logout.js

// ✅ Changed: Moved axios import to top
import axios from "axios";

// ✅ No change: Hooks
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🟢 Before: import { serverEndpoint } from "../config"
// ✅ Now: import from correct path
import { serverEndpoint } from "../config/config";

import { useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/actions";

// 🟢 Before: function Logout({ updateUserDetails })
// ✅ Now: props removed, using Redux dispatch
function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverEndpoint}/auth/logout`, {}, {
        withCredentials: true, // ✅ Important for sending cookies
      });

      // 🟢 Before: updateUserDetails(null)
      // ✅ Now: Clear user via Redux
      dispatch({
        type: CLEAR_USER,
      });

      // ✅ Navigate to login or home after logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/error");
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  // ✅ Return something to avoid React warnings
  return null;
}

export default Logout;







//---------------------last changed 27-06-25
// import { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {serverEndpoint} from "../config"
// import { useDispatch } from "react-redux";
// import { CLEAR_USER } from "../redux/user/actions";

// // function Logout({updateUserDetails}){  aging remove props frpm here
// function Logout(){
    
// const navigate = useNavigate();
//  const dispatch = useDispatch();   // using dispatch here instead of props 
// const handleLogout = async ()=>{
//  try {
//      await axios.post(`${serverEndpoint}/auth/logout`, {}, {
//          withCredentials: true // this is important to send cookies with the request
//      });
//     //  updateUserDetails(null); // Clear user state...........here as well use REDUX dispatch
//      dispatch({
//            type: CLEAR_USER,
           
//         });

//  }catch (error) {
//      console.error('Logout faicled:', error);
//      navigate('/error')
//  }
// };
//     useEffect(() => {
//         handleLogout();
//     }, []);

// }
// export default Logout;