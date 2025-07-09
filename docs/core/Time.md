# Time Class

The `Time` class provides static methods for accessing time-related information in your NityJS game. It acts as a convenient interface to retrieve timing data from the Game instance.

## Overview

Time management is crucial for creating smooth, frame-rate independent gameplay. The Time class gives you access to delta time and other timing information needed for consistent animations and movement.

## Properties

### static deltaTime()

Returns the time elapsed since the last frame in seconds.

**Returns:** `number` - The delta time in seconds

## Usage Examples

### Basic Movement

```javascript
import { Time } from './src/core/Time.js';

class PlayerController extends Component {
    constructor() {
        super();
        this.speed = 100; // pixels per second
    }
    
    update() {
        // Frame-rate independent movement
        if (Input.isKeyDown('ArrowRight')) {
            this.gameObject.x += this.speed * Time.deltaTime();
        }
        if (Input.isKeyDown('ArrowLeft')) {
            this.gameObject.x -= this.speed * Time.deltaTime();
        }
    }
}
```

### Animation Timing

```javascript
class RotatingObject extends Component {
    constructor() {
        super();
        this.rotationSpeed = 90; // degrees per second
        this.currentRotation = 0;
    }
    
    update() {
        // Smooth rotation
        this.currentRotation += this.rotationSpeed * Time.deltaTime();
        // Apply rotation to renderer or transform
    }
}
```

### Countdown Timer

```javascript
class CountdownTimer extends Component {
    constructor(duration) {
        super();
        this.duration = duration;
        this.timeRemaining = duration;
    }
    
    update() {
        this.timeRemaining -= Time.deltaTime();
        
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.onTimerExpired();
        }
    }
    
    onTimerExpired() {
        console.log("Timer expired!");
    }
}
```

## Best Practices

1. **Always use Time.deltaTime() for movement and animations** to ensure consistent behavior across different frame rates
2. **Multiply speeds by deltaTime** - define speeds in units per second, then multiply by deltaTime
3. **Use deltaTime for any time-based calculations** like timers, cooldowns, and lerping

## Common Patterns

### Smooth Interpolation

```javascript
// Smoothly move towards a target position
const lerpSpeed = 2.0;
const targetX = 100;
this.gameObject.x = this.gameObject.x + (targetX - this.gameObject.x) * lerpSpeed * Time.deltaTime();
```

### Oscillating Movement

```javascript
class OscillatingObject extends Component {
    constructor() {
        super();
        this.amplitude = 50;
        this.frequency = 1; // cycles per second
        this.time = 0;
        this.startX = 0;
    }
    
    start() {
        this.startX = this.gameObject.x;
    }
    
    update() {
        this.time += Time.deltaTime();
        this.gameObject.x = this.startX + Math.sin(this.time * this.frequency * 2 * Math.PI) * this.amplitude;
    }
}
```

## Related Classes

- [Game](Game.md) - Contains the actual deltaTime implementation
- [Component](Component.md) - Base class where Time is commonly used
- [Input](../input/Input.md) - Often used together with Time for movement
