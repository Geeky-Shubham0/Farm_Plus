import './navbar.css';
import logo from '../assets/logo.jpeg';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <NavLink to="/" className="logo">
        <img src={logo} alt="Farm+ Logo" className="logo-img" />
        <span className="logo-text">Farm+</span>
      </NavLink>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/smart-advisory">Smart Advisory</NavLink></li>
        <li><NavLink to="/market">Market</NavLink></li>
        <li><NavLink to="/livestock-care">Livestock Care</NavLink></li>
        <li><NavLink to="/government-schemes">Government Schemes</NavLink></li>
        <li><NavLink to="/knowledge-hub">Knowledge Hub</NavLink></li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* ICONS */}
        <div className="nav-icons">

          {/* Profile */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>

          {/* Settings */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>

          {/* Bell */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>

          {/* Logout */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>

        </div>

        {/* AUTH */}
        <div className="nav-auth">
          <NavLink to="/login" className="login-link">Login</NavLink>
          <NavLink to="/signup" className="signup-btn">Sign Up</NavLink>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;