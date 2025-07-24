import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/NoviAdmin.css';

// SVG Icons for password visibility
const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
    <path fill="currentColor" d="M2.85 2.15a.5.5 0 0 0-.707.707l11 11a.5.5 0 0 0 .707-.707zM15 8.88c-.434.594-.885 1.12-1.35 1.59l-.707-.707q.644-.644 1.25-1.47a.5.5 0 0 0 .047-.511l-.045-.075c-1.75-2.4-3.72-3.62-5.93-3.7l-.256-.005a6 6 0 0 0-.787.048l-.862-.862a7.3 7.3 0 0 1 1.65-.187c2.66 0 5 1.39 6.99 4.12a1.5 1.5 0 0 1 0 1.77z"></path>
    <path fill="currentColor" d="M11 7.83A3.007 3.007 0 0 0 8.17 5zm-9.78-1q.551-.72 1.14-1.3l.707.707q-.644.644-1.25 1.47l-.047.079a.5.5 0 0 0 0 .432l.044.074c1.75 2.4 3.72 3.62 5.93 3.7l.256.005q.399 0 .787-.048l.861.86a7.3 7.3 0 0 1-1.65.188c-2.66 0-5-1.39-6.99-4.12l-.082-.125a1.5 1.5 0 0 1 .082-1.645l.215-.287z"></path>
    <path fill="currentColor" d="M7.83 11A3.007 3.007 0 0 1 5 8.17z"></path>
  </svg>
);

const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"></path>
      <circle cx={12} cy={12} r={3}></circle>
    </g>
  </svg>
);

const DodajBibliotekara = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    sifra: '',
    ponoviSifru: '',
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
    
    if (!formData.ime) newErrors.ime = 'Morate unijeti ime!';
    if (!formData.prezime) newErrors.prezime = 'Morate unijeti prezime!';
    if (!formData.jmbg) newErrors.jmbg = 'Morate unijeti JMBG!';
    if (!formData.email) newErrors.email = 'Morate unijeti E-mail!';
    if (!formData.korisnickoIme) newErrors.korisnickoIme = 'Morate unijeti korisničko ime!';
    if (!formData.sifra) newErrors.sifra = 'Morate unijeti šifru!';
    if (!formData.ponoviSifru) newErrors.ponoviSifru = 'Morate ponoviti šifru!';
    if (formData.sifra !== formData.ponoviSifru) {
      newErrors.ponoviSifru = 'Šifre se ne poklapaju!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

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

        if (response.ok) {
          const lokalniBibliotekari = JSON.parse(localStorage.getItem('bibliotekari')) || [];
          lokalniBibliotekari.push(payload);
          localStorage.setItem('bibliotekari', JSON.stringify(lokalniBibliotekari));

          toast.success('Bibliotekar uspješno dodat!');
          setTimeout(() => {
            navigate('/dashboard/bibliotekari');
          }, 1200);
        } else {
          toast.error('Greška prilikom dodavanja bibliotekara');
        }
      } catch (error) {
        console.error(error);
        toast.error('Greška pri povezivanju sa serverom');
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
      <h2 className="novi-admin-title">Novi Bibliotekar</h2>
      <p className="novi-admin-breadcrumbs">Svi Bibliotekari / Novi Bibliotekar</p>

      <form className="novi-admin-form" onSubmit={handleSubmit}>
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
                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm1-2h12l-3.75-5l-3 4L9 13zm-1 2V5z"></path>
                </svg>
                <p>Add photo</p>
              </div>
            )}
          </div>
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="ime"
            id="ime"
            placeholder=" "
            value={formData.ime}
            onChange={handleChange}
          />
          <label htmlFor="ime">Ime</label>
          {errors.ime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ime}</div>}
        </div>

        <div className="floating-label-group">
          <input
            type="text"
            name="prezime"
            id="prezime"
            placeholder=" "
            value={formData.prezime}
            onChange={handleChange}
          />
          <label htmlFor="prezime">Prezime</label>
          {errors.prezime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.prezime}</div>}
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
            name="korisnickoIme"
            id="korisnickoIme"
            placeholder=" "
            value={formData.korisnickoIme}
            onChange={handleChange}
          />
          <label htmlFor="korisnickoIme">Korisničko ime</label>
          {errors.korisnickoIme && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.korisnickoIme}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="sifra"
            id="sifra"
            placeholder=" "
            value={formData.sifra}
            onChange={handleChange}
          />
          <label htmlFor="sifra">Šifra</label>
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
          {errors.sifra && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.sifra}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="ponoviSifru"
            id="ponoviSifru"
            placeholder=" "
            value={formData.ponoviSifru}
            onChange={handleChange}
          />
          <label htmlFor="ponoviSifru">Ponovite šifru</label>
          <button
            type="button"
            className="toggle-password"
            tabIndex={-1}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
          {errors.ponoviSifru && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ponoviSifru}</div>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="izmjena-admin-btn izmjena-admin-btn-primary">✓ SAČUVAJ</button>
          <button
            type="button"
            className="izmjena-admin-btn izmjena-admin-btn-secondary"
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
