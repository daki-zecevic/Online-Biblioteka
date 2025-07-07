import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../Styles/DodavanjeUcenika.css';

const DodavanjeUcenika = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    ime: '',
    prezime: '',
    uloga: 'Ucenik',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    lozinka: '',
    potvrdaLozinke: '',
    photoPath: '', // dodat
  });

  const [focused, setFocused] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = 'lRtjkr3X3OqEqxliGFYZwC8zRLw52twniASCUj2B';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (name) => {
    setFocused(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name) => {
    setFocused(prev => ({ ...prev, [name]: false }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData(prev => ({ ...prev, photoPath: url })); // Postavi preview kao photoPath
    }
  };

  const getWrapperClass = (name) =>
    `input-wrapper ${(focused[name] || formData[name]) ? 'floating-label-visible' : ''}`;

  const handleSubmit = async () => {
    if (
      !formData.ime ||
      !formData.prezime ||
      !formData.jmbg ||
      !formData.email ||
      !formData.korisnickoIme ||
      !formData.lozinka ||
      !formData.potvrdaLozinke
    ) {
      alert('Molimo popunite sva polja.');
      return;
    }
    if (formData.lozinka !== formData.potvrdaLozinke) {
      alert('Lozinka i potvrda lozinke se ne poklapaju.');
      return;
    }

    const body = {
      role_id: formData.uloga === 'Ucenik' ? 2 : 1,
      name: formData.ime,
      surname: formData.prezime,
      jmbg: formData.jmbg,
      email: formData.email,
      username: formData.korisnickoIme,
      password: formData.lozinka,
      password_confirmation: formData.potvrdaLozinke,
      photoPath: formData.photoPath || 'http://library.test/img/profile.jpg',
    };

    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Greška pri dodavanju učenika: ' + (errorData.message || response.statusText));
        return;
      }

      alert('Učenik uspešno dodat!');
      navigate('/dashboard/ucenici');
    } catch (error) {
      alert('Greška pri komunikaciji sa serverom: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="container-header column w-40">
        <div className="input-wrapper floating-label-visible">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="m-t-5 img"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="img-preview m-t-5" />
          )}
        </div>

        <div className={getWrapperClass('ime')}>
          <label>Ime</label>
          <input
            type="text"
            name="ime"
            placeholder="Unesite ime.."
            value={formData.ime}
            onChange={handleChange}
            onFocus={() => handleFocus('ime')}
            onBlur={() => handleBlur('ime')}
            className="m-t-5"
          />
        </div>

        <div className={getWrapperClass('prezime')}>
          <label>Prezime</label>
          <input
            type="text"
            name="prezime"
            placeholder="Unesite prezime.."
            value={formData.prezime}
            onChange={handleChange}
            onFocus={() => handleFocus('prezime')}
            onBlur={() => handleBlur('prezime')}
            className="m-t-5"
          />
        </div>

        <div className={getWrapperClass('uloga')}>
          <label>Uloga</label>
          <select
            name="uloga"
            value={formData.uloga}
            onChange={handleChange}
            onFocus={() => handleFocus('uloga')}
            onBlur={() => handleBlur('uloga')}
            className="m-t-5"
          >
            <option value="Ucenik">Učenik</option>
            <option value="Bibliotekar">Bibliotekar</option>
          </select>
        </div>

        <div className={getWrapperClass('jmbg')}>
          <label>JMBG</label>
          <input
            type="text"
            name="jmbg"
            placeholder="Unesite JMBG.."
            value={formData.jmbg}
            onChange={handleChange}
            onFocus={() => handleFocus('jmbg')}
            onBlur={() => handleBlur('jmbg')}
            className="m-t-5"
          />
        </div>

        <div className={getWrapperClass('email')}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Unesite e-mail.."
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            className="m-t-5"
          />
        </div>

        <div className={getWrapperClass('korisnickoIme')}>
          <label>Korisničko ime</label>
          <input
            type="text"
            name="korisnickoIme"
            placeholder="Unesite korisničko ime.."
            value={formData.korisnickoIme}
            onChange={handleChange}
            onFocus={() => handleFocus('korisnickoIme')}
            onBlur={() => handleBlur('korisnickoIme')}
            className="m-t-5"
          />
        </div>

        <div className={getWrapperClass('lozinka')}>
          <label>Lozinka</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="lozinka"
            placeholder="Unesite željenu šifru.."
            value={formData.lozinka}
            onChange={handleChange}
            onFocus={() => handleFocus('lozinka')}
            onBlur={() => handleBlur('lozinka')}
            className="m-t-5"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        </div>

        <div className={getWrapperClass('potvrdaLozinke')}>
          <label>Potvrda lozinke</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            name="potvrdaLozinke"
            placeholder="Ponovno unesite šifru.."
            value={formData.potvrdaLozinke}
            onChange={handleChange}
            onFocus={() => handleFocus('potvrdaLozinke')}
            onBlur={() => handleBlur('potvrdaLozinke')}
            className="m-t-5"
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirm(prev => !prev)}
          >
            {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        </div>

        <div className="m-t-5 align-right ">
          <button className="button-add" onClick={handleSubmit}> 🗸 SAČUVAJ</button>
          <button className="cancel-btn" onClick={() => navigate('/dashboard/ucenici')}> X Poništi</button>
        </div>
      </div>
    </div>
  );
};

export default DodavanjeUcenika;
