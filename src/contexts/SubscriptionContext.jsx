import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSubscription, getSubscriptionPlans } from '../services/stripeService';

// Create the subscription context
const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription data when user changes
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Get subscription details
        const subscriptionData = await getSubscription(user.id);
        setSubscription(subscriptionData);
        
        // Get available plans
        const plansData = await getSubscriptionPlans();
        setPlans(plansData);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Check if user has an active subscription
  const isSubscribed = () => {
    if (!subscription) return false;
    
    return (
      subscription.status === 'active' &&
      (!subscription.current_period_end || new Date(subscription.current_period_end * 1000) > new Date())
    );
  };

  // Get subscription tier
  const getSubscriptionTier = () => {
    if (!isSubscribed()) return 'free';
    
    // Check which plan the user is subscribed to
    const plan = plans.find(p => p.id === subscription.plan.id);
    
    return plan ? plan.nickname.toLowerCase() : 'basic';
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const subscriptionData = await getSubscription(user.id);
      setSubscription(subscriptionData);
    } catch (err) {
      console.error('Error refreshing subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Provide subscription context value
  const value = {
    subscription,
    plans,
    loading,
    error,
    isSubscribed: isSubscribed(),
    subscriptionTier: getSubscriptionTier(),
    refreshSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Custom hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === null) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

