import React, { useState } from 'react';
import Header from './components/Header';
import ImageEditor from './components/ImageEditor';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="min-h-screen">
      <Header isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentImage ? (
          <ImageEditor 
            image={currentImage} 
            setImage={setCurrentImage}
            isSubscribed={isSubscribed}
          />
        ) : (
          <WelcomeScreen onImageUpload={setCurrentImage} />
        )}
      </main>
    </div>
  );
}

export default App;