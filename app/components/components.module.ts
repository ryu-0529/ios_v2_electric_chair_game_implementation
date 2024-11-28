import { registerElement } from '@nativescript/core';

registerElement('score-board', () => require('./score-board/score-board').ScoreBoard);
registerElement('chair-grid', () => require('./chair-grid/chair-grid').ChairGrid);