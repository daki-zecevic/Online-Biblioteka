import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../Styles/DodavanjeUcenika.css';

const DodavanjeUcenika = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    uloga: 'Ucenik',
    jmbg: '',
    email: '',
    korisnickoIme: '',
    lozinka: '',
    potvrdaLozinke: '',
  });

  const [focused, setFocused] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem('authToken'); // Koristi token iz localStorage

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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getWrapperClass = (name) =>
    `input-wrapper ${(focused[name] || formData[name]) ? 'floating-label-visible' : ''}`;

  const handleSubmit = async () => {
    const {
      ime, prezime, jmbg, email, korisnickoIme, lozinka, potvrdaLozinke
    } = formData;

    if (!ime || !prezime || !jmbg || !email || !korisnickoIme || !lozinka || !potvrdaLozinke) {
      alert('Molimo popunite sva polja.');
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      alert('Lozinka i potvrda lozinke se ne poklapaju.');
      return;
    }

    const data = new FormData();
    data.append('role_id', formData.uloga === 'Ucenik' ? 2 : 1);
    data.append('name', ime);
    data.append('surname', prezime);
    data.append('jmbg', jmbg);
    data.append('email', email);
    data.append('username', korisnickoIme);
    data.append('password', lozinka);
    data.append('password_confirmation', potvrdaLozinke);

    if (imageFile) {
      data.append('photoPath', imageFile);
    }

    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/users/store', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Učenik uspešno dodat!');
        navigate('/dashboard/ucenici');
      } else {
        alert('Greška pri dodavanju učenika: ' + (result.message || 'Nepoznata greška.'));
      }
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
            value={formData.ime}
            onChange={handleChange}
            onFocus={() => handleFocus('ime')}
            onBlur={() => handleBlur('ime')}
            className="m-t-5"
            placeholder="Unesite ime.."
          />
        </div>

        <div className={getWrapperClass('prezime')}>
          <label>Prezime</label>
          <input
            type="text"
            name="prezime"
            value={formData.prezime}
            onChange={handleChange}
            onFocus={() => handleFocus('prezime')}
            onBlur={() => handleBlur('prezime')}
            className="m-t-5"
            placeholder="Unesite prezime.."
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
            value={formData.jmbg}
            onChange={handleChange}
            onFocus={() => handleFocus('jmbg')}
            onBlur={() => handleBlur('jmbg')}
            className="m-t-5"
            placeholder="Unesite JMBG.."
          />
        </div>

        <div className={getWrapperClass('email')}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            className="m-t-5"
            placeholder="Unesite e-mail.."
          />
        </div>

        <div className={getWrapperClass('korisnickoIme')}>
          <label>Korisničko ime</label>
          <input
            type="text"
            name="korisnickoIme"
            value={formData.korisnickoIme}
            onChange={handleChange}
            onFocus={() => handleFocus('korisnickoIme')}
            onBlur={() => handleBlur('korisnickoIme')}
            className="m-t-5"
            placeholder="Unesite korisničko ime.."
          />
        </div>

        <div className={getWrapperClass('lozinka')}>
          <label>Lozinka</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="lozinka"
            value={formData.lozinka}
            onChange={handleChange}
            onFocus={() => handleFocus('lozinka')}
            onBlur={() => handleBlur('lozinka')}
            className="m-t-5"
            placeholder="Unesite lozinku.."
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        </div>

        <div className={getWrapperClass('potvrdaLozinke')}>
          <label>Potvrda lozinke</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            name="potvrdaLozinke"
            value={formData.potvrdaLozinke}
            onChange={handleChange}
            onFocus={() => handleFocus('potvrdaLozinke')}
            onBlur={() => handleBlur('potvrdaLozinke')}
            className="m-t-5"
            placeholder="Ponovno unesite lozinku.."
          />
          <span className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </span>
        </div>

        <div className="m-t-5 align-right">
          <button className="button-add" onClick={handleSubmit}>🗸 SAČUVAJ</button>
          <button className="cancel-btn" onClick={() => navigate('/dashboard/ucenici')}>X PONIŠTI</button>
        </div>
      </div>
    </div>
  );
};

export default DodavanjeUcenika;
