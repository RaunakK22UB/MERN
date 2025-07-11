import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { serverEndpoint } from "../config/config";
import { SET_USER } from "../redux/user/actions";


//function Login({updateUserDetails}) {  we will remove this prop as well 
function Login() {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,                    // why spread opt^r , becoz :-Keeps all previous fields and updates the one that was typed.   
      [name]: value
    });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.username.length === 0) {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }

    if (formData.password.length === 0) {
      isValid = false;
      newErrors.password = "Password is mandatory";      // errors.username and errors.password — Field-Level Errors
    }

    setErrors(newErrors);
    return isValid;
  };
  //----------------------------------here we are going to add our server end points  going to use axios to make the api calls
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      //--------------------------------------This code was used to test the login functionality without server
      // if (formData.username === 'admin' && formData.password === 'admin') {
      //     updateUserDetails({
      //         name:'john cena',
      //         email:'john@gmail.com'
      //     });
      //     setMessage('Valid Credentials');
      // } else {
      //     setMessage('Invalid Credentails');
      // }

      // we can use axios by promise and async await , we wil use async await
      const body = {
        username: formData.username,
        password: formData.password
      };

      const config = {
        withCredentials: true // this is important to send cookies with the request  // this telling the browser to include cookies in the request
      };
      try {
        const response = await axios.post(`${serverEndpoint}/auth/login`, body, config); // This make sure that cookies are sent with the request // response varible will contain the response from the server, same response which we have seen in postman

        //[...........we dont need this again use dispatch]  updateUserDetails(response.data.user); // update the user details in the App component
        //    console.log(response.data);

        dispatch({
          type: SET_USER,
          payload: response.data.user
        });

      } catch (error) {
        console.log(error);
        setErrors({ message: 'something went wrong' });          //errors.message global error 
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {

    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, {
        withCredentials: true
      });
      // updateUserDetails(response.data.user); .... here as well use REDUX dispatch
      //  navigate("/dashboard");


      dispatch({
        type: SET_USER,
        payload: response.data.user

      });



    } catch (e) {
      console.log(e);
      setErrors({ message: "Error processing the google auth, try again" })
    }

  };

  const handleGoogleError = async (error) => {
    console.log(error);
    setErrors({ message: "Error in google authorization flow, try again" })
  }

  // return (
  //     <div className="container text-center">
  //         {message && (message)}
  //         <h1>Login Page</h1>
  //         <form onSubmit={handleSubmit}>
  //             <div>
  //                 <label>Username:</label>
  //                 <input type="text" name="username" value={formData.username} onChange={handleChange} />
  //                 {errors.username && (errors.username)}
  //             </div>
  //             <div>
  //                 <label>Password:</label>
  //                 <input type="password" name="password" value={formData.password} onChange={handleChange} />
  //                 {errors.password && (errors.password)}
  //             </div>
  //             <div>
  //                 <button>Submit</button>
  //             </div>
  //         </form>
  //         <br></br>
  //         <h1>Login With Google</h1>
  //         <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  //             <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>
  //         </GoogleOAuthProvider>
  //     </div>
  // );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Login in to Continue</h2>

          {/* Error Alert */}
          {errors.message && (
            <div className="alert alert-danger" role="alert">
              {errors.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} id="username" name="username" value={formData.username} onChange={handleChange} />
              {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
            </div>

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

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>

          <div className="text-center">
            <div className="my-4 d-flex align-items-center text-muted">
              <hr className="flex-grow-1" />
              <span className="px-2">OR</span>
              <hr className="flex-grow-1" />
            </div>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );

}


export default Login;


//  ----------------------------------------------------------Full Overview: What this app does
// It checks if the user is already logged in.

// If yes ➝ It shows Dashboard.

// If not ➝ It shows Home or Login page.

// It also allows you to log in, and then redirects to Dashboard