import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getSession, getCurrentUser, getUserProfile, getUserSubscription } from '../lib/supabase';

// Create the authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const session = await getSession();
        
        if (session) {
          // Get user data
          const userData = await getCurrentUser();
          setUser(userData);
          
          // Get user profile
          try {
            const profileData = await getUserProfile(userData.id);
            setProfile(profileData);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
          
          // Get subscription status
          try {
            const subscriptionData = await getUserSubscription(userData.id);
            setSubscription(subscriptionData);
          } catch (subscriptionError) {
            console.error('Error fetching subscription:', subscriptionError);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = await getCurrentUser();
          setUser(userData);
          
          try {
            const profileData = await getUserProfile(userData.id);
            setProfile(profileData);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
          
          try {
            const subscriptionData = await getUserSubscription(userData.id);
            setSubscription(subscriptionData);
          } catch (subscriptionError) {
            console.error('Error fetching subscription:', subscriptionError);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSubscription(null);
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Update subscription status
  const updateSubscription = async () => {
    if (!user) return;
    
    try {
      const subscriptionData = await getUserSubscription(user.id);
      setSubscription(subscriptionData);
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  // Check if user has an active subscription
  const isSubscribed = () => {
    if (!subscription) return false;
    
    // Check if subscription is active
    return (
      subscription.status === 'active' &&
      (!subscription.expires_at || new Date(subscription.expires_at) > new Date())
    );
  };

  // Provide auth context value
  const value = {
    user,
    profile,
    subscription,
    isSubscribed: isSubscribed(),
    loading,
    error,
    updateSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

