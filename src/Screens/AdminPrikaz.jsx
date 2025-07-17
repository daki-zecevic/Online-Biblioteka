import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/PrikazAdmin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPrikaz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');

  const handleEdit = (adminId) => {
    console.log('Edit admin with ID:', adminId);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://biblioteka.simonovicp.com/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setAdmin(data.data || data);
      } catch (error) {
        toast.error('Greška pri dohvatanju admina.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.admin-prikaz-dropdown-wrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://biblioteka.simonovicp.com/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Admin uspješno obrisan!');
        setTimeout(() => {
          navigate('/dashboard/admin');
        }, 1200);
      } else {
        toast.error('Greška pri brisanju admina.');
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  if (!admin || loading) return (
    <div>
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      {!loading && <div>Učitavanje...</div>}
    </div>
  );

  return (
    <div className="admin-prikaz-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="admin-prikaz-loading-overlay">
          <div className="admin-prikaz-loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="admin-prikaz-header">
        <div className="admin-prikaz-title-section">
          <h2>{`${admin.name || ''} ${admin.surname || admin.surename || ''}`}</h2>
          <p className="admin-prikaz-breadcrumbs">Svi bibliotekari / ID-{admin.id}</p>
        </div>
        <div className="admin-prikaz-actions">
         <div className="admin-prikaz-dropdown-wrapper">
            <button 
              className="admin-prikaz-dropdown-toggle" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="admin-prikaz-dropdown-menu">
                <button className="admin-prikaz-dropdown-btn" onClick={() => handleEdit(admin.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 12 12" style={{ marginRight: '8px' }}>
                    <path fill="currentColor" fillRule="evenodd" d="M8.08.1c.19-.06.39-.09.59-.09L8.66 0c.2 0 .4.03.59.09c.43.14.72.43 1.14.849l.67.669c.43.42.71.709.85 1.14c.12.39.12.799 0 1.18c-.14.43-.43.719-.85 1.14l-5.46 5.46c-.12.13-.21.22-.34.31c-.11.08-.23.15-.36.2a2.5 2.5 0 0 1-.429.127l-.01.002l-3.22.81c-.08.03-.16.03-.24.03c-.26 0-.52-.1-.71-.29a.98.98 0 0 1-.26-.95l.81-3.22l.002-.01c.039-.165.069-.292.128-.43c.05-.13.12-.25.2-.36c.09-.12.19-.22.31-.34L6.94.948C7.37.518 7.65.24 8.08.1m.87.949a.9.9 0 0 0-.28-.04v.01c-.1 0-.19.01-.28.04c-.2.06-.38.24-.74.6l-.642.642l2.7 2.7l.649-.648l.094-.097c.288-.295.442-.453.506-.643c.06-.18.06-.38 0-.56c-.06-.2-.24-.38-.6-.739l-.67-.669l-.096-.094c-.296-.288-.453-.442-.643-.505zm.054 4.66l-2.7-2.7l-4.1 4.11q-.056.062-.098.104a.9.9 0 0 0-.202.286c-.019.037-.03.082-.045.143q-.013.057-.035.136l-.81 3.22l3.22-.81c.14-.03.21-.05.28-.079c.06-.03.12-.06.17-.1c.06-.04.11-.09.22-.2l4.1-4.1z" clipRule="evenodd"></path>
                  </svg>
                  Izmijeni Bibliotekara
                </button>
                <button className="admin-prikaz-dropdown-btn" onClick={() => setShowModal(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                    <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"></path>
                  </svg>
                  Izbriši bibliotekara
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-prikaz-content">
        <div className="admin-prikaz-photo-section">
          <img 
            src={admin.photoPath || admin.avatar || '/Resources/default.jpg'} 
            alt="Admin profil" 
            className="admin-prikaz-photo"
          />
        </div>
        
        <div className="admin-prikaz-info-section">
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Ime i prezime</label>
            <span className="admin-prikaz-value">{admin.name} {admin.surname || admin.surename}</span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Tip korisnika</label>
            <span className="admin-prikaz-value">Bibliotekar</span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">JMBG</label>
            <span className="admin-prikaz-value">{admin.jmbg}</span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Email</label>
            <span className="admin-prikaz-value">
              <a href={`mailto:${admin.email}`} className="admin-prikaz-email-link">{admin.email}</a>
            </span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Korisničko ime</label>
            <span className="admin-prikaz-value">{admin.username}</span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Broj logovanja</label>
            <span className="admin-prikaz-value">{admin.login_count || admin.loginCount || 0}</span>
          </div>
          
          <div className="admin-prikaz-info-row">
            <label className="admin-prikaz-label">Poslednji put logovan/a</label>
            <span className="admin-prikaz-value">{admin.last_login || admin.lastLogin || 'Juče 11:57 AM'}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="admin-prikaz-modal-overlay">
          <div className="admin-prikaz-modal-box">
            <p>Izbriši bibliotekara?</p>
            <p>Da li ste sigurni da želite da obrišete ovog bibliotekara?</p>
            <div className="admin-prikaz-modal-buttons">
              <button className="admin-prikaz-modal-cancel" onClick={() => setShowModal(false)}>PONIŠTI</button>
              <button className="admin-prikaz-modal-delete" onClick={handleDelete}>IZBRIŠI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrikaz;
