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
    <>
      <style>
        {`
          .profile-container {
            background: linear-gradient(135deg, #fef7f7 0%, #fef2f2 100%) !important;
            min-height: 100vh;
            padding: 2rem;
          }
          .profile-card {
            background-color: #ffffff !important;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            max-width: 56rem;
            margin: 0 auto;
            padding: 2rem;
          }
          .section-blue {
            background-color: #fef2f2 !important;
            border: 1px solid #fecaca !important;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
          }
          .section-green {
            background-color: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
          }
          .section-purple {
            background-color: #fef2f2 !important;
            border: 1px solid #fecaca !important;
            border-radius: 0.75rem;
            padding: 1.5rem;
          }
          .heading-blue {
            color: #dc2626 !important;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .heading-green {
            color: #16a34a !important;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .heading-purple {
            color: #dc2626 !important;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          .main-heading {
            color: #dc2626 !important;
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-align: center;
          }
          .btn-blue {
            background-color: #dc2626 !important;
            color: white !important;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.2s;
          }
          .btn-blue:hover {
            background-color: #b91c1c !important;
            transform: translateY(-1px);
          }
          .btn-green {
            background-color: #16a34a !important;
            color: white !important;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-green:hover {
            background-color: #15803d !important;
            transform: translateY(-1px);
          }
          .btn-purple {
            background-color: #dc2626 !important;
            color: white !important;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-purple:hover {
            background-color: #b91c1c !important;
            transform: translateY(-1px);
          }
          .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s;
          }
          .form-input:focus {
            outline: none;
            border-color: #dc2626;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
          }
          .form-label {
            display: block;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          .profile-image {
            height: 6rem;
            width: 6rem;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #e5e7eb;
          }
          .file-input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: white;
          }
        `}
      </style>
      <div className="profile-container">
      <div className="profile-card">
        <h1 className="main-heading">👤 User Profile</h1>

        {/* Profile Picture Section */}
        <section className="section-blue">
          <h2 className="heading-blue">📸 Profile Picture</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="profile-image"
                src={profileImage ? `${import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5001'}/uploads/${profileImage}` : "https://via.placeholder.com/96"}
                alt="Profile"
              />
            </div>
            <div>
              <label htmlFor="profile-picture" className="form-label">Choose Profile Photo</label>
              <input
                id="profile-picture"
                name="profile-picture"
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-blue"
            onClick={handleImageUpload}
            disabled={!selectedFile}
          >
            {selectedFile ? '💾 Save Profile Picture' : '📁 Select a file first'}
          </button>
        </section>

        {/* Contact Information Section */}
        <section className="section-green">
          <h2 className="heading-green">📞 Contact Information</h2>
          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
              />
            </div>
            {user?.role === 'super_admin' && (
              <div className="md:col-span-2">
                <label htmlFor="company" className="form-label">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="form-input"
                  value={contactInfo.company}
                  onChange={handleContactInfoChange}
                />
              </div>
            )}
            {user?.role === 'super_admin' && (
              <div className="md:col-span-2">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  name="role"
                  className="form-input"
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
              <button type="submit" className="btn-green">
                💾 Save Contact Information
              </button>
            </div>
          </form>
        </section>

        {/* Settings Section */}
        <section className="section-purple">
          <h2 className="heading-purple">⚙️ Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label htmlFor="notification-email" className="form-label">Notification Email</label>
              <input
                type="email"
                id="notification-email"
                name="notificationEmail"
                className="form-input"
                value={settings.notificationEmail}
                onChange={handleSettingsChange}
              />
              <p className="mt-2 text-sm text-gray-500">This email will be used for important notifications.</p>
            </div>
            <div>
              <label htmlFor="theme" className="form-label">Theme</label>
              <select
                id="theme"
                name="theme"
                className="form-input"
                value={theme}
                onChange={handleSettingsChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <button type="submit" className="btn-purple">
                ⚙️ Save Settings
              </button>
            </div>
          </form>
        </section>
      </div>
      </div>
    </>
  );
};

export default Profile;
