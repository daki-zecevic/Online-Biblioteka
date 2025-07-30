import React, { useState, useEffect } from 'react';
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


const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36">
    <circle cx={14.67} cy={8.3} r={6} fill="currentColor" className="clr-i-solid clr-i-solid-path-1"></circle>
    <path fill="currentColor" d="M16.44 31.82a2.15 2.15 0 0 1-.38-2.55l.53-1l-1.09-.33a2.14 2.14 0 0 1-1.5-2.1v-2.05a2.16 2.16 0 0 1 1.53-2.07l1.09-.33l-.52-1a2.17 2.17 0 0 1 .35-2.52a19 19 0 0 0-2.32-.16A15.58 15.58 0 0 0 2 23.07v7.75a1 1 0 0 0 1 1z" className="clr-i-solid clr-i-solid-path-2"></path>
    <path fill="currentColor" d="m33.7 23.46l-2-.6a6.7 6.7 0 0 0-.58-1.42l1-1.86a.35.35 0 0 0-.07-.43l-1.45-1.46a.38.38 0 0 0-.43-.07l-1.85 1a7.7 7.7 0 0 0-1.43-.6l-.61-2a.38.38 0 0 0-.36-.25h-2.08a.38.38 0 0 0-.35.26l-.6 2a7 7 0 0 0-1.45.61l-1.81-1a.38.38 0 0 0-.44.06l-1.47 1.44a.37.37 0 0 0-.07.44l1 1.82a7.2 7.2 0 0 0-.65 1.43l-2 .61a.36.36 0 0 0-.26.35v2.05a.36.36 0 0 0 .26.35l2 .61a7.3 7.3 0 0 0 .6 1.41l-1 1.9a.37.37 0 0 0 .07.44L19.16 32a.38.38 0 0 0 .44.06l1.87-1a7 7 0 0 0 1.4.57l.6 2.05a.38.38 0 0 0 .36.26h2.05a.38.38 0 0 0 .35-.26l.6-2.05a6.7 6.7 0 0 0 1.38-.57l1.89 1a.38.38 0 0 0 .44-.06L32 30.55a.38.38 0 0 0 .06-.44l-1-1.88a7 7 0 0 0 .57-1.38l2-.61a.39.39 0 0 0 .27-.35v-2.07a.4.4 0 0 0-.2-.36m-8.83 4.72a3.34 3.34 0 1 1 3.33-3.34a3.34 3.34 0 0 1-3.33 3.34" className="clr-i-solid clr-i-solid-path-3"></path>
    <path fill="none" d="M0 0h36v36H0z"></path>
  </svg>
);

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Try different approaches to determine admin status
        
        // Approach 1: Try to access admin creation endpoint (POST to /api/users/store with admin role)
        // This is more likely to be restricted to actual admins
        const testResponse = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Send invalid data to test access - we just want to see if we get 403/401 vs validation error
            test: true
          })
        });

        // If we get anything other than 403/401, user likely has admin access
        // 422 = validation error (means endpoint is accessible)
        // 403/401 = forbidden/unauthorized (means no admin access)
        if (testResponse.status === 422 || testResponse.status === 200) {
          setIsAdmin(true);
        } else if (testResponse.status === 403 || testResponse.status === 401) {
          setIsAdmin(false);
        } else {
          // Fallback: Check against known admin usernames
          const adminUsernames = ['admin', 'administrator', 'super_admin', 'root']; 
          setIsAdmin(adminUsernames.includes(username?.toLowerCase()));
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // Fallback to username-based check
        const adminUsernames = ['admin', 'administrator', 'super_admin', 'root'];
        setIsAdmin(adminUsernames.includes(username?.toLowerCase()));
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const baseNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, exact: true },
    { path: "/dashboard/bibliotekari", label: "Bibliotekari", icon: <Users size={20} /> },
    { path: "/dashboard/knjige", label: "Knjige", icon: <BookOpen size={20} /> },
    { path: "/dashboard/ucenici", label: "Učenici", icon: <GraduationCap size={20} /> },
    { path: "/dashboard/authors", label: "Autori", icon: <PenSquare size={20} /> },
    { path: "/dashboard/checkout", label: "Izdavanje", icon: <RefreshCw size={20} /> }
  ];

  // Add admin item only if user is admin
  const navItems = isAdmin 
    ? [
        baseNavItems[0], // Dashboard
        { path: "/dashboard/admin", label: "Admin", icon: <AdminIcon /> },
        ...baseNavItems.slice(1) // Rest of the items
      ]
    : baseNavItems;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        {!isCollapsed && <span className="logo-text">Online Biblioteka</span>}
      </div>
      
      <nav className="sidebar-nav">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            {!isCollapsed && <span>Loading...</span>}
          </div>
        ) : (
          navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              data-tooltip={isCollapsed ? item.label : null}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-text">{item.label}</span>}
            </NavLink>
          ))
        )}
      </nav>
    </div>
  );
};

export default Sidebar;