import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <h2>Library Dashboard</h2>
      <div className="navbar-actions">
        <div className="dropdown">
          <button 
            className="dropdown-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Quick Actions 
          </button>
          {showDropdown && (
            <div className="dropdown-content">
              <div className="dropdown-item">New Librarian</div>
              <div className="dropdown-item">New Student</div>
              <div className="dropdown-item">New Book</div>
              <div className="dropdown-item">New Author</div>
            </div>
          )}
        </div>
        <div className="user-profile">
          <span>Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;