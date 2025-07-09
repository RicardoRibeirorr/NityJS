# GravityComponent Class

The `GravityComponent` applies gravity effects to GameObjects, creating realistic falling behavior when combined with physics components like `RigidbodyComponent`.

## Overview

The GravityComponent continuously increases the Y velocity of an object over time, simulating the effect of gravity. It's commonly used for platformer games, physics simulations, and any scenario where objects should fall naturally.

## Constructor

```javascript
new GravityComponent(options)
```

**Parameters:**
- `options` (object, optional) - Configuration options
  - `gravityScale` (number, default: 300) - Gravity strength in pixels per second squared

## Properties

- `gravity` (boolean) - Whether gravity is currently enabled
- `gravityScale` (number) - Strength of gravity effect
- `velocity` (object) - Current velocity with x and y components

## Usage Examples

### Basic Gravity

```javascript
import { GravityComponent } from './src/physics/components/GravityComponent.js';
import { RigidbodyComponent } from './src/physics/components/RigidbodyComponent.js';

class FallingObject extends GameObject {
    constructor() {
        super("FallingObject");
        
        // Add gravity (default strength)
        const gravity = new GravityComponent();
        this.addComponent(gravity);
        
        // Add rigidbody for movement
        const rigidbody = new RigidbodyComponent();
        this.addComponent(rigidbody);
    }
}
```

### Custom Gravity Strength

```javascript
// Lighter gravity (moon-like)
const lightGravity = new GravityComponent({ gravityScale: 100 });

// Heavy gravity (Jupiter-like)
const heavyGravity = new GravityComponent({ gravityScale: 800 });

// Reverse gravity (floating upward)
const reverseGravity = new GravityComponent({ gravityScale: -200 });
```

### Conditional Gravity

```javascript
class Player extends GameObject {
    constructor() {
        super("Player");
        
        this.gravity = new GravityComponent({ gravityScale: 400 });
        this.addComponent(this.gravity);
        
        this.isFlying = false;
    }
    
    update() {
        // Disable gravity when flying
        this.gravity.gravity = !this.isFlying;
        
        if (Input.isKeyPressed('F')) {
            this.toggleFlight();
        }
    }
    
    toggleFlight() {
        this.isFlying = !this.isFlying;
        
        if (this.isFlying) {
            // Reset velocity when starting to fly
            this.gravity.velocity.y = 0;
        }
    }
}
```

### Platformer Character

```javascript
class PlatformerPlayer extends GameObject {
    constructor() {
        super("Player");
        
        this.gravity = new GravityComponent({ gravityScale: 600 });
        this.rigidbody = new RigidbodyComponent();
        this.collider = new BoxColliderComponent(32, 32);
        
        this.addComponent(this.gravity);
        this.addComponent(this.rigidbody);
        this.addComponent(this.collider);
        
        this.jumpForce = -300;
        this.isGrounded = false;
    }
    
    update() {
        this.handleInput();
        this.checkGrounded();
    }
    
    handleInput() {
        // Horizontal movement
        if (Input.isKeyDown('ArrowLeft')) {
            this.rigidbody.velocity.x = -150;
        } else if (Input.isKeyDown('ArrowRight')) {
            this.rigidbody.velocity.x = 150;
        } else {
            this.rigidbody.velocity.x = 0;
        }
        
        // Jumping
        if (Input.isKeyPressed('Space') && this.isGrounded) {
            this.jump();
        }
    }
    
    jump() {
        this.gravity.velocity.y = this.jumpForce;
        this.isGrounded = false;
    }
    
    checkGrounded() {
        // Simple ground check (would be more complex in real implementation)
        if (this.y >= 400) { // Ground level
            this.y = 400;
            this.gravity.velocity.y = 0;
            this.isGrounded = true;
        }
    }
}
```

### Variable Gravity Zones

```javascript
class GravityZone extends GameObject {
    constructor(gravityScale, x, y, width, height) {
        super("GravityZone");
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravityScale = gravityScale;
        
        // Visual representation
        const shape = new ShapeComponent("rectangle", {
            width: width,
            height: height,
            color: "rgba(0, 255, 0, 0.2)"
        });
        this.addComponent(shape);
    }
    
    update() {
        // Find all objects with gravity in this zone
        const objectsInZone = this.getObjectsInZone();
        
        for (const obj of objectsInZone) {
            const gravity = obj.getComponent(GravityComponent);
            if (gravity) {
                gravity.gravityScale = this.gravityScale;
            }
        }
    }
    
    getObjectsInZone() {
        // Get all game objects in the scene
        const allObjects = Game.instance.currentScene.objects;
        
        return allObjects.filter(obj => {
            return obj.x >= this.x && 
                   obj.x <= this.x + this.width &&
                   obj.y >= this.y && 
                   obj.y <= this.y + this.height;
        });
    }
}

// Usage
const lowGravityZone = new GravityZone(50, 100, 100, 200, 300);
const highGravityZone = new GravityZone(1000, 400, 200, 150, 200);
```

### Bouncing Ball

```javascript
class BouncingBall extends GameObject {
    constructor() {
        super("BouncingBall");
        
        this.gravity = new GravityComponent({ gravityScale: 400 });
        this.addComponent(this.gravity);
        
        // Visual
        const shape = new ShapeComponent("circle", {
            radius: 15,
            color: "red"
        });
        this.addComponent(shape);
        
        this.bounciness = 0.8;
        this.groundY = 450;
    }
    
    update() {
        // Apply gravity movement
        this.y += this.gravity.velocity.y * Time.deltaTime();
        
        // Bounce off ground
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.gravity.velocity.y *= -this.bounciness;
            
            // Stop bouncing if velocity is too low
            if (Math.abs(this.gravity.velocity.y) < 20) {
                this.gravity.velocity.y = 0;
            }
        }
    }
}
```

### Particle System with Gravity

```javascript
class GravityParticleSystem extends GameObject {
    constructor() {
        super("ParticleSystem");
        
        this.particles = [];
    }
    
    createParticle(x, y) {
        const particle = new GameObject("Particle");
        particle.x = x;
        particle.y = y;
        
        // Add gravity with some randomness
        const gravity = new GravityComponent({ 
            gravityScale: Random.range(200, 600) 
        });
        
        // Initial upward velocity
        gravity.velocity.x = Random.range(-100, 100);
        gravity.velocity.y = Random.range(-200, -100);
        
        particle.addComponent(gravity);
        
        // Visual
        const shape = new ShapeComponent("circle", {
            radius: Random.range(2, 5),
            color: "orange"
        });
        particle.addComponent(shape);
        
        // Lifetime
        particle.life = Random.range(2, 4);
        particle.age = 0;
        
        this.particles.push(particle);
        Instantiate.create(particle);
    }
    
    update() {
        // Update particle lifetimes
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.age += Time.deltaTime();
            
            if (particle.age >= particle.life) {
                particle.destroy();
                this.particles.splice(i, 1);
            } else {
                // Apply gravity movement
                const gravity = particle.getComponent(GravityComponent);
                particle.x += gravity.velocity.x * Time.deltaTime();
                particle.y += gravity.velocity.y * Time.deltaTime();
                
                // Fade out
                const alpha = 1 - (particle.age / particle.life);
                const shape = particle.getComponent(ShapeComponent);
                shape.color = `rgba(255, 165, 0, ${alpha})`;
            }
        }
        
        // Create new particles
        if (Input.isLeftMousePressed()) {
            const mousePos = Input.getMousePosition();
            for (let i = 0; i < 5; i++) {
                this.createParticle(mousePos.x, mousePos.y);
            }
        }
    }
}
```

## Best Practices

1. **Combine with RigidbodyComponent** - For proper physics movement
2. **Adjust gravity scale** - Different values create different feels (light vs heavy objects)
3. **Use ground detection** - Prevent objects from falling through floors
4. **Consider terminal velocity** - Limit maximum falling speed for realism
5. **Reset velocity when needed** - Clear velocity when changing states

## Common Patterns

### Terminal Velocity

```javascript
class TerminalVelocityGravity extends GravityComponent {
    constructor(options = {}) {
        super(options);
        this.terminalVelocity = options.terminalVelocity || 400;
    }
    
    update() {
        super.update();
        
        // Limit falling speed
        if (this.velocity.y > this.terminalVelocity) {
            this.velocity.y = this.terminalVelocity;
        }
    }
}
```

### Air Resistance

```javascript
class AirResistanceGravity extends GravityComponent {
    constructor(options = {}) {
        super(options);
        this.airResistance = options.airResistance || 0.99;
    }
    
    update() {
        super.update();
        
        // Apply air resistance
        this.velocity.x *= this.airResistance;
        this.velocity.y *= this.airResistance;
    }
}
```

## Integration with Other Components

The GravityComponent works best when combined with:

- **RigidbodyComponent** - For physics-based movement
- **BoxColliderComponent/CircleColliderComponent** - For collision detection
- **PlayerController** - For character movement with gravity

## Related Classes

- [RigidbodyComponent](RigidbodyComponent.md) - Physics movement component
- [BoxColliderComponent](BoxColliderComponent.md) - Box collision detection
- [CircleColliderComponent](CircleColliderComponent.md) - Circle collision detection
- [Time](../core/Time.md) - Used for frame-independent gravity calculations
