# NityJS Documentation Index

This is a complete index of all available documentation for the NityJS game engine.

## Core Engine

### Fundamental Classes
- [Game](core/Game.md) - Main game engine, canvas management, and game loop
- [Scene](core/Scene.md) - Scene management, object lifecycle, and game state
- [GameObject](core/GameObject.md) - Base entity class with Vector2 transform, rotation, and component system
- [Component](core/Component.md) - Base class for all modular functionality (Unity's MonoBehaviour equivalent)
- [Instantiate](Instantiate.md) - Object creation, destruction, and scene management
- [Time](core/Time.md) - Enhanced timing with deltaTime, performance.now(), timeScale, FPS monitoring

> **Unity Developers:** Component = MonoBehaviour, GameObject = GameObject with Vector2 position/rotation, Scene = Scene. GameObject.rotation uses radians. Note that `lateUpdate()` runs independently and does NOT pause when game is in pause mode.

## Math System

### Vector Mathematics
- **Vector2** - Unity-compatible 2D vector with properties (magnitude, normalized, sqrMagnitude) and static methods (distance, dot, lerp, etc.)
- **Vector3** - Unity-compatible 3D vector with full vector operations
- **Static Constants** - Vector2.zero, Vector2.one, Vector2.up, Vector2.right, etc.
- **Transform System** - GameObject position/rotation with parent-child inheritance via getGlobalPosition(), getGlobalRotation()

## Input System

### Input Handling
- [Input](input/Input.md) - Comprehensive keyboard and mouse input with events

## Physics System

### Movement and Collision
- [RigidbodyComponent](physics/RigidbodyComponent.md) - Physics-based movement with velocity
- [BoxColliderComponent](physics/BoxColliderComponent.md) - Rectangle collision detection with gizmos
- [CircleColliderComponent](physics/CircleColliderComponent.md) - Circle collision detection with gizmos
- [GravityComponent](physics/GravityComponent.md) - Gravity simulation and effects

## Rendering System

### Visual Components
- [Renderer Components](renderer/RendererComponents.md) - Complete guide to all rendering components with gizmos
  - SpriteRendererComponent - Render sprites with options object (width, height scaling)
  - ImageComponent - Display individual image files with width/height parameters
  - ShapeComponent - Draw geometric shapes (rectangle, circle, triangle, polygon)
- [Sprite and Spritesheet](renderer/Sprite.md) - Sprite management and spritesheet handling

### Asset Management
- [SpriteRegistry](asset/SpriteRegistry.md) - Centralized sprite loading and unified access with colon notation
- **SpriteAsset** - Single sprite loading: `new SpriteAsset("key", "path.png")`
- **SpritesheetAsset** - Dual methods: grid-based and pixel coordinate-based definitions

### Debug Visualization
- **Gizmos System** - Visual debugging with __internalGizmos() methods
  - Renderer components: Magenta gizmos showing bounds and properties
  - Collision components: Green/blue gizmos showing collision areas

## Animation System

### Sprite Animation
- [Animation Components](animations/SpriteAnimation.md) - Complete sprite animation system
  - SpriteAnimationClip - Define animation sequences
  - SpriteAnimationComponent - Play and manage animations

## Utilities

### Helper Classes
- [Random](math/Random.md) - Random number generation and utilities

## Getting Started Guides

### By Topic

**For Beginners:**
1. Start with [Game](core/Game.md) to understand the engine basics
2. Learn about [Scene](core/Scene.md) for game state management
3. Understand [GameObject](core/GameObject.md) for creating entities
4. Explore [Component](core/Component.md) for modular functionality (includes multiple usage patterns)

**Component Usage Patterns:**
- **Class Extension** - `class PlayerController extends Component { ... }` (Unity-style)
- **Inline Anonymous** - `gameObject.addComponent(new class extends Component { update() { ... } })`
- **Options Objects** - `new SpriteRendererComponent("sprite", { width: 64, height: 64 })`

## Current API Examples

```javascript
// GameObject with Vector2 transforms
const obj = new GameObject(new Vector2(100, 50));
obj.rotation = Math.PI / 4; // 45 degrees in radians

// SpriteRendererComponent with options
obj.addComponent(new SpriteRendererComponent("player", { 
    width: 64, 
    height: 64 
}));

// Spritesheet with pixel coordinate method
const sheet = new SpritesheetAsset("tiles", "tiles.png", {
    sprites: [
        { name: "tile1", startX: 0, startY: 0, endX: 16, endY: 16 }
    ]
});
obj.addComponent(new SpriteRendererComponent("tiles:tile1"));

// Vector math operations
const velocity = Vector2.up.multiply(100);
const newPos = obj.position.add(velocity.multiply(Time.deltaTime));
const distance = Vector2.distance(obj.position, target.position);
```

**For Visuals:**
1. Use [Renderer Components](renderer/RendererComponents.md) for basic graphics
2. Advance to [Sprite and Spritesheet](renderer/Sprite.md) for complex graphics
3. Add [Animation Components](animations/SpriteAnimation.md) for movement

**For Interactivity:**
1. Learn [Input](input/Input.md) for user interaction
2. Add [Physics Components](physics/RigidbodyComponent.md) for movement
3. Use [Collision Components](physics/BoxColliderComponent.md) for interaction

**For Game Feel:**
1. Master [Time](core/Time.md) for smooth animations
2. Use [Random](math/Random.md) for variety
3. Apply [GravityComponent](physics/GravityComponent.md) for realism

### By Game Type

**Platformer Games:**
- [GameObject](core/GameObject.md) - Player and enemy entities
- [Input](input/Input.md) - Movement controls
- [RigidbodyComponent](physics/RigidbodyComponent.md) - Character movement
- [BoxColliderComponent](physics/BoxColliderComponent.md) - Platform collision
- [GravityComponent](physics/GravityComponent.md) - Falling mechanics
- [Animation Components](animations/SpriteAnimation.md) - Character animations

**Puzzle Games:**
- [Input](input/Input.md) - Mouse/touch interaction
- [Renderer Components](renderer/RendererComponents.md) - Game pieces
- [BoxColliderComponent](physics/BoxColliderComponent.md) - Piece interaction

**Action Games:**
- [Input](input/Input.md) - Fast-paced controls
- [CircleColliderComponent](physics/CircleColliderComponent.md) - Projectiles
- [Animation Components](animations/SpriteAnimation.md) - Action sequences
- [Random](math/Random.md) - Spawn patterns

**Simulation Games:**
- [Time](core/Time.md) - Precise timing
- [Random](math/Random.md) - Variation and events
- [Physics Components](physics/RigidbodyComponent.md) - Realistic movement

## Implementation Patterns

### Common Workflows

**Creating a Simple Character:**
```javascript
// 1. Create GameObject
const player = new GameObject("Player");

// 2. Add visual component
player.addComponent(new SpriteRendererComponent("character", "sprite_0_0"));

// 3. Add physics
player.addComponent(new RigidbodyComponent());
player.addComponent(new BoxColliderComponent(32, 32));

// 4. Add behavior
player.addComponent(new PlayerController());
```

**Setting Up Animation:**
```javascript
// 1. Create spritesheet
const sheet = new Spritesheet("character", "assets/char.png", 32, 32, 4, 2);

// 2. Create animation clips
const walkClip = new SpriteAnimationClip("walk", ["sprite_0_0", "sprite_1_0"], 8, true);

// 3. Add animator
const animator = new SpriteAnimationComponent("character", "walk");
animator.addClip(walkClip);
player.addComponent(animator);
```

**Handling Collisions:**
```javascript
// In your component's implementation
onCollisionEnter(collision) {
    if (collision.gameObject.hasTag("Enemy")) {
        this.takeDamage();
    }
}
```

## Advanced Topics

### Performance Optimization
- Object pooling with [Instantiate](Instantiate.md)
- Efficient collision detection with appropriate collider types
- Sprite batching with [SpriteRegistry](asset/SpriteRegistry.md)

### Architecture Patterns
- Component composition with [Component](core/Component.md)
- State management with [Scene](core/Scene.md)
- Event-driven design with [Input](input/Input.md)

### Debugging and Development
- Use [Time](core/Time.md) for frame-rate independent debugging
- Leverage component lifecycle methods for initialization
- Implement debug drawing with [Renderer Components](renderer/RendererComponents.md)

## Examples and Demos

Check the `examples/` directory in the repository for:
- Basic movement and collision
- Animation systems
- Input handling
- Physics simulations
- Complete game implementations

## API Quick Reference

All classes are documented with comprehensive JSDoc comments. Key namespaces:

- **Core**: Game, Scene, GameObject, Component
- **Physics**: RigidbodyComponent, BoxColliderComponent, CircleColliderComponent
- **Rendering**: SpriteRendererComponent, ImageComponent, ShapeComponent
- **Animation**: SpriteAnimationComponent, SpriteAnimationClip
- **Input**: Input (static class)
- **Utils**: Instantiate, Time, Random (static classes)

For detailed API documentation, see the individual class documentation files.
