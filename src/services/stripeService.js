import axios from 'axios';

// Base URL for Stripe API proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.remixify.app';

// Create API client
const createStripeClient = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies/sessions
  });
};

// Create a checkout session for subscription
export const createCheckoutSession = async (priceId, userId, returnUrl) => {
  try {
    const client = createStripeClient();
    
    const response = await client.post('/api/create-checkout-session', {
      priceId,
      userId,
      returnUrl,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    let errorMessage = 'Failed to create checkout session. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get subscription details
export const getSubscription = async (userId) => {
  try {
    const client = createStripeClient();
    
    const response = await client.get(`/api/subscription/${userId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error getting subscription:', error);
    
    let errorMessage = 'Failed to get subscription details. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const client = createStripeClient();
    
    const response = await client.post('/api/cancel-subscription', {
      subscriptionId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    let errorMessage = 'Failed to cancel subscription. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Update subscription
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const client = createStripeClient();
    
    const response = await client.post('/api/update-subscription', {
      subscriptionId,
      newPriceId,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    
    let errorMessage = 'Failed to update subscription. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Get available subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const client = createStripeClient();
    
    const response = await client.get('/api/subscription-plans');
    
    return response.data;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    
    let errorMessage = 'Failed to get subscription plans. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Create a customer portal session
export const createCustomerPortalSession = async (userId, returnUrl) => {
  try {
    const client = createStripeClient();
    
    const response = await client.post('/api/create-customer-portal-session', {
      userId,
      returnUrl,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    
    let errorMessage = 'Failed to create customer portal session. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

