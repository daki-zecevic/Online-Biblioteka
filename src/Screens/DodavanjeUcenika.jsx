import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/NoviAdmin.css';

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

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DodavanjeUcenika = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    lozinka: '',
    potvrdaLozinke: '',
    photoPath: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
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
    if (!formData.lozinka) newErrors.lozinka = 'Morate unijeti lozinku!';
    if (!formData.potvrdaLozinke) newErrors.potvrdaLozinke = 'Morate ponoviti lozinku!';
    if (formData.lozinka !== formData.potvrdaLozinke) {
      newErrors.potvrdaLozinke = 'Lozinke se ne poklapaju!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      let base64Image = '';
      if (imageFile) {
        base64Image = await toBase64(imageFile);
      }

      const data = {
        role_id: 2,
        name: formData.ime,
        surname: formData.prezime,
        jmbg: formData.jmbg,
        email: formData.email,
        username: formData.korisnickoIme,
        password: formData.lozinka,
        password_confirmation: formData.potvrdaLozinke,
        photoPath: base64Image || null
      };

      try {
        const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('Učenik uspješno dodat!');
          setTimeout(() => {
            navigate('/dashboard/ucenici');
          }, 1200);
        } else {
          if (result.errors) {
            setErrors(result.errors);
          }
          toast.error(result.message || 'Greška pri dodavanju učenika');
        }
      } catch {
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
      <h2 className="novi-admin-title">Novi Učenik</h2>
      <p className="novi-admin-breadcrumbs">Svi učenici / Novi učenik</p>

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
            {imagePreview ? (
              <img
                src={imagePreview}
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
          <input type="text" name="ime" id="ime" placeholder=" " value={formData.ime} onChange={handleChange} />
          <label htmlFor="ime">Ime</label>
          {errors.ime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.ime}</div>}
        </div>

        <div className="floating-label-group">
          <input type="text" name="prezime" id="prezime" placeholder=" " value={formData.prezime} onChange={handleChange} />
          <label htmlFor="prezime">Prezime</label>
          {errors.prezime && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.prezime}</div>}
        </div>

        <div className="floating-label-group">
          <input type="text" name="jmbg" id="jmbg" placeholder=" " value={formData.jmbg} onChange={handleChange} />
          <label htmlFor="jmbg">JMBG</label>
          {errors.jmbg && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.jmbg}</div>}
        </div>

        <div className="floating-label-group">
          <input type="email" name="email" id="email" placeholder=" " value={formData.email} onChange={handleChange} />
          <label htmlFor="email">E-mail</label>
          {errors.email && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</div>}
        </div>

        <div className="floating-label-group">
          <input type="text" name="korisnickoIme" id="korisnickoIme" placeholder=" " value={formData.korisnickoIme} onChange={handleChange} />
          <label htmlFor="korisnickoIme">Korisničko ime</label>
          {errors.korisnickoIme && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.korisnickoIme}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input type={showPassword ? 'text' : 'password'} name="lozinka" id="lozinka" placeholder=" " value={formData.lozinka} onChange={handleChange} />
          <label htmlFor="lozinka">Lozinka</label>
          <button type="button" className="toggle-password" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
          {errors.lozinka && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.lozinka}</div>}
        </div>

        <div className="floating-label-group password-wrapper">
          <input type={showConfirm ? 'text' : 'password'} name="potvrdaLozinke" id="potvrdaLozinke" placeholder=" " value={formData.potvrdaLozinke} onChange={handleChange} />
          <label htmlFor="potvrdaLozinke">Potvrda lozinke</label>
          <button type="button" className="toggle-password" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
          {errors.potvrdaLozinke && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.potvrdaLozinke}</div>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="izmjena-admin-btn izmjena-admin-btn-primary">✓ SAČUVAJ</button>
          <button type="button" className="izmjena-admin-btn izmjena-admin-btn-secondary" onClick={() => navigate('/dashboard/ucenici')}>✗ PONIŠTI</button>
        </div>
      </form>
    </div>
  );
};

export default DodavanjeUcenika;
