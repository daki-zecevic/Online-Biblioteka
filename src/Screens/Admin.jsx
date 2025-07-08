import React, { useEffect, useState } from 'react';
import '../Styles/Admin.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null); // ID admina za koji je meni otvoren
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://biblioteka.simonovicp.com/api/users?role=admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.data);
      }
    };
    fetchAdmins();
  }, []);

  
  const handleMenuClick = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
    setMenuOpenId(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`https://biblioteka.simonovicp.com/api/users/${selectedAdmin.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
        setShowModal(false);
        setSelectedAdmin(null);
      } else {
        alert('Greška pri brisanju admina.');
      }
    } catch (error) {
      alert('Greška pri povezivanju sa serverom.');
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/admin/prikaz/${id}`);
  };

  const handleAddAdmin = () => {
    navigate('/dashboard/admin/n');
  };

  return (
    <div className="bibliotekari-container">
      <div className="bibliotekari-header">
        <button className="add-btn" onClick={handleAddAdmin}>
          + NOVI ADMIN
        </button>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <table className="bibliotekari-table">
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
              <td className="name-cell">
                <img src={user.avatar || '/Resources/default.jpg'} alt={user.name} className="avatar" />
                {user.name}
              </td>
              <td>{user.email}</td>
              <td>{user.type || 'Admin'}</td>
              <td>{user.lastAccess || '-'}</td>
              <td style={{ position: 'relative' }}>
                <span
                  className="menu-dots"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMenuClick(user.id)}
                >⋮</span>
                {menuOpenId === user.id && (
                  <div className="admin-menu">
                    <button onClick={() => handleView(user.id)}>👁️ Pregledaj</button>
                    <button onClick={() => handleDeleteClick(user)}>🗑️ Izbriši</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Izbriši admina?</p>
            <p>Da li ste sigurni da želite da obrišete ovog admina?</p>
            <div className="modal-dugmad">
              <button onClick={() => setShowModal(false)}>Poništi</button>
              <button onClick={handleDelete}>Izbriši</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-footer">
        <span>Rows per page: 20</span>
        <span>1 of 1</span>
        <span>{`< >`}</span>
      </div>
    </div>
  );
};

export default Admin;
