import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-cinematic-800 border border-cinematic-700 rounded-xl p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};