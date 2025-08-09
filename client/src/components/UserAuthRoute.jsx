import { Navigate } from "react-router-dom";

export default function UserAuthRoute({ children, type }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const path = window.location.pathname;

  if (type === "private") {
    if (!token) return <Navigate to="/login" replace />;

    // Admin-only guard
    if (path.startsWith("/admin") && (!user || user.role !== "admin")) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (type === "public") {
    if (token && path !== "/") return <Navigate to="/dashboard" replace />;
  }

  return children;
}
