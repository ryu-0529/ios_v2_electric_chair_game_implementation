import React, { useState } from 'react';
import { BoltIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { RulesPopup } from './RulesPopup';
import { SilentModeNotice } from './SilentModeNotice';

interface HomeScreenProps {
  onStartGame: (player1Name: string, player2Name: string, firstPlayer: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [firstPlayer, setFirstPlayer] = useState<number>(1);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showSilentModeNotice, setShowSilentModeNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player1Name.trim() || !player2Name.trim()) {
      setError('両プレイヤーの名前を入力してください');
      return;
    }

    if (player1Name.trim() === player2Name.trim()) {
      setError('異なる名前を入力してください');
      return;
    }

    setError('');
    setShowSilentModeNotice(true);
  };

  const handleSilentModeConfirm = () => {
    setShowSilentModeNotice(false);
    onStartGame(player1Name.trim(), player2Name.trim(), firstPlayer);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <button
        onClick={() => setShowRules(true)}
        className="fixed top-4 right-4 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 group animate-pulse hover:animate-none"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
        <span className="font-bold">ルールを確認</span>
        <div className="absolute inset-0 bg-yellow-300/10 rounded-lg blur-sm group-hover:bg-yellow-300/20 transition-all duration-200" />
      </button>

      <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-8 border border-yellow-400/20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4">
            <BoltIcon className="h-16 w-16 sm:h-24 sm:w-24 text-yellow-300 animate-pulse filter drop-shadow-lg" />
            <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-50 animate-pulse" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold select-none">
            <span className="text-yellow-300 animate-neon bg-black/50 px-4 py-2 rounded-lg inline-block">
              電気椅子取りゲーム
            </span>
          </h1>
          
          {error && (
            <div className="text-red-400 text-sm text-center font-medium mt-4">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="player1" className="block text-sm font-medium text-yellow-300/80">
              プレイヤー1の名前
            </label>
            <input
              type="text"
              id="player1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="mt-1 block w-full rounded-md border-yellow-400/30 bg-black/30 text-yellow-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400/50 p-2 border"
              required
              maxLength={10}
              placeholder="10文字以内で入力"
            />
          </div>

          <div>
            <label htmlFor="player2" className="block text-sm font-medium text-yellow-300/80">
              プレイヤー2の名前
            </label>
            <input
              type="text"
              id="player2"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="mt-1 block w-full rounded-md border-yellow-400/30 bg-black/30 text-yellow-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400/50 p-2 border"
              required
              maxLength={10}
              placeholder="10文字以内で入力"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-yellow-300/80">
              先行プレイヤー
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={firstPlayer === 1}
                  onChange={() => setFirstPlayer(1)}
                  className="h-4 w-4 text-yellow-400 border-yellow-400/30 bg-black/30"
                />
                <span className="text-yellow-300">{player1Name || 'プレイヤー1'}</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={firstPlayer === 2}
                  onChange={() => setFirstPlayer(2)}
                  className="h-4 w-4 text-yellow-400 border-yellow-400/30 bg-black/30"
                />
                <span className="text-yellow-300">{player2Name || 'プレイヤー2'}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 relative group"
          >
            <span className="relative z-10">ゲームを始める</span>
            <div className="absolute inset-0 bg-yellow-200 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-200" />
          </button>
        </form>
      </div>

      <RulesPopup isOpen={showRules} onClose={() => setShowRules(false)} />
      <SilentModeNotice 
        isOpen={showSilentModeNotice} 
        onConfirm={handleSilentModeConfirm}
        onCancel={() => setShowSilentModeNotice(false)}
      />
    </div>
  );
};