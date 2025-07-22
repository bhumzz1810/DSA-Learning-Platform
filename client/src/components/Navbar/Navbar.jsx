import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import logoIcon from "../../assets/Logo/dsalogo.svg";
import avatarImg from "../../assets/avatar.jpg";
import { FiBell, FiSun } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Track URL changes
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update isLoggedIn when route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [location]); // 👈 re-check login status on every page change

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logoIcon} alt="DSArena logo" className="logo-icon-large" />
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          {isLoggedIn && (
            <>
              <li onClick={() => navigate("/dashboard")}>Dashboard</li>
            </>
          )}
          <li onClick={() => navigate("/problems")}>Problems</li>
          {isLoggedIn && (
            <>
              <li onClick={() => navigate("/join-room")}>Editor</li>
            </>
          )}
        </ul>

        {isLoggedIn && <FiBell className="bell-icon" />}
        <FiSun className="text-xl mr-4 cursor-pointer" />

        {isLoggedIn ? (
          <div className="relative">
            <img
              src={avatarImg}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500"
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
            className="btn btn-primary"
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
