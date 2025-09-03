import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <header className="glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Camera className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Remixify</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Join Remixify Today'}
            </h2>
            <p className="text-gray-300 max-w-md mx-auto">
              {isLogin 
                ? 'Log in to access your account and continue editing your photos.'
                : 'Create an account to start enhancing your photos with AI-powered editing tools.'}
            </p>
          </div>
          
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} onToggleForm={toggleForm} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} onToggleForm={toggleForm} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;

