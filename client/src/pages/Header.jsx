import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo/dsalogoicon.png';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Company Logo" className="logo" />
          </Link>
          <h1 className="app-title">DSArena</h1>
        </div>
        
        <nav className="nav-menu">
          <ul className="nav-list">
              <>
                 <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/learn" className="nav-link">Learn</Link>
                </li>
                <li className="nav-item">
                  <Link to="/Problems" className="nav-link">Problems</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login/Signp</Link>
                </li>
                {/* <li className="nav-item">
                  <button onClick="" className="nav-link logout-btn">Logout</button>
                </li> */}
              </>
        
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;