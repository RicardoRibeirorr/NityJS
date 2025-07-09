# NityJS Game Engine Documentation

NityJS is a lightweight, Unity-inspired 2D game engine built in JavaScript. It provides a component-based architecture for creating interactive games and applications in the browser.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Building and Distribution](#building-and-distribution)

## Quick Start

### Installation

1. Clone or download the NityJS repository
2. Build the engine: `npm run build`
3. Include the built file in your HTML:

```html
<!-- For ES6 modules -->
<script type="module">
  import { Game, Scene, GameObject } from './dist/nity.module.min.js';
</script>

<!-- For global usage -->
<script src="./dist/nity.min.js"></script>
```

### Basic Example

```javascript
import { Game, Scene, GameObject, ShapeComponent } from './dist/nity.module.min.js';

// Create canvas
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Create scene
const scene = new Scene({
  create(scene) {
    // Create a red square
    const player = new GameObject(100, 100);
    player.addComponent(new ShapeComponent(50, 50, '#ff0000'));
    scene.add(player);
  }
});

// Start the game
game.launch(scene);
```

## Core Concepts

### GameObject-Component Architecture

NityJS follows Unity's GameObject-Component pattern:

- **GameObject**: The base entity that exists in your scene
- **Component**: Modular functionality that can be attached to GameObjects
- **Scene**: Container that holds and manages GameObjects

### Key Classes

1. **[Game](./docs/core/Game.md)** - Main game loop and canvas management
2. **[Scene](./docs/core/Scene.md)** - Container for GameObjects
3. **[GameObject](./docs/core/GameObject.md)** - Base entity class
4. **[Component](./docs/core/Component.md)** - Base class for all components
5. **[Input](./docs/input/Input.md)** - Keyboard and mouse input handling

### Component Categories

#### Rendering Components
- **[ShapeComponent](./docs/renderer/ShapeComponent.md)** - Draw basic shapes
- **[SpriteRendererComponent](./docs/renderer/SpriteRendererComponent.md)** - Display sprites
- **[ImageComponent](./docs/renderer/ImageComponent.md)** - Display images

#### Physics Components
- **[RigidbodyComponent](./docs/physics/RigidbodyComponent.md)** - Physics movement and collision
- **[BoxColliderComponent](./docs/physics/BoxColliderComponent.md)** - Rectangle collision detection
- **[CircleColliderComponent](./docs/physics/CircleColliderComponent.md)** - Circle collision detection
- **[GravityComponent](./docs/physics/GravityComponent.md)** - Gravity simulation

#### Animation Components
- **[SpriteAnimationComponent](./docs/animations/SpriteAnimationComponent.md)** - Sprite sheet animations

## API Reference

### Core Classes
- [Game](core/Game.md) - Main game engine class
- [Scene](core/Scene.md) - Scene management and lifecycle
- [GameObject](core/GameObject.md) - Base entity class
- [Component](core/Component.md) - Base component class
- [Instantiate](Instantiate.md) - Object creation and destruction
- [Time](core/Time.md) - Time and delta time utilities

### Input System
- [Input](input/Input.md) - Keyboard and mouse input handling

### Physics System
- [RigidbodyComponent](physics/RigidbodyComponent.md) - Physics movement
- [BoxColliderComponent](physics/BoxColliderComponent.md) - Box collision detection
- [CircleColliderComponent](physics/CircleColliderComponent.md) - Circle collision detection
- [GravityComponent](physics/GravityComponent.md) - Gravity effects

### Rendering System
- [Sprite and Spritesheet](renderer/Sprite.md) - Sprite management
- [SpriteRegistry](asset/SpriteRegistry.md) - Asset loading and management
- [Renderer Components](renderer/RendererComponents.md) - Visual rendering components
  - SpriteRendererComponent
  - ImageComponent
  - ShapeComponent

### Animation System
- [Animation Components](animations/SpriteAnimation.md) - Sprite-based animations
  - SpriteAnimationClip
  - SpriteAnimationComponent

### Math Utilities
- [Random](math/Random.md) - Random number generation

### Quick Reference

```javascript
// Core
import { Game, Scene, GameObject, Component } from 'nity-engine';

// Rendering
import { ShapeComponent, SpriteRendererComponent, ImageComponent } from 'nity-engine';
import { Sprite, Spritesheet, SpriteRegistry } from 'nity-engine';

// Physics
import { RigidbodyComponent, BoxColliderComponent, CircleColliderComponent } from 'nity-engine';
import { GravityComponent } from 'nity-engine';

// Animation
import { SpriteAnimationComponent, SpriteAnimationClip } from 'nity-engine';

// Input
import { Input } from 'nity-engine';

// Utilities
import { Instantiate, Time, Random } from 'nity-engine';
```

### GameObject Lifecycle

1. **Constructor** - Object is created
2. **start()** - Called once when object enters the scene
3. **update()** - Called every frame
4. **lateUpdate()** - Called after all updates
5. **Destruction** - Object is removed from scene

### Component Lifecycle

1. **start()** - Called when component is added to an active GameObject
2. **update()** - Called every frame if GameObject is active
3. **lateUpdate()** - Called after all component updates

## Examples

### Movement with Input

```javascript
class PlayerController extends Component {
  speed = 200;
  
  update() {
    const rb = this.gameObject.getComponent(RigidbodyComponent);
    
    const moveX = (Input.isKeyDown('d') ? 1 : 0) - (Input.isKeyDown('a') ? 1 : 0);
    const moveY = (Input.isKeyDown('s') ? 1 : 0) - (Input.isKeyDown('w') ? 1 : 0);
    
    rb.velocity.x = moveX * this.speed;
    rb.velocity.y = moveY * this.speed;
  }
}
```

### Collision Detection

```javascript
const player = new GameObject(100, 100);
player.addComponent(new BoxColliderComponent(50, 50));
player.addComponent(new RigidbodyComponent());

player.onCollisionEnter = (other) => {
  console.log('Collision detected with:', other.name);
};
```

### Mouse Interaction

```javascript
// Click detection
if (Input.isLeftMousePressed()) {
  const mousePos = Input.getMousePosition();
  console.log('Clicked at:', mousePos);
}

// Mouse event callbacks
Input.onLeftClickEvent((button, position) => {
  console.log('Mouse clicked at:', position);
});
```

## Building and Distribution

### Development Build
```bash
npm run build
```

### File Structure
```
dist/
├── nity.min.js          # Global build (window.Nity)
└── nity.module.min.js   # ES6 module build
```

### Usage in Projects

```html
<!-- ES6 Module (Recommended) -->
<script type="module">
  import { Game, Scene, GameObject } from './path/to/nity.module.min.js';
</script>

<!-- Global (Legacy) -->
<script src="./path/to/nity.min.js"></script>
<script>
  const { Game, Scene, GameObject } = Nity;
</script>
```

## Advanced Topics

- [Custom Components](./docs/advanced/CustomComponents.md)
- [Scene Management](./docs/advanced/SceneManagement.md)
- [Performance Optimization](./docs/advanced/Performance.md)
- [Asset Management](./docs/advanced/AssetManagement.md)

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on contributing to NityJS.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
