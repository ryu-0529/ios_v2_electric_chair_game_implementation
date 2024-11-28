import React from 'react';
import { BoltIcon } from '@heroicons/react/24/solid';

interface ShockEffectProps {
  isVisible: boolean;
}

export const ShockEffect: React.FC<ShockEffectProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-yellow-400 bg-opacity-50 z-50 flex items-center justify-center animate-pulse">
      <BoltIcon className="h-64 w-64 text-yellow-600 animate-bounce" />
    </div>
  );
};