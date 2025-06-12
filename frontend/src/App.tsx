import { useState, useEffect } from "react";
import { api } from "../api/axios";
import "./App.css";
import Login from "./routes/login";
import Register from "./routes/register";

function App() {
  const [test, setTest] = useState<string>("To start...");
  // const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    api
      .get("http://localhost:3000/test", {
        method: "GET",
        withCredentials: true,
      })
      .then((res) => setTest(res.data))
      .catch(() => setTest("Didnt work!"));
  }, []);
  return (
    <>
      <div>Hello world!</div>
      <div>{test}</div>
      <Login />
      <Register />
    </>
  );
}

export default App;
