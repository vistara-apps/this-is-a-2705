import { useState } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { 
  signUp, 
  signIn, 
  signOut, 
  createUserProfile, 
  updateUserProfile 
} from '../lib/supabase';

export const useAuth = () => {
  const auth = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register a new user
  const register = async (email, password, profileData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign up the user
      const { user } = await signUp(email, password);
      
      // Create user profile
      if (user) {
        await createUserProfile(user.id, {
          email: user.email,
          ...profileData,
          created_at: new Date().toISOString(),
        });
      }
      
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user } = await signIn(email, password);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!auth.user) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await updateUserProfile(auth.user.id, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...auth,
    register,
    login,
    logout,
    updateProfile,
    authLoading: loading,
    authError: error,
  };
};

