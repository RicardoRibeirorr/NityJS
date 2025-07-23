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
import { Game, Scene, GameObject, SpriteRendererComponent, ShapeComponent, 
         SpriteAnimationClip, SpriteAnimationComponent, Destroy } from './dist/nity.module.min.js';

// Create canvas
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Create scene
const scene = new Scene({
  create(scene) {
    // ===== METADATA-DRIVEN CREATION (Recommended) =====
    
    // Create player with sprite renderer using metadata
    const player = new GameObject("Player", 100, 100);
    const playerSprite = SpriteRendererComponent.meta({
        spriteName: "player_idle",
        width: 64,
        height: 64,
        opacity: 0.9,
        color: "#FF6B6B"
    });
    player.addComponent(playerSprite);
    
    // Create enemy with shape using metadata
    const enemy = new GameObject("Enemy", 200, 100);
    const enemyShape = ShapeComponent.meta({
        shapeType: "circle",
        options: {
            radius: 25,
            color: "#00FF00",
            filled: true
        }
    });
    enemy.addComponent(enemyShape);
    
    // Create animation clips with metadata
    const walkClip = SpriteAnimationClip.meta({
        name: "walk",
        spriteNames: ["player:walk_0", "player:walk_1", "player:walk_2"],
        fps: 8,
        loop: true
    });
    
    // Create animation component with metadata
    const animator = SpriteAnimationComponent.meta({
        defaultClipName: "walk",
        autoPlay: true
    });
    animator.addClip(walkClip);
    player.addComponent(animator);
    
    // ===== TRADITIONAL CREATION (Still Supported) =====
    
    // Traditional constructor approach
    const platform = new GameObject("Platform", 300, 100);
    platform.addComponent(new ShapeComponent("rectangle", { width: 100, height: 20, color: '#8B4513' }));
    
    // Add all objects to scene
    scene.add(player);
    scene.add(enemy);
    scene.add(platform);
    
    // ===== UNITY-STYLE DESTRUCTION =====
    setTimeout(() => {
      Destroy(enemy); // Just like Unity!
    }, 3000);
    
    scene.add(player);
    scene.add(enemy);
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
5. **[Component Metadata](./docs/core/ComponentMetadata.md)** - Data-driven component creation
6. **[Destroy System](./docs/core/Destroy.md)** - Unity-style GameObject destruction  
7. **[Input](./docs/input/Input.md)** - Keyboard and mouse input handling

### Unity-Style Features

#### Destroy System
- **Destroy(gameObject)** - Destroys a GameObject (exact Unity API)
- **DestroyComponent(gameObject, ComponentClass)** - Removes specific component  
- **DestroyAll()** - Destroys all GameObjects in current scene
- **Function-based API** - Use `Destroy(obj)` not `obj.destroy()` to match Unity

#### Metadata System  
- **ComponentClass.meta()** - Static factory methods for all 8 components + SpriteAnimationClip
- **ComponentClass.getDefaultMeta()** - Get default configuration for any component
- **applyMeta()** - Runtime metadata application with validation
- **toMeta()** - Export component state for serialization  
- **Visual Editor Ready** - Perfect for future browser-based editors
- **JSON Configuration** - Define scenes and components declaratively
- **Type-Safe Validation** - Comprehensive validation with helpful error messages

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
- [Component Metadata](core/ComponentMetadata.md) - Data-driven component creation and editor integration
- [Destroy System](core/Destroy.md) - Unity-style GameObject destruction (Destroy, DestroyComponent, DestroyAll)
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
- [SpriteAsset and SpritesheetAsset](renderer/Sprite.md) - Sprite asset management
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
import { SpriteAsset, SpritesheetAsset, SpriteRegistry } from 'nity-engine';

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

### Build Commands
```bash
npm run build        # Build all versions (development + production)
npm run build:dev    # Development builds only (readable code for debugging)
npm run build:prod   # Production builds only (minified for deployment)
```

### File Structure
```
dist/
├── nity.js              # IIFE build, non-minified (development)
├── nity.min.js          # IIFE build, minified (production)
├── nity.module.js       # ES6 module, non-minified (development)
└── nity.module.min.js   # ES6 module, minified (production)
```

### Usage in Projects

```html
<!-- ES6 Module - Development (readable errors) -->
<script type="module">
  import { Game, Scene, GameObject } from './path/to/nity.module.js';
</script>

<!-- ES6 Module - Production (smaller size) -->
<script type="module">
  import { Game, Scene, GameObject } from './path/to/nity.module.min.js';
</script>

<!-- Global - Development -->
<script src="./path/to/nity.js"></script>
<script>
  const { Game, Scene, GameObject } = Nity;
</script>

<!-- Global - Production -->
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
