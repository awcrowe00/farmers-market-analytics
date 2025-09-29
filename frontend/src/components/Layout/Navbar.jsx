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
    <nav className="bg-red-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600">
            <img src={logo} alt="farMar" width={60} height={60} /> 
            <span className="text-white">Farmers Market Analytics</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-700 transition">
                <User className="w-5 h-5" />
                <span>Welcome, {user?.name}</span>
                <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-white">Logout</span>
              </button>
            </div>
          ) : (
            <div className="text-white space-x-4">
              <Link style={{ color: '#FFF' }}
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login
              </Link>
              <Link  style={{ color: '#FFF' }}
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
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
