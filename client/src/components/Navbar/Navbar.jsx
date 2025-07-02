import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logoIcon from "../../assets/Logo/dsalogo.svg";
import avatarImg from "../../assets/avatar.jpg";
import { FiBell, FiSearch } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <img src={logoIcon} alt="DSArena logo" className="logo-icon-large" />
      </div>

      {/* <div className="navbar-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div> */}

      {/* Menu */}
      <div className="navbar-right">
        <ul className="nav-links">
          <li
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/problems")}
          >
            Problems
          </li>
          <li>Dashboard</li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/join-room")}
          >
            Editor
          </li>
        </ul>
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Get Started
        </button>
        <FiBell className="bell-icon" />
        <img src={avatarImg} alt="Profile" className="avatar" />
      </div>
    </nav>
  );
};

export default Navbar;
