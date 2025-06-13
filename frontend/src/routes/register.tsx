// register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from "axios";

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
    <div>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister} id="register-form">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="string"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Register;
