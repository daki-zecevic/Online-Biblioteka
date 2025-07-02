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

  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        navigate('/login');
      } else {
        setMessage(data.message || 'An error occurred.');
      }  
    } catch {
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
        <input
  name="firstName"
  type="text"
  placeholder="First Name"
  className="m-t-20 p-10 input"
  value={formData.firstName}
  onChange={handleChange}
  required
/>

<input
  name="lastName"
  type="text"
  placeholder="Last Name"
  className="m-t-20 p-10 border"
  value={formData.lastName}
  onChange={handleChange}
  required
/>

<input
  name="email"
  type="email"
  placeholder="Email"
  className="m-t-20 p-10 border"
  value={formData.email}
  onChange={handleChange}
  required
/>

<input
  name="username"
  type="text"
  placeholder="Username"
  className="m-t-20 p-10 border"
  value={formData.username}
  onChange={handleChange}
  required
  pattern="^[a-zA-Z0-9_]{3,15}$"
  title="Username must be 3-15 characters and contain only letters, numbers, and underscores."
/>

<input
  name="password"
  type="password"
  placeholder="Password"
  className="m-t-20 p-10 border"
  value={formData.password}
  onChange={handleChange}
  required
  minLength={6}
/>

<input
  name="confirmPassword"
  type="password"
  placeholder="Confirm Password"
  className="m-t-20 p-10 border"
  value={formData.confirmPassword}
  onChange={handleChange}
  required
  minLength={6}
/>
        <button onClick={handleRegister} className="m-t-20 p-10 border button">REGISTER</button>
        <button onClick={handleLogin} className="m-t-20 p-10 button-white">RETURN TO LOGIN</button>

        {message && <p className="m-t-20">{message}</p>}

        <p className="m-t-20 p">©2025 ICT Cortex. All rights reserved</p>
      </div>
    </div>
  );
}

export default Register;
