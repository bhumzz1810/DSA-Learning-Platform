import { useEffect } from "react";

const SocialLogin = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user"); // ✅ Get user from URL

    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", user); // ✅ Save user object
      }

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
