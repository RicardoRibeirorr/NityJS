# Simple Layer System Integration

## Overview

This example demonstrates the basic integration of NityJS's layer system with the simplified 3-layer default configuration:

- **background** - Static background elements
- **default** - Main gameplay objects (default layer)
- **ui** - User interface elements

## Default Configuration

The layer system now uses sensible defaults that work for most games:

```javascript
// These are the default settings, no need to specify them explicitly
const game = new Game();
game.configure({
    canvas: canvas,
    useLayerSystem: true,
    // layers: ['background', 'default', 'ui'], // Default layers
    // defaultLayer: 'default', // Default layer for new objects
});
```

## Key Features

### 1. Automatic Layer Assignment
- GameObjects automatically go to the `default` layer if no layer is specified
- You can explicitly set `gameObject.layer = 'background'` or `gameObject.layer = 'ui'`

### 2. Simplified API
- `Game.instance.getDefaultLayer()` - Returns the default layer name
- `Game.instance.hasLayerSystem()` - Checks if layer system is enabled
- `Game.instance.addToLayer(layerName, gameObject)` - Manually add objects to layers

### 3. Scene Integration
- `scene.add(gameObject)` automatically handles layer assignment
- Uses the object's `layer` property or falls back to the default layer

## Usage Patterns

### Basic Setup
```javascript
const game = new Game();
game.configure({
    canvas: document.getElementById('gameCanvas'),
    useLayerSystem: true // Enable the layer system with defaults
});
```

### Creating Objects for Different Layers

#### Background Objects
```javascript
const background = new GameObject(new Vector2(100, 100));
background.layer = 'background'; // Explicitly set to background
background.addComponent(new MyBackgroundComponent());
scene.add(background);
```

#### Default Layer Objects (Most Common)
```javascript
const player = new GameObject(new Vector2(400, 300));
// No need to set layer - automatically goes to 'default'
player.addComponent(new PlayerComponent());
scene.add(player);
```

#### UI Objects
```javascript
const hud = new GameObject(new Vector2(50, 50));
hud.layer = 'ui'; // Explicitly set to UI
hud.addComponent(new HUDComponent());
scene.add(hud);
```

## Rendering Order

The layers render in this order (bottom to top):
1. **background** - Rendered first (appears behind everything)
2. **default** - Rendered second (main game content)
3. **ui** - Rendered last (appears on top of everything)

Within each layer, objects are sorted by their `zIndex` property.

## Example Structure

```
examples/simple_layers/
├── index.html          # HTML page with canvas and styling
├── index.js            # Game logic demonstrating layer usage
└── README.md           # This documentation
```

## Interactive Demo

The example includes an interactive demonstration:
- Click in the left third to add background objects
- Click in the middle third to add gameplay objects
- Click in the right third to add UI objects

Each object type has distinct visual styling to show the layer separation clearly.

## Benefits

1. **Simplified Setup** - Just enable `useLayerSystem: true`
2. **Sensible Defaults** - Works for most games without configuration
3. **Clear Separation** - Background, gameplay, and UI are clearly separated
4. **Performance** - Only renders layers that have changed (dirty tracking)
5. **Unity-Like** - Familiar patterns for Unity developers

## Best Practices

1. **Use Default Layer** - Most gameplay objects should use the default layer
2. **Background for Static** - Use background layer for static, non-interactive elements
3. **UI on Top** - Use UI layer for HUD, menus, and overlays
4. **Z-Index for Fine Control** - Use `zIndex` property for ordering within layers
5. **Explicit Assignment** - Set `gameObject.layer` before adding to scene for best performance

This simple integration makes the layer system easy to use while providing powerful rendering control for complex games.
