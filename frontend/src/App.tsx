// App.tsx
// import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import LoadingScreen from "./components/LoadingScreen.tsx";
import DashboardLayout from "./components/DashboardLayout.tsx";
import PublicLayout from "./components/PublicLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Routes
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import Edit from "./routes/edit.tsx";
import Topics from "./routes/dashboard/topics.tsx";
import Debates from "./routes/dashboard/debates.tsx";
import Analytics from "./routes/dashboard/analytics.tsx";

import { useAuth } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public homepage routes + unauth */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* Public homepage routes + auth */}
        <Route element={<PublicLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/profile/edit"} element={<Edit />} />
          </Route>
        </Route>
        {/* Dashboard routes for debates */}
        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path={"/dashboard/topics"} element={<Topics />} />
            <Route path={"/dashboard/debates"} element={<Debates />} />
            <Route path={"/dashboard/analytics"} element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
