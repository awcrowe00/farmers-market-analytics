// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Import ThemeProvider and useTheme
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Inner component that can use theme
const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fef7f7',
        transition: 'background-color 0.3s ease'
      }}>
        <Navbar />
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
          transition: 'color 0.3s ease'
        }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* Wrap the entire application with ThemeProvider */}
        <AppContent />
      </ThemeProvider> {/* Close ThemeProvider */}
    </AuthProvider>
  );
}

export default App;
