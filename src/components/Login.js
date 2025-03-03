// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.success) {
        // Save user details in localStorage (or a context)
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      alert("Login error: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Editor Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}
