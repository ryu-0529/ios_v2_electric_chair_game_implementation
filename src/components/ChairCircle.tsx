import React from 'react';
import { Chair } from '../types';
import { BoltIcon } from '@heroicons/react/24/solid';

interface ChairCircleProps {
  chairs: Chair[];
  onChairClick: (index: number) => void;
  isSettingTrap: boolean;
}

export const ChairCircle: React.FC<ChairCircleProps> = ({ chairs, onChairClick, isSettingTrap }) => {
  const availableChairs = chairs.filter(chair => chair.isAvailable);
  
  const getChairStyle = (index: number) => {
    const totalChairs = availableChairs.length;
    const angle = (index * (360 / totalChairs)) - 90;
    const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const radius = Math.min(180, baseRadius);
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    return {
      transform: `translate(${x}px, ${y}px)`,
      position: 'absolute' as const,
      width: '60px',
      height: '70px',
      margin: '2px',
    };
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center">
      <div className="absolute w-full sm:w-[500px] h-full sm:h-[500px] flex items-center justify-center">
        {availableChairs.map((chair, index) => {
          const originalIndex = chairs.findIndex(c => c.number === chair.number);
          const isElectrified = chair.isElectrified && isSettingTrap;

          return (
            <button
              key={chair.number}
              onClick={() => onChairClick(originalIndex)}
              style={getChairStyle(index)}
              className={`
                group font-bold text-base sm:text-xl flex flex-col items-center justify-center
                relative overflow-visible
                transition-all duration-200
                hover:scale-105
              `}
            >
              {/* 椅子の背もたれ */}
              <div className={`
                absolute top-0 left-1/2 -translate-x-1/2
                w-[42px] sm:w-[56px] h-[30px] sm:h-[40px]
                rounded-t-lg
                ${isElectrified ? 'bg-yellow-500 group-hover:bg-yellow-400' : 'bg-amber-800 group-hover:bg-amber-900'}
                shadow-inner
                flex items-center justify-center
                border-b-4 ${isElectrified ? 'border-yellow-600' : 'border-amber-900'}
                transition-colors duration-200
              `}>
                <span className={`text-sm sm:text-lg font-bold ${isElectrified ? 'text-black' : 'text-white'}`}>
                  {chair.number}
                </span>
                {isElectrified && (
                  <BoltIcon className="absolute h-5 w-5 text-yellow-600 animate-pulse" />
                )}
              </div>

              {/* 椅子の座面 */}
              <div className={`
                absolute top-[30px] sm:top-[40px] left-1/2 -translate-x-1/2
                w-[48px] sm:w-[64px] h-[15px] sm:h-[20px]
                ${isElectrified ? 'bg-yellow-400 group-hover:bg-yellow-300' : 'bg-amber-700 group-hover:bg-amber-800'}
                shadow-md
                flex items-center justify-center
                transition-colors duration-200
              `} />

              {/* 前脚 */}
              <div className={`
                absolute top-[45px] sm:top-[60px] left-[9px] sm:left-[12px]
                w-[6px] sm:w-[8px] h-[20px] sm:h-[25px]
                ${isElectrified ? 'bg-yellow-600' : 'bg-amber-900'}
                rounded-b-sm
                transition-colors duration-200
              `} />
              <div className={`
                absolute top-[45px] sm:top-[60px] right-[9px] sm:right-[12px]
                w-[6px] sm:w-[8px] h-[20px] sm:h-[25px]
                ${isElectrified ? 'bg-yellow-600' : 'bg-amber-900'}
                rounded-b-sm
                transition-colors duration-200
              `} />

              {/* 後脚 */}
              <div className={`
                absolute top-[45px] sm:top-[60px] left-[33px] sm:left-[44px]
                w-[6px] sm:w-[8px] h-[20px] sm:h-[25px]
                ${isElectrified ? 'bg-yellow-600' : 'bg-amber-900'}
                rounded-b-sm
                transition-colors duration-200
              `} />
              <div className={`
                absolute top-[45px] sm:top-[60px] right-[33px] sm:right-[44px]
                w-[6px] sm:w-[8px] h-[20px] sm:h-[25px]
                ${isElectrified ? 'bg-yellow-600' : 'bg-amber-900'}
                rounded-b-sm
                transition-colors duration-200
              `} />

              {/* 椅子の影 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[52px] sm:w-[70px] h-2 bg-black/10 rounded-full blur-sm" />

              {/* 電撃エフェクト */}
              {isElectrified && (
                <div className="absolute inset-0 bg-yellow-300/20 rounded-lg animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};