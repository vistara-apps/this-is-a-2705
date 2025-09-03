import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import WelcomeScreen from '../components/WelcomeScreen';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleImageUpload = (image) => {
    // If user is logged in, navigate to editor with the image
    if (user) {
      navigate('/editor', { state: { image } });
    } else {
      // If not logged in, prompt to login first
      if (window.confirm('Please log in to edit images. Would you like to log in now?')) {
        navigate('/auth');
      }
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <WelcomeScreen onImageUpload={handleImageUpload} />
      </main>
    </div>
  );
};

export default Home;

