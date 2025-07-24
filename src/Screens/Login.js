import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Login.css';
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

   const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer b3Rvcmlub2xhcmluZ29sb2dpamE=',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          device: 'DivajsNejm'
        })
      });

      const data = await response.json();

      if (!data.success) {
        toast.error('Invalid login credentials. Please try again.');
        setLoading(false); 
        return;
      }

      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('username', data.data.name);
      toast.success('Login successful!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }; 

   return (
    <div className="login-container">
      <style>
        {`
          .login-container .floating-label-group label {
            background: #f8f9fa !important;
          }
          
          .login-box {
            background: #f8f9fa !important;
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
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <div className="floating-label-group">
              <input
                type="text"
                id="username"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
              />
              <label htmlFor="username">Username</label>
              {errors.username && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}
            </div>
          </div>
          <div className="form-group">
            <div className="floating-label-group password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
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
          </div>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'LOG IN'}
          </button>
        </form>
        <div className="login-footer">
          <a href="/register" className="create-account">CREATE ACCOUNT</a>
          <div className="copyright">©2025 ICT Cortex. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;