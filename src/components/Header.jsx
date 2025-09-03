import React from 'react';
import { Camera, Sparkles, Crown } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PaymentButton from './PaymentButton';

const Header = ({ isSubscribed, setIsSubscribed }) => {
  return (
    <header className="glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Camera className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Remixify</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isSubscribed && (
              <PaymentButton onSuccess={() => setIsSubscribed(true)} />
            )}
            
            {isSubscribed && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">Pro</span>
              </div>
            )}
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;