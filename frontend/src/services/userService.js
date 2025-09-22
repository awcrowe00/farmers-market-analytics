import axios from 'axios';

const API_URL = '/api/users';

const uploadProfilePicture = async (token, file) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await axios.put(`${API_URL}/profilepicture`, formData, config);
  return response.data;
};

const getUserProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get('/api/auth/me', config); // Assuming an endpoint to get current user data
  return response.data;
};

const userService = {
  uploadProfilePicture,
  getUserProfile,
};

export default userService;
