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
    <nav className="bg-primary-800 shadow-lg dark:bg-primary-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-secondary-200 dark:text-secondary-50">
            <img src={logo} alt="farMar" width={60} height={60} /> 
            <span className="text-white dark:text-gray-100">Farmers Market Analytics</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 text-primary-200 hover:text-secondary-400 transition dark:text-primary-100 dark:hover:text-secondary-200">
                <User className="w-5 h-5" />
                <span>Welcome, {user?.name}</span>
                <span className="text-sm text-primary-300 capitalize dark:text-primary-200">({user?.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-secondary-600 text-white px-4 py-2 rounded hover:bg-secondary-700 transition dark:bg-secondary-500 dark:hover:bg-secondary-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-white">Logout</span>
              </button>
            </div>
          ) : (
            <div className="text-white space-x-4">
              <Link style={{ color: '#FFF' }} // This might need to be adjusted with Tailwind classes
                to="/login"
                className="text-secondary-200 hover:text-secondary-400 font-medium dark:text-secondary-100 dark:hover:text-secondary-200"
              >
                Login
              </Link>
              <Link  style={{ color: '#FFF' }} // This might need to be adjusted with Tailwind classes
                to="/register"
                className="bg-secondary-600 text-white px-4 py-2 rounded hover:bg-secondary-700 transition dark:bg-secondary-500 dark:hover:bg-secondary-600"
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
