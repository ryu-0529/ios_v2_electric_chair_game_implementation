import React from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface SilentModeNoticeProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SilentModeNotice: React.FC<SilentModeNoticeProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full border border-yellow-400/20 relative animate-fade-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-400 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <BellIcon className="h-12 w-12 text-yellow-300 animate-pulse" />
              <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-30 animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-yellow-300 text-center mb-4 animate-neon">
            サイレントモードの解除
          </h2>

          <p className="text-yellow-100/80 text-center mb-6">
            ゲーム中の効果音や振動を楽しむために、
            端末のサイレントモードを解除することをお勧めします。
          </p>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10 transition-colors duration-200"
            >
              後で
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
            >
              開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};