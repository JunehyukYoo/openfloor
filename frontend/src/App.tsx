import { useState, useEffect } from "react";
import { api } from "../api/axios";
import "./App.css";

function App() {
  const [test, setTest] = useState<string>("To start...");
  useEffect(() => {
    api
      .get("/test")
      .then((res) => setTest(res.data))
      .catch(() => setTest("Didnt work!"));
  }, []);
  return (
    <>
      <div>Hello world!</div>
      <div>{test}</div>
    </>
  );
}

export default App;
