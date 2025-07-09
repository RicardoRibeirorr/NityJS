# CircleColliderComponent Class

The `CircleColliderComponent` provides circular collision detection for GameObjects. It can detect collisions with other circle colliders and box colliders, and supports both solid colliders and triggers.

## Overview

The CircleColliderComponent uses circular bounds for collision detection, making it ideal for round objects like balls, coins, wheels, or character capsules. It provides efficient collision detection algorithms for both circle-to-circle and circle-to-box collisions.

## Constructor

```javascript
new CircleColliderComponent(radius, trigger)
```

**Parameters:**
- `radius` (number, optional) - Radius of the collider in pixels. If null, uses sprite width/2
- `trigger` (boolean, default: false) - Whether this acts as a trigger (no physics response)

## Properties

- `radius` (number) - The collision radius
- `trigger` (boolean) - Whether this is a trigger collider

## Methods

### checkCollisionWith(other)
Checks collision with another collider component.

### getBounds()
Returns the collision bounds with x, y, and radius properties.

## Usage Examples

### Basic Circle Collider

```javascript
import { CircleColliderComponent } from './src/physics/components/CircleColliderComponent.js';

class Ball extends GameObject {
    constructor() {
        super("Ball");
        
        // Circle collider with 20 pixel radius
        const collider = new CircleColliderComponent(20, false);
        this.addComponent(collider);
        
        // Visual representation
        const shape = new ShapeComponent("circle", {
            radius: 20,
            color: "red"
        });
        this.addComponent(shape);
    }
}
```

### Auto-sized Collider

```javascript
class Player extends GameObject {
    constructor() {
        super("Player");
        
        // Add sprite first
        const renderer = new SpriteRendererComponent("player", "sprite_0_0");
        this.addComponent(renderer);
        
        // Auto-sized collider (uses sprite width/2 as radius)
        const collider = new CircleColliderComponent();
        this.addComponent(collider);
    }
}
```

### Trigger Collider

```javascript
class Coin extends GameObject {
    constructor() {
        super("Coin");
        
        // Trigger collider for collectibles
        const trigger = new CircleColliderComponent(15, true);
        this.addComponent(trigger);
        
        // Visual
        const shape = new ShapeComponent("circle", {
            radius: 15,
            color: "gold"
        });
        this.addComponent(shape);
    }
    
    onTriggerEnter(other) {
        if (other.gameObject.name === "Player") {
            console.log("Coin collected!");
            this.collect();
        }
    }
    
    collect() {
        // Add score, play sound, destroy coin
        Instantiate.destroy(this);
    }
}
```

### Bouncing Balls

```javascript
class BouncingBall extends GameObject {
    constructor(x, y, radius) {
        super("BouncingBall");
        
        this.x = x;
        this.y = y;
        
        // Physics components
        const rigidbody = new RigidbodyComponent();
        const collider = new CircleColliderComponent(radius);
        const gravity = new GravityComponent({ gravityScale: 300 });
        
        this.addComponent(rigidbody);
        this.addComponent(collider);
        this.addComponent(gravity);
        
        // Visual
        const shape = new ShapeComponent("circle", {
            radius: radius,
            color: "blue"
        });
        this.addComponent(shape);
        
        // Random initial velocity
        rigidbody.velocity.x = Random.range(-100, 100);
        rigidbody.velocity.y = Random.range(-200, -50);
        
        this.bounciness = 0.8;
    }
    
    onCollisionEnter(collision) {
        const rigidbody = this.getComponent(RigidbodyComponent);
        
        // Bounce off other balls
        if (collision.gameObject.name === "BouncingBall") {
            // Simple bounce - reverse velocity
            rigidbody.velocity.x *= -this.bounciness;
            rigidbody.velocity.y *= -this.bounciness;
        }
        
        // Bounce off walls/platforms
        if (collision.gameObject.hasTag("Wall")) {
            rigidbody.velocity.x *= -this.bounciness;
        }
        
        if (collision.gameObject.hasTag("Ground")) {
            rigidbody.velocity.y *= -this.bounciness;
        }
    }
}
```

### Circular Detection Zone

```javascript
class DetectionZone extends GameObject {
    constructor(radius) {
        super("DetectionZone");
        
        // Large trigger collider for detection
        const detector = new CircleColliderComponent(radius, true);
        this.addComponent(detector);
        
        // Visual indicator (semi-transparent)
        const shape = new ShapeComponent("circle", {
            radius: radius,
            color: "rgba(255, 0, 0, 0.2)"
        });
        this.addComponent(shape);
        
        this.detectedObjects = new Set();
    }
    
    onTriggerEnter(other) {
        if (other.gameObject.hasTag("Enemy")) {
            this.detectedObjects.add(other.gameObject);
            console.log(`Enemy detected: ${other.gameObject.name}`);
        }
    }
    
    onTriggerExit(other) {
        if (other.gameObject.hasTag("Enemy")) {
            this.detectedObjects.delete(other.gameObject);
            console.log(`Enemy left range: ${other.gameObject.name}`);
        }
    }
    
    getClosestEnemy() {
        let closest = null;
        let closestDistance = Infinity;
        
        for (const enemy of this.detectedObjects) {
            const distance = this.getDistanceTo(enemy);
            if (distance < closestDistance) {
                closest = enemy;
                closestDistance = distance;
            }
        }
        
        return closest;
    }
    
    getDistanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
```

### Shield/Bubble Effect

```javascript
class Shield extends GameObject {
    constructor(target, radius = 50) {
        super("Shield");
        
        this.target = target;
        this.radius = radius;
        
        // Trigger collider for projectile deflection
        const collider = new CircleColliderComponent(radius, true);
        this.addComponent(collider);
        
        // Visual effect
        const shape = new ShapeComponent("circle", {
            radius: radius,
            color: "rgba(0, 255, 255, 0.3)"
        });
        this.addComponent(shape);
        
        this.energy = 100;
        this.maxEnergy = 100;
    }
    
    update() {
        if (this.target) {
            // Follow target
            this.x = this.target.x;
            this.y = this.target.y;
        }
        
        // Update visual based on energy
        const alpha = this.energy / this.maxEnergy * 0.5;
        const shape = this.getComponent(ShapeComponent);
        shape.color = `rgba(0, 255, 255, ${alpha})`;
    }
    
    onTriggerEnter(other) {
        if (other.gameObject.hasTag("Projectile")) {
            this.deflectProjectile(other.gameObject);
            this.energy -= 10;
            
            if (this.energy <= 0) {
                this.deactivate();
            }
        }
    }
    
    deflectProjectile(projectile) {
        // Calculate deflection angle
        const dx = projectile.x - this.x;
        const dy = projectile.y - this.y;
        const angle = Math.atan2(dy, dx);
        
        // Reverse projectile direction
        const rigidbody = projectile.getComponent(RigidbodyComponent);
        if (rigidbody) {
            const speed = Math.sqrt(rigidbody.velocity.x ** 2 + rigidbody.velocity.y ** 2);
            rigidbody.velocity.x = Math.cos(angle) * speed;
            rigidbody.velocity.y = Math.sin(angle) * speed;
        }
        
        console.log("Projectile deflected!");
    }
    
    deactivate() {
        console.log("Shield depleted!");
        Instantiate.destroy(this);
    }
}
```

### Circular Platform

```javascript
class CircularPlatform extends GameObject {
    constructor(x, y, radius) {
        super("CircularPlatform");
        
        this.x = x;
        this.y = y;
        
        // Solid collider
        const collider = new CircleColliderComponent(radius, false);
        this.addComponent(collider);
        
        // Visual
        const shape = new ShapeComponent("circle", {
            radius: radius,
            color: "brown"
        });
        this.addComponent(shape);
    }
    
    onCollisionStay(collision) {
        if (collision.gameObject.hasTag("Player")) {
            // Keep player on top of platform
            const player = collision.gameObject;
            const collider = this.getComponent(CircleColliderComponent);
            
            // Calculate if player is on top
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= collider.radius && player.y < this.y) {
                // Position player on surface
                const angle = Math.atan2(dy, dx);
                player.x = this.x + Math.cos(angle) * collider.radius;
                player.y = this.y + Math.sin(angle) * collider.radius;
            }
        }
    }
}
```

### Proximity Sensor

```javascript
class ProximitySensor extends GameObject {
    constructor(radius, callback) {
        super("ProximitySensor");
        
        this.callback = callback;
        
        // Large trigger zone
        const sensor = new CircleColliderComponent(radius, true);
        this.addComponent(sensor);
        
        // Debug visual (remove in production)
        const shape = new ShapeComponent("circle", {
            radius: radius,
            color: "rgba(0, 255, 0, 0.1)"
        });
        this.addComponent(shape);
        
        this.objectsInRange = new Map();
    }
    
    onTriggerEnter(other) {
        const distance = this.getDistanceTo(other.gameObject);
        this.objectsInRange.set(other.gameObject, distance);
        
        if (this.callback) {
            this.callback('enter', other.gameObject, distance);
        }
    }
    
    onTriggerExit(other) {
        this.objectsInRange.delete(other.gameObject);
        
        if (this.callback) {
            this.callback('exit', other.gameObject, 0);
        }
    }
    
    update() {
        // Update distances for objects in range
        for (const [obj, oldDistance] of this.objectsInRange) {
            const newDistance = this.getDistanceTo(obj);
            this.objectsInRange.set(obj, newDistance);
            
            if (this.callback) {
                this.callback('update', obj, newDistance);
            }
        }
    }
    
    getDistanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Usage
const sensor = new ProximitySensor(100, (event, object, distance) => {
    if (event === 'enter') {
        console.log(`${object.name} entered range`);
    } else if (event === 'exit') {
        console.log(`${object.name} left range`);
    } else if (event === 'update') {
        console.log(`${object.name} distance: ${distance.toFixed(1)}`);
    }
});
```

## Best Practices

1. **Choose appropriate radius** - Match visual size for consistency
2. **Use triggers for non-physical interactions** - Collectibles, sensors, zones
3. **Consider performance** - Circle collision is efficient but still has cost
4. **Handle edge cases** - Very small or very large radius values
5. **Combine with other components** - RigidbodyComponent for physics

## Common Patterns

### Variable Radius Collider

```javascript
class PulsatingCollider extends CircleColliderComponent {
    constructor(baseRadius) {
        super(baseRadius);
        this.baseRadius = baseRadius;
        this.time = 0;
        this.pulseSpeed = 2;
        this.pulseAmplitude = 10;
    }
    
    update() {
        this.time += Time.deltaTime();
        this.radius = this.baseRadius + Math.sin(this.time * this.pulseSpeed) * this.pulseAmplitude;
    }
}
```

### Collision Filtering

```javascript
class FilteredCircleCollider extends CircleColliderComponent {
    constructor(radius, trigger, filter) {
        super(radius, trigger);
        this.collisionFilter = filter || (() => true);
    }
    
    checkCollisionWith(other) {
        if (!this.collisionFilter(other.gameObject)) {
            return false;
        }
        
        return super.checkCollisionWith(other);
    }
}

// Usage - only collide with enemies
const playerCollider = new FilteredCircleCollider(16, false, (obj) => {
    return obj.hasTag("Enemy");
});
```

## Related Classes

- [BoxColliderComponent](BoxColliderComponent.md) - Box-shaped collision detection
- [RigidbodyComponent](RigidbodyComponent.md) - Physics movement
- [AbstractColliderComponent](AbstractColliderComponent.md) - Base collider class
- [GameObject](../core/GameObject.md) - Objects that use colliders
