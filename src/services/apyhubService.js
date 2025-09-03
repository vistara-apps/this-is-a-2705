import axios from 'axios';

// Base URL for ApyHub API
const API_BASE_URL = 'https://api.apyhub.com';

// Create API client with API key
const createApyHubClient = () => {
  const apiKey = import.meta.env.VITE_APYHUB_API_KEY;
  
  if (!apiKey) {
    console.error('ApyHub API key is missing. Make sure to set VITE_APYHUB_API_KEY in your environment variables.');
  }
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'apy-token': apiKey || 'your-api-key',
    },
  });
};

// Convert image to base64 format
const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Apply filter to an image using ApyHub API
export const applyImageFilter = async (imageFile, filterType) => {
  try {
    const client = createApyHubClient();
    const base64Image = await imageToBase64(imageFile);
    
    // Prepare the request payload
    const payload = {
      base64: base64Image,
      filter: filterType,
      responseType: 'base64',
    };
    
    // Make the API request
    const response = await client.post('/image-filter', payload);
    
    // Extract the filtered image from the response
    const filteredImageData = response.data.data;
    
    // Create a data URL for the filtered image
    const filteredImageUrl = `data:${imageFile.type};base64,${filteredImageData}`;
    
    return {
      url: filteredImageUrl,
      success: true,
    };
  } catch (error) {
    console.error('Error applying filter to image:', error);
    
    // Handle different types of errors
    let errorMessage = 'Failed to apply filter. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        errorMessage = 'Invalid request. Please check your image and try again.';
      } else if (status === 401) {
        errorMessage = 'Authentication failed. Please check your API key.';
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your internet connection.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Apply adjustments to an image using ApyHub API
export const applyImageAdjustments = async (imageFile, adjustments) => {
  try {
    const client = createApyHubClient();
    const base64Image = await imageToBase64(imageFile);
    
    // Prepare the request payload
    const payload = {
      base64: base64Image,
      brightness: adjustments.brightness / 100, // Convert to 0-2 range
      contrast: adjustments.contrast / 100,     // Convert to 0-2 range
      saturation: adjustments.saturation / 100, // Convert to 0-2 range
      hue: adjustments.hue || 0,                // Default to 0 if not provided
      responseType: 'base64',
    };
    
    // Make the API request
    const response = await client.post('/image-adjust', payload);
    
    // Extract the adjusted image from the response
    const adjustedImageData = response.data.data;
    
    // Create a data URL for the adjusted image
    const adjustedImageUrl = `data:${imageFile.type};base64,${adjustedImageData}`;
    
    return {
      url: adjustedImageUrl,
      success: true,
    };
  } catch (error) {
    console.error('Error applying adjustments to image:', error);
    
    // Handle different types of errors
    let errorMessage = 'Failed to apply adjustments. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        errorMessage = 'Invalid request. Please check your image and try again.';
      } else if (status === 401) {
        errorMessage = 'Authentication failed. Please check your API key.';
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your internet connection.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Get available filters
export const getAvailableFilters = () => {
  return [
    { id: 'none', name: 'Original', premium: false },
    { id: 'sepia', name: 'Sepia', premium: false },
    { id: 'grayscale', name: 'Grayscale', premium: false },
    { id: 'vintage', name: 'Vintage', premium: false },
    { id: 'clarendon', name: 'Clarendon', premium: false },
    { id: 'gingham', name: 'Gingham', premium: true },
    { id: 'moon', name: 'Moon', premium: true },
    { id: 'lark', name: 'Lark', premium: true },
    { id: 'reyes', name: 'Reyes', premium: true },
    { id: 'juno', name: 'Juno', premium: true },
    { id: 'slumber', name: 'Slumber', premium: true },
    { id: 'crema', name: 'Crema', premium: true },
    { id: 'ludwig', name: 'Ludwig', premium: true },
    { id: 'aden', name: 'Aden', premium: true },
    { id: 'perpetua', name: 'Perpetua', premium: true },
  ];
};

