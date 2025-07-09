# BoxColliderComponent Documentation

The `BoxColliderComponent` provides rectangular collision detection for GameObjects. It can be used as a solid collider (blocks movement) or as a trigger (detects overlap without blocking).

## Overview

```javascript
import { BoxColliderComponent } from 'nity-engine';

const player = new GameObject(100, 100);
// Create a 40x40 solid collider
player.addComponent(new BoxColliderComponent(40, 40, false));

// Create a 60x30 trigger collider
const sensor = new GameObject(200, 200);
sensor.addComponent(new BoxColliderComponent(60, 30, true));
```

## Constructor

### `new BoxColliderComponent(width, height, trigger)`

Creates a new BoxColliderComponent with the specified dimensions.

**Parameters:**
- `width` (number) - Width of the collision box (default: auto-detect from sprite)
- `height` (number) - Height of the collision box (default: auto-detect from sprite)
- `trigger` (boolean) - Whether this is a trigger collider (default: false)

**Example:**
```javascript
// Solid collider (blocks movement)
const solidCollider = new BoxColliderComponent(50, 50, false);

// Trigger collider (detects overlap only)
const triggerCollider = new BoxColliderComponent(80, 40, true);

// Auto-size from sprite
const autoCollider = new BoxColliderComponent(); // Uses sprite dimensions
```

## Properties

### `width`
- **Type:** `number`
- **Description:** Width of the collision box

### `height`
- **Type:** `number`
- **Description:** Height of the collision box

### `trigger`
- **Type:** `boolean`
- **Description:** Whether this collider is a trigger

## Methods

### `getBounds()`
Gets the current bounding box of the collider.

**Returns:** `{x: number, y: number, width: number, height: number}`

**Example:**
```javascript
const collider = gameObject.getComponent(BoxColliderComponent);
const bounds = collider.getBounds();
console.log(`Collider at (${bounds.x}, ${bounds.y}) size ${bounds.width}x${bounds.height}`);
```

### `isTrigger()`
Checks if this collider is a trigger.

**Returns:** `boolean`

### `checkCollisionWith(other)`
Checks if this collider overlaps with another collider.

**Parameters:**
- `other` (AbstractColliderComponent) - The other collider to check against

**Returns:** `boolean`

## Usage Examples

### Basic Solid Collider
```javascript
// Create a wall that blocks movement
const wall = new GameObject(300, 100);
wall.name = "Wall";
wall.addTag("wall");
wall.addComponent(new ShapeComponent(100, 200, '#666666'));
wall.addComponent(new BoxColliderComponent(100, 200)); // Solid collider

scene.add(wall);
```

### Player with Collision
```javascript
const player = new GameObject(100, 100);
player.name = "Player";
player.addComponent(new ShapeComponent(40, 40, '#ff4444'));
player.addComponent(new BoxColliderComponent(40, 40)); // Solid collider
player.addComponent(new RigidbodyComponent({ gravity: false }));

// Handle collisions
player.onCollisionEnter = (other) => {
  console.log(`Player collided with ${other.name}`);
  
  if (other.hasTag("enemy")) {
    console.log("Hit an enemy!");
  }
};

scene.add(player);
```

### Trigger Zones
```javascript
// Create a trigger zone that detects when player enters
const triggerZone = new GameObject(400, 300);
triggerZone.name = "TriggerZone";
triggerZone.addTag("trigger");
triggerZone.addComponent(new ShapeComponent(100, 100, '#00ff0044')); // Semi-transparent
triggerZone.addComponent(new BoxColliderComponent(100, 100, true)); // Trigger

// Handle trigger events
triggerZone.onTriggerEnter = (other) => {
  if (other.name === "Player") {
    console.log("Player entered the trigger zone!");
    showMessage("Welcome to the secret area!");
  }
};

triggerZone.onTriggerExit = (other) => {
  if (other.name === "Player") {
    console.log("Player left the trigger zone!");
    hideMessage();
  }
};

scene.add(triggerZone);
```

### Collectible Items
```javascript
class Collectible extends GameObject {
  constructor(x, y, type = "coin") {
    super(x, y);
    this.name = `Collectible_${type}`;
    this.addTag("collectible");
    this.addTag(type);
    
    this.type = type;
    this.value = this.getValueByType(type);
    
    // Visual
    this.addComponent(new ShapeComponent(20, 20, this.getColorByType(type)));
    
    // Trigger collider (doesn't block movement)
    this.addComponent(new BoxColliderComponent(20, 20, true));
    
    // Floating animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.startY = y;
  }
  
  update() {
    super.update();
    // Gentle floating animation
    this.y = this.startY + Math.sin(Time.time() * 2 + this.floatOffset) * 3;
  }
  
  onTriggerEnter(other) {
    if (other.name === "Player") {
      this.collect(other);
    }
  }
  
  collect(player) {
    console.log(`Collected ${this.type} worth ${this.value} points!`);
    
    // Add to player score
    if (player.addScore) {
      player.addScore(this.value);
    }
    
    // Remove this collectible
    this.destroy();
  }
  
  getValueByType(type) {
    switch(type) {
      case "coin": return 10;
      case "gem": return 50;
      case "star": return 100;
      default: return 1;
    }
  }
  
  getColorByType(type) {
    switch(type) {
      case "coin": return '#ffff00';
      case "gem": return '#00ffff';
      case "star": return '#ffffff';
      default: return '#cccccc';
    }
  }
}

// Create collectibles
const coin1 = new Collectible(200, 200, "coin");
const gem1 = new Collectible(300, 150, "gem");
const star1 = new Collectible(400, 250, "star");

scene.add(coin1);
scene.add(gem1);
scene.add(star1);
```

### Damage Zones
```javascript
class DamageZone extends GameObject {
  constructor(x, y, width, height, damagePerSecond = 20) {
    super(x, y);
    this.name = "DamageZone";
    this.addTag("damage");
    this.addTag("hazard");
    
    this.damagePerSecond = damagePerSecond;
    this.playersInside = new Set();
    
    // Visual (red, semi-transparent)
    this.addComponent(new ShapeComponent(width, height, '#ff000044'));
    
    // Trigger collider
    this.addComponent(new BoxColliderComponent(width, height, true));
  }
  
  onTriggerEnter(other) {
    if (other.hasTag("player")) {
      this.playersInside.add(other);
      console.log(`${other.name} entered damage zone!`);
    }
  }
  
  onTriggerExit(other) {
    if (other.hasTag("player")) {
      this.playersInside.delete(other);
      console.log(`${other.name} left damage zone!`);
    }
  }
  
  update() {
    super.update();
    
    // Damage all players inside
    for (const player of this.playersInside) {
      if (player.active && player.takeDamage) {
        const damage = this.damagePerSecond * Time.deltaTime();
        player.takeDamage(damage);
      } else {
        // Clean up inactive players
        this.playersInside.delete(player);
      }
    }
  }
}

// Create a lava pit
const lavaPit = new DamageZone(250, 350, 200, 50, 30);
scene.add(lavaPit);
```

### Door/Portal System
```javascript
class Door extends GameObject {
  constructor(x, y, targetX, targetY, requiresKey = false) {
    super(x, y);
    this.name = "Door";
    this.addTag("door");
    this.addTag("interactive");
    
    this.targetX = targetX;
    this.targetY = targetY;
    this.requiresKey = requiresKey;
    this.isOpen = !requiresKey;
    
    // Visual
    const color = this.isOpen ? '#00ff00' : '#ff8800';
    this.addComponent(new ShapeComponent(30, 60, color));
    
    // Trigger zone
    this.addComponent(new BoxColliderComponent(30, 60, true));
  }
  
  onTriggerEnter(other) {
    if (other.name === "Player") {
      if (this.canUse(other)) {
        this.teleportPlayer(other);
      } else {
        console.log("Door is locked! You need a key.");
      }
    }
  }
  
  canUse(player) {
    if (!this.requiresKey) return true;
    
    // Check if player has key
    return player.hasKey && player.hasKey();
  }
  
  teleportPlayer(player) {
    console.log(`Teleporting ${player.name} to (${this.targetX}, ${this.targetY})`);
    player.x = this.targetX;
    player.y = this.targetY;
    
    // Use key if required
    if (this.requiresKey && player.useKey) {
      player.useKey();
    }
  }
  
  unlock() {
    this.isOpen = true;
    this.requiresKey = false;
    
    // Change visual
    const shape = this.getComponent(ShapeComponent);
    if (shape) {
      shape.color = '#00ff00';
    }
    
    console.log("Door unlocked!");
  }
}

// Create doors
const door1 = new Door(500, 200, 100, 500); // Unlocked door
const door2 = new Door(600, 200, 200, 500, true); // Locked door

scene.add(door1);
scene.add(door2);
```

### Moving Platforms with Passenger Detection
```javascript
class MovingPlatform extends GameObject {
  constructor(x, y, endX, endY, speed = 50) {
    super(x, y);
    this.name = "MovingPlatform";
    this.addTag("platform");
    
    this.startX = x;
    this.startY = y;
    this.endX = endX;
    this.endY = endY;
    this.speed = speed;
    this.direction = 1;
    
    this.passengers = new Set();
    
    // Platform visual
    this.addComponent(new ShapeComponent(100, 20, '#888888'));
    
    // Solid collision for standing on
    this.addComponent(new BoxColliderComponent(100, 20));
    
    // Trigger zone above platform for passenger detection
    this.passengerDetector = new GameObject(x, y - 10);
    this.passengerDetector.addComponent(new BoxColliderComponent(100, 10, true));
    this.passengerDetector.onTriggerEnter = (other) => {
      if (other.hasTag("player")) {
        this.passengers.add(other);
      }
    };
    this.passengerDetector.onTriggerExit = (other) => {
      if (other.hasTag("player")) {
        this.passengers.delete(other);
      }
    };
    
    scene.add(this.passengerDetector);
  }
  
  update() {
    super.update();
    
    // Calculate movement
    const totalDistance = Math.sqrt(
      Math.pow(this.endX - this.startX, 2) + 
      Math.pow(this.endY - this.startY, 2)
    );
    
    const directionX = (this.endX - this.startX) / totalDistance;
    const directionY = (this.endY - this.startY) / totalDistance;
    
    const moveX = directionX * this.speed * this.direction * Time.deltaTime();
    const moveY = directionY * this.speed * this.direction * Time.deltaTime();
    
    // Move platform
    this.x += moveX;
    this.y += moveY;
    
    // Move passenger detector
    this.passengerDetector.x = this.x;
    this.passengerDetector.y = this.y - 10;
    
    // Move passengers
    for (const passenger of this.passengers) {
      if (passenger.active) {
        passenger.x += moveX;
        passenger.y += moveY;
      } else {
        this.passengers.delete(passenger);
      }
    }
    
    // Check direction reversal
    const distanceToEnd = Math.sqrt(
      Math.pow(this.x - this.endX, 2) + 
      Math.pow(this.y - this.endY, 2)
    );
    
    const distanceToStart = Math.sqrt(
      Math.pow(this.x - this.startX, 2) + 
      Math.pow(this.y - this.startY, 2)
    );
    
    if (this.direction === 1 && distanceToEnd < 5) {
      this.direction = -1;
    } else if (this.direction === -1 && distanceToStart < 5) {
      this.direction = 1;
    }
  }
}
```

## Auto-sizing from Sprites

BoxColliderComponent can automatically size itself based on attached sprite components:

```javascript
const gameObject = new GameObject(100, 100);

// Add sprite first
const sprite = gameObject.addComponent(new SpriteRendererComponent(mySprite));

// Collider will automatically use sprite dimensions
const collider = gameObject.addComponent(new BoxColliderComponent());

console.log(collider.width); // Matches sprite width
console.log(collider.height); // Matches sprite height
```

## Best Practices

1. **Use triggers for detection** - Items, zones, sensors
2. **Use solid colliders for blocking** - Walls, platforms, obstacles
3. **Size colliders appropriately** - Slightly smaller than visual for better feel
4. **Handle both enter and exit events** for complete interaction logic
5. **Use tags** to identify different types of objects in collision events
6. **Clean up references** in trigger exit events to prevent memory leaks

## Common Patterns

### Checkpoint System
```javascript
class Checkpoint extends GameObject {
  constructor(x, y, id) {
    super(x, y);
    this.name = `Checkpoint_${id}`;
    this.addTag("checkpoint");
    this.id = id;
    this.activated = false;
    
    this.addComponent(new ShapeComponent(40, 60, '#ffff00'));
    this.addComponent(new BoxColliderComponent(40, 60, true));
  }
  
  onTriggerEnter(other) {
    if (other.name === "Player" && !this.activated) {
      this.activate();
      if (other.setCheckpoint) {
        other.setCheckpoint(this.x, this.y);
      }
    }
  }
  
  activate() {
    this.activated = true;
    const shape = this.getComponent(ShapeComponent);
    shape.color = '#00ff00'; // Green when activated
    console.log(`Checkpoint ${this.id} activated!`);
  }
}
```

This comprehensive documentation covers all the essential aspects of using BoxColliderComponent effectively in NityJS games.
