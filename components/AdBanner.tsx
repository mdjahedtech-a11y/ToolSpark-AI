import React from 'react';

interface AdBannerProps {
  location: 'header' | 'footer' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ location }) => {
  let heightClass = 'h-24';
  let widthClass = 'w-full';
  
  if (location === 'header') {
    heightClass = 'h-20 sm:h-24';
  } else if (location === 'inline') {
    heightClass = 'h-60';
  }

  return (
    <div className={`flex items-center justify-center my-4 ${widthClass}`}>
      <div className={`${widthClass} ${heightClass} bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-2 overflow-hidden relative group`}>
        <span className="text-xs font-semibold tracking-wider uppercase mb-1 bg-gray-300 dark:bg-gray-700 px-2 py-0.5 rounded">Ad Space</span>
        <p className="text-sm text-center">
            {location === 'header' && 'Top Banner Ad (Adsterra)'}
            {location === 'footer' && 'Bottom Tool Banner'}
            {location === 'inline' && 'Display Ad'}
        </p>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
};