import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ChairCircle } from './components/ChairCircle';
import { ScoreBoard } from './components/ScoreBoard';
import { VictoryScreen } from './components/VictoryScreen';
import { ShockEffect } from './components/ShockEffect';
import { Chair, PlayerNames } from './types';

const playThunderEffect = async (duration: number) => {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 200, 50, 400]);
  }
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (AudioContext) {
    const context = new AudioContext();
    const thunderOsc = context.createOscillator();
    const thunderGain = context.createGain();
    const subThunderOsc = context.createOscillator();
    const subThunderGain = context.createGain();
    const bufferSize = 4 * context.sampleRate;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = context.createGain();
    const noiseFilter = context.createBiquadFilter();
    const crashFilter = context.createBiquadFilter();
    
    crashFilter.type = 'highpass';
    crashFilter.frequency.setValueAtTime(2000, context.currentTime);
    crashFilter.Q.setValueAtTime(10, context.currentTime);
    
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(80, context.currentTime);
    noiseFilter.Q.setValueAtTime(5, context.currentTime);
    
    thunderOsc.type = 'sine';
    thunderOsc.frequency.setValueAtTime(40, context.currentTime);
    thunderOsc.frequency.exponentialRampToValueAtTime(20, context.currentTime + 0.2);
    
    subThunderOsc.type = 'triangle';
    subThunderOsc.frequency.setValueAtTime(120, context.currentTime);
    subThunderOsc.frequency.exponentialRampToValueAtTime(60, context.currentTime + 0.15);
    
    thunderGain.gain.setValueAtTime(0, context.currentTime);
    thunderGain.gain.linearRampToValueAtTime(1.5, context.currentTime + 0.05);
    thunderGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);
    
    subThunderGain.gain.setValueAtTime(0, context.currentTime);
    subThunderGain.gain.linearRampToValueAtTime(0.8, context.currentTime + 0.02);
    subThunderGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000 * 0.7);
    
    noiseGain.gain.setValueAtTime(0, context.currentTime);
    noiseGain.gain.linearRampToValueAtTime(2, context.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000 * 0.5);
    
    thunderOsc.connect(thunderGain);
    thunderGain.connect(context.destination);
    
    subThunderOsc.connect(subThunderGain);
    subThunderGain.connect(context.destination);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noise.connect(crashFilter);
    crashFilter.connect(noiseGain);
    noiseGain.connect(context.destination);
    
    thunderOsc.start(context.currentTime);
    subThunderOsc.start(context.currentTime + 0.02);
    noise.start(context.currentTime);
    
    thunderOsc.stop(context.currentTime + duration / 1000);
    subThunderOsc.stop(context.currentTime + duration / 1000);
    noise.stop(context.currentTime + duration / 1000);
  }
};

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isSettingTrap, setIsSettingTrap] = useState(true);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Shocks, setPlayer1Shocks] = useState(0);
  const [player2Shocks, setPlayer2Shocks] = useState(0);
  const [showShockEffect, setShowShockEffect] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerNames, setPlayerNames] = useState<PlayerNames>({
    player1: '',
    player2: ''
  });

  const initializeGame = (player1Name: string, player2Name: string, firstPlayer: number) => {
    const initialChairs: Chair[] = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      isElectrified: false,
      isAvailable: true,
      wasShocked: false
    }));

    setChairs(initialChairs);
    setCurrentPlayer(firstPlayer);
    setIsSettingTrap(true);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setPlayer1Shocks(0);
    setPlayer2Shocks(0);
    setShowShockEffect(false);
    setWinner(null);
    setPlayerNames({
      player1: player1Name,
      player2: player2Name
    });
    setGameStarted(true);
  };

  const checkGameEnd = (p1Shocks: number, p2Shocks: number, p1Score: number, p2Score: number, availableChairs: Chair[]) => {
    // 40点以上による勝利判定
    if (p1Score >= 40) {
      setWinner(playerNames.player1);
      return true;
    }
    if (p2Score >= 40) {
      setWinner(playerNames.player2);
      return true;
    }

    // 電撃カウントによる判定（即座に終了）
    if (p1Shocks >= 3) {
      setWinner(playerNames.player2);
      return true;
    }
    if (p2Shocks >= 3) {
      setWinner(playerNames.player1);
      return true;
    }

    // 残り椅子が1つの場合のスコアによる判定
    const remainingAvailableChairs = availableChairs.filter(chair => chair.isAvailable).length;
    if (remainingAvailableChairs === 1) {
      if (p1Score > p2Score) {
        setWinner(playerNames.player1);
      } else if (p2Score > p1Score) {
        setWinner(playerNames.player2);
      } else {
        setWinner('引き分け');
      }
      return true;
    }

    return false;
  };

  const handleChairClick = (index: number) => {
    const newChairs = [...chairs];
    const chair = newChairs[index];

    if (!chair.isAvailable) return;

    if (isSettingTrap) {
      // 前の電撃をリセット
      newChairs.forEach(c => {
        c.isElectrified = false;
      });
      
      chair.isElectrified = true;
      setChairs(newChairs);
      setIsSettingTrap(false);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    } else {
      if (chair.isElectrified) {
        playThunderEffect(1000);
        setShowShockEffect(true);
        setTimeout(() => setShowShockEffect(false), 1000);

        const newPlayer1Shocks = currentPlayer === 1 ? player1Shocks + 1 : player1Shocks;
        const newPlayer2Shocks = currentPlayer === 2 ? player2Shocks + 1 : player2Shocks;

        if (currentPlayer === 1) {
          setPlayer1Score(0);
          setPlayer1Shocks(newPlayer1Shocks);
        } else {
          setPlayer2Score(0);
          setPlayer2Shocks(newPlayer2Shocks);
        }

        // 電撃カウントが3に達した場合は即座にゲーム終了
        if (checkGameEnd(newPlayer1Shocks, newPlayer2Shocks, player1Score, player2Score, newChairs)) {
          return;
        }
      } else {
        const newPlayer1Score = currentPlayer === 1 ? player1Score + chair.number : player1Score;
        const newPlayer2Score = currentPlayer === 2 ? player2Score + chair.number : player2Score;

        if (currentPlayer === 1) {
          setPlayer1Score(newPlayer1Score);
        } else {
          setPlayer2Score(newPlayer2Score);
        }

        chair.isAvailable = false;

        // スコアと残り椅子数をチェック
        if (checkGameEnd(player1Shocks, player2Shocks, newPlayer1Score, newPlayer2Score, newChairs)) {
          setChairs(newChairs);
          return;
        }
      }

      setChairs(newChairs);
      setIsSettingTrap(true);
      setCurrentPlayer(currentPlayer);
    }
  };

  const resetGame = () => {
    initializeGame(playerNames.player1, playerNames.player2, currentPlayer === 1 ? 2 : 1);
  };

  const returnToHome = () => {
    setGameStarted(false);
  };

  const getCurrentPlayerName = () => {
    return currentPlayer === 1 ? playerNames.player1 : playerNames.player2;
  };

  if (!gameStarted) {
    return <HomeScreen onStartGame={initializeGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-12 px-4">
      <ScoreBoard
        player1Score={player1Score}
        player2Score={player2Score}
        player1Shocks={player1Shocks}
        player2Shocks={player2Shocks}
        playerNames={playerNames}
      />

      <div className="text-center mb-8">
        <p className="text-lg text-yellow-300">
          {isSettingTrap
            ? `${getCurrentPlayerName()}が電気椅子を仕掛けてください`
            : `${getCurrentPlayerName()}が椅子を選んでください`}
        </p>
      </div>

      <ChairCircle
        chairs={chairs}
        onChairClick={handleChairClick}
        isSettingTrap={isSettingTrap}
      />

      <ShockEffect isVisible={showShockEffect} />
      <VictoryScreen
        winner={winner}
        onRestart={resetGame}
        onReturnHome={returnToHome}
        player1Score={player1Score}
        player2Score={player2Score}
        playerNames={playerNames}
      />
    </div>
  );
};

export default App;