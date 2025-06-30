// src/pages/Register.js
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { serverEndpoint } from "../config/config";
import { SET_USER } from "../redux/user/actions";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // optional for future redirect if needed

  // 🟢 Previously: no Google login, no dispatch
  // ✅ Now: using Redux + error handling + better UI
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Username is mandatory";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is mandatory";
      isValid = false;
    }
    if (!formData.name) {
      newErrors.name = "Name is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const body = {
        username: formData.username,
        password: formData.password,
        name: formData.name
      };
      const config = {
        withCredentials: true
      };

      try {
        const response = await axios.post(`${serverEndpoint}/auth/register`, body, config);
        dispatch({
          type: SET_USER,
          payload: response.data.user
        });
        // Optional redirect after registration
        // navigate("/dashboard");
      } catch (error) {
        if (error?.response?.status === 401) {
          setErrors({ message: 'User exists with the given email' });
        } else {
          setErrors({ message: 'Something went wrong, please try again' });
        }
      }
    }
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, {
        withCredentials: true
      });

      dispatch({
        type: SET_USER,
        payload: response.data.userDetails
      });

    } catch (error) {
      console.log(error);
      setErrors({ message: 'Something went wrong while Google sign-in' });
    }
  };

  const handleGoogleSigninFailure = (error) => {
    console.log(error);
    setErrors({ message: 'Something went wrong while Google sign-in' });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Sign up with a new account</h2>

          {/* 🟢 New: Bootstrap error alert */}
          {errors.message && (
            <div className="alert alert-danger" role="alert">
              {errors.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Username/Email Field */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>

          {/* Google Sign-in UI */}
          <div className="text-center">
            <div className="my-4 d-flex align-items-center text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSignin}
                onError={handleGoogleSigninFailure}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;



// last changes -------------------------27-06-25
// // src/Register.js
// import {useNavigate} from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { serverEndpoint } from "../config/config";

// function Register() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         name: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [message, setMessage] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const validate = () => {
//         let newErrors = {};
//         if (!formData.username) newErrors.username = "Username is required";
//         if (!formData.password) newErrors.password = "Password is required";
//         if (!formData.name) newErrors.name = "Name is required";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
        
//         e.preventDefault();

//         if (validate()) {
//             const body = {
//                 username: formData.username,
//                 password: formData.password,
//                 name: formData.name
//             };
//             try {
//                 const response = await axios.post(`${serverEndpoint}/auth/register`, body);
//                 setMessage(response.data.message);
//                 setFormData({ username: '', password: '', name: '' });
//                 navigate("/dashboard");
//             } catch (error) {
//                 console.log(error);
//                 setMessage(`Hey ${formData.name} Registration Failed, Email Id Already Exists!!,Please Tryagain!!`);
//             }
//         }
//     };

//     return (
//         <div className="container text-center">
//             <h1>Register</h1>
//             {message && <p>{message}</p>}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Name:</label>
//                     <input type="text" name="name" value={formData.name} onChange={handleChange} />
//                     {errors.name && <span>{errors.name}</span>}
//                 </div>
//                 <div>
//                     <label>Email:</label>
//                     <input type="text" name="username" value={formData.username} onChange={handleChange} />
//                     {errors.username && <span>{errors.username}</span>}
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input type="password" name="password" value={formData.password} onChange={handleChange} />
//                     {errors.password && <span>{errors.password}</span>}
//                 </div>
//                 <div>
//                     <button type="submit">Register</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default Register;
