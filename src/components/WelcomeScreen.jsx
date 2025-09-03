import React, { useRef } from 'react';
import { Upload, Sparkles, Zap, Palette, Type } from 'lucide-react';

const WelcomeScreen = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload({
          file,
          url: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload({
          file,
          url: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-5xl font-extrabold tracking-tight gradient-text">
          Transform Your Photos with AI
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-7">
          Instantly enhance your photos with AI-powered editing and creative effects. 
          No complex software needed.
        </p>
      </div>

      <div
        className="glass-effect rounded-lg border-2 border-dashed border-purple-400/50 p-12 max-w-2xl mx-auto cursor-pointer hover:border-purple-400 transition-all duration-250 group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-250">
            <Upload className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Upload Your Photo</h3>
            <p className="text-gray-400">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WEBP up to 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="glass-effect p-6 rounded-lg text-center animate-float">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Smart Adjustments</h4>
          <p className="text-sm text-gray-400">
            Intuitive brightness, contrast, and saturation controls
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg text-center animate-float" style={{animationDelay: '0.5s'}}>
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">AI Object Removal</h4>
          <p className="text-sm text-gray-400">
            Remove unwanted objects with intelligent AI
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg text-center animate-float" style={{animationDelay: '1s'}}>
          <Palette className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Artistic Filters</h4>
          <p className="text-sm text-gray-400">
            Transform mood with one-click filter effects
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg text-center animate-float" style={{animationDelay: '1.5s'}}>
          <Type className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h4 className="font-bold text-white mb-2">Text & Graphics</h4>
          <p className="text-sm text-gray-400">
            Add customizable text and shape overlays
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;