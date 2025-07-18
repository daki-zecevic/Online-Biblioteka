import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/IzmjenaAdmin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IzmjenaAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    jmbg: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

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
        const admin = data.data || data;
        
        setFormData({
          name: admin.name || '',
          surname: admin.surname || admin.surename || '',
          jmbg: admin.jmbg || '',
          email: admin.email || '',
          username: admin.username || '',
          password: '',
          confirmPassword: '',
          avatar: null
        });
        
        if (admin.photoPath || admin.avatar) {
          setPhotoPreview(admin.photoPath || admin.avatar);
        }
      } catch (error) {
        toast.error('Greška pri dohvatanju podataka o adminu.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Lozinke se ne poklapaju.');
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('surname', formData.surname);
      submitData.append('jmbg', formData.jmbg);
      submitData.append('email', formData.email);
      submitData.append('username', formData.username);
      
      if (formData.password) {
        submitData.append('password', formData.password);
      }
      
      if (formData.avatar) {
        submitData.append('avatar', formData.avatar);
      }

      const response = await fetch(`https://biblioteka.simonovicp.com/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (response.ok) {
        toast.success('Admin uspješno ažuriran!');
        setTimeout(() => {
          navigate(`/dashboard/admin/prikaz/${id}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          Object.values(errorData.errors).forEach(errorArray => {
            errorArray.forEach(error => toast.error(error));
          });
        } else {
          toast.error('Greška pri ažuriranju admina.');
        }
      }
    } catch (error) {
      toast.error('Greška pri povezivanju sa serverom.');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/admin/prikaz/${id}`);
  };

  return (
    <div className="izmjena-admin-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="izmjena-admin-loading-overlay">
          <div className="izmjena-admin-loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      
      <div className="izmjena-admin-header">
        <p className="breadcrumbs">Svi admini / Izmjena admina</p>
        <h2>Izmjena admina</h2>
      </div>

      <form onSubmit={handleSubmit} className="izmjena-admin-form">
        <div className="izmjena-admin-photo-upload">
          <label htmlFor="avatar" className="izmjena-admin-photo-box">
            {photoPreview ? (
              <img src={photoPreview} alt="Admin" />
            ) : (
              <div className="placeholder">
                <div className="icon">📷</div>
                <div>Dodaj sliku</div>
              </div>
            )}
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" "
            value={formData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="name">Ime</label>
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="surname"
            id="surname"
            placeholder=" "
            value={formData.surname}
            onChange={handleInputChange}
          />
          <label htmlFor="surname">Prezime</label>
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="jmbg"
            id="jmbg"
            placeholder=" "
            value={formData.jmbg}
            onChange={handleInputChange}
          />
          <label htmlFor="jmbg">JMBG</label>
        </div>

        <div className="floating-label-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={formData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="username"
            id="username"
            placeholder=" "
            value={formData.username}
            onChange={handleInputChange}
          />
          <label htmlFor="username">Korisničko ime</label>
        </div>

        <div className="floating-label-group">
          <input
            type="password"
            name="password"
            id="password"
            placeholder=" "
            value={formData.password}
            onChange={handleInputChange}
          />
          <label htmlFor="password">Nova lozinka (opcionalno)</label>
        </div>

        <div className="floating-label-group">
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <label htmlFor="confirmPassword">Potvrdi novu lozinku</label>
        </div>

        <div className="izmjena-admin-form-actions">
          <button type="submit" className="izmjena-admin-btn izmjena-admin-btn-primary">
            ✓ Sačuvaj
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            className="izmjena-admin-btn izmjena-admin-btn-secondary"
          >
            ✗ Poništi
          </button>
        </div>
      </form>
    </div>
  );
};

export default IzmjenaAdmin;
