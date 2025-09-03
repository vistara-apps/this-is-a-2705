import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { getAvailableFilters } from '../services/apyhubService';
import { useImageProcessing } from '../hooks/useImageProcessing';

const FilterPanel = ({ appliedFilter, setAppliedFilter, isSubscribed, image, onProcessedImage }) => {
  const [filters, setFilters] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFilter, setProcessingFilter] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Initialize filters
  useEffect(() => {
    const availableFilters = getAvailableFilters();
    
    // Add CSS preview versions for the filter grid
    const filtersWithCss = availableFilters.map(filter => {
      let css = 'none';
      
      // Map filter IDs to CSS filters for preview
      switch (filter.id) {
        case 'sepia':
          css = 'sepia(100%)';
          break;
        case 'grayscale':
          css = 'grayscale(100%)';
          break;
        case 'vintage':
          css = 'sepia(50%) hue-rotate(30deg)';
          break;
        case 'clarendon':
          css = 'contrast(120%) saturate(125%)';
          break;
        case 'gingham':
          css = 'brightness(105%) hue-rotate(350deg) saturate(90%)';
          break;
        case 'moon':
          css = 'grayscale(100%) brightness(110%)';
          break;
        case 'lark':
          css = 'brightness(108%) saturate(85%) contrast(85%)';
          break;
        case 'reyes':
          css = 'sepia(30%) brightness(110%) saturate(75%)';
          break;
        case 'juno':
          css = 'saturate(140%) hue-rotate(15deg)';
          break;
        case 'slumber':
          css = 'brightness(90%) saturate(85%) sepia(20%)';
          break;
        case 'crema':
          css = 'sepia(20%) brightness(105%) contrast(90%)';
          break;
        case 'ludwig':
          css = 'contrast(105%) brightness(105%) saturate(90%)';
          break;
        case 'aden':
          css = 'brightness(115%) saturate(85%) hue-rotate(20deg)';
          break;
        case 'perpetua':
          css = 'brightness(105%) saturate(110%)';
          break;
        default:
          css = 'none';
      }
      
      return { ...filter, css };
    });
    
    setFilters(filtersWithCss);
  }, []);

  const handleFilterClick = async (filter) => {
    if (filter.premium && !isSubscribed) {
      setErrorMessage('This filter requires a Pro subscription. Please upgrade to access premium features.');
      return;
    }
    
    if (filter.id === 'none') {
      setAppliedFilter(null);
      return;
    }
    
    // For CSS-based filters (non-premium), apply immediately
    if (!filter.premium) {
      setAppliedFilter(filter);
      return;
    }
    
    // For premium filters, use the API
    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingFilter(filter.id);
    
    try {
      // Process the image using the ApyHub API
      // This would be implemented in a real application
      // For now, we'll simulate the API call with a timeout
      setTimeout(() => {
        setAppliedFilter(filter);
        setIsProcessing(false);
        setProcessingFilter(null);
        
        // In a real implementation, we would call the API and update the image
        if (onProcessedImage) {
          // This is a placeholder - in a real app, we'd use the actual processed image URL
          onProcessedImage({
            url: image.url, // This would be the processed image URL from the API
            name: `${filter.name.toLowerCase()}-${image.name}`,
            file: image.file,
            editType: 'filter',
            filter: filter.id
          });
        }
      }, 1500);
    } catch (err) {
      console.error('Error applying filter:', err);
      setErrorMessage('Failed to apply filter. Please try again.');
      setIsProcessing(false);
      setProcessingFilter(null);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Artistic Filters</h4>
      
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter)}
            disabled={(filter.premium && !isSubscribed) || isProcessing}
            className={`relative p-3 rounded-lg border transition-all ${
              appliedFilter?.id === filter.id
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-gray-600 hover:border-gray-500'
            } ${
              (filter.premium && !isSubscribed) || isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >
            <div className="aspect-square w-full bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-2 relative"
                 style={{ filter: filter.css }}>
              {isProcessing && processingFilter === filter.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-medium">{filter.name}</span>
              {filter.premium && !isSubscribed && (
                <Lock className="w-3 h-3 text-yellow-400" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Click a filter to preview it on your image</p>
        <p>• Premium filters use AI for higher quality results</p>
        <p>• Original restores your image to its initial state</p>
      </div>
    </div>
  );
};

export default FilterPanel;
