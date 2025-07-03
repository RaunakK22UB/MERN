import { useEffect,useState } from "react";
import {Link} from "react-router-dom";
import LinksDashboard from "./links/LinksDashboard";


function Dashboard(){

   
    return(
        <div className="container text-center">
            <h1>User Welcome!!!</h1>
            <Link to ="/logout">Logout</Link>
            <LinksDashboard/>
        </div>
    );
}

export default Dashboard;


























//-------------------------------

// src/pages/Dashboard.js
// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Dashboard({ updateUserDetails }) {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
//       updateUserDetails(null); // Clear user state
//       navigate("/"); // Redirect to Home/Login
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="container text-center">
//       <h1>Welcome to Dashboard</h1>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

// export default Dashboard;
