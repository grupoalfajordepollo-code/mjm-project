import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, rol } = useAuth();

  if (!isAuthenticated) {
    const loginPath = requiredRole === "admin" ? "/login-admin" : "/login";
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/401" replace />;
  }

  return children;
};

export default ProtectedRoute;
