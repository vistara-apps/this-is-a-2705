import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, UserPlus, Loader2 } from 'lucide-react';

const SignupForm = ({ onSuccess, onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState(null);
  
  const { register, authLoading, authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await register(email, password, { full_name: name });
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled by the useAuth hook
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="glass-effect p-6 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>
        
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
          <p className="text-xs text-gray-400 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        {(formError || authError) && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{formError || authError}</p>
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </>
          )}
        </button>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;

