import React from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/inputField";
import GoogleButton from "../components/auth/GoogleBtn";

import "../css/style.css";
import "../css/sign.css";

import api from "../config/api";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    user_name: "",
    user_email: "",
    user_password: "",
    confirm_password: "",
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.user_password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);

      const data = res.data;

      if (res.status === 200) {
        if (data.needsPassword) {
          navigate("/set-password");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.error("Sign-up failed:", data.message);
      }

      alert(data.message);
    } catch (err) {
      console.error("Error during sign up:", err);
      alert("Error during sign up. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <AuthLayout title="Sign Up">
      <form onSubmit={handleSignUp}>
        <InputField
          icon="person"
          type="text"
          placeholder="Username"
          id="user_name"
          value={formData.user_name}
          onChange={(e) => handleChange("user_name", e.target.value)}
        />
        <InputField
          icon="envelope"
          type="email"
          placeholder="Email"
          id="user_email"
          value={formData.user_email}
          onChange={(e) => handleChange("user_email", e.target.value)}
        />
        <InputField
          icon="lock"
          type="password"
          placeholder="Password"
          id="user_password"
          isPassword={true}
          value={formData.user_password}
          onChange={(e) => handleChange("user_password", e.target.value)}
        />
        <InputField
          icon="lock-fill"
          type="password"
          placeholder="Confirm Password"
          id="confirm_password"
          isPassword={true}
          value={formData.confirm_password}
          onChange={(e) => handleChange("confirm_password", e.target.value)}
        />
        <button type="submit" className="btn btn-signup">
          Sign In
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <GoogleButton onClick={handleGoogleLogin} />

      <div className="signup-text">
        Already have an Account? <a href="/">Sign in</a>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
