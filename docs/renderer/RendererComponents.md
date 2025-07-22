# Renderer Components

The renderer components in NityJS handle the visual display of GameObjects with Unity-style rendering patterns. They provide different ways to render graphics, from simple shapes to complex sprites and images, with built-in gizmos for debugging.

## Overview

- **SpriteRendererComponent**: Renders sprites with options object for scaling and effects
- **ImageComponent**: Renders individual image files with width/height parameters  
- **ShapeComponent**: Renders geometric shapes (rectangle, circle, triangle, polygon)
- **Gizmos System**: All renderer components include debug visualization

## SpriteRendererComponent Class

### Constructor

```javascript
new SpriteRendererComponent(spriteKey, options = {})
```

**Parameters:**
- `spriteKey` (string) - Unified sprite key ("spriteName" or "spritesheet:spriteName")
- `options` (Object, optional) - Rendering options:
  - `width` (number) - Custom width for scaling
  - `height` (number) - Custom height for scaling
  - `flipX` (boolean) - Flip horizontally (future feature)
  - `flipY` (boolean) - Flip vertically (future feature)
  - `opacity` (number) - Transparency 0-1 (future feature)

### Examples

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

### Methods

#### preload()
Preloads the sprite from the unified SpriteRegistry (called automatically).

#### setOptions(newOptions)
Updates rendering options at runtime.
- `newOptions` (Object) - New options to merge with existing ones

#### setScale(width, height)
Convenience method to set width/height.
- `width` (number) - New width
- `height` (number) - New height

#### getRenderedWidth() / getRenderedHeight()
Returns the actual rendered dimensions (custom or natural).

## ImageComponent Class

### Constructor

```javascript
new ImageComponent(src, width, height)
```

**Parameters:**
- `src` (string) - Path to the image file
- `width` (number, optional) - Display width (defaults to image width)
- `height` (number, optional) - Display height (defaults to image height)

### Methods

#### async preload()
Loads the image file (called automatically).

#### draw(ctx)
Draws the image on the canvas with rotation support.

## ShapeComponent Class

### Constructor

```javascript
new ShapeComponent(shape, options)
```

**Parameters:**
- `shape` (string) - Shape type: "rectangle", "circle", "ellipse", "line", "triangle", "polygon"
- `options` (object) - Shape-specific options

### Shape Options

#### Rectangle/Square
- `width` (number) - Width in pixels
- `height` (number) - Height in pixels
- `color` (string) - Fill color

#### Circle
- `radius` (number) - Radius in pixels
- `color` (string) - Fill color

#### Ellipse
- `radiusX` (number) - X-axis radius
- `radiusY` (number) - Y-axis radius
- `color` (string) - Fill color

#### Line
- `x2` (number) - End X coordinate
- `y2` (number) - End Y coordinate
- `color` (string) - Line color
- `width` (number) - Line width

#### Triangle
- `size` (number) - Triangle size
- `color` (string) - Fill color

#### Polygon
- `points` (Array) - Array of [x, y] coordinate pairs
- `color` (string) - Fill color

## Usage Examples

### Basic Sprite Rendering

```javascript
import { SpriteRendererComponent } from './src/renderer/components/SpriteRendererComponent.js';
import { Spritesheet } from './src/renderer/Spritesheet.js';

// Create spritesheet
const playerSheet = new Spritesheet("player", "assets/player.png", 32, 32, 4, 2);

// Create player with sprite
class Player extends GameObject {
    constructor() {
        super("Player");
        
        // Add sprite renderer
        const renderer = new SpriteRendererComponent("player", "sprite_0_0");
        this.addComponent(renderer);
    }
}
```

### Image Rendering

```javascript
import { ImageComponent } from './src/renderer/components/ImageComponent.js';

class Background extends GameObject {
    constructor() {
        super("Background");
        
        // Render full-size background image
        const bgImage = new ImageComponent("assets/background.png");
        this.addComponent(bgImage);
    }
}

class ScaledImage extends GameObject {
    constructor() {
        super("ScaledImage");
        
        // Render image with specific dimensions
        const image = new ImageComponent("assets/icon.png", 64, 64);
        this.addComponent(image);
    }
}
```

### Shape Rendering

```javascript
import { ShapeComponent } from './src/renderer/components/ShapeComponent.js';

// Rectangle
class Platform extends GameObject {
    constructor() {
        super("Platform");
        
        const shape = new ShapeComponent("rectangle", {
            width: 200,
            height: 20,
            color: "brown"
        });
        this.addComponent(shape);
    }
}

// Circle
class Ball extends GameObject {
    constructor() {
        super("Ball");
        
        const shape = new ShapeComponent("circle", {
            radius: 15,
            color: "red"
        });
        this.addComponent(shape);
    }
}

// Custom polygon
class Arrow extends GameObject {
    constructor() {
        super("Arrow");
        
        const shape = new ShapeComponent("polygon", {
            points: [
                [0, -10],   // Top point
                [20, 0],    // Right point
                [0, 10],    // Bottom point
                [-10, 0]    // Left point
            ],
            color: "yellow"
        });
        this.addComponent(shape);
    }
}
```

### Dynamic Shape Properties

```javascript
class AnimatedShape extends GameObject {
    constructor() {
        super("AnimatedShape");
        
        this.shape = new ShapeComponent("circle", {
            radius: 10,
            color: "blue"
        });
        this.addComponent(this.shape);
        
        this.time = 0;
    }
    
    update() {
        this.time += Time.deltaTime();
        
        // Pulsating circle
        this.shape.radius = 10 + Math.sin(this.time * 3) * 5;
        
        // Color cycling
        const hue = (this.time * 50) % 360;
        this.shape.color = `hsl(${hue}, 100%, 50%)`;
    }
}
```

### UI Elements with Shapes

```javascript
class Button extends GameObject {
    constructor(text, width = 120, height = 40) {
        super("Button");
        
        // Button background
        this.background = new ShapeComponent("rectangle", {
            width: width,
            height: height,
            color: "#4CAF50"
        });
        this.addComponent(this.background);
        
        this.isHovered = false;
        this.isPressed = false;
    }
    
    update() {
        const mousePos = Input.getMousePosition();
        const bounds = this.getBounds();
        
        // Check hover
        this.isHovered = mousePos.x >= bounds.x && 
                        mousePos.x <= bounds.x + bounds.width &&
                        mousePos.y >= bounds.y && 
                        mousePos.y <= bounds.y + bounds.height;
        
        // Update appearance
        if (this.isPressed) {
            this.background.color = "#2E7D32";
        } else if (this.isHovered) {
            this.background.color = "#66BB6A";
        } else {
            this.background.color = "#4CAF50";
        }
        
        // Check click
        if (this.isHovered && Input.isLeftMousePressed()) {
            this.onClick();
        }
    }
    
    onClick() {
        console.log("Button clicked!");
    }
    
    getBounds() {
        return {
            x: this.getGlobalX(),
            y: this.getGlobalY(),
            width: this.background.width,
            height: this.background.height
        };
    }
}
```

### Health Bar with Shapes

```javascript
class HealthBar extends GameObject {
    constructor(maxHealth = 100) {
        super("HealthBar");
        
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        
        // Background bar
        this.background = new ShapeComponent("rectangle", {
            width: 100,
            height: 10,
            color: "darkred"
        });
        this.addComponent(this.background);
        
        // Health bar
        this.healthBar = new ShapeComponent("rectangle", {
            width: 100,
            height: 10,
            color: "green"
        });
        this.addComponent(this.healthBar);
    }
    
    setHealth(health) {
        this.currentHealth = Math.max(0, Math.min(health, this.maxHealth));
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        const healthPercentage = this.currentHealth / this.maxHealth;
        this.healthBar.width = 100 * healthPercentage;
        
        // Color based on health percentage
        if (healthPercentage > 0.6) {
            this.healthBar.color = "green";
        } else if (healthPercentage > 0.3) {
            this.healthBar.color = "yellow";
        } else {
            this.healthBar.color = "red";
        }
    }
}
```

### Particle System with Shapes

```javascript
class ParticleSystem extends GameObject {
    constructor() {
        super("ParticleSystem");
        
        this.particles = [];
        this.maxParticles = 50;
    }
    
    start() {
        // Create particle pool
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = new GameObject(`Particle_${i}`);
            particle.addComponent(new ShapeComponent("circle", {
                radius: 2,
                color: "white"
            }));
            
            // Add to scene but make inactive
            particle.active = false;
            Instantiate.create(particle);
            this.particles.push(particle);
        }
    }
    
    emit(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = this.getInactiveParticle();
            if (particle) {
                this.initializeParticle(particle, x, y);
            }
        }
    }
    
    getInactiveParticle() {
        return this.particles.find(p => !p.active);
    }
    
    initializeParticle(particle, x, y) {
        particle.x = x;
        particle.y = y;
        particle.active = true;
        
        // Random velocity and properties
        particle.velocityX = Random.range(-50, 50);
        particle.velocityY = Random.range(-100, -20);
        particle.life = Random.range(1, 3);
        particle.age = 0;
        
        // Random color
        const colors = ["red", "orange", "yellow", "white"];
        const shape = particle.getComponent(ShapeComponent);
        shape.color = colors[Random.range(0, colors.length - 1)];
        shape.radius = Random.range(1, 4);
    }
    
    update() {
        for (const particle of this.particles) {
            if (particle.active) {
                this.updateParticle(particle);
            }
        }
    }
    
    updateParticle(particle) {
        particle.age += Time.deltaTime();
        
        if (particle.age >= particle.life) {
            particle.active = false;
            return;
        }
        
        // Update position
        particle.x += particle.velocityX * Time.deltaTime();
        particle.y += particle.velocityY * Time.deltaTime();
        
        // Apply gravity
        particle.velocityY += 200 * Time.deltaTime();
        
        // Fade out
        const alpha = 1 - (particle.age / particle.life);
        const shape = particle.getComponent(ShapeComponent);
        shape.color = `rgba(255, 255, 255, ${alpha})`;
    }
}
```

## Best Practices

1. **Choose the right component** - Use sprites for detailed graphics, shapes for simple geometry
2. **Optimize image loading** - Preload images and use spritesheets for multiple sprites
3. **Consider performance** - Shapes are faster to render than images for simple graphics
4. **Use consistent dimensions** - Keep sprite sizes consistent for easier layout
5. **Cache rendered content** - For complex shapes, consider rendering to an off-screen canvas

## Common Patterns

### Layered Rendering

```javascript
class LayeredSprite extends GameObject {
    constructor() {
        super("LayeredSprite");
        
        // Base layer
        this.base = new SpriteRendererComponent("character", "sprite_0_0");
        this.addComponent(this.base);
        
        // Equipment layer
        this.equipment = new SpriteRendererComponent("equipment", "sword_0_0");
        this.addComponent(this.equipment);
        
        // Effect layer
        this.effect = new ShapeComponent("circle", {
            radius: 20,
            color: "rgba(255, 255, 0, 0.3)"
        });
        this.addComponent(this.effect);
    }
}
```

### Dynamic Sprite Switching

```javascript
class MultiStateSprite extends GameObject {
    constructor() {
        super("MultiStateSprite");
        
        this.renderer = new SpriteRendererComponent("character", "sprite_0_0");
        this.addComponent(this.renderer);
        
        this.state = "normal";
    }
    
    setState(newState) {
        this.state = newState;
        
        const spriteMap = {
            "normal": "sprite_0_0",
            "damaged": "sprite_1_0",
            "powered": "sprite_2_0"
        };
        
        const spriteName = spriteMap[newState];
        if (spriteName) {
            const sheet = Game.instance.spriteRegistry.getSheet("character");
            this.renderer.sprite = sheet.getSprite(spriteName);
        }
    }
}
```

## Related Classes

- [Sprite and Spritesheet](Sprite.md) - Core sprite management classes
- [Component](../core/Component.md) - Base class for all renderer components
- [GameObject](../core/GameObject.md) - Objects that use renderer components
- [SpriteAnimationComponent](../animations/SpriteAnimation.md) - For animated sprites
