// login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../../api/axios";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setLoggedIn, setUsername } = useAuth();
  const navigate = useNavigate();

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
    <div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin} id="login-form">
          <div>
            <label htmlFor="login-email">Email</label>
            <input
              type="email"
              id="login-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
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
