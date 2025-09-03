import React, { useState, useRef, useEffect } from 'react';
import { X, Download, RotateCcw, Save, Loader2 } from 'lucide-react';
import ToolBar from './ToolBar';
import AdjustmentsPanel from './AdjustmentsPanel';
import FilterPanel from './FilterPanel';
import TextPanel from './TextPanel';
import ObjectRemovalPanel from './ObjectRemovalPanel';
import { useImageAdjustments } from '../hooks/useImageAdjustments';
import { useTextOverlay } from '../hooks/useTextOverlay';
import { useImageStorage } from '../hooks/useImageStorage';
import { useAuth } from '../hooks/useAuth';

const ImageEditor = ({ image, setImage, isSubscribed }) => {
  const [activeTab, setActiveTab] = useState('adjustments');
  const [processedImage, setProcessedImage] = useState(image.url);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  // Custom hooks
  const { user } = useAuth();
  const { 
    adjustments, 
    updateAdjustment, 
    resetAdjustments, 
    getPreviewStyle 
  } = useImageAdjustments();
  const { 
    textElements, 
    activeTextId, 
    addText, 
    updateText, 
    deleteText, 
    updateTextPosition 
  } = useTextOverlay();
  const { saveProcessedImage } = useImageStorage();
  
  // State for filter
  const [appliedFilter, setAppliedFilter] = useState(null);
  
  // Handle processed image from components
  const handleProcessedImage = (processedImageData) => {
    setProcessedImage(processedImageData.url);
  };

  // Apply all edits to canvas for download/save
  const applyImageProcessing = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply filter and adjustments
        if (appliedFilter) {
          ctx.filter = appliedFilter.css;
        } else {
          ctx.filter = `
            brightness(${adjustments.brightness / 100})
            contrast(${adjustments.contrast / 100})
            saturate(${adjustments.saturation / 100})
            hue-rotate(${adjustments.hue}deg)
          `;
        }
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Reset filter for text overlays
        ctx.filter = 'none';
        
        // Draw text overlays
        textElements.forEach(element => {
          // Calculate position based on percentages
          const x = (element.x / 100) * canvas.width;
          const y = (element.y / 100) * canvas.height;
          
          // Set text properties
          ctx.font = `${element.fontWeight} ${element.fontStyle} ${element.fontSize}px sans-serif`;
          ctx.fillStyle = element.color;
          ctx.textAlign = element.textAlign;
          ctx.textBaseline = 'middle';
          
          // Apply text decoration if needed
          if (element.textDecoration === 'underline') {
            const textWidth = ctx.measureText(element.text).width;
            const textHeight = element.fontSize;
            const underlineY = y + textHeight / 2 + 3;
            
            // Draw the text
            ctx.fillText(element.text, x, y);
            
            // Draw the underline
            ctx.beginPath();
            if (element.textAlign === 'center') {
              ctx.moveTo(x - textWidth / 2, underlineY);
              ctx.lineTo(x + textWidth / 2, underlineY);
            } else if (element.textAlign === 'right') {
              ctx.moveTo(x - textWidth, underlineY);
              ctx.lineTo(x, underlineY);
            } else {
              ctx.moveTo(x, underlineY);
              ctx.lineTo(x + textWidth, underlineY);
            }
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.fontSize / 15;
            ctx.stroke();
          } else {
            // Just draw the text without underline
            ctx.fillText(element.text, x, y);
          }
        });
        
        // Get the processed image as data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      };
      
      img.src = image.url;
    });
  };

  // Reset all edits
  const resetAllEdits = () => {
    resetAdjustments();
    setAppliedFilter(null);
    setTextElements([]);
  };

  // Download the edited image
  const downloadImage = async () => {
    const processedDataUrl = await applyImageProcessing();
    
    const link = document.createElement('a');
    link.download = `remixified-${image.name}`;
    link.href = processedDataUrl;
    link.click();
  };
  
  // Save the edited image to storage
  const saveImage = async () => {
    if (!user) {
      setSaveError('Please log in to save images');
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Apply all edits to canvas
      const processedDataUrl = await applyImageProcessing();
      
      // Save to storage
      const metadata = {
        original_image_name: image.name,
        adjustments: adjustments,
        filter: appliedFilter ? appliedFilter.id : null,
        has_text_overlays: textElements.length > 0,
      };
      
      await saveProcessedImage(processedDataUrl, `edited-${image.name}`, metadata);
      
      // Show success message
      alert('Image saved successfully!');
    } catch (error) {
      console.error('Error saving image:', error);
      setSaveError('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render the active editing panel
  const renderActivePanel = () => {
    switch (activeTab) {
      case 'adjustments':
        return (
          <AdjustmentsPanel
            adjustments={adjustments}
            updateAdjustment={updateAdjustment}
            resetAdjustments={resetAdjustments}
            loading={false}
          />
        );
      case 'filters':
        return (
          <FilterPanel
            appliedFilter={appliedFilter}
            setAppliedFilter={setAppliedFilter}
            isSubscribed={isSubscribed}
            image={image}
            onProcessedImage={handleProcessedImage}
          />
        );
      case 'text':
        return (
          <TextPanel
            onAddText={addText}
            onUpdateText={updateText}
            onDeleteText={deleteText}
            activeTextId={activeTextId}
            textElements={textElements}
          />
        );
      case 'removal':
        return (
          <ObjectRemovalPanel
            image={image}
            isSubscribed={isSubscribed}
            onProcessedImage={handleProcessedImage}
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
              onClick={resetAllEdits}
              className="flex items-center space-x-2 px-3 py-2 glass-effect rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            {user && (
              <button
                onClick={saveImage}
                disabled={isSaving}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            )}
            
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
        
        {saveError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{saveError}</p>
          </div>
        )}
        
        <div className="glass-effect rounded-lg p-4 aspect-video flex items-center justify-center overflow-hidden relative">
          {/* Image with text overlays */}
          <div className="relative max-w-full max-h-full">
            <img
              ref={imageRef}
              src={processedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              style={appliedFilter ? { filter: appliedFilter.css } : getPreviewStyle()}
            />
            
            {/* Text overlay elements */}
            {textElements.map((element) => (
              <div
                key={element.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move"
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  color: element.color,
                  fontSize: `${element.fontSize}px`,
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  textDecoration: element.textDecoration,
                  textAlign: element.textAlign,
                }}
                onClick={() => updateText(element.id, null, true)}
                // In a real implementation, we would add drag handlers here
              >
                {element.text}
              </div>
            ))}
          </div>
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
