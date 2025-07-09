import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Styles/NoviAdmin.css';

const NoviAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role_id: 3,
    name: '',
    surename: '',
    jmbg: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    photoPath: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [slika, setSlika] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSlika(imageUrl);
      setFormData((prev) => ({
        ...prev,
        photoPath: imageUrl,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Morate unijeti ime!';
    if (!formData.surname) newErrors.surname = 'Morate unijeti prezime!';
    if (!formData.jmbg) newErrors.jmbg = 'Morate unijeti JMBG!';
    if (!formData.email) newErrors.email = 'Morate unijeti E-mail!';
    if (!formData.username) newErrors.username = 'Morate unijeti korisničko ime!';
    if (!formData.password) newErrors.password = 'Morate unijeti šifru!';
    if (!formData.password_confirmation) newErrors.password_confirmation = 'Morate ponoviti šifru!';

    setErrors(newErrors);
    const token = localStorage.getItem('authToken');

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Admin uspješno dodat!');
          setTimeout(() => {
            navigate('/dashboard/admin');
          }, 1200);
        }
        else {
          toast.error(data.message || 'Unauthenticated');
        }
      } catch (error) {
        toast.error('Unauthenticated');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="dodaj-bibliotekara-container">
      <ToastContainer position='top-center' />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="form-header">
        <h2>Novi Admin</h2>
        <p className="breadcrumbs">Svi Admini / Novi Admin</p>
      </div>

      <form className="bibliotekar-form" onSubmit={handleSubmit}>
        <div className="photo-upload">
          <div className="photo-box" onClick={handleImageClick}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {slika ? (
              <img
                src={slika}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <div className="photo-preview">
                <span style={{ fontSize: '30px' }}>🖼️</span>
                <p>Add photo</p>
              </div>
            )}
          </div>
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="name">Ime</label>
          {errors.name && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</div>}
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="surname"
            id="surname"
            placeholder=" "
            value={formData.surname}
            onChange={handleChange}
          />
          <label htmlFor="surname">Prezime</label>
          {errors.surname && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.surname}</div>}
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="jmbg"
            id="jmbg"
            placeholder=" "
            value={formData.jmbg}
            onChange={handleChange}
          />
          <label htmlFor="jmbg">JMBG</label>
          {errors.jmbg && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.jmbg}</div>}
        </div>

        <div className="floating-label-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="email">E-mail</label>
          {errors.email && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</div>}
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="username"
            id="username"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="username">Korisničko ime</label>
          {errors.username && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="password">Šifra</label>
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </button>
          {errors.password && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.password}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="password_confirmation"
            id="password_confirmation"
            required
            placeholder=" "
            value={formData.password_confirmation}
            onChange={handleChange}
          />
          <label htmlFor="password_confirmation">Ponovite šifru</label>
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            👁️
          </button>
          {errors.password_confirmation && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.password_confirmation}</div>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="sacuvaj-btn">✓ SAČUVAJ</button>
          <button
            type="button"
            className="ponisti-btn"
            onClick={() => navigate('/Dashboard/admin')}
          >
            ✗ PONIŠTI
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoviAdmin;
