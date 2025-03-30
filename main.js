import {GameMessage, GameStart} from './src/gui.js';
import { Game } from './src/game.js';

const game = new Game();
const startMenu = new GameStart(() => game.startGame());
// game.startGame();
