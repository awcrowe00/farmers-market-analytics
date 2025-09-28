import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import userService from '../services/userService';

const Profile = () => {
  const { user, token, setUser } = useAuth(); // Assuming setUser is available from AuthContext
  const { theme, setTheme } = useTheme(); // Use theme and setTheme from ThemeContext
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(123) 456-7890', // Placeholder
    address: '123 Market St, Anytown, USA', // Placeholder
  });
  const [settings, setSettings] = useState({
    notificationEmail: 'notifications@example.com', // Placeholder
  });

  useEffect(() => {
    if (user?.profilePicture) {
      setProfileImage(user.profilePicture);
    }
    // Fetch full user profile to get latest data, including potentially updated profilePicture
    const fetchUserProfile = async () => {
      try {
        const userData = await userService.getUserProfile(token);
        setUser(userData); // Update user in context
        if (userData.profilePicture) {
          setProfileImage(userData.profilePicture);
        }
        setContactInfo({
          ...contactInfo,
          name: userData.name || '',
          email: userData.email || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [user?.profilePicture, token, setUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (selectedFile && token) {
      try {
        console.log('Token before upload:', token);
        const response = await userService.uploadProfilePicture(token, selectedFile);
        console.log(response.message);
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: response.profilePicture,
        }));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleContactInfoChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSettingsChange = (e) => {
    if (e.target.name === 'theme') {
      setTheme(e.target.value);
    } else {
      setSettings({
        ...settings,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Saving contact info:', contactInfo);
    // Implement API call to update contact info
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings, 'Theme:', theme);
    // Implement API call to update settings and theme
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

        {/* Profile Picture Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile Picture</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={profileImage ? `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}${profileImage}` : "https://via.placeholder.com/96"}
                alt="Profile"
              />
            </div>
            <div>
              <label htmlFor="profile-picture" className="sr-only">Choose profile photo</label>
              <input
                id="profile-picture"
                name="profile-picture"
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-800 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleImageUpload}
          >
            Save Profile Picture
          </button>
        </section>

        {/* Contact Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information</h2>
          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Contact Information
              </button>
            </div>
          </form>
        </section>

        {/* Settings Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label htmlFor="notification-email" className="block text-sm font-medium text-gray-700">Notification Email</label>
              <input
                type="email"
                id="notification-email"
                name="notificationEmail"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={settings.notificationEmail}
                onChange={handleSettingsChange}
              />
              <p className="mt-2 text-sm text-gray-500">This email will be used for important notifications.</p>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                id="theme"
                name="theme"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={theme}
                onChange={handleSettingsChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-800 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
