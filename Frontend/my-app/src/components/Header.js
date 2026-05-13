import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-accent-bar" />
      <nav className="nav">
        <div className="logo-container">
          <img src="/images.png" alt="UET Peshawar" className="logo-img" />
          <div className="logo-text-group">
            <h1 className="logo-text">UET Hostel Management</h1>
            <p className="logo-subtitle">University of Engineering &amp; Technology, Peshawar</p>
          </div>
        </div>

        <div className="nav-divider" />

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {[
            { to: '/',           label: 'Dashboard', end: true },
            { to: '/room',       label: 'Rooms' },
            { to: '/students',   label: 'Students' },
            { to: '/allocations',label: 'Allocations' },
            { to: '/inventory',  label: 'Inventory' },
            { to: '/visitors',   label: 'Visitors' },
          ].map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active-link' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Header;
