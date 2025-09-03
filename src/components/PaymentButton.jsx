import React, { useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const PaymentButton = ({ onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSession } = usePaymentContext();

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true);
      await createSession();
      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
  );
};

export default PaymentButton;