// frontend/src/services/eventService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthToken = () => {
  console.log('Raw localStorage user:', localStorage.getItem('user')); // Debug log
  
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Parsed user object:', user); // Debug log
  console.log('User token:', user?.token); // Debug log
  
  const token = user?.token ? `Bearer ${user.token}` : '';
  console.log('Auth token available:', !!token);
  console.log('Full token:', token); // Debug log
  return token;
};

const getEventData = async () => {
  try {
    console.log('Fetching from URL:', `${API_URL}/eventData`); // Debug log
    const response = await axios.get(`${API_URL}/eventData`, { // Must match backend route
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    console.log('Event service response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching event data:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Full Error:', error.message);
    throw error;
  }
};

// const eventService = {
//   getEventData,
// };

// export default eventService;