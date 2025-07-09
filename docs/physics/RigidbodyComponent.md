# RigidbodyComponent Documentation

The `RigidbodyComponent` provides physics-based movement and collision handling for GameObjects. It integrates with collider components to provide collision detection and response.

## Overview

```javascript
import { RigidbodyComponent } from 'nity-engine';

const player = new GameObject(100, 100);
const rigidbody = player.addComponent(new RigidbodyComponent({
  gravity: true,
  gravityScale: 300,
  bounciness: 0.5
}));
```

## Constructor

### `new RigidbodyComponent(options)`

Creates a new RigidbodyComponent with the specified options.

**Parameters:**
- `options` (Object) - Configuration options
  - `gravity` (boolean) - Whether gravity affects this object (default: false)
  - `gravityScale` (number) - Gravity strength multiplier (default: 300)
  - `bounciness` (number) - Bounce factor on collision (0-1, default: 0)

**Example:**
```javascript
// Basic rigidbody without gravity
const rb1 = new RigidbodyComponent();

// Rigidbody with gravity
const rb2 = new RigidbodyComponent({
  gravity: true,
  gravityScale: 500
});

// Bouncy rigidbody
const rb3 = new RigidbodyComponent({
  bounciness: 0.8
});
```

## Properties

### `velocity`
- **Type:** `{x: number, y: number}`
- **Description:** Current velocity of the object in pixels per second

**Example:**
```javascript
// Set velocity directly
rigidbody.velocity.x = 200; // Move right at 200 pixels/second
rigidbody.velocity.y = -100; // Move up at 100 pixels/second

// Add to existing velocity
rigidbody.velocity.x += 50; // Accelerate
```

### `gravity`
- **Type:** `boolean`
- **Description:** Whether gravity affects this object

### `gravityScale`
- **Type:** `number`
- **Description:** Multiplier for gravity strength

### `bounciness`
- **Type:** `number`
- **Description:** How much the object bounces on collision (0 = no bounce, 1 = full bounce)

## Methods

### `move(dx, dy)`
Moves the object by the specified amount, handling collisions.

**Parameters:**
- `dx` (number) - Distance to move horizontally
- `dy` (number) - Distance to move vertically

**Returns:** `boolean` - Whether the movement was successful

**Example:**
```javascript
// Manual movement
const success = rigidbody.move(10, 0); // Move 10 pixels right
if (!success) {
  console.log("Movement blocked by collision");
}
```

## Usage Examples

### Basic Movement Controller
```javascript
class PlayerController extends Component {
  constructor(speed = 200) {
    super();
    this.speed = speed;
  }
  
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    if (!this.rigidbody) {
      console.warn("PlayerController requires RigidbodyComponent");
    }
  }
  
  update() {
    if (!this.rigidbody) return;
    
    // Handle input
    let moveX = 0;
    let moveY = 0;
    
    if (Input.isKeyDown('a')) moveX -= 1;
    if (Input.isKeyDown('d')) moveX += 1;
    if (Input.isKeyDown('w')) moveY -= 1;
    if (Input.isKeyDown('s')) moveY += 1;
    
    // Set velocity
    this.rigidbody.velocity.x = moveX * this.speed;
    this.rigidbody.velocity.y = moveY * this.speed;
  }
}

// Usage
const player = new GameObject(100, 100);
player.addComponent(new BoxColliderComponent(40, 40));
player.addComponent(new RigidbodyComponent({ gravity: false }));
player.addComponent(new PlayerController(250));
```

### Platformer Character
```javascript
class PlatformerController extends Component {
  constructor() {
    super();
    this.speed = 200;
    this.jumpPower = 400;
    this.isGrounded = false;
  }
  
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    
    // Setup collision events
    this.gameObject.onCollisionEnter = (other) => {
      if (other.hasTag("ground")) {
        this.isGrounded = true;
      }
    };
    
    this.gameObject.onCollisionExit = (other) => {
      if (other.hasTag("ground")) {
        this.isGrounded = false;
      }
    };
  }
  
  update() {
    // Horizontal movement
    let moveX = 0;
    if (Input.isKeyDown('a')) moveX -= 1;
    if (Input.isKeyDown('d')) moveX += 1;
    
    this.rigidbody.velocity.x = moveX * this.speed;
    
    // Jumping
    if (Input.isKeyPressed('space') && this.isGrounded) {
      this.rigidbody.velocity.y = -this.jumpPower;
      this.isGrounded = false;
    }
  }
}

// Setup
const player = new GameObject(100, 100);
player.addComponent(new BoxColliderComponent(30, 40));
player.addComponent(new RigidbodyComponent({
  gravity: true,
  gravityScale: 800
}));
player.addComponent(new PlatformerController());
```

### Projectile Physics
```javascript
class Projectile extends GameObject {
  constructor(x, y, angle, speed, gravity = true) {
    super(x, y);
    this.name = "Projectile";
    this.addTag("projectile");
    
    // Setup components
    this.addComponent(new ShapeComponent(8, 8, '#ffff00'));
    this.addComponent(new BoxColliderComponent(8, 8, true)); // Trigger
    
    const rigidbody = this.addComponent(new RigidbodyComponent({
      gravity: gravity,
      gravityScale: 500
    }));
    
    // Set initial velocity based on angle and speed
    rigidbody.velocity.x = Math.cos(angle) * speed;
    rigidbody.velocity.y = Math.sin(angle) * speed;
    
    // Auto-destroy after 5 seconds
    setTimeout(() => {
      if (this.active) this.destroy();
    }, 5000);
  }
  
  onTriggerEnter(other) {
    if (other.hasTag("enemy")) {
      // Hit enemy
      if (other.takeDamage) {
        other.takeDamage(25);
      }
      this.destroy();
    } else if (other.hasTag("wall")) {
      // Hit wall
      this.destroy();
    }
  }
}

// Usage - shoot projectile
function shootProjectile(startX, startY, targetX, targetY) {
  const angle = Math.atan2(targetY - startY, targetX - startX);
  const projectile = new Projectile(startX, startY, angle, 300);
  scene.add(projectile);
}
```

### Bouncing Ball
```javascript
class BouncyBall extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.name = "Ball";
    
    // Visual
    this.addComponent(new ShapeComponent(20, 20, '#ff4444', 'circle'));
    
    // Physics
    this.addComponent(new CircleColliderComponent(10));
    const rigidbody = this.addComponent(new RigidbodyComponent({
      gravity: true,
      gravityScale: 400,
      bounciness: 0.8 // 80% bounce
    }));
    
    // Give it some initial velocity
    rigidbody.velocity.x = (Math.random() - 0.5) * 200;
    rigidbody.velocity.y = -200;
  }
}

// Create bouncing balls
for (let i = 0; i < 5; i++) {
  const ball = new BouncyBall(100 + i * 30, 50);
  scene.add(ball);
}
```

### Moving Platform
```javascript
class MovingPlatform extends GameObject {
  constructor(x, y, endX, endY, speed = 100) {
    super(x, y);
    this.name = "MovingPlatform";
    this.addTag("platform");
    
    this.startX = x;
    this.startY = y;
    this.endX = endX;
    this.endY = endY;
    this.speed = speed;
    this.direction = 1; // 1 or -1
    
    // Visual
    this.addComponent(new ShapeComponent(100, 20, '#666666'));
    
    // Collision (solid)
    this.addComponent(new BoxColliderComponent(100, 20));
    
    // Movement
    this.addComponent(new RigidbodyComponent({ gravity: false }));
  }
  
  update() {
    super.update();
    
    const rigidbody = this.getComponent(RigidbodyComponent);
    
    // Calculate movement direction
    const totalDistance = Math.sqrt(
      Math.pow(this.endX - this.startX, 2) + 
      Math.pow(this.endY - this.startY, 2)
    );
    
    const directionX = (this.endX - this.startX) / totalDistance;
    const directionY = (this.endY - this.startY) / totalDistance;
    
    // Move
    rigidbody.velocity.x = directionX * this.speed * this.direction;
    rigidbody.velocity.y = directionY * this.speed * this.direction;
    
    // Check if we need to reverse direction
    const distanceToStart = Math.sqrt(
      Math.pow(this.x - this.startX, 2) + 
      Math.pow(this.y - this.startY, 2)
    );
    
    const distanceToEnd = Math.sqrt(
      Math.pow(this.x - this.endX, 2) + 
      Math.pow(this.y - this.endY, 2)
    );
    
    if (this.direction === 1 && distanceToEnd < 5) {
      this.direction = -1;
    } else if (this.direction === -1 && distanceToStart < 5) {
      this.direction = 1;
    }
  }
}
```

## Integration with Colliders

RigidbodyComponent requires a collider component to work properly:

```javascript
const gameObject = new GameObject(100, 100);

// Add collider first
gameObject.addComponent(new BoxColliderComponent(40, 40));

// Then add rigidbody
gameObject.addComponent(new RigidbodyComponent());
```

### Collision Events

RigidbodyComponent automatically handles collision events:

```javascript
const player = new GameObject(100, 100);
player.addComponent(new BoxColliderComponent(40, 40));
player.addComponent(new RigidbodyComponent());

// Handle collisions
player.onCollisionEnter = (other) => {
  console.log("Collision started with:", other.name);
  
  if (other.hasTag("enemy")) {
    player.takeDamage(10);
  }
};

player.onCollisionStay = (other) => {
  // Called every frame while colliding
  if (other.hasTag("damage_zone")) {
    player.takeDamage(1);
  }
};

player.onCollisionExit = (other) => {
  console.log("Collision ended with:", other.name);
};
```

## Performance Considerations

1. **Collision Resolution**: Uses small steps for accurate collision detection
2. **Gravity**: Only applied when `gravity` is true
3. **Velocity Limits**: No built-in velocity limits - implement if needed

```javascript
class LimitedRigidbody extends Component {
  constructor(maxSpeed = 500) {
    super();
    this.maxSpeed = maxSpeed;
  }
  
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
  }
  
  update() {
    if (!this.rigidbody) return;
    
    // Limit velocity
    const speed = Math.sqrt(
      this.rigidbody.velocity.x ** 2 + 
      this.rigidbody.velocity.y ** 2
    );
    
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.rigidbody.velocity.x *= scale;
      this.rigidbody.velocity.y *= scale;
    }
  }
}
```

## Best Practices

1. **Always pair with a collider** for collision detection
2. **Use appropriate gravity settings** for your game type
3. **Handle collision events** for game logic
4. **Set reasonable bounciness values** (0-1 range)
5. **Consider velocity limits** for fast-moving objects
6. **Use triggers** for detection without collision response

## Common Patterns

### Character Controller with Air Control
```javascript
class AdvancedController extends Component {
  constructor() {
    super();
    this.groundSpeed = 200;
    this.airSpeed = 150;
    this.jumpPower = 400;
    this.isGrounded = false;
  }
  
  update() {
    const rb = this.gameObject.getComponent(RigidbodyComponent);
    const currentSpeed = this.isGrounded ? this.groundSpeed : this.airSpeed;
    
    // Movement with different speeds for ground/air
    let moveX = 0;
    if (Input.isKeyDown('a')) moveX -= 1;
    if (Input.isKeyDown('d')) moveX += 1;
    
    rb.velocity.x = moveX * currentSpeed;
    
    // Jumping
    if (Input.isKeyPressed('space') && this.isGrounded) {
      rb.velocity.y = -this.jumpPower;
    }
  }
}
```
