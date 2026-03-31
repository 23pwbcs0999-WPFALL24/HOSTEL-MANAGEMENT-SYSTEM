import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <div className="logo-badge">HM</div>
          <div className="logo-text-group">
            <h1 className="logo-text">UET Hostel Management</h1>
            <p className="logo-subtitle">Operations Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/room" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={closeMenu}>
              Rooms
            </NavLink>
          </li>
          <li>
            <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={closeMenu}>
              Students
            </NavLink>
          </li>
          <li>
            <NavLink to="/allocations" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={closeMenu}>
              Allocations
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={closeMenu}>
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/visitors" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={closeMenu}>
              Visitors
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
