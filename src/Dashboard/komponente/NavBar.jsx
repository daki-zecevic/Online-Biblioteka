import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="dashboard-title">Library Dashboard</h2>
      
      <div className="dropdown-container">
        <button 
          className="dropdown-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          Quick Actions 
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item">Novi bibliotekar</button>
            <button className="dropdown-item">Novi ucenik</button>
            <button className="dropdown-item">Nova knjiga</button>
            <button className="dropdown-item">Novi autor</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;