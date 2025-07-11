// src/App.js
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

// 🟢 Earlier: serverEndpoint was imported from "./config"
// ✅ Now: moved to config/config.js for better structure
import { serverEndpoint } from "./config/config";

// 🟢 Earlier: Login, Register, Home were in root folder
// ✅ Now: moved under /pages for consistency
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Error from "./pages/Error";

import AppLayout from "./layout/AppLayout";

// ✅ New: Added UserLayout for logged-in views
import UserLayout from "./layout/UserLayout";

import { SET_USER } from "./redux/user/actions";

import ManageUser from './pages/manageUsers/manageUsers';
import UnauthorizedAccess from "./components/UnauthorizeAccess";
import ProtectedRoute from "./rbac/ProtectedRoute";
import ManagePayments from "./pages/payments/ManagePayments";
import AnalyticsDashboard from "./pages/links/AnalyticsDashboard";


function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const [loading , SetLoading]=useState(true);

  // 🟢 Earlier: isUserLoggedIn used updateUserDetails()
  // ✅ Now: using Redux dispatch instead
  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/isUserLoggedIn`, {}, {
        withCredentials: true,
      });
      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });
    } catch (e) {
      console.log(e);
    }finally{
      SetLoading(false);   // on default we have putten true, we need to false it
    }
  };

  useEffect(() => {                          
    isUserLoggedIn();  // because of this useEffect what use to happen when evern the page refress this will load and then user will be navigated to to the path , so in this fraction of seconds in browser the llogin page is aapppered for short time to to correct that we will use spinner using 
  }, []);

  if(loading){
    <div style={{ textAlign: 'center', marginTop: '40vh' }}></div>
      return<Spinner animation="boarder"/>  // here is the spinner
  }

  return (
    <Routes>

      {/* 🟢 Earlier: just Navigate or AppLayout */}
      {/* ✅ Now: Wrap Navigate with UserLayout if logged in */}
      <Route
        path="/"
        element={
          userDetails ? (
            <UserLayout>
              <Navigate to="/dashboard" />
            </UserLayout>
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      {/* 🟢 Earlier: Navigate to dashboard or show Login in AppLayout */}
      {/* ✅ Now: Wrap logged-in view with UserLayout and show Dashboard */}
      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard"/>
          ) : (
            <AppLayout>
              <Login />
            </AppLayout>
          )
        }
      />

      {/* ✅ New: Register route included in AppLayout */}
      <Route
        path="/register"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Register />
            </AppLayout>
          )
        }
      />

      {/* ✅ Dashboard route remains the same */}
      <Route
        path="/dashboard"
        element={
          userDetails ? <UserLayout><Dashboard /> </UserLayout>: <Navigate to="/login" />
        }
      />

      {/* ✅ Logout route remains the same */}
      <Route
        path="/logout"
        element={
          userDetails ? <Logout /> : <Navigate to="/login" />
        }
      />

      {/* 🟢 Earlier: Error route only had AppLayout */}
      {/* ✅ Now: Error route uses UserLayout if logged in */}
      <Route
        path="/error"
        element={
          userDetails ? (
            <UserLayout>
              <Error />
            </UserLayout>
          ) : (
            <AppLayout>
              <Error />
            </AppLayout>
          )
        }
      />
      <Route
       path="/manageUsers"
  element={
    userDetails ? (
       <ProtectedRoute roles={['admin']}>
       <UserLayout>
         <ManageUser />
       </UserLayout>
       </ProtectedRoute>
       
    ) : (
      <Navigate to="/login" />
    )
  }
  />


  <Route
       path="/unauthorized-access"
  element={
    userDetails ? (
       <UserLayout>
         <UnauthorizedAccess />
       </UserLayout>
       
    ) : (
      <Navigate to="/login" />
    )
  }
  />

    <Route
       path="/manage-payments"
  element={
    userDetails ? (
       <UserLayout>
         <ManagePayments />
       </UserLayout>
       
    ) : (
      <Navigate to="/login" />
    )
  }
  />

  <Route path="/analytics/:id" element={
    userDetails?
    <UserLayout>
      <AnalyticsDashboard/>
    </UserLayout> :
    <Navigate to ="/login"/>
  }/>
 
 

 
    </Routes>
   


  );
}

export default App;











































//--------------------------------------Last changes 27-06-25

// // src/App.js
// import { Route, Routes, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Home from "./Home";
// import Login from "./Login";
// import AppLayout from "./layout/AppLayout";
// import Logout from "./pages/Logout";  
// import Error from "./pages/Error";  
// import Dashboard from "./pages/Dashboard";
// import Register from "./Register";
// import axios from "axios";
// import { serverEndpoint } from "./config";
// import { useDispatch, useSelector } from "react-redux";
// import { SET_USER } from "./redux/user/actions";

// function App() {


//   // to iuse redux we will remove this userdetails
//   // const [userDetails, setUserDetails] = useState(null);
//   const dispatch = useDispatch();
//   const userDetails = useSelector((state)=>state.userDetails);
// // this is example of lifting state up  ............... we dont need this more we will use redux dispatcher
//   // const updateUserDetails = (updatedUserDetails) => {
//   //   setUserDetails(updatedUserDetails);
//   // };


//   //   const isUserLoggedIn = async () => {
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:5001/auth/is-user-logged-in",
// //         {},
// //         { withCredentials: true }
// //       );
// //       updateUserDetails(response.data.user);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };
//   const isUserLoggedIn = async ()=>{
//     try{
//     const response = await axios.post(`${serverEndpoint}/auth/isUserLoggedIn`, {}, {
//       withCredentials: true // this is important to send cookies with the request
     
//   });
//   // updateUserDetails(response.data.user);  .................did not need more use dispatch of redux
//    dispatch({
//         type: SET_USER,
//         payload:response.data.user
//    });
//  }catch(e){
//   console.log(e);
// }
//   };
  
//    useEffect(() => {
//     isUserLoggedIn();
//   }, []);
 
//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           userDetails ? (
//             <Navigate to="/dashboard" />
//           ) : (
//             <AppLayout>
//               <Home />
//             </AppLayout>
//           )
//         }
//       />

//       <Route
//         path="/login"
//         element={
//           userDetails ? (
//             <Navigate to="/dashboard" />
//           ) : (
//             <AppLayout>
//               {/* <Login updateUserDetails={updateUserDetails} /> */}
//                <Login  />
//             </AppLayout>
//           )
//         }
//       />

//      <Route
//         path="/dashboard"
//         element={
//           userDetails ? (
//             // <Dashboard updateUserDetails={updateUserDetails} />
//              <Dashboard  />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />


//       <Route
//         path="/logout"
//         element={
//           userDetails ? (
//             // <Logout updateUserDetails={updateUserDetails} />
//             <Logout />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />

//     <Route
//         path="/error"
//         element={
//           userDetails ? (
//             <Error />
//           ) : (
//             <AppLayout>
//               <Error />
//             </AppLayout>
//           )
//         }
//       />

//       <Route
//       path="/register"
//       element={
//       userDetails ? (
//       <Navigate to="/dashboard" />
//     ) : (
//       <AppLayout>
//         <Register />
//       </AppLayout>
//     )
//   }
// />

   

     
//     </Routes>
//   );
// }

// export default App;


// // src/App.js
// import { Route, Routes, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Home from "./Home";
// import Login from "./Login";
// import AppLayout from "./layout/AppLayout";
// import Dashboard from "./pages/Dashboard";
// import Logout from "./pages/Logout";  
// import Error from "./pages/Error";      
// import axios from "axios";

// function App() {
//   const [userDetails, setUserDetails] = useState(null);

//   // Function to update user details in state
//   const updateUserDetails = (updatedUserDetails) => {
//     setUserDetails(updatedUserDetails);
//   };

//   // Check if user is logged in (called on mount)
//   const isUserLoggedIn = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5001/auth/is-user-logged-in",
//         {},
//         { withCredentials: true }
//       );
//       updateUserDetails(response.data.user);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     isUserLoggedIn();
//   }, []);

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           userDetails ? (
//             <Navigate to="/dashboard" />
//           ) : (
//             <AppLayout>
//               <Home />
//             </AppLayout>
//           )
//         }
//       />

//       <Route
//         path="/login"
//         element={
//           userDetails ? (
//             <Navigate to="/dashboard" />
//           ) : (
//             <AppLayout>
//               <Login updateUserDetails={updateUserDetails} />
//             </AppLayout>
//           )
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           userDetails ? (
//             <Dashboard updateUserDetails={updateUserDetails} />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />

//       <Route
//         path="/logout"
//         element={
//           userDetails ? (
//             <Logout updateUserDetails={updateUserDetails} />
//           ) : (
//             <Navigate to="/login" />
//           )
//         }
//       />

//       <Route
//         path="/error"
//         element={
//           userDetails ? (
//             <Error />
//           ) : (
//             <AppLayout>
//               <Error />
//             </AppLayout>
//           )
//         }
//       />
//     </Routes>
//   );
// }

// export default App;


//change 1:-  <Route path="/dashboard" element={<Dashboard />} />
// {/* <Route path="/dashboard" element={<Dashboard updateUserDetails={updateUserDetails} />} /> */}



// learned about hard refresh and lifting state up