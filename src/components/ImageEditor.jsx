import React, { useState, useRef, useEffect } from 'react';
import { X, Download, RotateCcw } from 'lucide-react';
import ToolBar from './ToolBar';
import AdjustmentPanel from './AdjustmentPanel';
import FilterPanel from './FilterPanel';
import TextPanel from './TextPanel';
import ObjectRemovalPanel from './ObjectRemovalPanel';

const ImageEditor = ({ image, setImage, isSubscribed }) => {
  const [activeTab, setActiveTab] = useState('adjustments');
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    exposure: 100
  });
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [textOverlays, setTextOverlays] = useState([]);
  const canvasRef = useRef(null);
  const [processedImage, setProcessedImage] = useState(image.url);

  // Apply adjustments to image
  useEffect(() => {
    applyImageProcessing();
  }, [adjustments, appliedFilter, textOverlays]);

  const applyImageProcessing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply adjustments via CSS filters
      const filterString = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      ctx.filter = filterString;
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Reset filter for text overlays
      ctx.filter = 'none';
      
      // Draw text overlays
      textOverlays.forEach(overlay => {
        ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
        ctx.fillStyle = overlay.color;
        ctx.textAlign = overlay.align;
        ctx.fillText(overlay.text, overlay.x, overlay.y);
      });
      
      // Update processed image
      setProcessedImage(canvas.toDataURL());
    };
    
    img.src = image.url;
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      exposure: 100
    });
    setAppliedFilter(null);
    setTextOverlays([]);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `remixified-${image.name}`;
    link.href = processedImage;
    link.click();
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'adjustments':
        return (
          <AdjustmentPanel
            adjustments={adjustments}
            setAdjustments={setAdjustments}
          />
        );
      case 'filters':
        return (
          <FilterPanel
            appliedFilter={appliedFilter}
            setAppliedFilter={setAppliedFilter}
            isSubscribed={isSubscribed}
          />
        );
      case 'text':
        return (
          <TextPanel
            textOverlays={textOverlays}
            setTextOverlays={setTextOverlays}
          />
        );
      case 'removal':
        return (
          <ObjectRemovalPanel
            image={image}
            isSubscribed={isSubscribed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Image Preview */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Editing: {image.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetAdjustments}
              className="flex items-center space-x-2 px-3 py-2 glass-effect rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={downloadImage}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium text-white hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setImage(null)}
              className="p-2 glass-effect rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 aspect-video flex items-center justify-center overflow-hidden">
          <img
            src={processedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{
              filter: appliedFilter ? appliedFilter.css : 'none'
            }}
          />
        </div>
      </div>

      {/* Tools Panel */}
      <div className="space-y-4">
        <ToolBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="glass-effect rounded-lg p-4">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;