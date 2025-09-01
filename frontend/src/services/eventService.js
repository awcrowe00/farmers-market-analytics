import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getEventData = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventData`);
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

