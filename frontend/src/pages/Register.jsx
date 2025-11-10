// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart3 } from 'lucide-react';
import logo from '../assets/FMA.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendor',
    company: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
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
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-primary-950">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md dark:bg-primary-800">
        <div className="text-center">
          <div className="flex justify-center">
            <img src={logo} alt="farMar" width={60} height={60} /> 
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-primary-800 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-primary-600 dark:text-primary-200">
            Join farmers market analytics platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded dark:bg-secondary-900 dark:border-secondary-700 dark:text-secondary-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-700 dark:text-primary-200">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-800 rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-primary-700 dark:border-primary-600 dark:placeholder-primary-300 dark:text-white"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 dark:text-primary-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-800 rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-primary-700 dark:border-primary-600 dark:placeholder-primary-300 dark:text-white"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 dark:text-primary-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-800 rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-primary-700 dark:border-primary-600 dark:placeholder-primary-300 dark:text-white"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-primary-700 dark:text-primary-200">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary-300 placeholder-primary-400 text-primary-800 rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-primary-700 dark:border-primary-600 dark:placeholder-primary-300 dark:text-white"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-primary-700 dark:text-primary-200">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-primary-300 bg-primary-100 text-primary-800 rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="vendor">Vendor</option>
                <option value="market_manager">Market Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 dark:bg-secondary-500 dark:hover:bg-secondary-600"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-primary-700 dark:text-primary-200">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;