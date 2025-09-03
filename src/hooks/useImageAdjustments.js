import { useState } from 'react';
import { applyImageAdjustments } from '../services/apyhubService';

export const useImageAdjustments = () => {
  const [adjustments, setAdjustments] = useState({
    brightness: 100, // 0-200 (100 is normal)
    contrast: 100,   // 0-200 (100 is normal)
    saturation: 100, // 0-200 (100 is normal)
    hue: 0,          // -180 to 180 (0 is normal)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update a single adjustment
  const updateAdjustment = (name, value) => {
    setAdjustments({
      ...adjustments,
      [name]: value,
    });
  };

  // Reset all adjustments to default
  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
    });
  };

  // Apply adjustments to an image using the API
  const applyAdjustments = async (imageFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await applyImageAdjustments(imageFile, adjustments);
      
      if (!result.success) {
        setError(result.error);
        return null;
      }
      
      return result.url;
    } catch (err) {
      console.error('Error applying adjustments:', err);
      setError(err.message || 'Failed to apply adjustments');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get CSS filter string for preview
  const getPreviewStyle = () => {
    return {
      filter: `
        brightness(${adjustments.brightness / 100})
        contrast(${adjustments.contrast / 100})
        saturate(${adjustments.saturation / 100})
        hue-rotate(${adjustments.hue}deg)
      `,
    };
  };

  return {
    adjustments,
    updateAdjustment,
    resetAdjustments,
    applyAdjustments,
    getPreviewStyle,
    loading,
    error,
  };
};

