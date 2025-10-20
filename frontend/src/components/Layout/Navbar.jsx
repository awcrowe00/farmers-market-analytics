import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BarChart3, User } from 'lucide-react';
import logo from '../../assets/FMA.svg';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#dc2626',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#fef2f2',
            textDecoration: 'none'
          }}>
            <img src={logo} alt="farMar" width={60} height={60} /> 
            <span style={{ color: 'white' }}>Farmers Market Analytics</span>
          </Link>
          
          {isAuthenticated ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fef2f2',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <User style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Welcome, {user?.name}</span>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#fecaca',
                  textTransform: 'capitalize'
                }}>({user?.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ color: 'white', display: 'flex', gap: '1rem' }}>
              <Link style={{
                color: '#fef2f2',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fca5a5'}
              onMouseLeave={(e) => e.target.style.color = '#fef2f2'}
                to="/login"
              >
                Login
              </Link>
              <Link style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
                to="/register"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
