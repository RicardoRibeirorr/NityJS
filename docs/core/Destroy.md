# Destroy System

> **Unity Equivalent:** `Destroy()`, `DestroyImmediate()`, and component removal functions

The Destroy system provides Unity-style GameObject destruction with the exact same API patterns that Unity developers are familiar with. All destruction is deferred until the end of the frame, matching Unity's behavior precisely.

## Core Functions

### `Destroy(gameObject)`

Destroys a GameObject at the end of the current frame.

**Parameters:**
- `gameObject` (GameObject) - The GameObject to destroy

**Example:**
```javascript
import { Destroy } from 'nity-engine';

const enemy = new GameObject("Enemy");
// ... add components, position, etc.

// Destroy the GameObject (Unity-style!)
Destroy(enemy);

// GameObject is still accessible this frame
console.log(enemy.name); // "Enemy"

// Will be removed at end of frame
```

### `DestroyComponent(gameObject, ComponentClass)`

Removes a specific component from a GameObject.

**Parameters:**
- `gameObject` (GameObject) - The GameObject to remove component from
- `ComponentClass` (Class) - The component class to remove

**Example:**
```javascript
import { DestroyComponent, RigidbodyComponent } from 'nity-engine';

const player = new GameObject("Player");
player.addComponent(new RigidbodyComponent());
player.addComponent(new SpriteRendererComponent("player"));

// Remove only the physics component
DestroyComponent(player, RigidbodyComponent);

// Player still exists but no longer has physics
console.log(player.getComponent(RigidbodyComponent)); // null
console.log(player.getComponent(SpriteRendererComponent)); // still exists
```

### `DestroyAll()`

Destroys all GameObjects in the current scene.

**Example:**
```javascript
import { DestroyAll } from 'nity-engine';

// Clear the entire scene
DestroyAll();

// All GameObjects will be removed at end of frame
```

### `getPendingDestructionCount()`

Returns the number of objects pending destruction (useful for debugging).

**Returns:**
- `number` - Count of objects waiting to be destroyed

**Example:**
```javascript
import { getPendingDestructionCount, Destroy } from 'nity-engine';

Destroy(enemy1);
Destroy(enemy2);

console.log(getPendingDestructionCount()); // 2

// After frame ends, count will be 0
```

## Unity Compatibility

### Exact API Match

The Destroy system uses **function-based calls** exactly like Unity:

```javascript
// ✅ Unity-style (NityJS)
Destroy(gameObject);

// ❌ NOT like this (other engines)
gameObject.destroy();
```

### Deferred Destruction

Just like Unity, destruction happens at the **end of the frame**:

```javascript
const obj = new GameObject("Test");
Destroy(obj);

// Object is still accessible this frame
console.log(obj.name); // "Test"
obj.position.set(100, 100); // Still works

// Will be removed when frame ends
```

### Component Lifecycle

Components receive proper destruction callbacks:

```javascript
class MyComponent extends Component {
    onDestroy() {
        console.log("Component being destroyed!");
        // Cleanup code here
    }
}

const obj = new GameObject();
obj.addComponent(new MyComponent());

Destroy(obj); // Will call onDestroy() on all components
```

## Advanced Usage

### Conditional Destruction

```javascript
// Destroy enemies with low health
scene.gameObjects
    .filter(obj => obj.hasComponent(EnemyComponent))
    .forEach(enemy => {
        const health = enemy.getComponent(HealthComponent);
        if (health.current <= 0) {
            Destroy(enemy);
        }
    });
```

### Timed Destruction

```javascript
// Auto-destroy after 5 seconds
setTimeout(() => {
    Destroy(projectile);
}, 5000);

// Or using component
class TimedDestroy extends Component {
    constructor(lifetime = 5.0) {
        super();
        this.lifetime = lifetime;
        this.timer = 0;
    }
    
    update() {
        this.timer += Time.deltaTime;
        if (this.timer >= this.lifetime) {
            Destroy(this.gameObject);
        }
    }
}
```

### Cleanup Before Destruction

```javascript
class CleanupComponent extends Component {
    onDestroy() {
        // Save player data
        this.savePlayerData();
        
        // Release resources
        this.releaseAudioClips();
        
        // Notify other systems
        GameEvents.emit('playerDestroyed', this.gameObject);
    }
}
```

## Performance Notes

- **Batch Operations**: Multiple `Destroy()` calls in one frame are processed efficiently
- **Memory Management**: Destroyed objects are properly cleaned up and garbage collected
- **No Immediate Effect**: Objects remain functional until end of frame (Unity behavior)
- **Safe Calls**: Safe to call `Destroy()` multiple times on same object

## Common Patterns

### Enemy Death System

```javascript
class EnemyHealth extends Component {
    constructor(maxHealth = 100) {
        super();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }
    
    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }
    
    die() {
        // Play death animation, drop loot, etc.
        this.playDeathEffect();
        
        // Destroy after effect
        setTimeout(() => {
            Destroy(this.gameObject);
        }, 1000);
    }
}
```

### Projectile Cleanup

```javascript
class Bullet extends Component {
    update() {
        // Move forward
        this.gameObject.position.add(
            this.direction.multiply(this.speed * Time.deltaTime)
        );
        
        // Destroy if off-screen
        if (this.isOffScreen()) {
            Destroy(this.gameObject);
        }
    }
    
    onCollisionEnter(collision) {
        if (collision.gameObject.hasTag("Enemy")) {
            // Deal damage
            const enemy = collision.gameObject.getComponent(EnemyHealth);
            enemy.takeDamage(this.damage);
            
            // Destroy bullet
            Destroy(this.gameObject);
        }
    }
}
```

### Scene Transitions

```javascript
class SceneManager {
    static changeScene(newSceneName) {
        // Clear current scene
        DestroyAll();
        
        // Load new scene
        this.loadScene(newSceneName);
    }
    
    static resetScene() {
        // Destroy all except persistent objects
        scene.gameObjects
            .filter(obj => !obj.hasTag("Persistent"))
            .forEach(obj => Destroy(obj));
    }
}
```

## Integration with Game Loop

The Destroy system is automatically integrated with the game loop:

1. **During Frame**: `Destroy()` calls are queued
2. **End of Frame**: All queued destructions are processed
3. **Component Cleanup**: `onDestroy()` called on all components
4. **Scene Removal**: Objects removed from scene
5. **Memory Cleanup**: References cleared for garbage collection

This ensures that destruction behavior matches Unity exactly, providing a seamless transition for Unity developers.
