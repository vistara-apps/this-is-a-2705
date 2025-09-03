import React, { useState } from 'react';
import { Type, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

const TextPanel = ({ onAddText, onUpdateText, onDeleteText, activeTextId, textElements }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState('center');
  
  // Find active text element if any
  const activeText = textElements.find(t => t.id === activeTextId);
  
  // Update local state when active text changes
  React.useEffect(() => {
    if (activeText) {
      setText(activeText.text);
      setFontSize(activeText.fontSize || 24);
      setFontColor(activeText.color || '#ffffff');
      setFontWeight(activeText.fontWeight || 'normal');
      setFontStyle(activeText.fontStyle || 'normal');
      setTextDecoration(activeText.textDecoration || 'none');
      setTextAlign(activeText.textAlign || 'center');
    } else {
      // Reset to defaults if no active text
      setText('');
      setFontSize(24);
      setFontColor('#ffffff');
      setFontWeight('normal');
      setFontStyle('normal');
      setTextDecoration('none');
      setTextAlign('center');
    }
  }, [activeText]);
  
  // Handle text input change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { text: newText });
    }
  };
  
  // Handle font size change
  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { fontSize: newSize });
    }
  };
  
  // Handle font color change
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setFontColor(newColor);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { color: newColor });
    }
  };
  
  // Handle text alignment change
  const handleAlignmentChange = (alignment) => {
    setTextAlign(alignment);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { textAlign: alignment });
    }
  };
  
  // Toggle font weight
  const toggleFontWeight = () => {
    const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
    setFontWeight(newWeight);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { fontWeight: newWeight });
    }
  };
  
  // Toggle font style
  const toggleFontStyle = () => {
    const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newStyle);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { fontStyle: newStyle });
    }
  };
  
  // Toggle text decoration
  const toggleTextDecoration = () => {
    const newDecoration = textDecoration === 'underline' ? 'none' : 'underline';
    setTextDecoration(newDecoration);
    
    if (activeTextId) {
      onUpdateText(activeTextId, { textDecoration: newDecoration });
    }
  };
  
  // Add new text element
  const handleAddText = () => {
    if (!text.trim()) return;
    
    const newText = {
      id: Date.now().toString(),
      text,
      fontSize,
      color: fontColor,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      x: 50, // Center horizontally (percentage)
      y: 50, // Center vertically (percentage)
    };
    
    onAddText(newText);
    setText('');
  };
  
  // Delete active text element
  const handleDeleteText = () => {
    if (activeTextId) {
      onDeleteText(activeTextId);
    }
  };
  
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
        <Type className="w-5 h-5" />
        <span>Text Overlay</span>
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text here..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none resize-none"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Font Size
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="w-full accent-purple-500"
            />
            <div className="text-xs text-gray-400 text-center mt-1">
              {fontSize}px
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Font Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={fontColor}
                onChange={handleColorChange}
                className="w-8 h-8 rounded overflow-hidden cursor-pointer"
              />
              <input
                type="text"
                value={fontColor}
                onChange={handleColorChange}
                className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleAlignmentChange('left')}
              className={`p-2 rounded-lg ${
                textAlign === 'left'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignmentChange('center')}
              className={`p-2 rounded-lg ${
                textAlign === 'center'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAlignmentChange('right')}
              className={`p-2 rounded-lg ${
                textAlign === 'right'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={toggleFontWeight}
              className={`p-2 rounded-lg ${
                fontWeight === 'bold'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleFontStyle}
              className={`p-2 rounded-lg ${
                fontStyle === 'italic'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleTextDecoration}
              className={`p-2 rounded-lg ${
                textDecoration === 'underline'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {activeTextId ? (
            <>
              <button
                onClick={handleDeleteText}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Text</span>
              </button>
              
              <button
                onClick={() => onUpdateText(activeTextId, { 
                  text, 
                  fontSize, 
                  color: fontColor,
                  fontWeight,
                  fontStyle,
                  textDecoration,
                  textAlign
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all"
              >
                <span>Update Text</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleAddText}
              disabled={!text.trim()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium text-white transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Text</span>
            </button>
          )}
        </div>
      </div>
      
      {textElements.length > 0 && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Text Elements ({textElements.length})
          </label>
          <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
            {textElements.map((item) => (
              <button
                key={item.id}
                onClick={() => onUpdateText(item.id, null, true)} // Just select, don't update
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activeTextId === item.id
                    ? 'bg-purple-500/30 border border-purple-500/50'
                    : 'bg-gray-700 border border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="truncate text-left" style={{ 
                  color: item.color,
                  fontWeight: item.fontWeight,
                  fontStyle: item.fontStyle,
                  textDecoration: item.textDecoration,
                  fontSize: `${Math.min(item.fontSize / 2, 16)}px`
                }}>
                  {item.text}
                </div>
                <div className="text-xs text-gray-400">{item.fontSize}px</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextPanel;

