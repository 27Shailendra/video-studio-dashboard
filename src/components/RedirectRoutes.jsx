import { Navigate } from "react-router-dom";

const RedirectRoute = ({ children }) => {
  const isLoggedIn = document.cookie.includes("token=");
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

export default RedirectRoute;
