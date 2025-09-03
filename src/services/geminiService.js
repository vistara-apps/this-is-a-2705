import axios from 'axios';

// Base URL for Google Gemini API
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1';

// Create API client with API key
const createGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is missing. Make sure to set VITE_GEMINI_API_KEY in your environment variables.');
  }
  
  return axios.create({
    baseURL: API_BASE_URL,
    params: {
      key: apiKey || 'your-api-key',
    },
    headers: {
      'Content-Type': 'application/json',
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

// Remove objects from an image using Gemini API
export const removeObjectFromImage = async (imageFile, prompt) => {
  try {
    const client = createGeminiClient();
    const base64Image = await imageToBase64(imageFile);
    
    // Prepare the request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Remove the following from this image: ${prompt}. Fill in the removed area naturally.`,
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generation_config: {
        temperature: 0.4,
        top_p: 0.95,
        top_k: 40,
      },
    };
    
    // Make the API request
    const response = await client.post('/models/gemini-2.5-flash-image-edit:generateContent', payload);
    
    // Extract the edited image from the response
    const editedImageData = response.data.candidates[0].content.parts[0].inline_data.data;
    
    // Create a data URL for the edited image
    const editedImageUrl = `data:${imageFile.type};base64,${editedImageData}`;
    
    return {
      url: editedImageUrl,
      success: true,
    };
  } catch (error) {
    console.error('Error removing object from image:', error);
    
    // Handle different types of errors
    let errorMessage = 'Failed to process image. Please try again.';
    
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
      
      if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
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

// Generate image variations using Gemini API
export const generateImageVariations = async (imageFile, prompt) => {
  try {
    const client = createGeminiClient();
    const base64Image = await imageToBase64(imageFile);
    
    // Prepare the request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate a variation of this image with the following style: ${prompt}.`,
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generation_config: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
      },
    };
    
    // Make the API request
    const response = await client.post('/models/gemini-2.5-flash-image-edit:generateContent', payload);
    
    // Extract the generated image from the response
    const generatedImageData = response.data.candidates[0].content.parts[0].inline_data.data;
    
    // Create a data URL for the generated image
    const generatedImageUrl = `data:${imageFile.type};base64,${generatedImageData}`;
    
    return {
      url: generatedImageUrl,
      success: true,
    };
  } catch (error) {
    console.error('Error generating image variations:', error);
    
    // Handle different types of errors
    let errorMessage = 'Failed to generate image variations. Please try again.';
    
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
      
      if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
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

