
// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fef7f7',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            marginTop: '1rem',
            fontSize: '1.875rem',
            fontWeight: '800',
            color: '#dc2626'
          }}>
            Sign in to your account
          </h2>
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Access your farmers market analytics dashboard
          </p>
        </div>
        
        <form style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }} onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '0.25rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#dc2626',
                marginBottom: '0.5rem'
              }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#dc2626',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.25rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: loading ? '#9ca3af' : '#16a34a',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#15803d')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#dc2626'
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                fontWeight: '500',
                color: '#16a34a',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.color = '#15803d'}
              onMouseLeave={(e) => e.target.style.color = '#16a34a'}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;