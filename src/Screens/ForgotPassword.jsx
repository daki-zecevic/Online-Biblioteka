import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../Login.css';
import '../Styles/NoviAdmin.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!email) {
      setErrors({ email: 'Email je obavezan' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://biblioteka.simonovicp.com/api/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer b3Rvcmlub2xhcmluZ29sb2dpamE=' // Zameni ako treba
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        toast.error(data?.message || 'Greška prilikom slanja linka.');
      } else {
        toast.success('Link za reset lozinke je poslat!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Greška prilikom povezivanja sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Sačekajte...</span>
        </div>
      )}
      <div className="login-box">
        <h1 className="login-title">Reset Password</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
              <label htmlFor="email">Email</label>
              {errors.email && (
                <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.email}</div>
              )}
            </div>
          </div>

          <button type="submit" className="login-button m-t-10" disabled={loading}>
            {loading ? 'Slanje...' : 'SEND PASSWORD RESET LINK'}
          </button>

          <button
            type="button"
            onClick={handleReturnToLogin}
            className=" p-10 button-white"
          >
            RETURN TO LOGIN
          </button>
        </form>

        <div className="login-footer">
          <p className="m-t-5 p">©2025 ICT Cortex. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
