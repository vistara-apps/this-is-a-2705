import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Crown, User, LogIn } from 'lucide-react';
import PaymentButton from './PaymentButton';
import { useAuth } from '../hooks/useAuth';

const Header = ({ isSubscribed }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Camera className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Remixify</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/editor" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Editor
            </Link>
            
            {isSubscribed && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">Pro</span>
              </div>
            )}
            
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}
            
            {!isSubscribed && user && (
              <PaymentButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
