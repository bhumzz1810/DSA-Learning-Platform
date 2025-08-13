import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../RT_Pairing/ThemeContext";
// import "./style.css";
import logoIcon from "../../assets/Logo/dsalogo.svg";
import avatarImg from "../../assets/avatar.jpg";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Theme configuration
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
      button: "bg-blue-600 hover:bg-blue-700",
      dropdown: "bg-white border-gray-200",
      icon: "text-gray-800",
      hover: "hover:text-blue-700",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      border: "border-gray-700",
      button: "bg-blue-500 hover:bg-blue-600",
      dropdown: "bg-gray-800 border-gray-700",
      icon: "text-white",
      hover: "hover:text-blue-400",
    },
    ocean: {
      bg: "bg-blue-900",
      text: "text-white",
      border: "border-blue-800",
      button: "bg-cyan-600 hover:bg-cyan-700",
      dropdown: "bg-blue-900 border-blue-800",
      icon: "text-white",
      hover: "hover:text-cyan-300",
    },
    forest: {
      bg: "bg-green-800",
      text: "text-white",
      border: "border-green-700",
      button: "bg-emerald-600 hover:bg-emerald-700",
      dropdown: "bg-green-800 border-green-700",
      icon: "text-white",
      hover: "hover:text-emerald-300",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;
  const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch(`${API_ROOT}/api/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsSubscribed(data.subscriptionActive);
        })
        .catch(() => setIsSubscribed(false));
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav
      className={`w-full py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm ${currentTheme.bg} ${currentTheme.text} border-b ${currentTheme.border} font-['Poppins'] box-border`}
    >
      <div className="flex items-center gap-2">
        <div className="bg-white p-2 rounded-lg">
          <img
            src={logoIcon}
            alt="DSArena logo"
            className="w-32 h-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <ul className="flex gap-6 list-none m-0 p-0 text-sm font-medium">
          <li
            className={`cursor-pointer transition-colors duration-200 ${currentTheme.hover}`}
            onClick={() => navigate("/")}
          >
            Home
          </li>
          {isLoggedIn && (
            <li
              className={`cursor-pointer transition-colors duration-200 ${currentTheme.hover}`}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </li>
          )}
          <li
            className={`cursor-pointer transition-colors duration-200 ${currentTheme.hover}`}
            onClick={() => navigate("/problems")}
          >
            Problems
          </li>
          {isLoggedIn && (
            <li
              onClick={() =>
                isSubscribed
                  ? navigate("/join-room")
                  : navigate("/", { state: { scrollToPricing: true } })
              }
              className={`cursor-pointer relative group ${
                isSubscribed ? currentTheme.hover : "text-gray-400"
              }`}
              title={
                isSubscribed
                  ? "Access collaborative editor"
                  : "Subscribe to unlock the Editor and AI suggestions"
              }
            >
              Editor {isSubscribed ? "" : "🔒"}
            </li>
          )}
        </ul>

        {isLoggedIn && (
          <FiBell className={`text-lg cursor-pointer ${currentTheme.icon}`} />
        )}

        {/* <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button> */}

        {isLoggedIn ? (
          <div className="relative dropdown-container">
            <img
              src={avatarImg}
              alt="Profile"
              className={`w-8 h-8 rounded-full cursor-pointer border ${currentTheme.border} hover:border-blue-500 object-cover`}
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg border z-50 ${currentTheme.dropdown}`}
              >
                <button
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-gray-500 ${currentTheme.text}`}
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-20 hover:bg-gray-500 ${currentTheme.text}`}
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-opacity-20 hover:bg-gray-500`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={`px-4 py-2 rounded-md text-white ${currentTheme.button} text-sm font-medium`}
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
