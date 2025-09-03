import React from 'react';
import { Sliders, RotateCcw, Loader2 } from 'lucide-react';

const AdjustmentsPanel = ({ adjustments, updateAdjustment, resetAdjustments, loading }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5" />
          <span>Adjustments</span>
        </h4>
        
        <button
          onClick={resetAdjustments}
          disabled={loading}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Reset adjustments"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Brightness slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Brightness</label>
            <span className="text-xs text-gray-500">{adjustments.brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.brightness}
            onChange={(e) => updateAdjustment('brightness', parseInt(e.target.value))}
            disabled={loading}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>
        
        {/* Contrast slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Contrast</label>
            <span className="text-xs text-gray-500">{adjustments.contrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.contrast}
            onChange={(e) => updateAdjustment('contrast', parseInt(e.target.value))}
            disabled={loading}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>
        
        {/* Saturation slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Saturation</label>
            <span className="text-xs text-gray-500">{adjustments.saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.saturation}
            onChange={(e) => updateAdjustment('saturation', parseInt(e.target.value))}
            disabled={loading}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>
        
        {/* Hue slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Hue</label>
            <span className="text-xs text-gray-500">{adjustments.hue}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={adjustments.hue}
            onChange={(e) => updateAdjustment('hue', parseInt(e.target.value))}
            disabled={loading}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-180°</span>
            <span>0°</span>
            <span>180°</span>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin mr-2" />
            <span className="text-sm text-gray-400">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdjustmentsPanel;

