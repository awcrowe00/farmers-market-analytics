// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* Wrap the entire application with ThemeProvider */}
        <Router>
          <div style={{
            minHeight: '100vh',
            minWidth: '100vw',
            backgroundColor: '#fef7f7'
          }}>
            <Navbar />
            <main style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem 1rem'
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
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider> {/* Close ThemeProvider */}
    </AuthProvider>
  );
}

export default App;
