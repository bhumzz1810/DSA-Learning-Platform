import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../RT_Pairing/ThemeContext";
import logoIcon from "../../assets/Logo/dsalogo.svg";
import logoHome from "../../assets/Logo/dsalogowhite.svg";
import avatarImg from "../../assets/avatar.jpg";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { theme } = useTheme();
  const logoByTheme = {
    light: logoIcon,
    dark: logoHome,
    ocean: logoHome,
    forest: logoHome,
  };
  const logoSrc = isHome ? logoHome : (logoByTheme[theme] || logoIcon);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Themed styles (used everywhere except Home)
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
      button: "bg-blue-600 hover:bg-blue-700",
      dropdown: "bg-white border-gray-200",
      icon: "text-gray-800",
      hover: "hover:text-blue-700",
      shell: "sticky top-0 ",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      border: "border-gray-700",
      button: "bg-blue-500 hover:bg-blue-600",
      dropdown: "bg-gray-800 border-gray-700",
      icon: "text-white",
      hover: "hover:text-blue-400",
      shell: "sticky top-0 ",
    },
    ocean: {
      bg: "bg-blue-900",
      text: "text-white",
      border: "border-blue-800",
      button: "bg-cyan-600 hover:bg-cyan-700",
      dropdown: "bg-blue-900 border-blue-800",
      icon: "text-white",
      hover: "hover:text-cyan-300",
      shell: "sticky top-0 ",
    },
    forest: {
      bg: "bg-green-800",
      text: "text-white",
      border: "border-green-700",
      button: "bg-emerald-600 hover:bg-emerald-700",
      dropdown: "bg-green-800 border-green-700",
      icon: "text-white",
      hover: "hover:text-emerald-300",
      shell: "sticky top-0 ",
    },
  };

  // Plain Home
  const homeStyles = {
    bg: "bg-transparent",
    text: "text-white",
    border: "border-transparent",
    button: "bg-white hover:bg-white/90",
    dropdown: "bg-black/80 border-white/10",
    icon: "text-white",
    hover: "hover:text-cyan-400",
    shell: "absolute top-0 left-0 right-0",
  };

  const current = isHome ? homeStyles : (themeStyles[theme] || themeStyles.light);
  const ctaTextColor = isHome ? "text-black" : "text-white";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}api/auth/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setIsSubscribed(!!data.subscriptionActive))
        .catch(() => setIsSubscribed(false));
    }

    const onDocClick = (e) => {
      if (!e.target.closest(".dropdown-container")) setShowDropdown(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav
      className={`${current.shell} z-50 w-full border-b ${current.border} ${current.bg} ${current.text} font-['Poppins']`}
      data-uses-theme={!isHome}
    >
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <div className={isHome}>
          <img
            src={logoSrc}
            alt="DSArena logo"
            className="w-32 h-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
            onError={(e) => {
              e.target.onerror = null;
              e.currentTarget.src = isHome ? logoHome : logoIcon;
            }}
          />
        </div>

        <div className="flex items-center gap-5">
          <ul className="flex gap-6 list-none m-0 p-0 text-sm font-medium">
            <li className={`${current.hover} cursor-pointer`} onClick={() => navigate("/")}>
              Home
            </li>
            {isLoggedIn && (
              <li className={`${current.hover} cursor-pointer`} onClick={() => navigate("/dashboard")}>
                Dashboard
              </li>
            )}
            <li className={`${current.hover} cursor-pointer`} onClick={() => navigate("/problems")}>
              Problems
            </li>
            {isLoggedIn && (
              <li
                onClick={() =>
                  isSubscribed
                    ? navigate("/join-room")
                    : navigate("/", { state: { scrollToPricing: true } })
                }
                className={`cursor-pointer ${isSubscribed ? current.hover : "text-gray-400"
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

          {isLoggedIn && <FiBell className={`text-lg cursor-pointer ${current.icon}`} />}

          {isLoggedIn ? (
            <div className="relative dropdown-container">
              <img
                src={avatarImg}
                alt="Profile"
                className={`w-8 h-8 rounded-full cursor-pointer border ${current.border} hover:border-blue-500 object-cover`}
                onClick={() => setShowDropdown((s) => !s)}
              />
              {showDropdown && (
                <div className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg border z-50 ${current.dropdown}`}>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => navigate("/profile")}>
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10" onClick={() => navigate("/settings")}>
                    Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`px-4 py-2 rounded-md ${ctaTextColor} ${current.button} text-sm font-medium`}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
