import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const LoginForm = ({ onSuccess, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, authLoading, authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled by the useAuth hook
      console.error('Login error:', error);
    }
  };

  return (
    <div className="glass-effect p-6 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Log In to Remixify</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        {authError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{authError}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50"
        >
          {authLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </>
          )}
        </button>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

