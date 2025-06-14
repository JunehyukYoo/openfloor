// register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RevealOnScroll from "../components/RevealOnScroll";
import api from "../../api/axios";
import axios from "axios";
import "../styles/loginRegister.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const { data } = await api.post("/register", {
        email,
        password,
        username,
      });
      console.log("Register successful:", data);
      alert("Registration successful! You can now log in.");
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg = error.response?.data?.message as string | undefined;

        if (status === 400) {
          setErrorMessage(serverMsg ?? "That email is already registered.");
        } else if (status === 409) {
          setErrorMessage(serverMsg ?? "That username is already taken.");
        } else {
          setErrorMessage(
            serverMsg ?? "Registration failed. Please try again later."
          );
        }
      } else {
        console.error(error);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="lr-container">
      <div className="video-container">
        <video src="/register-background.mp4" autoPlay loop muted></video>
      </div>
      <div className="form-container">
        <RevealOnScroll>
          <h1>You're making a great decision.</h1>
          <form onSubmit={handleRegister} id="register-form">
            <div className="input-container">
              <input
                type="email"
                id="email"
                className="input-line"
                placeholder="Email*"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="string"
                id="username"
                className="input-line"
                placeholder="Username*"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                id="password"
                className="input-line"
                placeholder="Password*"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Register</button>
          </form>
          <p className="cl-account">
            Already have an account? <a href="/register">Log in here!</a>
          </p>
        </RevealOnScroll>
      </div>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default Register;
