import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classes from '../Styles/IzmjeniBibliotekara.css';

const API_BASE = 'http://localhost:8000';

const IzmijeniBibliotekara = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    slika: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Nije moguće dohvatiti podatke');
        return res.json();
      })
      .then(data => {
        setFormData({
          ime: data.name || '',
          prezime: data.last_name || '',
          email: data.email || '',
          slika: data.image || ''
        });
      })
      .catch(err => console.error('Greška pri učitavanju:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    fetch(`${API_BASE}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Greška pri izmjeni');
        return res.json();
      })
      .then(() => {
        navigate('/dashboard/bibliotekari');
      })
      .catch(err => {
        console.error(err);
        alert('Došlo je do greške pri izmjeni.');
      });
  };

  return (
    <div className="edit-bibliotekar-container">
      <h2>Izmijeni bibliotekara</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="ime" value={formData.ime} onChange={handleChange} placeholder="Ime" required />
        <input type="text" name="prezime" value={formData.prezime} onChange={handleChange} placeholder="Prezime" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="slika" value={formData.slika} onChange={handleChange} placeholder="URL slike" />
        <button type="submit">Sačuvaj izmjene</button>
      </form>
    </div>
  );
};

export default IzmijeniBibliotekara;
