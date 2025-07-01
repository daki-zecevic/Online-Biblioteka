import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    if(email === 'bibliotekar@cortex.com' && password === 'password') {
      const success = {
        success: true,
        data: {
          token: "2|cNQB0oo0oGSeImijyh0Hv2DSrN1sHA7Q8cuhnsYX",
          name: "ucenik-123"
        },
        message: "User login successfully."
      };
      
      localStorage.setItem('authToken', success.data.token);
      localStorage.setItem('username', success.data.name);
      window.location.href = '/dashboard';
    } else {
      const fail = { 
        success: false,
        message: "Unauthorized.",
        data: {
          error: "Invalid login credentials. Please try again."
        }
      };
      setError(fail.data.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="input-label">Email</label>
            <input
              type="email"  value={email}  onChange={(e) => setEmail(e.target.value)} placeholder="example@example.net"  className="login-input" required />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              type="password" value={password}  onChange={(e) => setPassword(e.target.value)}  placeholder="Password" className="login-input" required/>
          </div>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'LOG IN'}
          </button>
        </form>
        <div className="login-footer">
          <a href="/create-account" className="create-account">CREATE ACCOUNT</a>
          <div className="copyright">©2025 ICT Cortex. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;