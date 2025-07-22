import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/BibliotekarForma.css';

const DodajBibliotekara = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    sifra: '',
    ponoviSifru: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [slika, setSlika] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSlika(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sifra !== formData.ponoviSifru) {
      alert('Šifre se ne poklapaju!');
      return;
    }

    const payload = {
      id: Date.now(),
      ime: formData.ime,
      prezime: formData.prezime,
      jmbg: formData.jmbg,
      email: formData.email,
      korisnickoIme: formData.korisnickoIme,
      lozinka: formData.sifra,
      uloga: 'Bibliotekar',
      slika: slika,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('https://library-api-k5b6.onrender.com/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Greška prilikom slanja zahteva.');
      }

      const data = await response.json();

      const lokalniBibliotekari = JSON.parse(localStorage.getItem('bibliotekari')) || [];
      lokalniBibliotekari.push(payload);
      localStorage.setItem('bibliotekari', JSON.stringify(lokalniBibliotekari));

      alert('Bibliotekar uspešno dodat!');
      navigate('/dashboard/bibliotekari');
    } catch (error) {
      console.error(error);
      alert('Došlo je do greške prilikom dodavanja bibliotekara.');
    }
  };

  return (
    <div className="dodaj-bibliotekara-container">
      <div className="form-header">
        <h2>Novi Bibliotekar</h2>
        <p className="breadcrumbs">Svi Bibliotekari / Novi Bibliotekar</p>
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
                <p>Dodaj fotografiju</p>
              </div>
            )}
          </div>
        </div>

        <input
          type="text"
          name="ime"
          placeholder="Unesite ime.."
          value={formData.ime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="prezime"
          placeholder="Unesite prezime.."
          value={formData.prezime}
          onChange={handleChange}
          required
        />

        <select disabled>
          <option>Bibliotekar</option>
        </select>

        <input
          type="text"
          name="jmbg"
          placeholder="Unesite JMBG.."
          value={formData.jmbg}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Unesite E-mail.."
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="korisnickoIme"
          placeholder="Unesite korisničko ime.."
          value={formData.korisnickoIme}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="sifra"
            placeholder="Unesite šifru.."
            value={formData.sifra}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </button>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="ponoviSifru"
            placeholder="Ponovo unesite šifru.."
            value={formData.ponoviSifru}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            👁️
          </button>
        </div>

        <div className="form-buttons">
          <button type="submit" className="sacuvaj-btn">✓ SAČUVAJ</button>
          <button
            type="button"
            className="ponisti-btn"
            onClick={() => navigate('/dashboard/bibliotekari')}
          >
            ✗ PONIŠTI
          </button>
        </div>
      </form>
    </div>
  );
};

export default DodajBibliotekara;
