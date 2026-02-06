import React from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import "../css/landing.css";
import bg from "../assets/landing.jpg";

function Landing() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  // This object handles the stroke and the extra small sizing
  const buttonStyle = {
    backgroundColor: "#2c72b0", // Your custom button color
    borderColor: "#2c72b0", // White line stroke
    borderWidth: "1px",
    borderStyle: "solid",
    fontSize: "0.85rem", // Smaller text
    padding: "5px 15px", // Slim padding
    display: "flex",
    alignItems: "center",
    color: "#FFFFFF", // Ensures text is white
  };
  return (
    <>
      <div className="bg-container" style={{ backgroundImage: `url(${bg})` }}>
        <div
          className="navbar-container py-2 d-flex align-items-center"
          style={{ backgroundColor: "#003B6F" }}
        >
          <Container className="d-flex justify-content-start gap-2">
            <Button
              style={buttonStyle}
              className="btn-primary-blue"
              href="/signin"
            >
              Sign In
            </Button>

            <Button
              style={buttonStyle}
              className="btn-soft-blue"
              href="/signUp"
            >
              Sign Up
            </Button>

            <Button
              style={buttonStyle}
              className="btn-google-blue"
              onClick={handleGoogleLogin}
            >
              <i
                className="bi bi-google me-2"
                style={{ fontSize: "0.7rem" }}
              ></i>
              Log in with Google
            </Button>
          </Container>
        </div>
      </div>
    </>
  );
}

export default Landing;
