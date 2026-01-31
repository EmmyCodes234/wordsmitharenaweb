
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
    light: 'bg-white text-[#5C2A11] border-b-4 border-stone-200',
    dark: 'bg-[#5C2A11] text-white border-b-4 border-black',
    orange: 'bg-[#CC5500] text-white border-b-4 border-[#994000]'
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colors[variant]}
      rounded-lg 
      flex items-center justify-center 
      relative 
      select-none 
      font-display
      ${className}
    `}>
      <span className="uppercase">{letter}</span>
      <span className="absolute bottom-1 right-1 text-[10px] font-bold opacity-60">
        {points}
      </span>
    </div>
  );
};

export default ScrabbleTile;
