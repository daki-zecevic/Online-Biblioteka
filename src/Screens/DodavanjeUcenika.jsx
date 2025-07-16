import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../Styles/DodavanjeUcenika.css';

const DodavanjeUcenika = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    lozinka: '',
    potvrdaLozinke: ''
  });

  const [focused, setFocused] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem('authToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFocus = (name) => {
    setFocused((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name) => {
    setFocused((prev) => ({ ...prev, [name]: false }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getWrapperClass = (name) =>
    `input-wrapper ${(focused[name] || formData[name]) ? 'floating-label-visible' : ''} ${errors[name] ? 'input-error' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.ime.trim()) newErrors.ime = 'Morate unijeti ime!';
    if (!formData.prezime.trim()) newErrors.prezime = 'Morate unijeti prezime!';
    if (!formData.jmbg.trim()) newErrors.jmbg = 'Morate unijeti JMBG!';
    if (!formData.email.trim()) newErrors.email = 'Morate unijeti email!';
    if (!formData.korisnickoIme.trim()) newErrors.korisnickoIme = 'Morate unijeti korisničko ime!';
    if (!formData.lozinka.trim()) newErrors.lozinka = 'Morate unijeti lozinku!';
    if (!formData.potvrdaLozinke.trim()) {
      newErrors.potvrdaLozinke = 'Morate ponovo unijeti lozinku!';
    } else if (formData.lozinka !== formData.potvrdaLozinke) {
      newErrors.potvrdaLozinke = 'Lozinke se ne poklapaju!';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = new FormData();
    data.append('role_id', 2);
    data.append('name', formData.ime);
    data.append('surname', formData.prezime);
    data.append('jmbg', formData.jmbg);
    data.append('email', formData.email);
    data.append('username', formData.korisnickoIme);
    data.append('password', formData.lozinka);
    data.append('password_confirmation', formData.potvrdaLozinke);
    if (imageFile) {
      data.append('photoPath', imageFile);
    }

    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Učenik uspešno dodat!');
        navigate('/dashboard/ucenici');
      } else {
        alert('Greška: ' + (result.message || 'Nepoznata greška.'));
      }
    } catch (error) {
      alert('Greška u komunikaciji sa serverom: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dodaj-ucenika-container">
      <div className="form-header">
        <h2>Novi Učenik</h2>
        <p className="breadcrumbs">Svi učenici / Novi učenik</p>
      </div>

      <div className="ucenik-form w-40">
        <div className="photo-upload">
          <div className="photo-box" onClick={handleImageClick}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="img-preview" />
            ) : (
              <div className="photo-preview">
                <span style={{ fontSize: '30px' }}>🖼️</span>
                <p>Dodaj fotografiju</p>
              </div>
            )}
          </div>
        </div>

        {[
          { label: 'Ime', name: 'ime' },
          { label: 'Prezime', name: 'prezime' },
          { label: 'JMBG', name: 'jmbg' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Korisničko ime', name: 'korisnickoIme' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name} className={getWrapperClass(name)}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => handleFocus(name)}
              onBlur={() => handleBlur(name)}
              placeholder={`Unesite ${label.toLowerCase()}...`}
            />
            {errors[name] && <span className="error-message">{errors[name]}</span>}
          </div>
        ))}

        {[
          { label: 'Lozinka', name: 'lozinka', visible: showPassword, toggle: setShowPassword },
          { label: 'Potvrda lozinke', name: 'potvrdaLozinke', visible: showConfirm, toggle: setShowConfirm },
        ].map(({ label, name, visible, toggle }) => (
          <div key={name} className={getWrapperClass(name)}>
            <label>{label}</label>
            <input
              type={visible ? 'text' : 'password'}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => handleFocus(name)}
              onBlur={() => handleBlur(name)}
              placeholder={`Unesite ${label.toLowerCase()}...`}
            />
            <span className="toggle-password" onClick={() => toggle((prev) => !prev)}>
              {visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
            {errors[name] && <span className="error-message">{errors[name]}</span>}
          </div>
        ))}

        <div className="form-buttons">
          <button type="submit" className="sacuvaj-btn">✓ SAČUVAJ</button>
          <button type="button" className="ponisti-btn" onClick={() => navigate('/dashboard/ucenici')}>✗ PONIŠTI</button>
        </div>
      </div>
    </form>
  );
};

export default DodavanjeUcenika;
