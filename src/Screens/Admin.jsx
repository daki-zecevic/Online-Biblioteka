import React, { useEffect, useState } from 'react';
import '../Styles/Admin.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true); 
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('https://biblioteka.simonovicp.com/api/users?role_id=3', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAdmins(data.data);
        } else {
          toast.error('Greška pri učitavanju admina.');
        }
      } catch (error) {
        toast.error('Greška pri povezivanju sa serverom.');
      } finally {
        setLoading(false); 
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && !event.target.closest('.admin-list-actions-cell')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpenId]);

  const handleMenuClick = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleDeleteClick = (admin) => {
    const currentUsername = localStorage.getItem('username');
    
    // Check if the user is trying to delete themselves
    if (admin.name === currentUsername || admin.username === currentUsername) {
      toast.error('Ne možete obrisati ulogovanog admina');
      return;
    }
    
    setSelectedAdmin(admin);
    setShowModal(true);
    setMenuOpenId(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    try {
      const response = await fetch(`https://biblioteka.simonovicp.com/api/users/${selectedAdmin.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
        setShowModal(false);
        setSelectedAdmin(null);
        toast.success('Admin uspješno izbrisan!');
      } else {
        const errorData = await response.text();
        console.error('Delete error:', errorData);
        toast.error('Greška pri brisanju admina.');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/admin/prikaz/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/admin/prikaz/${id}/izmjena`);
  };

  const handleAddAdmin = () => {
    navigate('/dashboard/admin/n');
  };

  return (
    <div className="admin-list-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="admin-list-loading-overlay">
          <div className="admin-list-loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="admin-list-header">
        <button className="admin-list-add-btn" onClick={handleAddAdmin}>
          + NOVI ADMIN
        </button>
        <input type="text" placeholder="Search..." className="admin-list-search-input" />
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Tip korisnika</th>
            <th>Zadnji pristup sistemu</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((user) => (
            <tr key={user.id}>
              <td><input type="checkbox" /></td>
              <td className="admin-list-name-cell">
                <img src={user.avatar || '/Resources/default.jpg'} alt={user.name} className="admin-list-avatar" />
                {user.name}
              </td>
              <td>{user.email}</td>
              <td>{user.type || 'Admin'}</td>
              <td>{user.lastAccess || '-'}</td>
              <td className="admin-list-actions-cell">
                <span
                  className="admin-list-menu-dots"
                  onClick={() => handleMenuClick(user.id)}
                >⋮</span>
                {menuOpenId === user.id && (
                  <div className="admin-list-dropdown-menu">
                    <button className="admin-list-dropdown-btn" onClick={() => handleView(user.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                        <path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h8a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm13.586 4L14 4.414V8zM12 4H6v16h12V10h-5a1 1 0 0 1-1-1zm-4 9a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"></path>
                      </svg>
                      Pogledaj Detalje
                    </button>
                    <button className="admin-list-dropdown-btn" onClick={() => handleEdit(user.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" style={{ marginRight: '8px' }}>
                        <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                      </svg>
                      Izmijeni Admina
                    </button>
                    <button className="admin-list-dropdown-btn" onClick={() => handleDeleteClick(user)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                        <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"></path>
                      </svg>
                      Izbriši admina
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedAdmin && (
        <div className="admin-list-modal-overlay">
          <div className="admin-list-modal-box">
            <p>Izbriši admina?</p>
            <p>Da li ste sigurni da želite da obrišete ovog admina?</p>
            <div className="admin-list-modal-buttons">
              <button className="admin-list-modal-cancel" onClick={() => setShowModal(false)}>PONIŠTI</button>
              <button className="admin-list-modal-delete" onClick={handleDelete}>IZBRIŠI</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-list-table-footer">
        <span>Rows per page: 20</span>
        <span>1 of 1</span>
        <span>{`< >`}</span>
      </div>
    </div>
  );
};

export default Admin;
