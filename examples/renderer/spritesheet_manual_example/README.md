# Manual Spritesheet Example

This example demonstrates how to use the pixel coordinate method for defining sprites in a spritesheet.

## Features

- **Full Spritesheet Display**: Shows the complete 24x8 pixel spritesheet
- **Individual Sprite Extraction**: Displays each 8x8 sprite separately with red borders
- **Pixel Coordinate Method**: Uses `{name, startX, startY, endX, endY}` format
- **Custom Scaling**: Implements ScaledSpriteComponent for proper sprite scaling

## Spritesheet Details

- **Image**: `environment_tiles.png` (24x8 pixels)
- **Sprites**: 3 tiles, each 8x8 pixels
- **Method**: Pixel coordinate-based definition

## Code Structure

```javascript
const manualSheet = new SpritesheetAsset('tiles', './assets/environment_tiles.png', {
    sprites: [
        { name: "tile1", startX: 0, startY: 0, endX: 8, endY: 8 },
        { name: "tile2", startX: 8, startY: 0, endX: 16, endY: 8 },
        { name: "tile3", startX: 16, startY: 0, endX: 24, endY: 8 }
    ]
});
```

## Important Implementation Details

### SpriteRendererComponent API
- Constructor takes sprite key: `new SpriteRendererComponent('tiles:tile1')`
- No `setSize()` method - sprites render at natural size
- For scaling, use custom components like `ScaledSpriteComponent`

### Custom Scaling Component
```javascript
class ScaledSpriteComponent extends Component {
    constructor(spriteKey, width, height) {
        // Custom component that renders sprites at specified dimensions
    }
}
```

## Display

1. **Top**: Full spritesheet scaled up 10x (240x80 display size)
2. **Bottom**: Individual sprites scaled up 8x (64x64 each) with red borders
