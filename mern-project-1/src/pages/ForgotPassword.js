import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      await axios.post(
        `${serverEndpoint}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      setSuccess("OTP sent to your email!");

      // Navigate to Reset Password page with email
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Forgot Password</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Send OTP</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
