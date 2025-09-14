// frontend/src/services/trafficService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/traffic';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : '';
};

const getTrafficData = async (timeRange = '7d') => {
  const response = await axios.get(`${API_URL}/`, {
    params: { timeRange },
    headers: {
      Authorization: getAuthToken(),
    },
  });
  return response.data;
};

const getWeatherCorrelation = async () => {
  const response = await axios.get(`${API_URL}/weather`, {
    headers: {
      Authorization: getAuthToken(),
    },
  });
  return response.data;
};

const getPeakHours = async () => {
  const response = await axios.get(`${API_URL}/peak-hours`, {
    headers: {
      Authorization: getAuthToken(),
    },
  });
  return response.data;
};

export default {
  getTrafficData,
  getWeatherCorrelation,
  getPeakHours,
};