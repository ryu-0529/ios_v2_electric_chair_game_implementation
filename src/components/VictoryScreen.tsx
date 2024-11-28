import React from 'react';
import { TrophyIcon, BoltIcon } from '@heroicons/react/24/solid';
import { PlayerNames } from '../types';

interface VictoryScreenProps {
  winner: string | null;
  onRestart: () => void;
  onReturnHome: () => void;
  player1Score: number;
  player2Score: number;
  playerNames: PlayerNames;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  winner, 
  onRestart,
  onReturnHome,
  player1Score, 
  player2Score,
  playerNames
}) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in p-4">
      <div className="relative">
        <TrophyIcon className="h-32 w-32 text-yellow-300 animate-bounce mb-8" />
        <BoltIcon className="absolute top-0 right-0 h-12 w-12 text-yellow-300 animate-pulse" />
        <BoltIcon className="absolute top-0 left-0 h-12 w-12 text-yellow-300 animate-pulse" />
      </div>
      
      <h2 className="text-5xl font-bold text-yellow-300 mb-8 animate-neon text-center">
        {winner === '引き分け' ? '引き分け！' : `${winner}の勝利！`}
      </h2>
      
      <div className="flex gap-12 mb-12">
        <div className="text-center">
          <h3 className="text-xl text-yellow-300 mb-2">{playerNames.player1}</h3>
          <p className="text-4xl font-bold text-yellow-300 animate-neon">{player1Score}</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl text-yellow-300 mb-2">{playerNames.player2}</h3>
          <p className="text-4xl font-bold text-yellow-300 animate-neon">{player2Score}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReturnHome}
          className="bg-yellow-400/20 text-yellow-300 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400/30 transition-colors duration-200"
        >
          ホームに戻る
        </button>
        <button
          onClick={onRestart}
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 relative group"
        >
          <span className="relative z-10">もう一度プレイ</span>
          <div className="absolute inset-0 bg-yellow-200 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-200" />
        </button>
      </div>
    </div>
  );
};