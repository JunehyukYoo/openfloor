// App.tsx
// import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import LoadingScreen from "./components/LoadingScreen.tsx";
import DashboardLayout from "./components/DashboardLayout.tsx";
import PublicLayout from "./components/PublicLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute";

// Routes
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Profile from "./pages/profile.tsx";
import Edit from "./pages/edit.tsx";
import Topics from "./pages/dashboard/topics.tsx";
import Debates from "./pages/dashboard/debates.tsx";
import Analytics from "./pages/dashboard/analytics.tsx";
import DebatePage from "./pages/dashboard/debate-page.tsx";
import Stances from "./pages/dashboard/stances.tsx";

import { useAuth } from "./context/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen">
        <LoadingScreen />
      </div>
    );
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
            <Route
              path={"/dashboard/debates/:debateId"}
              element={<DebatePage />}
            />
            <Route
              path={"/dashboard/debates/:debateId/stances/:stanceId"}
              element={<Stances />}
            />
            <Route path={"/dashboard/analytics"} element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
