import React, { useState, useRef } from 'react';
import { Upload, Image, Camera, Loader2 } from 'lucide-react';

const WelcomeScreen = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    setIsLoading(true);
    
    // Create a URL for the image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        url: e.target.result,
        file: file,
        name: file.name,
      };
      
      onImageUpload(imageData);
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4">
          Enhance Your Photos with AI
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Upload an image to get started with Remixify's powerful editing tools.
          Adjust, enhance, and transform your photos in seconds.
        </p>
      </div>
      
      <div
        className={`glass-effect w-full max-w-2xl p-8 rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? 'border-purple-400 bg-purple-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragging ? 'Drop your image here' : 'Upload an image to edit'}
          </h3>
          
          <p className="text-gray-400 mb-6">
            Drag and drop an image, or click to browse
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5" />
                <span>Select Image</span>
              </div>
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="glass-effect p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Intuitive Adjustments
          </h3>
          <p className="text-gray-400">
            Easily enhance your photos with simple sliders for brightness, contrast, and more.
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <path d="M12 3c.3 0 .5.1.7.3l8 8c.4.4.4 1 0 1.4l-8 8c-.4.4-1 .4-1.4 0l-8-8c-.4-.4-.4-1 0-1.4l8-8c.2-.2.4-.3.7-.3z"></path>
              <path d="M12 7v10"></path>
              <path d="M8 11h8"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Object Removal
          </h3>
          <p className="text-gray-400">
            Remove unwanted objects or blemishes with powerful AI technology.
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <path d="M2 12h20"></path>
              <path d="M12 2v20"></path>
              <path d="m4.93 4.93 14.14 14.14"></path>
              <path d="m19.07 4.93-14.14 14.14"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Artistic Filters
          </h3>
          <p className="text-gray-400">
            Transform your photos with a variety of artistic filters and effects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

