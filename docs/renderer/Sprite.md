# Sprite and Spritesheet Classes

The `Sprite` and `Spritesheet` classes work together to manage and render sprite-based graphics in NityJS.

## Overview

- **Sprite**: Represents a single sprite or image region within a larger image
- **Spritesheet**: Manages a collection of sprites loaded from a single image file

These classes provide an efficient way to handle sprite-based graphics, reducing the number of image files and improving performance.

## Sprite Class

### Constructor

```javascript
new Sprite(image, x, y, width, height)
```

**Parameters:**
- `image` (HTMLImageElement) - The source image element
- `x` (number) - X coordinate of the sprite region in the source image
- `y` (number) - Y coordinate of the sprite region in the source image
- `width` (number) - Width of the sprite region
- `height` (number) - Height of the sprite region

## Spritesheet Class

### Constructor

```javascript
new Spritesheet(name, src, frameWidth, frameHeight, cols, rows)
```

**Parameters:**
- `name` (string) - Unique identifier for the spritesheet
- `src` (string) - Path to the image file
- `frameWidth` (number, optional) - Width of each frame in pixels
- `frameHeight` (number, optional) - Height of each frame in pixels
- `cols` (number, default: 1) - Number of columns in the spritesheet
- `rows` (number, default: 1) - Number of rows in the spritesheet

### Methods

#### async load()
Loads the spritesheet image and creates individual sprites.

#### getSprite(name)
Retrieves a specific sprite by name.

**Parameters:**
- `name` (string) - The sprite name (format: "sprite_x_y")

**Returns:** `Sprite` - The requested sprite

## Usage Examples

### Basic Spritesheet Setup

```javascript
import { Spritesheet } from './src/renderer/Spritesheet.js';

// Create a spritesheet for a character with 4 frames per row, 2 rows
const playerSheet = new Spritesheet(
    "player", 
    "assets/player_spritesheet.png", 
    32, 32, // 32x32 pixel frames
    4, 2    // 4 columns, 2 rows
);

// The spritesheet automatically loads during game preload
```

### Using Sprites in Components

```javascript
import { SpriteRendererComponent } from './src/renderer/components/SpriteRendererComponent.js';

class Player extends GameObject {
    constructor() {
        super("Player");
        
        // Add sprite renderer component
        this.addComponent(new SpriteRendererComponent("player", "sprite_0_0"));
    }
}
```

### Animation with Spritesheets

```javascript
import { SpriteAnimationComponent } from './src/animations/components/SpriteAnimationComponent.js';
import { SpriteAnimationClip } from './src/animations/SpriteAnimationClip.js';

// Create spritesheet
const characterSheet = new Spritesheet("character", "assets/character.png", 64, 64, 8, 4);

// Create animation clips
const walkAnimation = new SpriteAnimationClip("walk", [
    "sprite_0_0", "sprite_1_0", "sprite_2_0", "sprite_3_0"
], 8, true);

const jumpAnimation = new SpriteAnimationClip("jump", [
    "sprite_0_1", "sprite_1_1", "sprite_2_1"
], 12, false);

// Add to game object
class AnimatedCharacter extends GameObject {
    constructor() {
        super("Character");
        
        const spriteRenderer = new SpriteRendererComponent("character", "sprite_0_0");
        const animator = new SpriteAnimationComponent("character", "walk");
        
        animator.addClip(walkAnimation);
        animator.addClip(jumpAnimation);
        
        this.addComponent(spriteRenderer);
        this.addComponent(animator);
    }
}
```

### Dynamic Sprite Selection

```javascript
class TileRenderer extends Component {
    constructor() {
        super();
        this.tileSheet = null;
        this.tileType = 0;
    }
    
    start() {
        this.tileSheet = Game.instance.spriteRegistry.getSheet("tiles");
    }
    
    setTileType(type) {
        this.tileType = type;
        const col = type % 8; // 8 tiles per row
        const row = Math.floor(type / 8);
        const spriteName = `sprite_${col}_${row}`;
        
        const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
        if (spriteRenderer) {
            spriteRenderer.sprite = this.tileSheet.getSprite(spriteName);
        }
    }
}
```

### Custom Sprite Names

```javascript
class CustomSpritesheet extends Spritesheet {
    constructor(name, src, frameWidth, frameHeight, cols, rows, spriteNames) {
        super(name, src, frameWidth, frameHeight, cols, rows);
        this.customNames = spriteNames || [];
    }
    
    async load() {
        await super.load();
        
        // Add custom named sprites
        if (this.customNames.length > 0) {
            let index = 0;
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    if (index < this.customNames.length) {
                        const sprite = this.sprites.get(`sprite_${x}_${y}`);
                        this.sprites.set(this.customNames[index], sprite);
                    }
                    index++;
                }
            }
        }
    }
}

// Usage
const uiSheet = new CustomSpritesheet(
    "ui", 
    "assets/ui_elements.png", 
    64, 64, 4, 2,
    ["button_normal", "button_hover", "button_pressed", "panel", "health_bar", "mana_bar", "icon_sword", "icon_shield"]
);
```

## Best Practices

1. **Organize sprites logically** - Group related sprites in the same spritesheet
2. **Use consistent frame sizes** - Makes animation and positioning easier
3. **Power-of-2 dimensions** - Use texture sizes like 256x256, 512x512 for better performance
4. **Minimize transparency** - Reduce file size by minimizing transparent areas
5. **Name conventions** - Use descriptive names for custom sprite naming

## Common Patterns

### Tilemap Rendering

```javascript
class TilemapRenderer extends Component {
    constructor(tilemapData, tileSize = 32) {
        super();
        this.tilemapData = tilemapData;
        this.tileSize = tileSize;
        this.tilesheet = null;
    }
    
    start() {
        this.tilesheet = Game.instance.spriteRegistry.getSheet("tileset");
    }
    
    __draw(ctx) {
        for (let y = 0; y < this.tilemapData.length; y++) {
            for (let x = 0; x < this.tilemapData[y].length; x++) {
                const tileId = this.tilemapData[y][x];
                if (tileId > 0) {
                    const col = (tileId - 1) % 8;
                    const row = Math.floor((tileId - 1) / 8);
                    const sprite = this.tilesheet.getSprite(`sprite_${col}_${row}`);
                    
                    if (sprite) {
                        ctx.drawImage(
                            sprite.image,
                            sprite.x, sprite.y, sprite.width, sprite.height,
                            x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
                        );
                    }
                }
            }
        }
    }
}
```

### Sprite Batching for Performance

```javascript
class SpriteBatch {
    constructor(spritesheet) {
        this.spritesheet = spritesheet;
        this.drawCalls = [];
    }
    
    addSprite(spriteName, x, y, scaleX = 1, scaleY = 1) {
        this.drawCalls.push({ spriteName, x, y, scaleX, scaleY });
    }
    
    render(ctx) {
        for (const call of this.drawCalls) {
            const sprite = this.spritesheet.getSprite(call.spriteName);
            if (sprite) {
                ctx.drawImage(
                    sprite.image,
                    sprite.x, sprite.y, sprite.width, sprite.height,
                    call.x, call.y, 
                    sprite.width * call.scaleX, 
                    sprite.height * call.scaleY
                );
            }
        }
        this.drawCalls.length = 0; // Clear for next frame
    }
}
```

## Related Classes

- [SpriteRendererComponent](SpriteRendererComponent.md) - Renders sprites on game objects
- [SpriteAnimationComponent](../animations/SpriteAnimationComponent.md) - Animates sprites
- [SpriteRegistry](../asset/SpriteRegistry.md) - Manages spritesheet loading
- [Game](../core/Game.md) - Contains the sprite registry
