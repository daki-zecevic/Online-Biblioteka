import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovde možete poslati podatke backendu
    console.log('Forma poslata:', formData);
  };

  return (
    <div className="dodaj-bibliotekara-container">
      <div className="form-header">
        <p className="breadcrumbs">Svi Bibliotekari / Novi Bibliotekar</p>
        <h2>Novi Bibliotekar</h2>
      </div>

      <form className="bibliotekar-form" onSubmit={handleSubmit}>
        <div className="photo-upload">
          <div className="photo-box">
            <div className="photo-preview">
              <span>🖼️</span>
              <p>Add photo</p>
            </div>
          </div>
        </div>

        <input
          type="text"
          name="ime"
          placeholder="Unesite ime.."
          value={formData.ime}
          onChange={handleChange}
        />

        <input
          type="text"
          name="prezime"
          placeholder="Unesite prezime.."
          value={formData.prezime}
          onChange={handleChange}
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
        />

        <input
          type="email"
          name="email"
          placeholder="Unesite E-mail.."
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="korisnickoIme"
          placeholder="Unesite korisničko ime.."
          value={formData.korisnickoIme}
          onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="sifra"
            placeholder="Unesite željenu šifru.."
            value={formData.sifra}
            onChange={handleChange}
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
            placeholder="Ponovi unesite šifru.."
            value={formData.ponoviSifru}
            onChange={handleChange}
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
            onClick={() => navigate('/Dashboard/Bibliotekari')}
          >
            ✗ PONIŠTI
          </button>
        </div>
      </form>
    </div>
  );
};

export default DodajBibliotekara;
