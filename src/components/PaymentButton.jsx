import React, { useState } from 'react';
import { Crown, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createCheckoutSession } from '../services/stripeService';

const PaymentButton = ({ onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please log in to upgrade to Pro.');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create a checkout session with Stripe
      const { url } = await createCheckoutSession(
        'price_monthly_pro', // This would be the actual price ID from Stripe
        user.id,
        window.location.href // Return to the current page after checkout
      );
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
      // Note: onSuccess will be called when the user returns from Stripe
      // via a webhook or return URL handling
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleUpgrade}
        disabled={isProcessing}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all duration-200 neon-glow disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Crown className="w-4 h-4" />
        )}
        <span>{isProcessing ? 'Processing...' : 'Upgrade to Pro'}</span>
      </button>
      
      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
