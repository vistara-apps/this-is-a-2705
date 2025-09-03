import React, { useState } from 'react';
import { Wand2, Lock, Loader2 } from 'lucide-react';

const ObjectRemovalPanel = ({ image, isSubscribed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleObjectRemoval = async () => {
    if (!isSubscribed) {
      alert('Object removal requires a Pro subscription. Please upgrade to access this feature.');
      return;
    }

    if (!prompt.trim()) {
      alert('Please describe what you want to remove from the image.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Object removal completed! (This is a demo - actual AI processing would happen here)');
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h4 className="text-lg font-semibold text-white">AI Object Removal</h4>
        {!isSubscribed && <Lock className="w-4 h-4 text-yellow-400" />}
      </div>
      
      {!isSubscribed && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            This feature requires a Pro subscription. Upgrade to access AI-powered object removal.
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Describe what to remove:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., remove the person in the background, delete the unwanted object..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none resize-none"
            rows={3}
            disabled={!isSubscribed}
          />
        </div>
        
        <button
          onClick={handleObjectRemoval}
          disabled={!isSubscribed || isProcessing || !prompt.trim()}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isSubscribed && !isProcessing && prompt.trim()
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Remove Objects</span>
            </>
          )}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Be specific about what you want to remove</p>
        <p>• AI will intelligently fill the removed area</p>
        <p>• Processing may take a few moments</p>
      </div>
    </div>
  );
};

export default ObjectRemovalPanel;