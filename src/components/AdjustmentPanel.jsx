import React from 'react';
import SliderControl from './SliderControl';

const AdjustmentPanel = ({ adjustments, setAdjustments }) => {
  const handleAdjustmentChange = (key, value) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white">Basic Adjustments</h4>
      
      <SliderControl
        label="Brightness"
        value={adjustments.brightness}
        onChange={(value) => handleAdjustmentChange('brightness', value)}
        min={0}
        max={200}
        defaultValue={100}
      />
      
      <SliderControl
        label="Contrast"
        value={adjustments.contrast}
        onChange={(value) => handleAdjustmentChange('contrast', value)}
        min={0}
        max={200}
        defaultValue={100}
      />
      
      <SliderControl
        label="Saturation"
        value={adjustments.saturation}
        onChange={(value) => handleAdjustmentChange('saturation', value)}
        min={0}
        max={200}
        defaultValue={100}
      />
      
      <SliderControl
        label="Exposure"
        value={adjustments.exposure}
        onChange={(value) => handleAdjustmentChange('exposure', value)}
        min={0}
        max={200}
        defaultValue={100}
      />
    </div>
  );
};

export default AdjustmentPanel;