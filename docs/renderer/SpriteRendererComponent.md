# SpriteRendererComponent

> **Unity Equivalent:** `SpriteRenderer` - Renders sprites with scaling, tinting, and flipping options

The `SpriteRendererComponent` is the primary component for displaying sprites in NityJS. It supports the unified sprite system, allowing you to render both single sprites and spritesheet frames with comprehensive visual options.

## Constructor

```javascript
new SpriteRendererComponent(spriteKey, options = {})
```

**Parameters:**
- `spriteKey` (string) - Unified sprite key ("spriteName" or "spritesheet:spriteName")
- `options` (Object, optional) - Rendering options:
  - `width` (number) - Custom width for scaling
  - `height` (number) - Custom height for scaling
  - `opacity` (number) - Sprite opacity/alpha (0.0 to 1.0, default: 1.0)
  - `color` (string) - Tint color in hex format (e.g., "#FF0000") or rgba format (e.g., "rgba(255, 0, 0, 0.5)", default: "#FFFFFF")
  - `flipX` (boolean) - Flip sprite horizontally (default: false)
  - `flipY` (boolean) - Flip sprite vertically (default: false)

## Examples

### Basic Usage

```javascript
// Natural size
gameObject.addComponent(new SpriteRendererComponent("player"));

// Custom scaling
gameObject.addComponent(new SpriteRendererComponent("player", { 
    width: 64, 
    height: 64 
}));

// Spritesheet sprite
gameObject.addComponent(new SpriteRendererComponent("enemies:orc"));
```

### Advanced Options

```javascript
// With opacity and color tinting
gameObject.addComponent(new SpriteRendererComponent("player", {
    width: 64,
    height: 64,
    opacity: 0.8,
    color: "rgba(255, 68, 68, 0.7)" // Semi-transparent red tint
}));

// With flipping
gameObject.addComponent(new SpriteRendererComponent("player", {
    flipX: true,  // Flip horizontally
    flipY: false  // No vertical flip
}));

// Complete example with all options
gameObject.addComponent(new SpriteRendererComponent("tiles:tile1", { 
    width: 128, 
    height: 128,
    opacity: 0.9,
    color: "#FF6644", // Orange tint
    flipX: false,
    flipY: false 
}));
```

## Methods

### Lifecycle Methods

#### `preload()`
Preloads the sprite from the unified SpriteRegistry (called automatically).

### Configuration Methods

#### `setOptions(newOptions)`
Updates rendering options at runtime.
- `newOptions` (Object) - New options to merge with existing ones

```javascript
const renderer = gameObject.getComponent(SpriteRendererComponent);
renderer.setOptions({
    opacity: 0.5,
    color: "#00FF00"
});
```

#### `setScale(width, height)`
Convenience method to set width/height.
- `width` (number) - New width
- `height` (number) - New height

```javascript
renderer.setScale(128, 128);
```

### Property Accessors

#### Size Methods
- `getRenderedWidth()` - Returns the actual rendered width (custom or natural)
- `getRenderedHeight()` - Returns the actual rendered height (custom or natural)

#### Opacity Methods
- `getOpacity()` - Get current opacity value
- `setOpacity(opacity)` - Set sprite opacity (0.0 to 1.0)

```javascript
console.log(renderer.getOpacity()); // 1.0
renderer.setOpacity(0.5); // 50% transparent
```

#### Color Methods
- `getColor()` - Get current tint color
- `setColor(color)` - Set sprite tint color

```javascript
renderer.setColor("#FF0000"); // Red tint
renderer.setColor("rgba(0, 255, 0, 0.7)"); // Semi-transparent green
```

#### Flip Methods
- `getFlipX()` / `setFlipX(flipX)` - Horizontal flip state
- `getFlipY()` / `setFlipY(flipY)` - Vertical flip state

```javascript
renderer.setFlipX(true);  // Flip horizontally
renderer.setFlipY(false); // No vertical flip
```

#### Sprite Methods
- `setSprite(newSpriteKey)` - Change the sprite being rendered

```javascript
renderer.setSprite("player_running");
renderer.setSprite("enemies:skeleton"); // Switch to spritesheet sprite
```

## Unity Compatibility

### Familiar Patterns

```javascript
// Unity C# style (conceptual)
// spriteRenderer.sprite = newSprite;
// spriteRenderer.color = Color.red;
// spriteRenderer.flipX = true;

// NityJS equivalent
renderer.setSprite("newSprite");
renderer.setColor("#FF0000");
renderer.setFlipX(true);
```

### Common Unity Properties

| Unity Property | NityJS Equivalent |
|---------------|-------------------|
| `sprite` | `setSprite(key)` |
| `color` | `setColor(color)` |
| `flipX` | `setFlipX(bool)` |
| `flipY` | `setFlipY(bool)` |
| Custom scaling | `setScale(w, h)` |

## Practical Examples

### Character Animation System

```javascript
class CharacterAnimator extends Component {
    start() {
        this.renderer = this.gameObject.getComponent(SpriteRendererComponent);
        this.facingRight = true;
    }
    
    update() {
        // Handle movement and sprite flipping
        const moveX = Input.isKeyDown('d') ? 1 : Input.isKeyDown('a') ? -1 : 0;
        
        if (moveX > 0 && !this.facingRight) {
            this.facingRight = true;
            this.renderer.setFlipX(false);
        } else if (moveX < 0 && this.facingRight) {
            this.facingRight = false;
            this.renderer.setFlipX(true);
        }
        
        // Change sprite based on movement
        if (moveX !== 0) {
            this.renderer.setSprite("player_running");
        } else {
            this.renderer.setSprite("player_idle");
        }
    }
}
```

### Health Indicator

```javascript
class HealthIndicator extends Component {
    start() {
        this.renderer = this.gameObject.getComponent(SpriteRendererComponent);
        this.maxHealth = 100;
        this.currentHealth = 100;
    }
    
    takeDamage(amount) {
        this.currentHealth -= amount;
        this.updateHealthColor();
    }
    
    updateHealthColor() {
        const healthPercent = this.currentHealth / this.maxHealth;
        
        if (healthPercent > 0.6) {
            this.renderer.setColor("#00FF00"); // Green - healthy
        } else if (healthPercent > 0.3) {
            this.renderer.setColor("#FFFF00"); // Yellow - injured
        } else {
            this.renderer.setColor("#FF0000"); // Red - critical
        }
        
        // Fade when near death
        this.renderer.setOpacity(Math.max(0.3, healthPercent));
    }
}
```

### Powerup Effect

```javascript
class PowerupEffect extends Component {
    start() {
        this.renderer = this.gameObject.getComponent(SpriteRendererComponent);
        this.timer = 0;
        this.duration = 5.0; // 5 seconds
    }
    
    update() {
        this.timer += Time.deltaTime;
        
        // Pulsing effect
        const pulse = Math.sin(this.timer * 10) * 0.3 + 0.7;
        this.renderer.setOpacity(pulse);
        
        // Color cycling
        const colorPhase = this.timer * 2;
        const r = Math.sin(colorPhase) * 128 + 127;
        const g = Math.sin(colorPhase + 2) * 128 + 127;
        const b = Math.sin(colorPhase + 4) * 128 + 127;
        this.renderer.setColor(`rgb(${r}, ${g}, ${b})`);
        
        // Remove effect after duration
        if (this.timer >= this.duration) {
            this.gameObject.removeComponent(PowerupEffect);
            this.renderer.setOpacity(1.0);
            this.renderer.setColor("#FFFFFF");
        }
    }
}
```

## Performance Tips

1. **Sprite Caching** - Sprites are automatically cached by the SpriteRegistry
2. **Batch Operations** - Set multiple properties using `setOptions()` instead of individual calls
3. **Avoid Frequent Changes** - Minimize runtime sprite/color changes for better performance
4. **Use Spritesheets** - Single spritesheet files are more efficient than many individual sprites

## Troubleshooting

### Common Issues

- **Sprite not displaying**: Ensure the sprite key exists in SpriteRegistry
- **Wrong size**: Check if width/height options are set correctly
- **Blurry sprites**: Ensure sprite dimensions match rendered dimensions for pixel-perfect display
- **Color not applying**: Verify color format (hex or rgba string)

### Debug Tips

```javascript
// Check if sprite is loaded
const renderer = gameObject.getComponent(SpriteRendererComponent);
console.log("Sprite key:", renderer.spriteKey);
console.log("Rendered size:", renderer.getRenderedWidth(), "x", renderer.getRenderedHeight());
console.log("Opacity:", renderer.getOpacity());
console.log("Color:", renderer.getColor());
```

The SpriteRendererComponent provides a powerful and flexible way to display sprites with Unity-familiar patterns and modern web-optimized features.
