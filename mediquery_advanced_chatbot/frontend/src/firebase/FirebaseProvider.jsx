import React, { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { userService, analyticsService } from './services';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const userData = {
            uid: decoded.email, // Using email as uid for simplicity
            email: decoded.email
          };
          setUser(userData);
          
          // Don't load profile or track activity initially to avoid errors
          setUserProfile(null);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    
    try {
      await userService.saveUserProfile(user.uid, profileData);
      setUserProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const trackActivity = async (activityType, data = {}) => {
    if (!user) return;
    
    try {
      // For now, just log the activity instead of saving to Firebase
      console.log('Activity tracked:', activityType, data);
      // await analyticsService.trackActivity(user.uid, activityType, data);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    updateUserProfile,
    trackActivity
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
