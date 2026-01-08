
import React from 'react';
import { BgColor } from '../types';

interface ColorPickerProps {
  selectedColor: BgColor;
  onColorChange: (color: BgColor) => void;
  disabled?: boolean;
}

const colors: { id: BgColor; hex: string; label: string }[] = [
  { id: 'white', hex: '#FFFFFF', label: 'White' },
  { id: 'blue', hex: '#2563EB', label: 'Blue' },
  { id: 'sky blue', hex: '#7DD3FC', label: 'Sky' },
  { id: 'red', hex: '#EF4444', label: 'Red' },
  { id: 'purple', hex: '#A855F7', label: 'Purple' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, disabled }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Background Color</span>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            disabled={disabled}
            title={color.label}
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all duration-200 
              ${selectedColor === color.id 
                ? 'border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900/40' 
                : 'border-transparent dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-105'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ backgroundColor: color.hex }}
          >
            {selectedColor === color.id && (
              <div className={`absolute inset-0 flex items-center justify-center ${color.id === 'white' ? 'text-gray-900' : 'text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
