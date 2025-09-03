import React, { useState, useEffect } from 'react';
import { useImageStorage } from '../hooks/useImageStorage';
import { Loader2, Image, Trash2, Edit, AlertCircle } from 'lucide-react';

const SavedImagesGallery = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { getUserImageLibrary, deleteUserImage, loading, error } = useImageStorage();

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, []);

  // Load user's saved images
  const loadImages = async () => {
    const userImages = await getUserImageLibrary();
    setImages(userImages);
  };

  // Handle image selection
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    if (onSelectImage) {
      onSelectImage(image);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (e, imageId) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    
    if (window.confirm('Are you sure you want to delete this image?')) {
      const success = await deleteUserImage(imageId);
      
      if (success) {
        // Remove the deleted image from the state
        setImages(images.filter(img => img.id !== imageId));
        
        // Clear selection if the deleted image was selected
        if (selectedImage && selectedImage.id === imageId) {
          setSelectedImage(null);
        }
      }
    }
  };

  // Handle edit button click
  const handleEditImage = (e, image) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    handleSelectImage(image);
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-red-400 font-medium">Error loading images</p>
          <p className="text-xs text-red-400/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 px-4 glass-effect rounded-lg">
        <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">No saved images</h3>
        <p className="text-sm text-gray-400">
          Your edited images will appear here. Start by uploading and editing an image.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Saved Images</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => handleSelectImage(image)}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-all ${
              selectedImage && selectedImage.id === image.id
                ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900'
                : 'hover:opacity-90'
            }`}
          >
            <img
              src={image.url}
              alt={image.original_name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => handleEditImage(e, image)}
                className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
              >
                <Edit className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={(e) => handleDeleteImage(e, image.id)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-xs text-white truncate">
              {image.original_name}
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin mr-2" />
          <span className="text-sm text-gray-400">Loading more images...</span>
        </div>
      )}
    </div>
  );
};

export default SavedImagesGallery;

