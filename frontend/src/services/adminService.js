// frontend/src/services/adminService.js
import axios from 'axios';

const API_URL = '/api/users';

const adminService = {
  // Get all users (admin only)
  getAllUsers: async (token) => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Delete a user
  deleteUser: async (userId, token) => {
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update user company
  updateUserCompany: async (userId, company, token) => {
    const response = await axios.put(
      `${API_URL}/${userId}/company`,
      { company },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // Update user graph visibility
  updateUserGraphs: async (userId, enabledGraphs, token) => {
    const response = await axios.put(
      `${API_URL}/${userId}/graphs`,
      { enabledGraphs },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

export default adminService;

