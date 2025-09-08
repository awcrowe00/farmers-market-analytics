// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

const register = async (userData) => {
   console.log('Sending registration data:', userData);
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  login,
  register,
  logout,
};
