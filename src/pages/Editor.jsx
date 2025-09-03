import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useImageStorage } from '../hooks/useImageStorage';
import Header from '../components/Header';
import ImageEditor from '../components/ImageEditor';
import WelcomeScreen from '../components/WelcomeScreen';
import { Loader2 } from 'lucide-react';

const Editor = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isSubscribed } = useAuth();
  const { getImage } = useImageStorage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if there's an image ID in the URL
  const imageId = searchParams.get('imageId');
  
  // Check if there's an image in the location state (from navigation)
  const locationImage = location.state?.image;
  
  useEffect(() => {
    const loadImage = async () => {
      // If there's an image ID in the URL, load it from storage
      if (imageId) {
        try {
          setLoading(true);
          setError(null);
          
          const image = await getImage(imageId);
          
          if (image) {
            // Convert to the format expected by the ImageEditor
            setCurrentImage({
              url: image.url,
              name: image.original_name,
              file: null, // We don't have the file object for stored images
              id: image.id,
              metadata: image.metadata,
            });
          } else {
            setError('Image not found');
          }
        } catch (err) {
          console.error('Error loading image:', err);
          setError('Failed to load image');
        } finally {
          setLoading(false);
        }
      }
      // If there's an image in the location state, use it
      else if (locationImage) {
        setCurrentImage(locationImage);
      }
    };
    
    loadImage();
  }, [imageId, locationImage]);
  
  const handleImageUpload = (image) => {
    setCurrentImage(image);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header isSubscribed={isSubscribed} />
        <main className="container mx-auto px-4 py-8 max-w-6xl flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading image...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen">
        <Header isSubscribed={isSubscribed} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="glass-effect rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Image</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium text-white"
            >
              Return Home
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header isSubscribed={isSubscribed} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentImage ? (
          <ImageEditor 
            image={currentImage} 
            setImage={setCurrentImage}
            isSubscribed={isSubscribed}
          />
        ) : (
          <WelcomeScreen onImageUpload={handleImageUpload} />
        )}
      </main>
    </div>
  );
};

export default Editor;

