// ProtectedRoute.tsx
import { useAuth } from "../context/authContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { loggedIn } = useAuth();
  const location = useLocation();

  if (loggedIn) return <Outlet />;
  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location,
        message: "You must be logged in to view this page.",
      }}
    />
  );
};

export default ProtectedRoute;
