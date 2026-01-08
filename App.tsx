
import React, { useState, useEffect, useRef } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { ComparisonView } from './components/ComparisonView';
import { ColorPicker } from './components/ColorPicker';
import { GeminiService } from './services/geminiService';
import { ImageData, ProcessingState, BgColor } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<BgColor>('blue');
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    progressMessage: '',
  });

  const lastProcessedRef = useRef<{ id: string; color: BgColor } | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const processImage = async (image: ImageData, color: BgColor) => {
    setProcessing({ 
      isProcessing: true, 
      error: null, 
      progressMessage: `Auto-applying ${color} background...` 
    });

    try {
      const result = await GeminiService.removeBackground(
        image.base64, 
        image.mimeType,
        color
      );
      setProcessedImage(result);
      lastProcessedRef.current = { id: image.url, color };
      setProcessing(prev => ({ ...prev, isProcessing: false, progressMessage: 'Success!' }));
    } catch (err: any) {
      setProcessing({ 
        isProcessing: false, 
        error: err.message || 'An unexpected error occurred.', 
        progressMessage: '' 
      });
    }
  };

  const handleImageSelect = (image: ImageData) => {
    setSelectedImage(image);
    setProcessedImage(null);
    setProcessing({ isProcessing: false, error: null, progressMessage: '' });
    processImage(image, bgColor);
  };

  const handleColorChange = (newColor: BgColor) => {
    setBgColor(newColor);
    if (selectedImage) {
      processImage(selectedImage, newColor);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `clearbg-${bgColor}-${selectedImage?.name || 'result'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setBgColor('blue');
    lastProcessedRef.current = null;
    setProcessing({ isProcessing: false, error: null, progressMessage: '' });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-transform group-hover:scale-105">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ClearBG <span className="text-indigo-600">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</a>
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">API</a>
            </nav>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591-1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <Button variant="secondary" className="!px-4 !py-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">Sign In</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section - Always Visible */}
        <div className={`text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ${selectedImage ? 'mb-8' : 'mb-16'}`}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            <a 
              href="https://csc-jakir.lovable.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 hover:opacity-80 transition-opacity cursor-pointer"
            >
              Bulbul Computer Centre
            </a> 
            <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Background Removal.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 font-semibold tracking-tight">
            Develop by <a 
              href="https://wa.me/917002443108" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors underline decoration-2 underline-offset-4"
            >
              Jahangir Hussain
            </a>
          </p>
        </div>

        {/* Upload/Workspace Area */}
        <div className="max-w-4xl mx-auto">
          {!selectedImage ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <ImageUploader onImageSelect={handleImageSelect} />
              
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Full Auto</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Processing starts immediately after you drop your file.</p>
                </div>
                <div className="p-4">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Studio Ready</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Default blue background for professional portraits.</p>
                </div>
                <div className="p-4">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Lossless Quality</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">High-fidelity extraction using multimodal AI vision.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
                <ComparisonView 
                  original={selectedImage} 
                  processed={processedImage} 
                  isLoading={processing.isProcessing}
                />
                
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <ColorPicker 
                    selectedColor={bgColor} 
                    onColorChange={handleColorChange} 
                    disabled={processing.isProcessing}
                  />
                  
                  <div className="flex flex-col sm:flex-row items-stretch md:justify-end gap-3">
                    <Button variant="secondary" onClick={handleReset} disabled={processing.isProcessing} className="dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200">
                      Upload New
                    </Button>
                    
                    {processedImage && !processing.isProcessing && (
                      <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                        Download HD
                      </Button>
                    )}
                  </div>
                </div>

                {processing.error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <p className="text-sm font-medium">{processing.error}</p>
                    <Button variant="outline" onClick={() => processImage(selectedImage, bgColor)} className="ml-auto text-xs py-1 px-3">Retry</Button>
                  </div>
                )}
                
                {processing.isProcessing && (
                  <div className="mt-6">
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full animate-[progress_2s_infinite]"></div>
                    </div>
                    <p className="text-xs text-center text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest animate-pulse">
                      {processing.progressMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-12 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="font-bold text-gray-900 dark:text-white">ClearBG AI</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact Us</a>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; 2024 ClearBG AI. Powered by Gemini.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
