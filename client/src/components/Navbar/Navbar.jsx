import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoIcon from "../../assets/Logo/dsalogo.svg";
import avatarImg from "../../assets/avatar.jpg";
import { FiBell, FiSearch, FiSun } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <img src={logoIcon} alt="DSArena logo" className="logo-icon-large" />
      </div>

      {/* Search */}
      <div className="navbar-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Menu */}
      <div className="navbar-right">
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/problems")}>Problems</li>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/editor")}>Editor</li>
        </ul>
        <FiBell className="bell-icon" />
        <img src={avatarImg} alt="Profile" className="avatar" />
        <FiSun className="theme-icon" />
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Get Started
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
