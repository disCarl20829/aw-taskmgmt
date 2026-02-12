import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/inputField";
import GoogleButton from "../components/auth/GoogleBtn";

import "../css/style.css";
import "../css/sign.css";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    user_input: "",
    user_password: "",
  });

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signin", {
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/dashboard");
      } else {
        console.error("Sign-in failed:", data.message);
      }

      alert(data.message);
    } catch (err) {
      console.error("Error during sign in:", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://192.168.1.18:3000/auth/google";
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSignIn}>
        <InputField
          icon="person"
          type="text"
          placeholder="Username or Email"
          id="user_input"
          value={formData.user_input}
          onChange={(e) => handleChange("user_input", e.target.value)}
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
        <button type="submit" className="btn btn-signup">
          Sign In
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <GoogleButton onClick={handleGoogleLogin} />

      <div className="signup-text">
        Don't have an Account? <a href="/signup">Sign up</a>
      </div>
    </AuthLayout>
  );
}

export default SignIn;
