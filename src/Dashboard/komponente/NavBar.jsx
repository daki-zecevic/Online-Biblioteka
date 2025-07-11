import React, { useState } from 'react';
import { Bell, Plus, UserRound, GraduationCap, BookText, PenSquare } from 'lucide-react';
import './NavBar.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <GraduationCap size={24} className="logo-icon" />
          <span className="brand-name">Online Biblioteka</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="dropdown-container">
          <button 
            className="add-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
          >
            <Plus size={24} />
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <UserRound size={18} className="dropdown-icon" />
                Bibliotekar
              </button>
              <button className="dropdown-item">
                <GraduationCap size={18} className="dropdown-icon" />
                Učenik
              </button>
              <button className="dropdown-item">
                <BookText size={18} className="dropdown-icon" />
                Knjiga
              </button>
              <button className="dropdown-item">
                <PenSquare size={18} className="dropdown-icon" />
                Autor
              </button>
            </div>
          )}
        </div>

        <div className="profile">
          <span className="company-name">bildstudio</span>
          <div className="avatar">
            <UserRound size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;