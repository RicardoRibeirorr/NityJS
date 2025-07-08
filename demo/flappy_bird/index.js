import { Game } from '../../dist/nity.module.min.js';
import { createFlappyScene } from './scenes/FlappyScene.js';

const canvas = document.getElementById('game');

const game = new Game(canvas);

const scene = createFlappyScene(game);
game.launch(scene);
