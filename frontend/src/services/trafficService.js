// frontend/src/services/trafficService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/traffic';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : '';
};

const getTrafficData = async (vendorId, timeRange = '7d') => {
  const response = await axios.get(`${API_URL}/${vendorId}`, {
    params: { timeRange },
    headers: {
      Authorization: getAuthToken(),
    },
  });
  return response.data;
};

const getWeatherCorrelation = async (vendorId) => {
  const response = await axios.get(`${API_URL}/${vendorId}/weather`, {
    headers: {
      Authorization: getAuthToken(),
    },
  });
  return response.data;
};

const getPeakHours = async (vendorId) => {
  const response = await axios.get(`${API_URL}/${vendorId}/peak-hours`, {
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