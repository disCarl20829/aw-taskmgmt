import React from "react";
import { useNavigate } from "react-router-dom";

import "../css/landing.css";
import bg from "../assets/landing2.jpg";
import logo from "../assets/logo.png";

function Landing() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="bg-container" style={{ backgroundImage: `url(${bg})` }}>

      <div className="company-branding">
        <img src={logo} alt="AnimateWell Logo" className="company-logo-image" />
        <div className="divider-line" />
        <div className="company-text">
          <span className="company-name-top">ANIMATEWELL</span>
          <span className="company-name-bottom">COMPANY</span>
        </div>
      </div>

      <div className="auth-buttons">
        <a className="btn-login" href="/signin">
          Log In
        </a>

        <a className="btn-signup" href="/signUp">
          Sign Up
        </a>

        <a className="btn-google" role="button" onClick={handleGoogleLogin}>
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.805 10.023H12v3.977h5.617c-.242 1.242-1 2.297-2.133 3l3.422 2.656C20.63 17.773 21.805 15.113 21.805 12c0-.664-.059-1.312-.164-1.977z"/>
            <path d="M12 22c2.7 0 4.965-.895 6.617-2.43l-3.422-2.656C14.18 17.582 13.145 18 12 18c-2.672 0-4.938-1.805-5.746-4.234H2.758v2.742A9.997 9.997 0 0 0 12 22z"/>
            <path d="M6.254 13.766A6.01 6.01 0 0 1 5.934 12c0-.617.109-1.215.32-1.766V7.492H2.758A9.994 9.994 0 0 0 2 12c0 1.617.387 3.148 1.066 4.508l3.188-2.742z"/>
            <path d="M12 5.977c1.508 0 2.86.52 3.926 1.54l2.94-2.94C17.035 2.945 14.77 2 12 2A9.997 9.997 0 0 0 2.758 7.492l3.188 2.742C6.754 8.054 9.121 5.977 12 5.977z"/>
          </svg>
          Continue with Google
        </a>
      </div>

    </div>
  );
}

export default Landing;