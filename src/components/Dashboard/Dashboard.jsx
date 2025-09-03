import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { createCustomerPortalSession } from '../../services/stripeService';
import SavedImagesGallery from '../SavedImagesGallery';
import { 
  User, 
  CreditCard, 
  LogOut, 
  Settings, 
  Crown, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [loading, setLoading] = useState(false);
  const { user, profile, logout } = useAuth();
  const { subscription, isSubscribed, subscriptionTier } = useSubscription();
  const navigate = useNavigate();

  // Handle image selection
  const handleSelectImage = (image) => {
    navigate(`/editor?imageId=${image.id}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle subscription management
  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      
      // Create a customer portal session
      const { url } = await createCustomerPortalSession(
        user.id,
        window.location.origin + '/dashboard'
      );
      
      // Redirect to the customer portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="glass-effect rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {profile?.full_name || user?.email}
                </h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            
            {isSubscribed && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">
                  {subscriptionTier === 'pro' ? 'Pro Subscription' : 'Basic Subscription'}
                </span>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="glass-effect rounded-lg p-2">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('images')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'images'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">My Images</span>
              </button>
              
              <button
                onClick={() => setActiveTab('subscription')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'subscription'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Subscription</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 glass-effect rounded-lg p-6">
          {activeTab === 'images' && (
            <SavedImagesGallery onSelectImage={handleSelectImage} />
          )}
          
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Subscription</h3>
              
              <div className="glass-effect rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {isSubscribed ? 'Active Subscription' : 'No Active Subscription'}
                    </h4>
                    {isSubscribed && (
                      <p className="text-sm text-gray-400 mt-1">
                        {subscriptionTier === 'pro' ? 'Pro Plan' : 'Basic Plan'} - 
                        {subscription?.current_period_end 
                          ? ` Renews on ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`
                          : ' Monthly billing'}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        {isSubscribed ? 'Manage Subscription' : 'Upgrade to Pro'}
                      </>
                    )}
                  </button>
                </div>
                
                {!isSubscribed && (
                  <div className="mt-4 space-y-4">
                    <h5 className="text-md font-medium text-white">Pro Benefits:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400 text-lg leading-none">•</span>
                        <span>Access to all premium filters and effects</span>
                      </li>
                      <li className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400 text-lg leading-none">•</span>
                        <span>AI-powered object removal</span>
                      </li>
                      <li className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400 text-lg leading-none">•</span>
                        <span>Unlimited image storage</span>
                      </li>
                      <li className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400 text-lg leading-none">•</span>
                        <span>Higher resolution exports</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Plan</h4>
                  <p className="text-3xl font-bold text-white mb-4">$5<span className="text-sm text-gray-400 font-normal">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Basic image adjustments</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Standard filters</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Text & graphic overlays</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>10 saved images</span>
                    </li>
                  </ul>
                </div>
                
                <div className="glass-effect rounded-lg p-6 border-2 border-purple-500/50 relative">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                    POPULAR
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-4">Pro Plan</h4>
                  <p className="text-3xl font-bold text-white mb-4">$15<span className="text-sm text-gray-400 font-normal">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>All Basic features</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>AI object removal</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Premium filters & effects</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Unlimited saved images</span>
                    </li>
                    <li className="flex items-start space-x-2 text-gray-300">
                      <span className="text-green-400 text-lg leading-none">•</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Account Settings</h3>
              
              <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-white">Profile Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile?.full_name || ''}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Your full name"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Your email"
                      disabled
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    To update your profile information or change your password, please contact support.
                  </p>
                </div>
              </div>
              
              <div className="glass-effect rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-white">Danger Zone</h4>
                
                <div className="pt-2 space-y-4">
                  <p className="text-sm text-gray-400">
                    These actions are permanent and cannot be undone.
                  </p>
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                  >
                    Log Out of All Devices
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

