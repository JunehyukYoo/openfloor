// login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import RevealOnScroll from "../components/RevealOnScroll";
import api from "../../api/axios";
import axios from "axios";
import "../styles/loginRegister.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setLoggedIn, setUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // To display if user attempts to access a protected route without being logged in
  // uses react-toastify package
  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message, {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { email, password });
      if (response.status === 200) {
        console.log("Login successful:", response.data);
        console.log("User:", response.data.user);
        setLoggedIn(true);
        setUsername(response.data.user.username);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response!.data as {
          message: string;
        };
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="lr-container">
      <div className="video-container">
        <video src="/bg-login.mp4" autoPlay loop muted></video>
      </div>

      <div className="form-container">
        <RevealOnScroll>
          <h1>Glad to have you back.</h1>
          <form onSubmit={handleLogin} id="login-form">
            <div className="input-container">
              <input
                type="email"
                id="login-email"
                className="input-line"
                placeholder="Email*"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="login-password"
                className="input-line"
                placeholder="Password*"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p className="cl-account">
            Don't have an account? <a href="/register">Create one now!</a>
          </p>
        </RevealOnScroll>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
