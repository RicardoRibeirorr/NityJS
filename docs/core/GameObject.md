# GameObject Class Documentation

The `GameObject` class is the fundamental building block of NityJS. Every entity in your game is a GameObject that can have multiple Components attached to provide functionality.

## Overview

```javascript
import { GameObject, ShapeComponent } from 'nity-engine';

const player = new GameObject(100, 100);
player.addComponent(new ShapeComponent(50, 50, '#ff0000'));
```

## Constructor

### `new GameObject(x = 0, y = 0)`

Creates a new GameObject at the specified position.

**Parameters:**
- `x` (number) - X coordinate (default: 0)
- `y` (number) - Y coordinate (default: 0)

**Example:**
```javascript
const player = new GameObject(100, 150);
const enemy = new GameObject(); // Defaults to (0, 0)
```

## Properties

### Position
- `x` (number) - X coordinate in world space
- `y` (number) - Y coordinate in world space

### Identification
- `name` (string) - Name of the GameObject for identification
- `tags` (Set) - Set of string tags for grouping

### State
- `active` (boolean) - Whether the GameObject is active and updating
- `components` (Map) - Map of attached components

### Hierarchy
- `parent` (GameObject) - Parent GameObject (if any)
- `children` (GameObject[]) - Array of child GameObjects

## Core Methods

### Component Management

#### `addComponent(component)`
Adds a component to the GameObject.

**Parameters:**
- `component` (Component) - The component to add

**Returns:** The added component

**Example:**
```javascript
const player = new GameObject(100, 100);
const shape = player.addComponent(new ShapeComponent(40, 40, '#ff4444'));
const rigidbody = player.addComponent(new RigidbodyComponent());
```

#### `getComponent(ComponentClass)`
Gets the first component of the specified type.

**Parameters:**
- `ComponentClass` (Class) - The component class to find

**Returns:** Component instance or `undefined`

**Example:**
```javascript
const rb = player.getComponent(RigidbodyComponent);
if (rb) {
  rb.velocity.x = 100;
}
```

#### `hasComponent(ComponentClass)`
Checks if the GameObject has a component of the specified type.

**Parameters:**
- `ComponentClass` (Class) - The component class to check for

**Returns:** `boolean`

**Example:**
```javascript
if (player.hasComponent(RigidbodyComponent)) {
  console.log("Player can move!");
}
```

#### `removeComponent(ComponentClass)`
Removes a component from the GameObject.

**Parameters:**
- `ComponentClass` (Class) - The component class to remove

**Example:**
```javascript
player.removeComponent(GravityComponent);
```

### Tag Management

#### `addTag(tag)`
Adds a tag to the GameObject.

**Parameters:**
- `tag` (string) - The tag to add

**Example:**
```javascript
player.addTag("player");
player.addTag("controllable");
```

#### `hasTag(tag)`
Checks if the GameObject has a specific tag.

**Parameters:**
- `tag` (string) - The tag to check for

**Returns:** `boolean`

**Example:**
```javascript
if (enemy.hasTag("hostile")) {
  // Handle hostile enemy
}
```

#### `removeTag(tag)`
Removes a tag from the GameObject.

**Parameters:**
- `tag` (string) - The tag to remove

### Position Methods

#### `getGlobalX()` / `getGlobalY()`
Gets the global position considering parent hierarchy.

**Returns:** `number`

**Example:**
```javascript
const globalX = childObject.getGlobalX();
const globalY = childObject.getGlobalY();
```

### Lifecycle Methods

#### `start()`
Called once when the GameObject enters the scene. Override for initialization logic.

```javascript
class Player extends GameObject {
  start() {
    super.start();
    console.log("Player started!");
    // Initialize player-specific logic
  }
}
```

#### `update()`
Called every frame. Override for per-frame logic.

```javascript
class Enemy extends GameObject {
  update() {
    super.update();
    // AI logic, movement, etc.
    this.moveTowardsPlayer();
  }
}
```

#### `lateUpdate()`
Called after all updates. Override for cleanup or final calculations.

#### `destroy()`
Marks the GameObject for destruction at the end of the frame.

```javascript
if (player.health <= 0) {
  player.destroy();
}
```

## Collision Events

GameObjects can respond to collision events when they have collider components:

### `onCollisionEnter(other)`
Called when this GameObject starts colliding with another.

```javascript
player.onCollisionEnter = (other) => {
  if (other.hasTag("enemy")) {
    console.log("Player hit an enemy!");
  }
};
```

### `onCollisionStay(other)`
Called every frame while this GameObject is colliding with another.

```javascript
player.onCollisionStay = (other) => {
  if (other.hasTag("damage_zone")) {
    this.takeDamage(1);
  }
};
```

### `onCollisionExit(other)`
Called when this GameObject stops colliding with another.

```javascript
player.onCollisionExit = (other) => {
  if (other.hasTag("safe_zone")) {
    console.log("Left safe zone!");
  }
};
```

### Trigger Events

For trigger colliders (non-solid):

```javascript
// Trigger events work the same way
player.onTriggerEnter = (other) => {
  if (other.hasTag("powerup")) {
    this.collectPowerup(other);
    other.destroy();
  }
};
```

## Common Patterns

### Player Character
```javascript
class Player extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.name = "Player";
    this.health = 100;
    this.speed = 200;
    
    // Add components
    this.addComponent(new ShapeComponent(40, 40, '#ff4444'));
    this.addComponent(new BoxColliderComponent(40, 40));
    this.addComponent(new RigidbodyComponent({ gravity: false }));
    this.addComponent(new PlayerController());
  }
  
  start() {
    super.start();
    console.log("Player initialized with health:", this.health);
  }
  
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }
  
  die() {
    console.log("Player died!");
    this.destroy();
  }
}
```

### Enemy with AI
```javascript
class Enemy extends GameObject {
  constructor(x, y, type = "basic") {
    super(x, y);
    this.name = `Enemy_${type}`;
    this.addTag("enemy");
    this.addTag("hostile");
    
    this.health = 50;
    this.damage = 10;
    this.moveSpeed = 100;
    
    // Setup based on type
    this.setupByType(type);
  }
  
  setupByType(type) {
    switch(type) {
      case "fast":
        this.moveSpeed = 200;
        this.health = 30;
        this.addComponent(new ShapeComponent(30, 30, '#ff8800'));
        break;
      case "tank":
        this.moveSpeed = 50;
        this.health = 150;
        this.addComponent(new ShapeComponent(60, 60, '#880000'));
        break;
      default:
        this.addComponent(new ShapeComponent(40, 40, '#ff0000'));
    }
    
    this.addComponent(new BoxColliderComponent());
    this.addComponent(new EnemyAI());
  }
  
  update() {
    super.update();
    
    // Find and move towards player
    const player = this.scene?.findByName("Player");
    if (player) {
      this.moveTowards(player);
    }
  }
  
  moveTowards(target) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.x += (dx / distance) * this.moveSpeed * Time.deltaTime();
      this.y += (dy / distance) * this.moveSpeed * Time.deltaTime();
    }
  }
}
```

### Collectible Item
```javascript
class Powerup extends GameObject {
  constructor(x, y, type = "health") {
    super(x, y);
    this.name = `Powerup_${type}`;
    this.addTag("powerup");
    this.addTag("collectible");
    
    this.type = type;
    this.value = this.getValueByType(type);
    
    // Visual setup
    this.addComponent(new ShapeComponent(20, 20, this.getColorByType(type)));
    this.addComponent(new BoxColliderComponent(20, 20, true)); // Trigger
    
    // Floating animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.startY = y;
  }
  
  update() {
    super.update();
    
    // Floating animation
    this.y = this.startY + Math.sin(Time.time() * 2 + this.floatOffset) * 5;
  }
  
  getValueByType(type) {
    switch(type) {
      case "health": return 25;
      case "speed": return 50;
      case "damage": return 10;
      default: return 10;
    }
  }
  
  getColorByType(type) {
    switch(type) {
      case "health": return '#00ff00';
      case "speed": return '#0088ff';
      case "damage": return '#ff8800';
      default: return '#ffffff';
    }
  }
}

// Usage
const healthPowerup = new Powerup(200, 200, "health");
scene.add(healthPowerup);

// Handle collection
player.onTriggerEnter = (other) => {
  if (other.hasTag("powerup")) {
    this.collectPowerup(other);
  }
};
```

### Projectile
```javascript
class Bullet extends GameObject {
  constructor(x, y, direction, speed = 500) {
    super(x, y);
    this.name = "Bullet";
    this.addTag("projectile");
    
    this.direction = direction;
    this.speed = speed;
    this.lifetime = 3; // Seconds
    this.damage = 25;
    
    this.addComponent(new ShapeComponent(8, 8, '#ffff00'));
    this.addComponent(new BoxColliderComponent(8, 8, true)); // Trigger
    this.addComponent(new RigidbodyComponent({ gravity: false }));
  }
  
  start() {
    super.start();
    
    // Set velocity based on direction
    const rb = this.getComponent(RigidbodyComponent);
    rb.velocity.x = Math.cos(this.direction) * this.speed;
    rb.velocity.y = Math.sin(this.direction) * this.speed;
    
    // Auto-destroy after lifetime
    setTimeout(() => {
      if (this.active) this.destroy();
    }, this.lifetime * 1000);
  }
  
  onTriggerEnter(other) {
    if (other.hasTag("enemy")) {
      // Deal damage
      if (other.takeDamage) {
        other.takeDamage(this.damage);
      }
      this.destroy();
    } else if (other.hasTag("wall")) {
      this.destroy();
    }
  }
}
```

## Best Practices

1. **Use meaningful names** for GameObjects to aid debugging
2. **Add tags** to group related objects
3. **Prefer composition over inheritance** - use Components for functionality
4. **Don't store direct references** to other GameObjects across scenes
5. **Use collision events** instead of manual distance checking when possible
6. **Call super methods** when overriding lifecycle methods
7. **Clean up resources** in destroy() if needed

## Performance Tips

1. **Disable inactive objects** instead of destroying them if they'll be reused
2. **Use object pooling** for frequently created/destroyed objects like bullets
3. **Minimize updates** - only update what needs to change each frame
4. **Cache component references** in start() instead of getting them every frame

```javascript
class OptimizedController extends Component {
  start() {
    // Cache components once
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    this.renderer = this.gameObject.getComponent(ShapeComponent);
  }
  
  update() {
    // Use cached references
    this.rigidbody.velocity.x = this.calculateMovement();
  }
}
```
