// components/UserAuthRoute.jsx
import { Navigate } from "react-router-dom";

export default function UserAuthRoute({ children, type }) {
  const token = localStorage.getItem("token");

  if (type === "private") {
    // Private route: redirect to login if not logged in
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  }

  if (type === "public") {
    // Public route: redirect to dashboard if logged in (except home page)
    if (token && window.location.pathname !== "/") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}