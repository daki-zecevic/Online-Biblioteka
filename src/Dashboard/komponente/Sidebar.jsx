import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: '📊', text: 'Dashboard' },
    { path: '/dashboard/bibliotekari', icon: '👨‍💼', text: 'Bibliotekari' },
    { path: '/dashboard/knjige', icon: '📚', text: 'Knjige' },
    { path: '/dashboard/ucenici', icon: '👦', text: 'Učenici' },
    { path: '/dashboard/autori', icon: '✍️', text: 'Autori' },
    { path: '/dashboard/izdavanje', icon: '🔄', text: 'Izdavanje' }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '>' : '<'}
      </button>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            end
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-text">{item.text}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;