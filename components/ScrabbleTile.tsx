
import React from 'react';

interface ScrabbleTileProps {
  letter: string;
  points: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'light' | 'dark' | 'orange';
}

const ScrabbleTile: React.FC<ScrabbleTileProps> = ({ 
  letter, 
  points, 
  size = 'md', 
  className = '',
  variant = 'light'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-5xl'
  };

  const colors = {
    light: 'bg-white text-black border-b border-black/10 shadow-sm',
    dark: 'bg-[#111111] text-noovo-yellow border-b border-black',
    orange: 'bg-noovo-yellow text-black border-b border-[#E5A600]'
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colors[variant]}
      rounded-lg flex flex-col items-center justify-center 
      relative select-none font-medium
      ${className}
    `}>
      <span className="uppercase">{letter}</span>
      <span className="absolute bottom-1 right-1 text-[9px] font-semibold opacity-50">
        {points}
      </span>
    </div>
  );
};

export default ScrabbleTile;
