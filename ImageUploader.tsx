
import React, { useCallback, useState } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImageSelect: (image: ImageData) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      onImageSelect({
        base64,
        mimeType: file.type,
        name: file.name,
        url: URL.createObjectURL(file),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' 
          : 'border-gray-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800 shadow-sm'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input 
        id="fileInput"
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleChange}
      />
      
      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 3 3m-3-3v15" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Upload an Image</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Drag and drop your photo here, or click to browse files
      </p>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
        Supports JPG, PNG, WEBP
      </p>
    </div>
  );
};
