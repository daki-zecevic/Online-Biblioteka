import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-btn" 
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '>' : '<'}
      </button>
      <div className="sidebar-header">
        {!collapsed && <h3>Online Biblioteka</h3>}
      </div>
      <div className="menu-items">
        <div className="menu-item">
          {collapsed ? 'D' : 'Dashboard'}
        </div>
        <div className="menu-item">
          {collapsed ? 'K' : 'Knjige'}
        </div>
        <div className="menu-item">
          {collapsed ? 'K' : 'Korisnici'}
        </div>
        <div className="menu-item">
          {collapsed ? 'A' : 'Autori'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;