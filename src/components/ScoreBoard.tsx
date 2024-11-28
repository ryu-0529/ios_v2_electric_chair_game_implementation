import React from 'react';
import { PlayerNames } from '../types';
import { BoltIcon } from '@heroicons/react/24/solid';

interface ScoreBoardProps {
  player1Score: number;
  player2Score: number;
  player1Shocks: number;
  player2Shocks: number;
  playerNames: PlayerNames;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  player1Score,
  player2Score,
  player1Shocks,
  player2Shocks,
  playerNames,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-yellow-400/20">
        <h2 className="text-xl font-bold text-yellow-300 mb-3">{playerNames.player1}</h2>
        <p className="text-4xl font-bold text-yellow-300 mb-2 animate-neon">{player1Score}</p>
        <p className="text-sm text-red-400 flex items-center justify-center gap-1">
          <BoltIcon className="h-4 w-4 animate-pulse" />
          ショック: {player1Shocks}/3
        </p>
      </div>
      <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-yellow-400/20">
        <h2 className="text-xl font-bold text-yellow-300 mb-3">{playerNames.player2}</h2>
        <p className="text-4xl font-bold text-yellow-300 mb-2 animate-neon">{player2Score}</p>
        <p className="text-sm text-red-400 flex items-center justify-center gap-1">
          <BoltIcon className="h-4 w-4 animate-pulse" />
          ショック: {player2Shocks}/3
        </p>
      </div>
    </div>
  );
};