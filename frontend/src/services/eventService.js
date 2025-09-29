import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : '';
};

const getEventData = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventData`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
};

const eventService = {
  getEventData,
};

export default eventService;

