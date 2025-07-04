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

  // Update isLoggedIn when route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
        {isLoggedIn && <img src={avatarImg} alt="Profile" className="avatar" />}
        <FiSun className="theme-icon" />

        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
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
