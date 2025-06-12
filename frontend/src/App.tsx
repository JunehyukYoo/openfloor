// App.tsx
// import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import api from "../api/axios";
import "./App.css";
import Login from "./routes/login";
import Register from "./routes/register";
import { useAuth } from "./context/authContext";

function Home({ loggedIn, username }: { loggedIn: boolean; username: string }) {
  return (
    <>
      <h1>Openfloor</h1>
      <h2>Welcome to Openfloor!</h2>
      {loggedIn ? (
        <p>You are logged in as {username}!</p>
      ) : (
        <p>You are not logged in. Please log in or register.</p>
      )}
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
    </>
  );
}

function App() {
  const { isLoading, loggedIn, username, setLoggedIn, setUsername } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  const handleLogout = async () => {
    await api
      .post("/logout")
      .then(() => {
        setLoggedIn(false);
        setUsername("");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home loggedIn={loggedIn} username={username} />
              {loggedIn && <button onClick={handleLogout}>Logout</button>}
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
