import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <img src="/images.png" alt="Hostel Logo" className="logo-image" />
          <h1 className="logo-text">UET Hostel Management</h1>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/room" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Rooms
            </NavLink>
          </li>
          <li>
            <NavLink to="/students" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Students
            </NavLink>
          </li>
          <li>
            <NavLink to="/allocations" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Allocations
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/visitors" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Visitors
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
