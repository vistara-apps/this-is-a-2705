import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const TextPanel = ({ textOverlays, setTextOverlays }) => {
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [newText, setNewText] = useState('');

  const addTextOverlay = () => {
    if (!newText.trim()) return;
    
    const newOverlay = {
      id: Date.now(),
      text: newText,
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'left'
    };
    
    setTextOverlays([...textOverlays, newOverlay]);
    setNewText('');
    setSelectedOverlay(newOverlay.id);
  };

  const updateOverlay = (id, updates) => {
    setTextOverlays(overlays =>
      overlays.map(overlay =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  };

  const removeOverlay = (id) => {
    setTextOverlays(overlays => overlays.filter(overlay => overlay.id !== id));
    setSelectedOverlay(null);
  };

  const selectedOverlayData = textOverlays.find(overlay => overlay.id === selectedOverlay);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Text Overlays</h4>
      
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter text..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          />
          <button
            onClick={addTextOverlay}
            className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {textOverlays.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Text Elements:</p>
            {textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedOverlay === overlay.id
                    ? 'bg-purple-500/20 border border-purple-400/30'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedOverlay(overlay.id)}
              >
                <span className="text-sm text-white truncate">{overlay.text}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOverlay(overlay.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedOverlayData && (
          <div className="space-y-3 p-3 bg-gray-700/30 rounded-lg">
            <p className="text-sm font-medium text-white">Edit Selected Text</p>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Text</label>
              <input
                type="text"
                value={selectedOverlayData.text}
                onChange={(e) => updateOverlay(selectedOverlay, { text: e.target.value })}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={selectedOverlayData.fontSize}
                  onChange={(e) => updateOverlay(selectedOverlay, { fontSize: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-purple-400">{selectedOverlayData.fontSize}px</span>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  value={selectedOverlayData.color}
                  onChange={(e) => updateOverlay(selectedOverlay, { color: e.target.value })}
                  className="w-full h-8 rounded border border-gray-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPanel;