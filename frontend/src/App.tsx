// App.tsx
import { useState, useEffect } from "react";
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
  const { loggedIn, username, setLoggedIn, setUsername } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use the useEffect hook to check login status when the component mounts
  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const checkLoginStatus = async () => {
      try {
        const response = await api.get(
          new URL("/me", import.meta.env.VITE_API_BASE_URL).toString(),
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setLoggedIn(true);
          setUsername(response.data.user.username);
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setLoggedIn(false);
        setUsername("");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

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
      .post(
        "/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setLoggedIn(false);
        setUsername("");
        // Optionally redirect to login or home
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
