import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqUrl = new URL(
      "/login",
      import.meta.env.VITE_API_BASE_URL
    ).toString();
    const body = JSON.stringify({ email, password });
    console.log("Logging in with details: " + body);
    try {
      const response = await fetch(reqUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body,
      });
      // Handle response here (e.g., redirect, show error, etc.)
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Redirect or update UI after successful login
      }
    } catch (error) {
      // Handle error here
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} id="login-form">
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
      </div>
    </div>
  );
};

export default Login;
