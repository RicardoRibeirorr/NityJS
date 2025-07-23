# Math Documentation

Welcome to the **Math** documentation section! This is where you'll find all the mathematical utilities and classes that power NityJS games. From Unity-compatible vectors to random number generation, everything you need for game mathematics.

## 🎯 What You'll Find Here

The math system provides Unity-compatible mathematical classes and utilities designed specifically for game development. All classes follow Unity's API patterns while adding modern JavaScript enhancements.

## 📚 Math Utilities Documentation

### 🧮 Mathematical Classes
- **[Vector](Vector.md)** - Unity-compatible Vector2 and Vector3 classes with properties and static methods
- **[Random](Random.md)** - Advanced random number generation and utility functions

## 🚀 Quick Start Guide

Math in NityJS is designed to feel exactly like Unity:

```javascript
// Vector2 operations (Unity-style)
const position = new Vector2(10, 20);
const velocity = new Vector2(5, 0);

// Move object using vectors
position.add(velocity.multiply(Time.deltaTime));

// Distance calculation
const player = new Vector2(100, 50);
const enemy = new Vector2(120, 80);
const distance = Vector2.distance(player, enemy);

// Random values
const randomPosition = new Vector2(
    Random.range(-100, 100),
    Random.range(-100, 100)
);
```

## 🎮 Unity Equivalents

The math system provides exact Unity API compatibility:

| Unity Class/Method | NityJS Equivalent | Description |
|-------------------|-------------------|-------------|
| `Vector2` | `Vector2` | 2D vector with x, y components |
| `Vector3` | `Vector3` | 3D vector with x, y, z components |
| `Vector2.Distance()` | `Vector2.distance()` | Distance between two points |
| `Vector2.Lerp()` | `Vector2.lerp()` | Linear interpolation |
| `Vector2.zero` | `Vector2.zero` | Zero vector (0, 0) |
| `Vector2.one` | `Vector2.one` | One vector (1, 1) |
| `Random.Range()` | `Random.range()` | Random number in range |
| `Random.value` | `Random.value` | Random float 0-1 |

## 🔧 Math Features

### Vector Mathematics
- **Properties** - `magnitude`, `normalized`, `sqrMagnitude`
- **Static Methods** - `distance()`, `dot()`, `lerp()`, `angle()`
- **Instance Methods** - `add()`, `subtract()`, `multiply()`, `divide()`
- **Constants** - `zero`, `one`, `up`, `down`, `left`, `right`

### Transform Integration
- **GameObject Transform** - Position (Vector2), rotation (radians)
- **Parent-Child** - Automatic transform inheritance
- **Global/Local** - `getGlobalPosition()`, `getGlobalRotation()`
- **Unity Compatibility** - Same patterns as Unity's Transform component

### Random Utilities
- **Number Generation** - Integers, floats, ranges
- **Array Utilities** - Random choice, shuffle, weighted selection
- **Vector Generation** - Random points, directions, circles
- **Seeded Random** - Reproducible random sequences

## 💡 Common Math Patterns

### Movement and Physics
```javascript
class MovementController extends Component {
    start() {
        this.velocity = Vector2.zero;
        this.acceleration = new Vector2(0, 981); // Gravity
        this.speed = 200;
    }
    
    update() {
        // Input-based movement
        const input = Vector2.zero;
        if (Input.isKeyDown('w')) input.y -= 1;
        if (Input.isKeyDown('s')) input.y += 1;
        if (Input.isKeyDown('a')) input.x -= 1;
        if (Input.isKeyDown('d')) input.x += 1;
        
        // Normalize diagonal movement
        if (input.magnitude > 0) {
            input.normalize();
            this.velocity = input.multiply(this.speed);
        } else {
            this.velocity = Vector2.zero;
        }
        
        // Apply physics
        this.velocity.add(this.acceleration.multiply(Time.deltaTime));
        this.gameObject.position.add(this.velocity.multiply(Time.deltaTime));
    }
}
```

### AI and Pathfinding
```javascript
class EnemyAI extends Component {
    start() {
        this.target = null;
        this.speed = 100;
        this.detectionRange = 150;
    }
    
    update() {
        const player = this.findPlayer();
        if (!player) return;
        
        // Check if player is in range
        const distance = Vector2.distance(
            this.gameObject.position,
            player.position
        );
        
        if (distance <= this.detectionRange) {
            // Move towards player
            const direction = Vector2.subtract(
                player.position,
                this.gameObject.position
            ).normalized;
            
            const movement = direction.multiply(this.speed * Time.deltaTime);
            this.gameObject.position.add(movement);
            
            // Rotate to face player
            this.gameObject.rotation = Vector2.angle(Vector2.right, direction);
        }
    }
    
    findPlayer() {
        return Game.instance.scene.findGameObjectWithTag("Player");
    }
}
```

### Smooth Interpolation
```javascript
class SmoothFollow extends Component {
    constructor(target, smoothTime = 1.0) {
        super();
        this.target = target;
        this.smoothTime = smoothTime;
        this.velocity = Vector2.zero;
    }
    
    update() {
        if (!this.target) return;
        
        // Smooth follow using lerp
        const targetPosition = this.target.position;
        const currentPosition = this.gameObject.position;
        
        // Calculate smooth movement
        const difference = Vector2.subtract(targetPosition, currentPosition);
        const smoothed = Vector2.lerp(
            Vector2.zero,
            difference,
            Time.deltaTime / this.smoothTime
        );
        
        this.gameObject.position.add(smoothed);
    }
}

// Camera follow example
class CameraFollow extends Component {
    start() {
        this.player = Game.instance.scene.findGameObjectWithTag("Player");
        this.offset = new Vector2(0, -50); // Camera offset
        this.smoothTime = 0.3;
    }
    
    update() {
        if (!this.player) return;
        
        const targetPosition = Vector2.add(this.player.position, this.offset);
        
        this.gameObject.position = Vector2.lerp(
            this.gameObject.position,
            targetPosition,
            Time.deltaTime / this.smoothTime
        );
    }
}
```

### Random Generation
```javascript
class RandomSpawner extends Component {
    start() {
        this.spawnTimer = 0;
        this.spawnInterval = 2.0; // Spawn every 2 seconds
        this.spawnArea = new Vector2(400, 300);
    }
    
    update() {
        this.spawnTimer += Time.deltaTime;
        
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnRandomEnemy();
        }
    }
    
    spawnRandomEnemy() {
        const enemy = new GameObject("Enemy");
        
        // Random position within spawn area
        enemy.position = new Vector2(
            Random.range(-this.spawnArea.x / 2, this.spawnArea.x / 2),
            Random.range(-this.spawnArea.y / 2, this.spawnArea.y / 2)
        );
        
        // Random enemy type
        const enemyTypes = ["orc", "skeleton", "goblin"];
        const randomType = Random.choice(enemyTypes);
        
        // Random color tint
        const randomColor = Random.colorHex();
        
        enemy.addComponent(new SpriteRendererComponent(`enemies:${randomType}`, {
            color: randomColor
        }));
        
        // Random movement direction
        const randomDirection = Random.insideUnitCircle().normalized;
        const randomSpeed = Random.range(50, 150);
        
        enemy.addComponent(new class extends Component {
            start() {
                this.velocity = randomDirection.multiply(randomSpeed);
            }
            
            update() {
                this.gameObject.position.add(
                    this.velocity.multiply(Time.deltaTime)
                );
            }
        });
        
        Instantiate.create(enemy);
    }
}
```

## 🎯 Advanced Math Concepts

### Trigonometry for Game Development
```javascript
class OrbitingObject extends Component {
    constructor(center, radius, speed) {
        super();
        this.center = center;
        this.radius = radius;
        this.speed = speed; // Radians per second
        this.angle = 0;
    }
    
    update() {
        this.angle += this.speed * Time.deltaTime;
        
        // Calculate orbital position
        this.gameObject.position = new Vector2(
            this.center.x + Math.cos(this.angle) * this.radius,
            this.center.y + Math.sin(this.angle) * this.radius
        );
        
        // Face movement direction
        const tangent = new Vector2(-Math.sin(this.angle), Math.cos(this.angle));
        this.gameObject.rotation = Vector2.angle(Vector2.right, tangent);
    }
}
```

### Physics Calculations
```javascript
class ProjectileMotion extends Component {
    constructor(target, launchAngle = Math.PI / 4) {
        super();
        this.target = target;
        this.launchAngle = launchAngle;
        this.gravity = 981; // pixels/second²
    }
    
    start() {
        const launchVelocity = this.calculateLaunchVelocity();
        this.velocity = launchVelocity;
    }
    
    calculateLaunchVelocity() {
        const distance = Vector2.distance(this.gameObject.position, this.target);
        const height = this.target.y - this.gameObject.position.y;
        
        // Physics calculation for projectile motion
        const speed = Math.sqrt(
            (this.gravity * distance * distance) / 
            (2 * Math.cos(this.launchAngle) * Math.cos(this.launchAngle) * 
             (distance * Math.tan(this.launchAngle) - height))
        );
        
        return new Vector2(
            speed * Math.cos(this.launchAngle),
            speed * Math.sin(this.launchAngle)
        );
    }
    
    update() {
        // Apply gravity
        this.velocity.y += this.gravity * Time.deltaTime;
        
        // Update position
        this.gameObject.position.add(this.velocity.multiply(Time.deltaTime));
    }
}
```

## 🚀 Performance Tips

1. **Vector Operations** - Use static methods when possible to avoid object creation
2. **Magnitude Comparisons** - Use `sqrMagnitude` instead of `magnitude` when comparing distances
3. **Constant Vectors** - Reuse `Vector2.zero`, `Vector2.one` instead of creating new instances
4. **Random Seeding** - Use seeded random for reproducible results in testing

## 🎯 Learning Path

1. **[Start with Vector](Vector.md)** - Master Unity-compatible vector mathematics
2. **[Learn Random](Random.md)** - Add randomness and procedural generation
3. **Practice Integration** - Combine math with physics and movement
4. **Advanced Concepts** - Explore trigonometry and complex calculations

## 🚀 Next Steps

- **[Vector Documentation](Vector.md)** - Complete Vector2 and Vector3 reference
- **[Random Documentation](Random.md)** - Random number generation and utilities
- **[Physics Components](../physics/)** - Apply math to realistic movement and collision
- **[Core Components](../core/)** - Integrate math with GameObject transforms

---

**Master game mathematics with Unity-compatible classes that make complex calculations simple and intuitive!**
