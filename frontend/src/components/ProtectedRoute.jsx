// ProtectedRoute.jsx
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token") !== null;

  useEffect(() => {
    // Check authentication on initial load and route changes
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname]); // Run effect when URL path changes

  // Additional check for immediate render
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;