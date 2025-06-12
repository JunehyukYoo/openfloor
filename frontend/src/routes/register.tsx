import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_API_BASE_URL);
    const reqUrl = new URL(
      "/register",
      import.meta.env.VITE_API_BASE_URL
    ).toString();
    console.log("Register URL:", reqUrl);
    try {
      const { data } = await axios.post(reqUrl, {
        email,
        password,
        username,
      });
      console.log("Register successful:", data);
    } catch (error) {
      // Handle error here
      console.error("Register failed:", error);
      alert("Register failed. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} id="register-form">
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
      </div>
    </div>
  );
};

export default Register;
