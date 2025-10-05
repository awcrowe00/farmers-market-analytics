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
    company: user?.company || '',
    role: user?.role || '',
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
          company: userData.company || '',
          role: userData.role || '',
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await userService.updateUserProfile(token, user._id, contactInfo);
      setUser(updatedUser);
      console.log('Contact info saved:', updatedUser);
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Saving settings:', settings, 'Theme:', theme);
    // Implement API call to update settings and theme
  };

  return (
    <div className="min-h-screen bg-primary-50 p-8 dark:bg-primary-950">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-primary-800">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">User Profile</h1>

        {/* Profile Picture Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-200">Profile Picture</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={profileImage ? `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000'}/api/users/profilepicture/${profileImage}` : "https://via.placeholder.com/96"}
                alt="Profile"
              />
            </div>
            <div>
              <label htmlFor="profile-picture" className="sr-only">Choose profile photo</label>
              <input
                id="profile-picture"
                name="profile-picture"
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200 dark:text-gray-300 dark:file:bg-primary-700 dark:file:text-primary-50 dark:hover:file:bg-primary-600"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
            onClick={handleImageUpload}
          >
            Save Profile Picture
          </button>
        </section>

        {/* Contact Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-200">Contact Information</h2>
          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
              />
            </div>
            {user?.role === 'super_admin' && (
              <div className="md:col-span-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                  value={contactInfo.company}
                  onChange={handleContactInfoChange}
                />
              </div>
            )}
            {user?.role === 'super_admin' && (
              <div className="md:col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                  value={contactInfo.role}
                  onChange={handleContactInfoChange}
                >
                  <option value="vendor">Vendor</option>
                  <option value="market_manager">Market Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Save Contact Information
              </button>
            </div>
          </form>
        </section>

        {/* Settings Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-200">Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label htmlFor="notification-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notification Email</label>
              <input
                type="email"
                id="notification-email"
                name="notificationEmail"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-primary-700 dark:border-primary-600 dark:text-white"
                value={settings.notificationEmail}
                onChange={handleSettingsChange}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This email will be used for important notifications.</p>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
              <select
                id="theme"
                name="theme"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-primary-700 dark:border-primary-600 dark:text-white"
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
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
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
