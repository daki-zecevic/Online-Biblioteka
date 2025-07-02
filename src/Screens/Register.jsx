import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [focusedInput, setFocusedInput] = useState(null);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const requestBody = {
      name: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      device: navigator.userAgent
    };

    try {
      const res = await fetch('https://biblioteka.simonovicp.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer b3Rvcmlub2xhcmluZ29sb2dpamE='
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Registration successful!");
        navigate('/login');
      } else {
        // Ako postoji validaciona greska na email polju, posebno obavestenje
        if (data.errors && data.errors.email) {
          if (data.errors.email.includes("Polje email već postoji.")) {
            setMessage("Email je već zauzet, molimo koristite drugi.");
            return;
          }
        }

        if (data.errors) {
          // Prikazi prvu gresku iz errors objekta
          const firstError = Object.values(data.errors)[0][0];
          setMessage(firstError);
        } else if (data.error) {
          setMessage(data.error);
        } else if (data.message) {
          setMessage(data.message);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to the server.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="background">
      <div className="column align-center w-25 margin m-t-150 p-20 background-white">
        <h1>Register</h1>

        {[
          { name: "firstName", type: "text", label: "First Name" },
          { name: "lastName", type: "text", label: "Last Name" },
          { name: "email", type: "email", label: "Email" },
          { name: "username", type: "text", label: "Username", pattern: "^[a-zA-Z0-9_]{3,15}$", title: "Username must be 3-15 characters and contain only letters, numbers, and underscores." },
          { name: "password", type: "password", label: "Password", minLength: 6 },
          { name: "confirmPassword", type: "password", label: "Confirm Password", minLength: 6 }
        ].map(({ name, type, label, pattern, title, minLength }) => (
          <div
            key={name}
            className={`input-wrapper m-t-20 border ${formData[name] || focusedInput === name ? "floating-label-visible" : ""}`}
          >
            <input
              name={name}
              type={type}
              placeholder={focusedInput === name ? '' : label}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => setFocusedInput(name)}
              onBlur={() => setFocusedInput(null)}
              required
              pattern={pattern}
              title={title}
              minLength={minLength}
              className="p-10"
            />
            <label htmlFor={name}>{label}</label>
          </div>
        ))}

        <button onClick={handleRegister} className="m-t-20 p-10 border button">REGISTER</button>
        <button onClick={handleLogin} className="m-t-20 p-10 button-white">RETURN TO LOGIN</button>

        {message && <p className="m-t-20">{message}</p>}

        <p className="m-t-20 p">©2025 ICT Cortex. All rights reserved</p>
      </div>
    </div>
  );
};

export default Register;
