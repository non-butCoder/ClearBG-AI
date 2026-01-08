
import React from 'react';
import { ImageData } from '../types';

interface ComparisonViewProps {
  original: ImageData;
  processed: string | null;
  isLoading: boolean;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ original, processed, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div className="space-y-3">
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full uppercase tracking-wider">Original</span>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 group shadow-sm">
          <img 
            src={original.url} 
            alt="Original" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">Processed</span>
        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/50 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] dark:bg-slate-900 group shadow-sm">
          {isLoading ? (
            <div className="w-full h-full p-4 flex items-center justify-center bg-gray-50/50 dark:bg-slate-800/50 backdrop-blur-[2px]">
              <div className="w-full h-full rounded-lg relative overflow-hidden bg-gray-200 dark:bg-slate-700 animate-pulse">
                {/* Skeleton Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-slate-600" />
                  <div className="h-4 w-32 bg-gray-300 dark:bg-slate-600 rounded" />
                  <div className="h-3 w-20 bg-gray-300 dark:bg-slate-600 rounded" />
                </div>
              </div>
            </div>
          ) : processed ? (
            <img 
              src={processed} 
              alt="Processed" 
              className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-gray-500 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6.75v10.5a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-sm font-medium">Result will appear here</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
