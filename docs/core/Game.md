# Game Class Documentation

The `Game` class is the main entry point for NityJS applications. It manages the game loop, canvas rendering, and coordinates all game systems.

## Overview

```javascript
import { Game } from 'nity-engine';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
```

## Constructor

### `new Game(canvas)`

Creates a new game instance.

**Parameters:**
- `canvas` (HTMLCanvasElement) - The canvas element where the game will be rendered

**Example:**
```javascript
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
```

## Properties

### `canvas`
- **Type:** `HTMLCanvasElement`
- **Description:** The canvas element used for rendering

### `ctx`
- **Type:** `CanvasRenderingContext2D`
- **Description:** The 2D rendering context

### `scene`
- **Type:** `Scene`
- **Description:** The currently active scene

### `paused`
- **Type:** `boolean`
- **Description:** Whether the game is paused

### `mainCamera`
- **Type:** `GameObject`
- **Description:** The main camera GameObject (must have CameraComponent)

## Methods

### `launch(scene)`

Initializes and starts the game with the specified scene.

**Parameters:**
- `scene` (Scene) - The scene to load and start

**Example:**
```javascript
const scene = new Scene({
  create(scene) {
    // Setup your scene here
  }
});

game.launch(scene);
```

### `loadScene(scene)`

Loads a new scene without starting the game loop.

**Parameters:**
- `scene` (Scene) - The scene to load

**Returns:** `Promise<void>`

### `start()`

Starts the game loop. Usually called automatically by `launch()`.

### `pause()`

Pauses the game loop. Updates and rendering stop, but the loop continues.

```javascript
game.pause();
```

### `resume()`

Resumes the game loop after being paused.

```javascript
game.resume();
```

## Game Loop

The game loop runs the following sequence each frame:

1. **Input Update** - Process keyboard and mouse input
2. **Scene Update** - Update all GameObjects and Components
3. **Camera Transform** - Apply camera transformations
4. **Late Update** - Final update pass
5. **Rendering** - Draw all visible objects

## Static Properties

### `Game.instance`
- **Type:** `Game`
- **Description:** Singleton reference to the current game instance

## Complete Example

```javascript
import { Game, Scene, GameObject, ShapeComponent, RigidbodyComponent, Input } from 'nity-engine';

// Create canvas
const canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;

// Create game
const game = new Game(canvas);

// Player movement component
class PlayerMovement extends Component {
  speed = 200;
  
  update() {
    const rb = this.gameObject.getComponent(RigidbodyComponent);
    if (!rb) return;
    
    const moveX = (Input.isKeyDown('d') ? 1 : 0) - (Input.isKeyDown('a') ? 1 : 0);
    const moveY = (Input.isKeyDown('s') ? 1 : 0) - (Input.isKeyDown('w') ? 1 : 0);
    
    rb.velocity.x = moveX * this.speed;
    rb.velocity.y = moveY * this.speed;
  }
}

// Create scene
const scene = new Scene({
  create(scene) {
    // Create player
    const player = new GameObject(100, 100);
    player.name = "Player";
    player.addComponent(new ShapeComponent(40, 40, '#ff4444'));
    player.addComponent(new RigidbodyComponent({ gravity: false }));
    player.addComponent(new PlayerMovement());
    
    scene.add(player);
    
    // Create obstacle
    const obstacle = new GameObject(300, 200);
    obstacle.name = "Obstacle";
    obstacle.addComponent(new ShapeComponent(60, 60, '#444444'));
    obstacle.addComponent(new BoxColliderComponent(60, 60));
    
    scene.add(obstacle);
  }
});

// Handle pause/resume with spacebar
Input.onKeyDownEvent(' ', () => {
  if (game.paused) {
    game.resume();
    console.log('Game resumed');
  } else {
    game.pause();
    console.log('Game paused');
  }
});

// Start the game
game.launch(scene);
```

## Best Practices

1. **Single Game Instance**: Only create one Game instance per application
2. **Canvas Setup**: Set canvas dimensions before creating the Game
3. **Scene Management**: Use `loadScene()` to switch between scenes
4. **Error Handling**: Wrap game initialization in try-catch blocks
5. **Performance**: Use `pause()` when the game window loses focus

## Common Patterns

### Scene Switching
```javascript
// Create multiple scenes
const menuScene = new Scene({ create: createMenu });
const gameScene = new Scene({ create: createGame });

// Switch scenes
async function switchToGame() {
  await game.loadScene(gameScene);
}
```

### Camera Control
```javascript
// Setup camera
const cameraObject = new GameObject(0, 0);
cameraObject.addComponent(new CameraComponent());
game.mainCamera = cameraObject;
scene.add(cameraObject);
```

### Responsive Canvas
```javascript
function resizeCanvas() {
  game.canvas.width = window.innerWidth;
  game.canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
```
