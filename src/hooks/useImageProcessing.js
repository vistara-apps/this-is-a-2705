import { useState } from 'react';
import { removeObjectFromImage, generateImageVariations } from '../services/geminiService';
import { uploadImage, saveImageMetadata } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useImageProcessing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Process image with AI object removal
  const processObjectRemoval = async (imageFile, prompt) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await removeObjectFromImage(imageFile, prompt);
      
      if (!result.success) {
        setError(result.error);
        return null;
      }
      
      return result.url;
    } catch (err) {
      setError(err.message || 'Failed to process image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Generate image variations
  const processImageVariation = async (imageFile, prompt) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await generateImageVariations(imageFile, prompt);
      
      if (!result.success) {
        setError(result.error);
        return null;
      }
      
      return result.url;
    } catch (err) {
      setError(err.message || 'Failed to generate image variations');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save processed image to storage
  const saveProcessedImage = async (imageUrl, originalName, metadata = {}) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert data URL to Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a File object from the Blob
      const file = new File([blob], originalName, { type: blob.type });
      
      // Upload to Supabase storage
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}_${originalName}`;
      const { path } = await uploadImage('images', filePath, file);
      
      // Save metadata to database
      const imageData = {
        user_id: user.id,
        original_name: originalName,
        storage_path: path,
        file_type: blob.type,
        file_size: blob.size,
        created_at: new Date().toISOString(),
        metadata: metadata,
      };
      
      await saveImageMetadata(imageData);
      
      return {
        path,
        url: imageUrl,
      };
    } catch (err) {
      setError(err.message || 'Failed to save image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processObjectRemoval,
    processImageVariation,
    saveProcessedImage,
    loading,
    error,
  };
};

