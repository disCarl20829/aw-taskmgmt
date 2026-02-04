import React from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import "../css/landing.css";

function Landing() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <>
      <div className="bg-container">
        <div className="navbar-container">
          <Container className="d-flex gap-2">
            <Button variant="primary" href="/signin">
              Sign In
            </Button>
            <Button variant="secondary" href="/signUp">
              Sign Up
            </Button>
            <Button variant="success" onClick={handleGoogleLogin}>
              Log in with Google
            </Button>
          </Container>
        </div>
      </div>
    </>
  );
}

export default Landing;
