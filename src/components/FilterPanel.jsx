import React from 'react';
import { Lock } from 'lucide-react';

const FilterPanel = ({ appliedFilter, setAppliedFilter, isSubscribed }) => {
  const filters = [
    { id: 'none', name: 'Original', css: 'none', premium: false },
    { id: 'vintage', name: 'Vintage', css: 'sepia(50%) hue-rotate(30deg)', premium: false },
    { id: 'noir', name: 'Film Noir', css: 'grayscale(100%) contrast(120%)', premium: false },
    { id: 'warm', name: 'Warm', css: 'hue-rotate(20deg) saturate(120%)', premium: false },
    { id: 'cool', name: 'Cool Blue', css: 'hue-rotate(180deg) saturate(110%)', premium: true },
    { id: 'dramatic', name: 'Dramatic', css: 'contrast(150%) brightness(90%)', premium: true },
    { id: 'dreamy', name: 'Dreamy', css: 'blur(0.5px) brightness(110%) saturate(80%)', premium: true },
    { id: 'neon', name: 'Neon', css: 'saturate(200%) hue-rotate(90deg) brightness(110%)', premium: true },
  ];

  const handleFilterClick = (filter) => {
    if (filter.premium && !isSubscribed) {
      alert('This filter requires a Pro subscription. Please upgrade to access premium features.');
      return;
    }
    setAppliedFilter(filter.id === 'none' ? null : filter);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Artistic Filters</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter)}
            disabled={filter.premium && !isSubscribed}
            className={`relative p-3 rounded-lg border transition-all ${
              appliedFilter?.id === filter.id
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-gray-600 hover:border-gray-500'
            } ${
              filter.premium && !isSubscribed
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >
            <div className="aspect-square w-full bg-gradient-to-br from-purple-400 to-pink-400 rounded mb-2"
                 style={{ filter: filter.css }}>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-medium">{filter.name}</span>
              {filter.premium && !isSubscribed && (
                <Lock className="w-3 h-3 text-yellow-400" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;