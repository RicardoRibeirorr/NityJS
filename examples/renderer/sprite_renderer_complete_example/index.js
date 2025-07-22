// === Simple SpriteRenderer Test - Step by Step ===
import {
  Game,
  Scene,
  GameObject,
  SpriteAsset,
  SpriteRendererComponent,
  CameraComponent,
  Vector2,
} from '../../../dist/nity.module.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

// Global sprite renderer reference for controls
let spriteRenderer;
let currentOptions = {
  width: 100,
  height: 100,
  opacity: 1.0
};

const scene = new Scene({
  async create(scene) {
    // Load the arrow sprite
    const arrowSprite = new SpriteAsset("SPS_Arrow", "./assets/arrow_top.png");
    await arrowSprite.load();

    // Create game object with sprite renderer
    const obj = new GameObject(new Vector2(0, 0));
    spriteRenderer = new SpriteRendererComponent("SPS_Arrow", currentOptions);
    obj.addComponent(spriteRenderer);
    scene.add(obj);

    // Add camera
    const cameraObject = new GameObject(new Vector2(0, 0));
    cameraObject.addComponent(new CameraComponent(game.canvas, 1));
    scene.add(cameraObject);
    game.mainCamera = cameraObject;
  }
});

// Helper function to update sprite renderer options
function updateSpriteRenderer() {
  if (spriteRenderer) {
    spriteRenderer.setOptions(currentOptions);
    updateDisplayValues();
  }
}

// Update display values
function updateDisplayValues() {
  document.getElementById('widthValue').textContent = currentOptions.width;
  document.getElementById('heightValue').textContent = currentOptions.height;
  document.getElementById('opacityValue').textContent = currentOptions.opacity.toFixed(2);
}

// Control functions
function changeWidth(delta) {
  currentOptions.width = Math.max(10, currentOptions.width + delta);
  updateSpriteRenderer();
}

function changeHeight(delta) {
  currentOptions.height = Math.max(10, currentOptions.height + delta);
  updateSpriteRenderer();
}

function changeOpacity(delta) {
  currentOptions.opacity = Math.max(0, Math.min(1, currentOptions.opacity + delta));
  updateSpriteRenderer();
}

function resetAll() {
  currentOptions = {
    width: 100,
    height: 100,
    opacity: 1.0
  };
  updateSpriteRenderer();
}

// Make functions globally available
window.changeWidth = changeWidth;
window.changeHeight = changeHeight;
window.changeOpacity = changeOpacity;
window.resetAll = resetAll;

// Start the game
game.configure({debug: true});
game.launch(scene);

// Initialize display values when page loads
window.addEventListener('load', () => {
  updateDisplayValues();
});