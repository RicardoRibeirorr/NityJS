# LayerManager

The **LayerManager** is NityJS's internal rendering layer system that provides depth-based rendering organization using OffscreenCanvas technology. It enables developers to organize GameObjects into distinct rendering layers for proper depth sorting and visual hierarchy.

## Overview

The LayerManager implements a professional-grade layering system that:

- **Internal OffscreenCanvas System**: Uses multiple OffscreenCanvas instances for each layer, composited to a single main canvas
- **Zero DOM Overhead**: No additional DOM elements - everything renders to one HTML canvas
- **Automatic Layer Assignment**: GameObjects are automatically assigned to appropriate layers
- **Dirty Tracking**: Only re-renders layers that have changed for optimal performance
- **Unity-Style Integration**: Seamless integration with GameObject and Scene systems

## Architecture

```
HTML Canvas (Single)
    └── LayerManager
        ├── Background Layer (OffscreenCanvas)
        ├── Default Layer (OffscreenCanvas)  
        └── UI Layer (OffscreenCanvas)
```

## Default Configuration

LayerManager comes with sensible defaults for immediate use:

- **3 Default Layers**: `['background', 'default', 'ui']`
- **Default Layer**: `'default'` (where most GameObjects go automatically)
- **Rendering Order**: background → default → ui (bottom to top)

## Basic Usage

### Enable Layer System

```javascript
const game = new Game();
game.configure({
    canvas: canvas,
    useLayerSystem: true  // Enables 3 default layers
});
```

### Automatic Layer Assignment

```javascript
// GameObjects automatically go to 'default' layer
const player = new GameObject(new Vector2(400, 300));
player.addComponent(new SpriteRendererComponent("player"));
scene.add(player); // Automatically assigned to 'default' layer
```

### Explicit Layer Assignment

```javascript
// Background objects
const background = new GameObject(new Vector2(0, 0));
background.layer = 'background';
background.addComponent(new ImageComponent("bg.png"));
scene.add(background);

// UI objects  
const hud = new GameObject(new Vector2(10, 10));
hud.layer = 'ui';
hud.addComponent(new ShapeComponent("rectangle", {color: '#000', width: 200, height: 50}));
scene.add(hud);
```

## Advanced Configuration

### Custom Layers

```javascript
game.configure({
    canvas: canvas,
    useLayerSystem: true,
    layers: ['far-background', 'background', 'environment', 'gameplay', 'effects', 'ui', 'overlay'],
    defaultLayer: 'gameplay'
});
```

### Runtime Layer Management

```javascript
// Add GameObject to specific layer
Game.instance.addToLayer('effects', explosionObject);

// Remove GameObject from layer
Game.instance.removeFromLayer('effects', explosionObject);

// Get default layer name
const defaultLayer = Game.instance.getDefaultLayer(); // 'default'

// Check if layer system is active
if (Game.instance.hasLayerSystem()) {
    console.log('Layer system is active');
}
```

## Layer Organization Strategies

### Game Layer Structure

```javascript
// Typical game layer organization
const layers = [
    'far-background',    // Sky, distant mountains
    'background',        // Static background elements  
    'environment',       // Platforms, terrain, buildings
    'gameplay',          // Players, enemies, pickups (default)
    'effects',          // Particles, explosions, magic effects
    'ui',               // HUD, health bars, score
    'overlay'           // Menus, pause screens, dialogs
];
```

### UI-Heavy Applications

```javascript
// UI-focused layer structure
const layers = [
    'background',        // App background
    'content',          // Main content area (default)
    'ui-low',           // Base UI elements
    'ui-high',          // Elevated UI elements
    'modals',           // Modal dialogs
    'tooltips'          // Tooltips and hints
];
```

## Performance Optimization

### Dirty Tracking

LayerManager automatically tracks which layers need re-rendering:

```javascript
// Only layers with changed objects are re-rendered
// Unchanged layers use cached OffscreenCanvas content
```

### Layer-Based Culling

Objects are organized by layer for efficient processing:

```javascript
// Each layer maintains its own object list
// Rendering pipeline processes layers in order
// Invisible layers can be skipped entirely
```

## Integration with GameObjects

### Layer Property

Every GameObject has a `layer` property:

```javascript
const obj = new GameObject(new Vector2(100, 100));
console.log(obj.layer); // 'default'

obj.layer = 'background';
console.log(obj.layer); // 'background'
```

### Z-Index Within Layers

For fine-grained control within a layer:

```javascript
const obj1 = new GameObject(new Vector2(100, 100));
obj1.layer = 'gameplay';
obj1.zIndex = 1;

const obj2 = new GameObject(new Vector2(100, 100));  
obj2.layer = 'gameplay';
obj2.zIndex = 2; // Renders on top of obj1
```

## Scene Integration

The Scene class automatically handles layer assignment:

```javascript
class GameScene extends Scene {
    async start() {
        // Background
        const bg = new GameObject(new Vector2(0, 0));
        bg.layer = 'background';
        bg.addComponent(new ImageComponent("background.png"));
        this.add(bg); // Automatically added to 'background' layer
        
        // Gameplay (uses default layer)
        const player = new GameObject(new Vector2(400, 300));
        player.addComponent(new SpriteRendererComponent("player"));
        this.add(player); // Automatically added to 'default' layer
        
        // UI
        const ui = new GameObject(new Vector2(10, 10));
        ui.layer = 'ui';
        ui.addComponent(new ShapeComponent("rectangle", {color: '#000', width: 100, height: 30}));
        this.add(ui); // Automatically added to 'ui' layer
    }
}
```

## Instantiate Integration

The Instantiate system also respects layer assignments:

```javascript
// Runtime object creation with layers
const enemy = Instantiate.create(new GameObject(new Vector2(200, 200)));
enemy.layer = 'gameplay'; // Will be moved to gameplay layer
enemy.addComponent(new SpriteRendererComponent("enemy"));
```

## API Reference

### LayerManager Class

#### Constructor

```javascript
new LayerManager(canvas, options)
```

**Parameters:**
- `canvas` (HTMLCanvasElement): Main rendering canvas
- `options.layers` (Array<string>): Array of layer names (default: `['background', 'default', 'ui']`)
- `options.defaultLayer` (string): Default layer name (default: `'default'`)
- `options.width` (number): Canvas width
- `options.height` (number): Canvas height

#### Methods

##### `addToLayer(layerName, gameObject)`
Adds a GameObject to the specified layer.

##### `removeFromLayer(layerName, gameObject)`
Removes a GameObject from the specified layer.

##### `getDefaultLayer()`
Returns the default layer name.

##### `render()`
Renders all layers to the main canvas. Called automatically by the Game loop.

### Game Integration Methods

#### `Game.configure(options)`
Configure the game with layer system support.

**Options:**
- `useLayerSystem` (boolean): Enable layer system
- `layers` (Array<string>): Custom layer names
- `defaultLayer` (string): Default layer name

#### `Game.addToLayer(layerName, gameObject)`
Add GameObject to specific layer.

#### `Game.removeFromLayer(layerName, gameObject)`
Remove GameObject from specific layer.

#### `Game.getDefaultLayer()`
Get the default layer name.

#### `Game.hasLayerSystem()`
Check if layer system is enabled.

## Examples

### Simple Layer Demo

```javascript
// Create 3 overlapping shapes on different layers
const scene = new Scene({
    create(scene) {
        // Background - Blue circle (largest, back)
        const bg = new GameObject(new Vector2(400, 300));
        bg.layer = 'background';
        bg.addComponent(new ShapeComponent('circle', {color: '#0066CC', radius: 80}));
        Instantiate.create(bg);
        
        // Default - Red circle (medium, middle)  
        const mid = new GameObject(new Vector2(400, 300));
        mid.addComponent(new ShapeComponent('circle', {color: '#FF6B6B', radius: 60}));
        Instantiate.create(mid);
        
        // UI - Green circle (smallest, front)
        const ui = new GameObject(new Vector2(400, 300));
        ui.layer = 'ui';
        ui.addComponent(new ShapeComponent('circle', {color: '#4CAF50', radius: 40}));
        Instantiate.create(ui);
    }
});
```

### Game Scene with Layers

```javascript
class GameScene extends Scene {
    async start() {
        // Background layer
        const background = new GameObject(new Vector2(0, 0));
        background.layer = 'background';
        background.addComponent(new ImageComponent("forest_bg.png"));
        this.add(background);
        
        // Environment layer (platforms, terrain)
        const platform = new GameObject(new Vector2(200, 500));
        platform.layer = 'environment';
        platform.addComponent(new SpriteRendererComponent("platform"));
        platform.addComponent(new BoxColliderComponent(200, 50));
        this.add(platform);
        
        // Gameplay layer (default - players, enemies)
        const player = new GameObject(new Vector2(100, 400));
        player.addComponent(new SpriteRendererComponent("player"));
        player.addComponent(new PlayerController());
        this.add(player); // Automatically goes to 'default' layer
        
        // Effects layer
        const particles = new GameObject(new Vector2(300, 300));
        particles.layer = 'effects';
        particles.addComponent(new ParticleSystem());
        this.add(particles);
        
        // UI layer
        const healthBar = new GameObject(new Vector2(20, 20));
        healthBar.layer = 'ui';
        healthBar.addComponent(new HealthBarComponent());
        this.add(healthBar);
    }
}
```

## Best Practices

### Layer Organization

1. **Use Descriptive Names**: `'environment'` instead of `'layer2'`
2. **Logical Grouping**: Group related objects on same layer
3. **Minimal Layers**: Use only as many layers as needed
4. **Consistent Naming**: Establish naming conventions for your project

### Performance

1. **Static Layers**: Put static objects on background layers
2. **Dynamic Layers**: Put frequently changing objects on separate layers
3. **UI Separation**: Keep UI on top layers for easy management
4. **Layer Switching**: Minimize runtime layer changes

### Integration

1. **Set Layer Early**: Assign layer in GameObject constructor or immediately after
2. **Use Defaults**: Let most objects use the default layer automatically
3. **Document Usage**: Comment layer assignments in complex scenes
4. **Test Rendering**: Verify layer order with overlapping objects

## Troubleshooting

### Common Issues

**Objects Not Visible**
- Check if layer system is enabled: `Game.instance.hasLayerSystem()`
- Verify layer name spelling and case sensitivity
- Ensure objects are added to scene: `scene.add(gameObject)`

**Wrong Rendering Order**
- Check layer order in configuration
- Verify GameObject.layer assignments
- Use zIndex for fine-grained control within layers

**Performance Issues**
- Monitor dirty layer updates
- Reduce unnecessary layer changes
- Group static objects on background layers

### Debug Information

```javascript
// Check layer system status
console.log('Has layers:', Game.instance.hasLayerSystem());
console.log('Available layers:', Game.instance.getLayerManager()?.layers);
console.log('Default layer:', Game.instance.getDefaultLayer());

// Check GameObject layer assignment
console.log('Object layer:', gameObject.layer);
console.log('Object zIndex:', gameObject.zIndex);
```

## Unity Comparison

| Unity | NityJS LayerManager |
|-------|-------------------|
| Sorting Layers | Layers array |
| Order in Layer | zIndex property |
| Layer property | layer property |
| Canvas Renderer | LayerManager |
| Multiple Cameras | Single canvas composition |

The LayerManager provides Unity-like layer functionality while leveraging web technologies for optimal browser performance.
