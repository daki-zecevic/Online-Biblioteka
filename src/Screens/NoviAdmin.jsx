import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/NoviAdmin.css';

const NoviAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role_id: 3,
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

  const [errors, setErrors] = useState({});
  
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
     setErrors((prev) => ({
      ...prev,
      [name]: '', 
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.ime) newErrors.ime = 'Morate unijeti ime!';
    if (!formData.prezime) newErrors.prezime = 'Morate unijeti prezime!';
    if (!formData.jmbg) newErrors.jmbg = 'Morate unijeti JMBG!';
    if (!formData.email) newErrors.email = 'Morate unijeti E-mail!';
    if (!formData.korisnickoIme) newErrors.korisnickoIme = 'Morate unijeti korisničko ime!';
    if (!formData.sifra) newErrors.sifra = 'Morate unijeti šifru!';
    if (!formData.ponoviSifru) newErrors.ponoviSifru = 'Morate ponoviti šifru!';
   
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Accept': 'application/json; charset=utf-8',
         'Authorization': 'Bearer b3Rvcmlub2xhcmluZ29sb2dpamE=', },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
         alert('Admin uspješno dodat!');
        navigate('/dashboard/admin');
      } else {
        alert(data.message || 'Greška pri dodavanju admina.');
      }
    } catch (error) {
      alert('Greška pri povezivanju sa serverom.');
    }
  }
};

  return (
    <div className="dodaj-bibliotekara-container">
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

        <input
          type="text"
          name="ime"
          placeholder="Unesite ime.."
          value={formData.ime}
          onChange={handleChange}
        />
         {errors.ime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ime}</div>}

        <input
          type="text"
          name="prezime"
          placeholder="Unesite prezime.."
          value={formData.prezime}
          onChange={handleChange}
        />
         {errors.prezime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.prezime}</div>}

        <select disabled>
          <option>Admin</option>
        </select>

        <input
          type="text"
          name="jmbg"
          placeholder="Unesite JMBG.."
          value={formData.jmbg}
          onChange={handleChange}
        />
         {errors.jmbg && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.jmbg}</div>}

        <input
          type="email"
          name="email"
          placeholder="Unesite E-mail.."
          value={formData.email}
          onChange={handleChange}
        />
         {errors.email && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</div>}

        <input
          type="text"
          name="korisnickoIme"
          placeholder="Unesite korisničko ime.."
          value={formData.korisnickoIme}
          onChange={handleChange}
        />
         {errors.korisnickoIme && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.korisnickoIme}</div>}

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
         {errors.sifra && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.sifra}</div>}

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
         {errors.ponoviSifru && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ponoviSifru}</div>}

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
