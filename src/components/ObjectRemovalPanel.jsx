import React, { useState } from 'react';
import { Wand2, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useImageProcessing } from '../hooks/useImageProcessing';

const ObjectRemovalPanel = ({ image, isSubscribed, onProcessedImage }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { processObjectRemoval, loading, error } = useImageProcessing();

  const handleObjectRemoval = async () => {
    if (!isSubscribed) {
      setErrorMessage('Object removal requires a Pro subscription. Please upgrade to access this feature.');
      return;
    }

    if (!prompt.trim()) {
      setErrorMessage('Please describe what you want to remove from the image.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    
    try {
      // Process the image using the Gemini API
      const processedImageUrl = await processObjectRemoval(image.file, prompt);
      
      if (processedImageUrl) {
        // Pass the processed image back to the parent component
        if (onProcessedImage) {
          onProcessedImage({
            url: processedImageUrl,
            name: `edited-${image.name}`,
            file: image.file,
            editType: 'object-removal',
            prompt: prompt
          });
        }
      } else {
        setErrorMessage(error || 'Failed to process image. Please try again.');
      }
    } catch (err) {
      console.error('Error in object removal:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
      
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-400">{errorMessage}</p>
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
            disabled={!isSubscribed || isProcessing}
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
