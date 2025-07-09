# Component Class Documentation

The `Component` class is the base class for all functionality in NityJS, equivalent to Unity's **MonoBehaviour**. Components provide modular behavior that can be attached to GameObjects using Unity-familiar patterns.

## Overview

```javascript
import { Component } from 'nity-engine';

class MyCustomComponent extends Component {
  start() {
    console.log("Component started!");
  }
  
  update() {
    // Component logic here
  }
}
```

## Unity Equivalents

- **Component** = Unity's **MonoBehaviour** - Base class for all game logic
- **start()** = Unity's **Start()** - Initialization method
- **update()** = Unity's **Update()** - Per-frame logic
- **lateUpdate()** = Unity's **LateUpdate()** - Post-update logic
- **gameObject** = Unity's **gameObject** - Reference to parent GameObject

> **⚠️ Important:** `lateUpdate()` runs independently and does **NOT** pause when the game is in pause mode.

## Component Usage Patterns

NityJS supports multiple ways to create and use components, offering flexibility for different coding styles:

### 1. Class Extension (Recommended)
**Unity-style component classes** - Most similar to Unity MonoBehaviour scripts:

```javascript
class PlayerController extends Component {
    constructor() {
        super();
        this.speed = 200;
        this.jumpForce = 400;
    }
    
    start() {
        this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
        this.collider = this.gameObject.getComponent(BoxColliderComponent);
    }
    
    update() {
        this.handleMovement();
        this.handleJumping();
    }
    
    handleMovement() {
        const moveX = Input.isKeyDown('d') ? 1 : 0 - Input.isKeyDown('a') ? 1 : 0;
        this.rigidbody.velocity.x = moveX * this.speed;
    }
    
    handleJumping() {
        if (Input.isKeyPressed('Space') && this.isGrounded()) {
            this.rigidbody.velocity.y = -this.jumpForce;
        }
    }
    
    isGrounded() {
        return this.gameObject.y >= 400;
    }
}

// Usage
const player = new GameObject("Player");
player.addComponent(new PlayerController());
```

### 2. Inline Anonymous Components
**Quick behavior** - For simple, one-off behaviors:

```javascript
const enemy = new GameObject("Enemy");

// Simple patrol behavior
enemy.addComponent(new class extends Component {
    constructor() {
        super();
        this.speed = 50;
        this.direction = 1;
        this.leftBound = 100;
        this.rightBound = 300;
    }
    
    update() {
        this.gameObject.x += this.speed * this.direction * Time.deltaTime();
        
        if (this.gameObject.x <= this.leftBound || this.gameObject.x >= this.rightBound) {
            this.direction *= -1;
        }
    }
});
```

### 3. Factory Pattern
**Component factories** - For configurable, reusable components:

```javascript
class ComponentFactory {
    static createMover(speed, direction) {
        return new class extends Component {
            constructor() {
                super();
                this.speed = speed;
                this.direction = direction;
            }
            
            update() {
                this.gameObject.x += Math.cos(this.direction) * this.speed * Time.deltaTime();
                this.gameObject.y += Math.sin(this.direction) * this.speed * Time.deltaTime();
            }
        };
    }
}

// Usage
const bullet = new GameObject("Bullet");
bullet.addComponent(ComponentFactory.createMover(300, Math.PI / 4));
```

## Base Component Class

### Properties

#### `gameObject`
- **Type:** `GameObject`
- **Description:** Reference to the GameObject this component is attached to

**Example:**
```javascript
class MoveComponent extends Component {
  update() {
    // Access the GameObject
    this.gameObject.x += 100 * Time.deltaTime();
  }
}
```

#### `active`
- **Type:** `boolean`
- **Description:** Whether this component is active and updating

## Lifecycle Methods

### `start()`
Called once when the component is added to an active GameObject.

```javascript
class PlayerController extends Component {
  start() {
    console.log("Player controller initialized");
    this.speed = 200;
    this.health = 100;
    
    // Cache component references
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
  }
}
```

### `update()`
Called every frame while the component and GameObject are active.

```javascript
class EnemyAI extends Component {
  update() {
    const player = this.findPlayer();
    if (player) {
      this.moveTowards(player);
    }
  }
  
  findPlayer() {
    // Find player in scene
    return Game.instance.scene.findByName("Player");
  }
  
  moveTowards(target) {
    const dx = target.x - this.gameObject.x;
    const dy = target.y - this.gameObject.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const speed = 100;
      this.gameObject.x += (dx / distance) * speed * Time.deltaTime();
      this.gameObject.y += (dy / distance) * speed * Time.deltaTime();
    }
  }
}
```

### `lateUpdate()`
Called after all update() methods have been called.

> **⚠️ Important:** `lateUpdate()` runs independently and does **NOT** pause when the game is in pause mode. Use this for critical systems that need to continue running during pauses (like UI updates, debug systems, or essential background processes).

```javascript
class CameraFollow extends Component {
  lateUpdate() {
    // Update camera position after everything else has moved
    const target = this.gameObject.getComponent(FollowTarget);
    if (target) {
      this.updateCameraPosition(target.target);
    }
  }
}
```

## Creating Custom Components

### Basic Component
```javascript
class HealthComponent extends Component {
  constructor(maxHealth = 100) {
    super();
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }
  
  start() {
    console.log(`Health component initialized with ${this.maxHealth} HP`);
  }
  
  takeDamage(amount) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    console.log(`Took ${amount} damage. Health: ${this.currentHealth}/${this.maxHealth}`);
    
    if (this.currentHealth <= 0) {
      this.onDeath();
    }
  }
  
  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    console.log(`Healed ${amount}. Health: ${this.currentHealth}/${this.maxHealth}`);
  }
  
  onDeath() {
    console.log("Entity died!");
    this.gameObject.destroy();
  }
}
```

### Input Handling Component
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
    
    // Handle movement input
    const moveX = (Input.isKeyDown('d') ? 1 : 0) - (Input.isKeyDown('a') ? 1 : 0);
    const moveY = (Input.isKeyDown('s') ? 1 : 0) - (Input.isKeyDown('w') ? 1 : 0);
    
    this.rigidbody.velocity.x = moveX * this.speed;
    this.rigidbody.velocity.y = moveY * this.speed;
    
    // Handle shooting
    if (Input.isKeyPressed(' ')) {
      this.shoot();
    }
  }
  
  shoot() {
    // Create bullet
    const bullet = new GameObject(this.gameObject.x, this.gameObject.y);
    bullet.addComponent(new BulletComponent(0, -1)); // Shoot upward
    Game.instance.scene.add(bullet);
  }
}
```

### Timer Component
```javascript
class TimerComponent extends Component {
  constructor(duration, onComplete, repeat = false) {
    super();
    this.duration = duration;
    this.onComplete = onComplete;
    this.repeat = repeat;
    this.currentTime = 0;
    this.isRunning = true;
  }
  
  update() {
    if (!this.isRunning) return;
    
    this.currentTime += Time.deltaTime();
    
    if (this.currentTime >= this.duration) {
      this.onComplete();
      
      if (this.repeat) {
        this.currentTime = 0;
      } else {
        this.isRunning = false;
      }
    }
  }
  
  reset() {
    this.currentTime = 0;
    this.isRunning = true;
  }
  
  pause() {
    this.isRunning = false;
  }
  
  resume() {
    this.isRunning = true;
  }
  
  getProgress() {
    return this.currentTime / this.duration;
  }
}

// Usage
const explosion = new GameObject(100, 100);
explosion.addComponent(new TimerComponent(2.0, () => {
  explosion.destroy(); // Remove after 2 seconds
}));
```

### State Machine Component
```javascript
class StateMachineComponent extends Component {
  constructor(initialState = "idle") {
    super();
    this.states = new Map();
    this.currentState = null;
    this.initialState = initialState;
  }
  
  start() {
    this.changeState(this.initialState);
  }
  
  addState(name, stateObject) {
    this.states.set(name, stateObject);
  }
  
  changeState(newState) {
    // Exit current state
    if (this.currentState && this.states.has(this.currentState)) {
      const state = this.states.get(this.currentState);
      if (state.exit) state.exit();
    }
    
    // Enter new state
    this.currentState = newState;
    if (this.states.has(newState)) {
      const state = this.states.get(newState);
      if (state.enter) state.enter();
    }
  }
  
  update() {
    if (this.currentState && this.states.has(this.currentState)) {
      const state = this.states.get(this.currentState);
      if (state.update) state.update();
    }
  }
}

// Usage
class EnemyAI extends Component {
  start() {
    this.stateMachine = this.gameObject.addComponent(new StateMachineComponent("patrol"));
    
    // Define states
    this.stateMachine.addState("patrol", {
      enter: () => console.log("Started patrolling"),
      update: () => this.patrolBehavior(),
      exit: () => console.log("Stopped patrolling")
    });
    
    this.stateMachine.addState("chase", {
      enter: () => console.log("Started chasing"),
      update: () => this.chaseBehavior(),
      exit: () => console.log("Stopped chasing")
    });
  }
  
  update() {
    // Check for state transitions
    const player = this.findNearbyPlayer();
    if (player && this.stateMachine.currentState === "patrol") {
      this.stateMachine.changeState("chase");
    } else if (!player && this.stateMachine.currentState === "chase") {
      this.stateMachine.changeState("patrol");
    }
  }
}
```

## Component Communication

### Getting Other Components
```javascript
class WeaponComponent extends Component {
  start() {
    // Get other components on the same GameObject
    this.health = this.gameObject.getComponent(HealthComponent);
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
  }
  
  update() {
    if (this.health && this.health.currentHealth > 0) {
      // Only allow shooting if alive
      if (Input.isKeyPressed(' ')) {
        this.shoot();
      }
    }
  }
}
```

### Component Events
```javascript
class EventComponent extends Component {
  constructor() {
    super();
    this.listeners = new Map();
  }
  
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  dispatchEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

// Usage
class Player extends GameObject {
  start() {
    const health = this.addComponent(new HealthComponent(100));
    const events = this.addComponent(new EventComponent());
    
    // Listen for health changes
    events.addEventListener("health_changed", (data) => {
      console.log(`Health changed from ${data.old} to ${data.new}`);
    });
    
    // Health component dispatches events
    health.addEventListener("damage_taken", () => {
      events.dispatchEvent("health_changed", {
        old: health.currentHealth + amount,
        new: health.currentHealth
      });
    });
  }
}
```

## Built-in Components

### Rendering Components
- **[ShapeComponent](../renderer/ShapeComponent.md)** - Basic shape rendering
- **[SpriteRendererComponent](../renderer/SpriteRendererComponent.md)** - Sprite rendering
- **[ImageComponent](../renderer/ImageComponent.md)** - Image rendering

### Physics Components
- **[RigidbodyComponent](../physics/RigidbodyComponent.md)** - Physics movement
- **[BoxColliderComponent](../physics/BoxColliderComponent.md)** - Rectangle collision
- **[CircleColliderComponent](../physics/CircleColliderComponent.md)** - Circle collision
- **[GravityComponent](../physics/GravityComponent.md)** - Gravity simulation

### Animation Components
- **[SpriteAnimationComponent](../animations/SpriteAnimationComponent.md)** - Sprite animations

### Utility Components
- **[CameraComponent](../camera/CameraComponent.md)** - Camera control

## Best Practices

1. **Keep components focused** - Each component should have a single responsibility
2. **Use composition** - Combine simple components to create complex behavior
3. **Cache references** - Get component references in start(), not update()
4. **Avoid tight coupling** - Components shouldn't depend heavily on each other
5. **Use events** for communication between components
6. **Make components reusable** - Parameterize behavior through constructor options

## Performance Tips

1. **Minimize update() work** - Only do necessary calculations each frame
2. **Use object pooling** for frequently created components
3. **Cache expensive operations** - Store results instead of recalculating
4. **Conditional updates** - Skip updates when component state hasn't changed

```javascript
class OptimizedComponent extends Component {
  constructor() {
    super();
    this.lastUpdateTime = 0;
    this.updateInterval = 0.1; // Update 10 times per second instead of 60
  }
  
  update() {
    // Throttle updates
    if (Time.time() - this.lastUpdateTime < this.updateInterval) {
      return;
    }
    
    this.lastUpdateTime = Time.time();
    this.doExpensiveCalculation();
  }
}
```

## Component Templates

### Basic AI Component
```javascript
class BasicAI extends Component {
  constructor(config = {}) {
    super();
    this.speed = config.speed || 100;
    this.detectionRange = config.detectionRange || 150;
    this.target = null;
  }
  
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
  }
  
  update() {
    this.findTarget();
    this.moveTowardsTarget();
  }
  
  findTarget() {
    const players = Game.instance.scene.findByTag("player");
    for (const player of players) {
      const distance = this.getDistanceTo(player);
      if (distance <= this.detectionRange) {
        this.target = player;
        return;
      }
    }
    this.target = null;
  }
  
  getDistanceTo(other) {
    const dx = other.x - this.gameObject.x;
    const dy = other.y - this.gameObject.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  moveTowardsTarget() {
    if (!this.target || !this.rigidbody) return;
    
    const dx = this.target.x - this.gameObject.x;
    const dy = this.target.y - this.gameObject.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.rigidbody.velocity.x = (dx / distance) * this.speed;
      this.rigidbody.velocity.y = (dy / distance) * this.speed;
    }
  }
}
```
