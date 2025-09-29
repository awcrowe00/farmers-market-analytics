// frontend/src/services/heatMapService.js
import axios from 'axios';

const API_URL = '/api/heatmap';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? `Bearer ${user.token}` : '';
};

const getHeatMapData = async (timeRange = 'today', hour = null) => {
  try {
    const params = { timeRange };
    if (hour) params.hour = hour;
    
    const response = await axios.get(`${API_URL}/data`, {
      params,
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching heat map data:', error);
    throw error;
  }
};

const getMarketLayout = async () => {
  try {
    const response = await axios.get(`${API_URL}/layout`, {
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching market layout:', error);
    throw error;
  }
};

const getTrafficTrends = async (vendorId, hours = 24) => {
  try {
    const response = await axios.get(`${API_URL}/trends/${vendorId}`, {
      params: { hours },
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching traffic trends:', error);
    throw error;
  }
};

const heatMapService = {
  getHeatMapData,
  getMarketLayout,
  getTrafficTrends,
};

export default heatMapService;