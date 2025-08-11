import { useEffect } from "react";

const SocialLogin = () => {
  // SocialLogin.jsx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (!token) return (window.location.href = "/#/login");

    localStorage.setItem("token", token);

    if (userParam) {
      // decode → parse → re-serialize cleanly
      const parsed = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem("user", JSON.stringify(parsed));
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // ok for most JWTs
      const role = payload.role;
      console.log("User role from token:", role);

      window.location.href =
        role === "admin" ? "/#/admin/problems" : "/#/dashboard";
    } catch (e) {
      console.error("Error decoding token:", e);
      window.location.href = "/#/login";
    }
  }, []);

  return <div>Logging in...</div>;
};

export default SocialLogin;
