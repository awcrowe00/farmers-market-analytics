// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = '/api/auth';

const login = async (email, password) => {
  console.log('Attempting login with:', email); // Debug log
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  console.log('Login response:', response.data); // Debug log
  return response.data;
};

const register = async (userData) => {
   console.log('Sending registration data:', userData);
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
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
