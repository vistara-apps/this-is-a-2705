import { useState } from 'react';

export const useTextOverlay = () => {
  const [textElements, setTextElements] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null);

  // Add a new text element
  const addText = (textElement) => {
    setTextElements([...textElements, textElement]);
    setActiveTextId(textElement.id);
  };

  // Update an existing text element
  const updateText = (id, updates, justSelect = false) => {
    if (justSelect) {
      // Just select the text element without updating it
      setActiveTextId(id);
      return;
    }
    
    if (!updates) {
      // If no updates provided, just select the text
      setActiveTextId(id);
      return;
    }
    
    setTextElements(
      textElements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  // Delete a text element
  const deleteText = (id) => {
    setTextElements(textElements.filter((element) => element.id !== id));
    setActiveTextId(null);
  };

  // Update text position
  const updateTextPosition = (id, x, y) => {
    setTextElements(
      textElements.map((element) =>
        element.id === id ? { ...element, x, y } : element
      )
    );
  };

  // Clear all text elements
  const clearAllText = () => {
    setTextElements([]);
    setActiveTextId(null);
  };

  // Deselect active text
  const deselectText = () => {
    setActiveTextId(null);
  };

  return {
    textElements,
    activeTextId,
    addText,
    updateText,
    deleteText,
    updateTextPosition,
    clearAllText,
    deselectText,
  };
};

