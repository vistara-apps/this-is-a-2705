import { useState } from 'react';
import { useAuth } from './useAuth';
import {
  uploadImage,
  getImageUrl,
  deleteImage,
  saveImageMetadata,
  getUserImages,
  getImageMetadata,
  deleteImageMetadata
} from '../lib/supabase';

export const useImageStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Save an image to storage
  const saveImage = async (imageFile, metadata = {}) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload image to storage
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}_${imageFile.name}`;
      const { path } = await uploadImage('images', filePath, imageFile);
      
      // Get public URL
      const publicUrl = getImageUrl('images', path);
      
      // Save metadata to database
      const imageData = {
        user_id: user.id,
        original_name: imageFile.name,
        storage_path: path,
        file_type: imageFile.type,
        file_size: imageFile.size,
        created_at: new Date().toISOString(),
        metadata: metadata,
      };
      
      const savedMetadata = await saveImageMetadata(imageData);
      
      return {
        id: savedMetadata.id,
        path,
        url: publicUrl,
        name: imageFile.name,
        ...metadata,
      };
    } catch (err) {
      console.error('Error saving image:', err);
      setError(err.message || 'Failed to save image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save a processed image (from data URL)
  const saveProcessedImage = async (dataUrl, originalName, metadata = {}) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert data URL to File object
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], originalName, { type: blob.type });
      
      // Save the file
      return await saveImage(file, metadata);
    } catch (err) {
      console.error('Error saving processed image:', err);
      setError(err.message || 'Failed to save processed image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all images for the current user
  const getUserImageLibrary = async () => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const images = await getUserImages(user.id);
      
      // Add public URLs to the images
      return images.map(image => ({
        ...image,
        url: getImageUrl('images', image.storage_path),
      }));
    } catch (err) {
      console.error('Error getting user images:', err);
      setError(err.message || 'Failed to get images');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a single image by ID
  const getImage = async (imageId) => {
    try {
      setLoading(true);
      setError(null);
      
      const image = await getImageMetadata(imageId);
      
      if (!image) {
        setError('Image not found');
        return null;
      }
      
      // Add public URL to the image
      return {
        ...image,
        url: getImageUrl('images', image.storage_path),
      };
    } catch (err) {
      console.error('Error getting image:', err);
      setError(err.message || 'Failed to get image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an image
  const deleteUserImage = async (imageId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get image metadata
      const image = await getImageMetadata(imageId);
      
      if (!image) {
        setError('Image not found');
        return false;
      }
      
      // Delete from storage
      await deleteImage('images', image.storage_path);
      
      // Delete metadata
      await deleteImageMetadata(imageId);
      
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.message || 'Failed to delete image');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveImage,
    saveProcessedImage,
    getUserImageLibrary,
    getImage,
    deleteUserImage,
    loading,
    error,
  };
};

