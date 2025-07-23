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
let gameObject; // Reference to the GameObject for rotation
let currentOptions = {
  width: 100,
  height: 100,
  opacity: 1.0,
  color: "#FFFFFF",
  flipX: false,
  flipY: false
};

const scene = new Scene({
  async create(scene) {
    // Load the arrow sprite
    const arrowSprite = new SpriteAsset("SPS_Arrow", "./assets/arrow_top.png");
    await arrowSprite.load();

    // Create game object with sprite renderer
    gameObject = new GameObject(new Vector2(0, 0));
    spriteRenderer = new SpriteRendererComponent("SPS_Arrow", currentOptions);
    gameObject.addComponent(spriteRenderer);
    scene.add(gameObject);

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
  document.getElementById('colorValue').textContent = currentOptions.color;
  document.getElementById('flipXValue').textContent = currentOptions.flipX;
  document.getElementById('flipYValue').textContent = currentOptions.flipY;
  
  // Update flip button states
  const flipXButton = document.getElementById('flipXButton');
  const flipYButton = document.getElementById('flipYButton');
  
  if (flipXButton) {
    flipXButton.classList.toggle('active', currentOptions.flipX);
  }
  if (flipYButton) {
    flipYButton.classList.toggle('active', currentOptions.flipY);
  }
  
  // Update rotation display (convert radians to degrees)
  if (gameObject) {
    const degrees = Math.round((gameObject.rotation * 180 / Math.PI) % 360);
    document.getElementById('rotationValue').textContent = degrees + '°';
  }
}

// Control functions
function changeWidth(delta) {
  currentOptions.width = Math.max(-100, currentOptions.width + delta);
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

function setColor(color) {
  currentOptions.color = color;
  updateSpriteRenderer();
}

function changeRotation(degrees) {
  if (gameObject) {
    gameObject.rotation += degrees * Math.PI / 180; // Convert degrees to radians
    updateDisplayValues();
  }
}

function setRotation(degrees) {
  if (gameObject) {
    gameObject.rotation = degrees * Math.PI / 180; // Convert degrees to radians
    updateDisplayValues();
  }
}

function toggleFlipX() {
  currentOptions.flipX = !currentOptions.flipX;
  updateSpriteRenderer();
}

function toggleFlipY() {
  currentOptions.flipY = !currentOptions.flipY;
  updateSpriteRenderer();
}

function resetAll() {
  currentOptions = {
    width: 100,
    height: 100,
    opacity: 1.0,
    color: "#FFFFFF",
    flipX: false,
    flipY: false
  };
  if (gameObject) {
    gameObject.rotation = 0;
  }
  updateSpriteRenderer();
}

// Make functions globally available
window.changeWidth = changeWidth;
window.changeHeight = changeHeight;
window.changeOpacity = changeOpacity;
window.setColor = setColor;
window.changeRotation = changeRotation;
window.setRotation = setRotation;
window.toggleFlipX = toggleFlipX;
window.toggleFlipY = toggleFlipY;
window.resetAll = resetAll;

// Start the game
game.configure({debug: true});
game.launch(scene);

// Initialize display values when page loads
window.addEventListener('load', () => {
  updateDisplayValues();
});