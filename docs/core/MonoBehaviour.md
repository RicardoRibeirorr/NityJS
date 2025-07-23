# MonoBehaviour Class

> **Unity Equivalent:** `MonoBehaviour` - Exact same name and functionality as Unity!

The `MonoBehaviour` class is a Unity-style alias for the `Component` class. It provides **exactly the same functionality** as Component but with Unity's familiar naming for developers who prefer the original Unity API.

## Overview

```javascript
import { MonoBehaviour } from 'nity-engine';

// Use MonoBehaviour instead of Component - same functionality!
class PlayerController extends MonoBehaviour {
  start() {
    console.log("Using Unity-style MonoBehaviour!");
  }
  
  update() {
    // Exact same API as Component
  }
}
```

## Why MonoBehaviour?

Many Unity developers are more comfortable with the `MonoBehaviour` name since that's what they've used for years. NityJS provides this alias so you can write code that looks and feels exactly like Unity:

```javascript
// Unity C# style
public class PlayerController : MonoBehaviour
{
    void Start() { }
    void Update() { }
}

// NityJS JavaScript style  
class PlayerController extends MonoBehaviour {
    start() { }
    update() { }
}
```

## Identical Functionality

`MonoBehaviour` is **literally the same class** as `Component`. There is no difference in:

- **Performance** - Same speed and memory usage
- **Features** - All metadata, lifecycle, and API methods
- **Compatibility** - Works with all NityJS systems
- **Documentation** - Everything applies to both classes

## API Reference

**👉 For complete API documentation, see [Component](Component.md)**

All methods, properties, lifecycle events, and usage patterns documented in the Component class apply identically to MonoBehaviour:

- **Lifecycle Methods**: `start()`, `update()`, `lateUpdate()`, `onDestroy()`
- **Properties**: `gameObject`, `active`, `enabled`
- **Metadata System**: `createFromMetadata()`, `getDefaultMeta()`, `applyMeta()`
- **Unity Patterns**: All Unity-style workflows and examples

## Usage Examples

### Basic MonoBehaviour

```javascript
class EnemyAI extends MonoBehaviour {
    constructor() {
        super();
        this.speed = 100;
        this.detectionRange = 150;
    }
    
    start() {
        this.player = this.findGameObjectWithTag("Player");
        this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    }
    
    update() {
        if (this.playerInRange()) {
            this.chasePlayer();
        }
    }
    
    playerInRange() {
        const distance = Vector2.distance(
            this.gameObject.position, 
            this.player.position
        );
        return distance <= this.detectionRange;
    }
    
    chasePlayer() {
        const direction = Vector2.subtract(
            this.player.position, 
            this.gameObject.position
        ).normalized;
        
        this.rigidbody.velocity = direction.multiply(this.speed);
    }
}
```

### Metadata with MonoBehaviour

```javascript
class HealthSystem extends MonoBehaviour {
    static getDefaultMeta() {
        return {
            maxHealth: 100,
            currentHealth: 100,
            regenerationRate: 5
        };
    }
    
    applyMeta(metadata) {
        this.maxHealth = metadata.maxHealth;
        this.currentHealth = metadata.currentHealth;
        this.regenerationRate = metadata.regenerationRate;
    }
}

// Create with metadata (works identically to Component)
const health = Component.createFromMetadata(HealthSystem, {
    maxHealth: 150,
    currentHealth: 100
});
```

## Choosing Between Component and MonoBehaviour

Both are identical, so choose based on your preference:

### Use **Component** if:
- You prefer modern JavaScript naming conventions
- You're building web-first applications
- You want to emphasize the component-based architecture

### Use **MonoBehaviour** if:
- You're coming from Unity and want familiar naming
- You're porting Unity projects to JavaScript
- You prefer Unity's exact terminology and conventions

## Migration from Unity

If you're porting Unity scripts, simply:

1. **Change the language**: C# → JavaScript
2. **Keep the class name**: `MonoBehaviour` works exactly the same
3. **Update method syntax**: `void Start()` → `start()`
4. **Update variable declarations**: `public float speed` → `this.speed`

### Unity C# Example:
```csharp
public class Jump : MonoBehaviour 
{
    public float jumpForce = 400f;
    private Rigidbody2D rb;
    
    void Start() 
    {
        rb = GetComponent<Rigidbody2D>();
    }
    
    void Update() 
    {
        if (Input.GetKeyDown(KeyCode.Space)) 
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }
}
```

### NityJS JavaScript Equivalent:
```javascript
class Jump extends MonoBehaviour 
{
    constructor() {
        super();
        this.jumpForce = 400;
    }
    
    start() 
    {
        this.rb = this.gameObject.getComponent(RigidbodyComponent);
    }
    
    update() 
    {
        if (Input.isKeyPressed('Space')) 
        {
            this.rb.velocity = new Vector2(this.rb.velocity.x, this.jumpForce);
        }
    }
}
```

## Summary

`MonoBehaviour` is provided for Unity developers who want to maintain familiar naming conventions. It's **exactly the same** as the `Component` class with no functional differences.

**👉 For complete documentation, examples, and API reference, see [Component](Component.md)**
