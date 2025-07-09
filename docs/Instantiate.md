# Instantiate System

The Instantiate system is a Unity-like utility for creating and managing GameObjects in your NityJS game. It automatically handles component registration, parent-child relationships, and scene management.

## Key Features

- **Automatic Collider Registration**: Colliders are automatically registered with the CollisionSystem
- **Parent-Child Relationships**: Easily create hierarchies using the `parent` option
- **Scene Management**: Objects can be automatically added to the current scene
- **Component Registration**: All components are properly initialized and their `start()` methods are called
- **Cloning Support**: Clone existing GameObjects with all their components and children

## Basic Usage

### Creating a GameObject

```javascript
import { Instantiate, GameObject } from './path/to/nity.js';

// Create a simple GameObject
const obj = Instantiate.create(GameObject, {
    x: 100,
    y: 100
});
```

### Creating with a Custom Class

```javascript
class Player extends GameObject {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.name = "Player";
        
        // Add components
        this.addComponent(new ShapeComponent("square", {
            width: 20,
            height: 20,
            color: 'red'
        }));
        this.addComponent(new BoxColliderComponent(20, 20));
    }
}

// Create the player
const player = Instantiate.create(Player, {
    x: 200,
    y: 150
});
```

### Parent-Child Relationships

```javascript
// Create parent
const parent = Instantiate.create(GameObject, {
    x: 300,
    y: 200
});

// Create child attached to parent
const child = Instantiate.create(GameObject, {
    x: 20,  // Relative to parent
    y: 20,
    parent: parent,
    addToScene: false  // Don't add to scene since it's a child
});
```

### Cloning Objects

```javascript
// Clone an existing object
const clone = Instantiate.clone(originalObject, {
    x: 400,
    y: 300
});
```

## API Reference

### Instantiate.create(prefab, options, ...args)

Creates a new GameObject instance.

**Parameters:**
- `prefab` - GameObject instance or class constructor
- `options` - Configuration object:
  - `x` (number): X position (default: 0)
  - `y` (number): Y position (default: 0)
  - `parent` (GameObject): Parent object (default: null)
  - `addToScene` (boolean): Whether to add to current scene (default: true)
- `...args` - Additional constructor arguments if prefab is a class

**Returns:** GameObject instance

### Instantiate.clone(original, options)

Clones an existing GameObject.

**Parameters:**
- `original` - GameObject to clone
- `options` - Same as create() options

**Returns:** Cloned GameObject instance

### Instantiate.destroy(gameObject)

Destroys a GameObject and unregisters all components.

**Parameters:**
- `gameObject` - GameObject to destroy

## Important Notes

1. **Colliders are automatically registered** - You don't need to manually register colliders with the CollisionSystem
2. **Component start() methods are called** - All component initialization happens automatically
3. **Parent-child relationships are maintained** - Use the `parent` option for hierarchies
4. **Scene management is handled** - Objects are added to the current scene unless specified otherwise

## Migration from Manual Creation

**Before (manual creation):**
```javascript
const obj = new GameObject(100, 100);
obj.addComponent(new BoxColliderComponent(30, 30));
scene.add(obj);
// Collider registration was manual and error-prone
```

**After (with Instantiate):**
```javascript
const obj = Instantiate.create(GameObject, { x: 100, y: 100 });
obj.addComponent(new BoxColliderComponent(30, 30));
// Collider automatically registered!
```

## Examples

See the `/examples/instantiate_system/` folder for a complete working example demonstrating all features of the Instantiate system.

## System Architecture

### Collision Detection vs Physics Resolution

The NityJS engine separates collision detection from physics resolution for better performance and cleaner code:

#### CollisionSystem
- **Responsibility**: Detects all collisions between colliders
- **Events**: Fires `onCollisionEnter`, `onCollisionStay`, `onCollisionExit` events
- **Triggers**: Handles trigger events (`onTriggerEnter`, `onTriggerStay`, `onTriggerExit`)
- **Performance**: Single pass collision detection for all objects

#### RigidbodyComponent  
- **Responsibility**: Physics resolution for non-trigger collisions only
- **Physics**: Handles bouncing, movement blocking, gravity
- **No Events**: Does not fire collision events (handled by CollisionSystem)
- **Efficiency**: Only processes physics for objects that need it

This separation means:
- **No duplicate events**: CollisionSystem handles all event firing
- **Better performance**: Physics only calculated when needed
- **Cleaner code**: Clear separation of concerns
- **Easier debugging**: Single source of truth for collision events
