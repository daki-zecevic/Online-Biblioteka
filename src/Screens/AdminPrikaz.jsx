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
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');

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
    <div className="admin-detalji-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="gornji-bar">
        <h2>{`${admin.name || ''} ${admin.surname || admin.surename || ''}`}</h2>
        <p className="breadcrumbs">Svi Admini / ID-{admin.id}</p>
        <div className="akcije">
          <button onClick={() => setShowModal(true)}>🗑️ Izbriši Admina</button>
        </div>
      </div>

      <div className="admin-info-kartica">
        <div className="admin-slika">
          <img src={admin.photoPath || admin.avatar || '/Resources/default.jpg'} alt="Admin profil" />
        </div>
        <div className="admin-podaci">
          <p><strong>Ime i Prezime:</strong><br />{admin.name} {admin.surname || admin.surename}</p>
          <p><strong>JMBG:</strong><br />{admin.jmbg}</p>
          <p><strong>Email:</strong><br /><a href={`mailto:${admin.email}`}>{admin.email}</a></p>
          <p><strong>Korisničko ime:</strong><br />{admin.username}</p>
          <p><strong>Broj logovanja:</strong><br />{admin.login_count || admin.loginCount || 0}</p>
          <p><strong>Poslednji put logovan/a:</strong><br />{admin.last_login || admin.lastLogin || 'Nepoznato'}</p>
        </div>
      </div>

      {showModal && (
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
    </div>
  );
};

export default AdminPrikaz;
