import React, { useState } from 'react';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('https://biblioteka.simonovicp.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'b3Rvcmlub2xhcmluZ29sb2dpamE=',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        device: 'web'
      })
    });
    

    const data = await response.json();

    if (!data.success) {
     
      setError('Invalid login credentials. Please try again.');
        setLoading(false); 
      return;
    }

    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('username', data.data.name);
      setLoading(false); 
    window.location.href = '/dashboard'; 
  };

   return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="input-label">Username</label>
            <input
              type="text"  value={username}  onChange={(e) => setUsername(e.target.value)} placeholder="Username"  className="login-input" required />
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
          <a href="/register" className="create-account">CREATE ACCOUNT</a>
          <div className="copyright">©2025 ICT Cortex. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Login;