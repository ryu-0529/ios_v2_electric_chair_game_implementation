import { Observable } from '@nativescript/core';

interface Chair {
    number: number;
    isElectrified: boolean;
    isAvailable: boolean;
    index: number;
}

export class GameViewModel extends Observable {
    private _chairs: Chair[] = [];
    private _currentPlayer: number = 1;
    private _isSettingTrap: boolean = true;
    private _player1Score: number = 0;
    private _player2Score: number = 0;
    private _player1Shocks: number = 0;
    private _player2Shocks: number = 0;
    private _message: string = 'プレイヤー1が電気椅子を仕掛けてください';

    constructor() {
        super();
        this.initializeGame();
    }

    private initializeGame(): void {
        this._chairs = Array.from({ length: 12 }, (_, i) => ({
            number: i + 1,
            isElectrified: false,
            isAvailable: true,
            index: i
        }));
        this.notifyPropertyChange('chairs', this._chairs);
    }

    get chairs(): Chair[] {
        return this._chairs;
    }

    get player1Score(): number {
        return this._player1Score;
    }

    get player2Score(): number {
        return this._player2Score;
    }

    get message(): string {
        return this._message;
    }

    get player1Shocks(): number {
        return this._player1Shocks;
    }

    get player2Shocks(): number {
        return this._player2Shocks;
    }

    onChairTap(args: any): void {
        const index = parseInt(args.object.get('index'), 10);
        const chair = this._chairs[index];
        
        if (!chair || !chair.isAvailable) return;

        if (this._isSettingTrap) {
            chair.isElectrified = true;
            this._isSettingTrap = false;
            this._message = `プレイヤー${this._currentPlayer === 1 ? '2' : '1'}が椅子を選んでください`;
        } else {
            if (chair.isElectrified) {
                if (this._currentPlayer === 1) {
                    this._player1Score = 0;
                    this._player1Shocks++;
                } else {
                    this._player2Score = 0;
                    this._player2Shocks++;
                }
                this._message = `プレイヤー${this._currentPlayer}が電気椅子に当たりました！`;
            } else {
                if (this._currentPlayer === 1) {
                    this._player1Score += chair.number;
                } else {
                    this._player2Score += chair.number;
                }
            }

            chair.isAvailable = false;
            this._isSettingTrap = true;
            this._currentPlayer = this._currentPlayer === 1 ? 2 : 1;
            
            if (this.checkGameEnd()) {
                this.announceWinner();
            } else {
                this._message = `プレイヤー${this._currentPlayer}が電気椅子を仕掛けてください`;
            }
        }

        this.notifyOfPropertyChange();
    }

    private checkGameEnd(): boolean {
        return (
            this._player1Shocks >= 3 ||
            this._player2Shocks >= 3 ||
            !this._chairs.some(chair => chair.isAvailable)
        );
    }

    private announceWinner(): void {
        if (this._player1Shocks >= 3) {
            this._message = 'プレイヤー2の勝利！';
        } else if (this._player2Shocks >= 3) {
            this._message = 'プレイヤー1の勝利！';
        } else {
            this._message = this._player1Score > this._player2Score
                ? 'プレイヤー1の勝利！'
                : this._player2Score > this._player1Score
                    ? 'プレイヤー2の勝利！'
                    : '引き分け！';
        }
    }

    private notifyOfPropertyChange(): void {
        this.notifyPropertyChange('chairs', [...this._chairs]);
        this.notifyPropertyChange('player1Score', this._player1Score);
        this.notifyPropertyChange('player2Score', this._player2Score);
        this.notifyPropertyChange('message', this._message);
        this.notifyPropertyChange('player1Shocks', this._player1Shocks);
        this.notifyPropertyChange('player2Shocks', this._player2Shocks);
    }

    resetGame(): void {
        this._currentPlayer = 1;
        this._isSettingTrap = true;
        this._player1Score = 0;
        this._player2Score = 0;
        this._player1Shocks = 0;
        this._player2Shocks = 0;
        this._message = 'プレイヤー1が電気椅子を仕掛けてください';
        this.initializeGame();
        this.notifyOfPropertyChange();
    }
}