// frontend/src/services/eventService.js
import axios from 'axios';

const API_URL = '/api/events';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : '';
};

const getEventData = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await axios.get(`${API_URL}/data`, {
      params,
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Event service response:', response.data);
    return response.data.data; // Return the data array
  } catch (error) {
    console.error('Error fetching event data:', error);
    throw error;
  }
};

const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData, {
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

const eventService = {
  getEventData,
  createEvent,
};

export default eventService;