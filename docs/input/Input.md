# Input Class Documentation

The `Input` class provides comprehensive keyboard and mouse input handling for NityJS games. It supports both immediate input detection and event-based callbacks.

## Overview

```javascript
import { Input } from 'nity-engine';

// Check if key is currently pressed
if (Input.isKeyDown('w')) {
  player.moveUp();
}

// Check for single key press (click-like)
if (Input.isKeyPressed('space')) {
  player.jump();
}

// Mouse input
if (Input.isLeftMousePressed()) {
  const mousePos = Input.getMousePosition();
  console.log('Clicked at:', mousePos);
}
```

## Initialization

The Input system is automatically initialized by the Game class. No manual setup required.

```javascript
// Automatic initialization in Game
const game = new Game(canvas);
const scene = new Scene({
  create(scene) {
    // Your game objects here
  }
});
game.launch(scene); // Input.initialize() called here
```

## Keyboard Input

### Immediate Detection Methods

#### `isKeyDown(key)`
Returns true every frame while the key is held down.

**Parameters:**
- `key` (string) - The key to check (case-insensitive)

**Example:**
```javascript
class PlayerController extends Component {
  update() {
    // Continuous movement
    const speed = 200;
    const rb = this.gameObject.getComponent(RigidbodyComponent);
    
    if (Input.isKeyDown('w') || Input.isKeyDown('ArrowUp')) {
      rb.velocity.y = -speed;
    }
    if (Input.isKeyDown('s') || Input.isKeyDown('ArrowDown')) {
      rb.velocity.y = speed;
    }
    if (Input.isKeyDown('a') || Input.isKeyDown('ArrowLeft')) {
      rb.velocity.x = -speed;
    }
    if (Input.isKeyDown('d') || Input.isKeyDown('ArrowRight')) {
      rb.velocity.x = speed;
    }
  }
}
```

#### `isKeyPressed(key)`
Returns true only on the frame when the key is first pressed (click-like behavior).

**Parameters:**
- `key` (string) - The key to check

**Example:**
```javascript
class PlayerActions extends Component {
  update() {
    // Single-shot actions
    if (Input.isKeyPressed('space')) {
      this.jump();
    }
    
    if (Input.isKeyPressed('f')) {
      this.interact();
    }
    
    if (Input.isKeyPressed('r')) {
      this.reload();
    }
  }
  
  jump() {
    console.log("Jump!"); // Only logs once per press
    const rb = this.gameObject.getComponent(RigidbodyComponent);
    rb.velocity.y = -300;
  }
}
```

#### `isKeyReleased(key)`
Returns true only on the frame when the key is released.

**Parameters:**
- `key` (string) - The key to check

**Example:**
```javascript
class ChargeAttack extends Component {
  update() {
    if (Input.isKeyDown('c')) {
      this.chargeAttack(); // Charge while held
    }
    
    if (Input.isKeyReleased('c')) {
      this.releaseAttack(); // Release when let go
    }
  }
}
```

### Keyboard Event Callbacks

#### `onKeyDownEvent(key, callback)`
Register a callback for when a key is first pressed.

**Parameters:**
- `key` (string) - The key to listen for
- `callback` (function) - Function to call when key is pressed

**Example:**
```javascript
// Setup in game initialization
Input.onKeyDownEvent('escape', () => {
  game.pause();
  showPauseMenu();
});

Input.onKeyDownEvent('f1', () => {
  toggleDebugMode();
});

Input.onKeyDownEvent('enter', () => {
  if (gameState === 'menu') {
    startGame();
  }
});
```

#### `onKeyStayEvent(key, callback)`
Register a callback that fires every frame while a key is held.

**Parameters:**
- `key` (string) - The key to listen for
- `callback` (function) - Function to call while key is held

**Example:**
```javascript
// Continuous actions
Input.onKeyStayEvent('shift', () => {
  player.sprint();
});

Input.onKeyStayEvent('ctrl', () => {
  player.crouch();
});
```

#### `onKeyUpEvent(key, callback)`
Register a callback for when a key is released.

**Parameters:**
- `key` (string) - The key to listen for
- `callback` (function) - Function to call when key is released

**Example:**
```javascript
Input.onKeyUpEvent('shift', () => {
  player.stopSprinting();
});

Input.onKeyUpEvent('space', () => {
  console.log("Spacebar released");
});
```

## Mouse Input

### Mouse Detection Methods

#### `isMouseDown(button)`
Returns true every frame while the mouse button is held down.

**Parameters:**
- `button` (number) - Mouse button (0=left, 1=middle, 2=right)

**Example:**
```javascript
class MouseDrag extends Component {
  update() {
    if (Input.isMouseDown(0)) { // Left button
      const mousePos = Input.getMousePosition();
      this.gameObject.x = mousePos.x;
      this.gameObject.y = mousePos.y;
    }
  }
}
```

#### `isMousePressed(button)`
Returns true only on the frame when the mouse button is first pressed.

**Parameters:**
- `button` (number) - Mouse button (0=left, 1=middle, 2=right)

**Example:**
```javascript
class ClickToShoot extends Component {
  update() {
    if (Input.isMousePressed(0)) { // Left click
      const mousePos = Input.getMousePosition();
      this.shootAt(mousePos);
    }
  }
  
  shootAt(target) {
    const bullet = new GameObject(this.gameObject.x, this.gameObject.y);
    const direction = this.getDirectionTo(target);
    bullet.addComponent(new BulletComponent(direction));
  }
}
```

#### `isMouseReleased(button)`
Returns true only on the frame when the mouse button is released.

**Parameters:**
- `button` (number) - Mouse button

### Convenience Methods

#### `isLeftMouseDown()` / `isLeftMousePressed()`
Shortcuts for left mouse button (button 0).

#### `isRightMouseDown()` / `isRightMousePressed()`
Shortcuts for right mouse button (button 2).

**Example:**
```javascript
class PlayerInteraction extends Component {
  update() {
    if (Input.isLeftMousePressed()) {
      this.primaryAction();
    }
    
    if (Input.isRightMousePressed()) {
      this.secondaryAction();
    }
  }
}
```

### Mouse Position and Movement

#### `getMousePosition()`
Gets the current mouse position relative to the canvas.

**Returns:** `{x: number, y: number}`

**Example:**
```javascript
class CursorFollower extends Component {
  update() {
    const mousePos = Input.getMousePosition();
    
    // Move towards mouse position
    const dx = mousePos.x - this.gameObject.x;
    const dy = mousePos.y - this.gameObject.y;
    
    this.gameObject.x += dx * 0.1; // Smooth following
    this.gameObject.y += dy * 0.1;
  }
}
```

#### `getMouseDelta()`
Gets the mouse movement since the last frame.

**Returns:** `{x: number, y: number}`

**Example:**
```javascript
class MouseLook extends Component {
  update() {
    const delta = Input.getMouseDelta();
    
    // Rotate based on mouse movement
    this.rotationX += delta.y * 0.01;
    this.rotationY += delta.x * 0.01;
  }
}
```

### Mouse Event Callbacks

#### `onMouseDownEvent(button, callback)`
Register a callback for mouse button press.

**Parameters:**
- `button` (number) - Mouse button
- `callback` (function) - Callback receives `(button, position)`

**Example:**
```javascript
Input.onMouseDownEvent(0, (button, pos) => {
  console.log(`Left clicked at ${pos.x}, ${pos.y}`);
  spawnEffect(pos.x, pos.y);
});

Input.onMouseDownEvent(2, (button, pos) => {
  console.log(`Right clicked at ${pos.x}, ${pos.y}`);
  showContextMenu(pos);
});
```

#### `onMouseStayEvent(button, callback)`
Register a callback that fires while mouse button is held.

**Parameters:**
- `button` (number) - Mouse button
- `callback` (function) - Callback receives `(button, position)`

#### `onMouseUpEvent(button, callback)`
Register a callback for mouse button release.

#### `onMouseMoveEvent(callback)`
Register a callback for mouse movement.

**Parameters:**
- `callback` (function) - Callback receives `(currentPos, lastPos)`

**Example:**
```javascript
Input.onMouseMoveEvent((currentPos, lastPos) => {
  const delta = {
    x: currentPos.x - lastPos.x,
    y: currentPos.y - lastPos.y
  };
  
  console.log(`Mouse moved by ${delta.x}, ${delta.y}`);
});
```

### Convenience Event Methods

#### `onLeftClickEvent(callback)` / `onRightClickEvent(callback)`
Shortcuts for common mouse button events.

**Example:**
```javascript
Input.onLeftClickEvent((button, pos) => {
  player.teleportTo(pos.x, pos.y);
});

Input.onRightClickEvent((button, pos) => {
  showRadialMenu(pos);
});
```

## Event Management

### `removeKeyEvent(event, key)`
Remove a specific key event callback.

**Parameters:**
- `event` (string) - 'down', 'stay', or 'up'
- `key` (string) - The key

### `removeMouseEvent(event, buttonOrCallback)`
Remove a specific mouse event callback.

**Parameters:**
- `event` (string) - 'down', 'stay', 'up', or 'move'
- `buttonOrCallback` - Button number or callback function

### `clearAllEvents()`
Remove all registered event callbacks.

**Example:**
```javascript
// Clean up when changing scenes
Input.clearAllEvents();
```

## Complete Examples

### Basic Player Movement
```javascript
class PlayerMovement extends Component {
  constructor(speed = 200) {
    super();
    this.speed = speed;
  }
  
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
  }
  
  update() {
    if (!this.rigidbody) return;
    
    // WASD movement
    let moveX = 0;
    let moveY = 0;
    
    if (Input.isKeyDown('a')) moveX -= 1;
    if (Input.isKeyDown('d')) moveX += 1;
    if (Input.isKeyDown('w')) moveY -= 1;
    if (Input.isKeyDown('s')) moveY += 1;
    
    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.707; // 1/sqrt(2)
      moveY *= 0.707;
    }
    
    this.rigidbody.velocity.x = moveX * this.speed;
    this.rigidbody.velocity.y = moveY * this.speed;
    
    // Jump
    if (Input.isKeyPressed('space')) {
      this.rigidbody.velocity.y = -300;
    }
  }
}
```

### Mouse-Based Shooting
```javascript
class MouseShooting extends Component {
  constructor() {
    super();
    this.fireRate = 0.2; // Seconds between shots
    this.lastShotTime = 0;
  }
  
  update() {
    // Continuous shooting while mouse held
    if (Input.isLeftMouseDown()) {
      const currentTime = Time.time();
      if (currentTime - this.lastShotTime >= this.fireRate) {
        this.shoot();
        this.lastShotTime = currentTime;
      }
    }
    
    // Single shot on click
    if (Input.isRightMousePressed()) {
      this.shootSpecial();
    }
  }
  
  shoot() {
    const mousePos = Input.getMousePosition();
    const direction = this.getAngleTo(mousePos);
    
    const bullet = new GameObject(this.gameObject.x, this.gameObject.y);
    bullet.addComponent(new BulletComponent(direction, 500));
  }
  
  getAngleTo(target) {
    const dx = target.x - this.gameObject.x;
    const dy = target.y - this.gameObject.y;
    return Math.atan2(dy, dx);
  }
}
```

### Menu Input Handling
```javascript
class MenuController extends Component {
  start() {
    // Setup menu navigation
    Input.onKeyDownEvent('ArrowUp', () => this.navigateUp());
    Input.onKeyDownEvent('ArrowDown', () => this.navigateDown());
    Input.onKeyDownEvent('enter', () => this.selectOption());
    Input.onKeyDownEvent('escape', () => this.goBack());
    
    // Mouse support
    Input.onLeftClickEvent((button, pos) => {
      const menuItem = this.getMenuItemAt(pos);
      if (menuItem) {
        this.selectMenuItem(menuItem);
      }
    });
  }
  
  navigateUp() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    this.updateMenuHighlight();
  }
  
  navigateDown() {
    this.selectedIndex = Math.min(this.menuItems.length - 1, this.selectedIndex + 1);
    this.updateMenuHighlight();
  }
}
```

### Advanced Input Combinations
```javascript
class AdvancedControls extends Component {
  update() {
    // Modifier keys
    const isShiftHeld = Input.isKeyDown('shift');
    const isCtrlHeld = Input.isKeyDown('control');
    
    // Different actions based on modifiers
    if (Input.isKeyPressed('s')) {
      if (isCtrlHeld) {
        this.save();
      } else if (isShiftHeld) {
        this.saveAs();
      } else {
        this.moveDown();
      }
    }
    
    // Mouse + keyboard combinations
    if (Input.isKeyDown('ctrl') && Input.isLeftMousePressed()) {
      const mousePos = Input.getMousePosition();
      this.specialAction(mousePos);
    }
    
    // Multiple key combinations
    if (Input.isKeyDown('shift') && Input.isKeyDown('ctrl') && Input.isKeyPressed('z')) {
      this.redo();
    }
  }
}
```

## Best Practices

1. **Use appropriate detection methods**: 
   - `isKeyDown()` for continuous actions (movement)
   - `isKeyPressed()` for single actions (jump, shoot)

2. **Cache input states** if checking multiple times per frame
3. **Use event callbacks** for UI and menu interactions
4. **Handle modifier keys** (Shift, Ctrl, Alt) for advanced controls
5. **Provide both keyboard and mouse alternatives** when possible
6. **Clear event listeners** when changing scenes to prevent memory leaks

## Common Key Names

- **Movement**: 'w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
- **Actions**: 'space', 'enter', 'escape', 'shift', 'control', 'alt'
- **Numbers**: '0', '1', '2', etc.
- **Functions**: 'f1', 'f2', etc.
- **Special**: 'tab', 'backspace', 'delete'

## Mouse Button Numbers

- **0**: Left mouse button
- **1**: Middle mouse button (wheel click)
- **2**: Right mouse button
