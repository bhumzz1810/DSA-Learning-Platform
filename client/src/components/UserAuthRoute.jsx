// src/components/UserAuthRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function UserAuthRoute({ children, type }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const { pathname } = useLocation(); // <-- works with HashRouter

  if (type === "private") {
    if (!token) return <Navigate to="/login" replace />;
    // Admin-only guard
    if (pathname.startsWith("/admin") && (!user || user.role !== "admin")) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (type === "public") {
    // if logged-in users should NOT visit login/sign-up pages
    if (token && (pathname === "/login" || pathname === "/social-login")) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
