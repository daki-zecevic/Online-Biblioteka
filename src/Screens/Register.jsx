import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Register.css';
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

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
        toast.success(data.message || "Registration successful!");
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        if (data.errors && data.errors.email) {
          if (data.errors.email.includes("Polje email već postoji.")) {
            toast.error("Email je već zauzet, molimo koristite drugi.");
            return;
          }
        }

        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          toast.error(firstError);
        } else if (data.error) {
          toast.error(data.error);
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error('An unknown error occurred.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to the server.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-background">
      <style>
        {`
          .register-background .floating-label-group label {
            background: #f8f9fa !important;
          }
          
          .register-background .background-white {
            background: #f8f9fa !important;
          }
          
          .register-submit-btn {
            background-color: rgba(51, 146, 234, 1) !important;
            color: white !important;
            border: rgb(131, 131, 131) 1px solid !important;
            font-family: "Roboto", sans-serif !important;
            font-weight: 500 !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: background-color 0.3s ease !important;
            width: 100% !important;
            min-height: auto !important;
            font-size: inherit !important;
            box-sizing: border-box !important;
          }
          
          .register-submit-btn:hover:not(:disabled) {
            background-color: rgba(51, 146, 234, 0.9) !important;
          }
          
          .register-submit-btn:disabled {
            background-color: #6c757d !important;
            border-color: #6c757d !important;
            opacity: 0.6 !important;
            cursor: not-allowed !important;
          }
        `}
      </style>
      <ToastContainer position='top-center' />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="column align-center w-25 margin m-t-150 p-20 background-white">
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <div className="floating-label-group m-t-20">
            <input
              name="firstName"
              type="text"
              id="firstName"
              placeholder=" "
              value={formData.firstName}
              onChange={handleChange}
            />
            <label htmlFor="firstName">First Name</label>
            {errors.firstName && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.firstName}</div>}
          </div>

          <div className="floating-label-group m-t-20">
            <input
              name="lastName"
              type="text"
              id="lastName"
              placeholder=" "
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor="lastName">Last Name</label>
            {errors.lastName && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.lastName}</div>}
          </div>

          <div className="floating-label-group m-t-20">
            <input
              name="email"
              type="email"
              id="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
            {errors.email && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</div>}
          </div>

          <div className="floating-label-group m-t-20">
            <input
              name="username"
              type="text"
              id="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              pattern="^[a-zA-Z0-9_]{3,15}$"
              title="Username must be 3-15 characters and contain only letters, numbers, and underscores."
            />
            <label htmlFor="username">Username</label>
            {errors.username && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}
          </div>

          <div className="floating-label-group password-wrapper m-t-20">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              minLength={6}
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="toggle-password"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
            {errors.password && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.password}</div>}
          </div>

          <div className="floating-label-group password-wrapper m-t-20">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <button
              type="button"
              className="toggle-password"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
            {errors.confirmPassword && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="m-t-20 p-10 register-submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'REGISTER'}
          </button>
        </form>

        <button onClick={handleLogin} className="m-t-20 p-10 button-white">RETURN TO LOGIN</button>

        <p className="m-t-20 p">©2025 ICT Cortex. All rights reserved</p>
      </div>
    </div>
  );
};

export default Register;
