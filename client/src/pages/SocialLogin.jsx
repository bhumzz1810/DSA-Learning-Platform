import { useEffect } from "react";

const SocialLogin = () => {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("token", token);

      try {
        const payloadData = JSON.parse(atob(token.split(".")[1]));
        const role = payloadData.role;
        console.log("User role:", role);

        // ✅ This forces a full page reload — safest for now
        if (role === "admin") {
          window.location.href = "/admin/problems";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  return <div>Logging in...</div>;
};

export default SocialLogin;
