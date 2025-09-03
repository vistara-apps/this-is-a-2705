import React from 'react';
import { Sliders, Palette, Type, Eraser } from 'lucide-react';

const ToolBar = ({ activeTab, setActiveTab }) => {
  const tools = [
    { id: 'adjustments', icon: Sliders, label: 'Adjustments' },
    { id: 'filters', icon: Palette, label: 'Filters' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'removal', icon: Eraser, label: 'Remove Objects' },
  ];

  return (
    <div className="glass-effect rounded-lg p-2">
      <div className="space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                activeTab === tool.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolBar;