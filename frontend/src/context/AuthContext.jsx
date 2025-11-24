// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('LOGIN_SUCCESS payload:', action.payload);
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_USER':
      console.log('SET_USER payload:', action.payload);
      // Update user in localStorage as well to maintain persistence
      // Preserve token from state.user if it exists
      const tokenToPreserve = state.user?.token;
      const updatedUser = { 
        ...state.user, 
        ...action.payload,
        ...(tokenToPreserve && { token: tokenToPreserve }) // Explicitly preserve token
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userData = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return userData;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.register(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const refreshUser = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      try {
        const updatedUser = await authService.getCurrentUser(user.token);
        // Merge with existing user data to preserve token
        const mergedUser = {
          ...updatedUser,
          token: user.token, // Keep the existing token
        };
        localStorage.setItem('user', JSON.stringify(mergedUser));
        // Dispatch with merged user to update state properly
        dispatch({ type: 'SET_USER', payload: updatedUser });
        return mergedUser;
      } catch (error) {
        console.error('Error refreshing user data:', error);
        // If refresh fails, return the existing user
        return user;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      token: state.user?.token || null,
      login,
      register,
      logout,
      refreshUser,
      setUser: (userData) => dispatch({ type: 'SET_USER', payload: userData }),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};