// Example usage of the Nity game engine
import { Game, GameObject, Component, Scene } from '../../src/index.js';

// Custom component that logs every frame
class LoggerComponent extends Component {
  update(delta) {
    console.log(`LoggerComponent update, delta: ${delta.toFixed(3)}`);
  }
}

// Example scene class
class DemoScene extends Scene {
  constructor(game) {
    super(game);
    this._loggerGO = null;
  }
  async preload() {
    console.log('DemoScene preload (async)...');
    await new Promise(res => setTimeout(res, 1000)); // Simulate async load
    console.log('DemoScene preload done');
  }
  awake() {
    console.log('DemoScene awake');
    // Create a GameObject and add a LoggerComponent
    this._loggerGO = new GameObject('LoggerGO');
    this._loggerGO.addComponent(new LoggerComponent(this._loggerGO));
    this.game.addGameObject(this._loggerGO);
  }
  start() {
    console.log('DemoScene start');
  }
  update(delta) {
    // Scene-level update logic (optional)
  }
  onDestroy() {
    console.log('DemoScene destroyed');
  }
}

// Create game instance
const game = new Game({ targetFPS: 2, canvas:'gameCanvas' }); // Slow FPS for demo

(async () => {
  await game.load(DemoScene);
  game.start();
})();
