import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  PenSquare,
  RefreshCw,
  Menu
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/dashboard/librarians", label: "Bibliotekari", icon: <Users size={20} /> },
    { path: "/dashboard/books", label: "Knjige", icon: <BookOpen size={20} /> },
    { path: "/dashboard/ucenici", label: "Učenici", icon: <GraduationCap size={20} /> },
    { path: "/dashboard/authors", label: "Autori", icon: <PenSquare size={20} /> },
    { path: "/dashboard/checkout", label: "Izdavanje", icon: <RefreshCw size={20} /> }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        {!isCollapsed && <span className="logo-text">Online Biblioteka</span>}
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip={isCollapsed ? item.label : null}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-text">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;