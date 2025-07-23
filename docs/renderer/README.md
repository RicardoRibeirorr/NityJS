# Renderer Documentation

Welcome to the **Renderer** documentation section! This is where you'll find all the components that handle visual display in NityJS games. From sprites to shapes to images, everything you need for graphics rendering is here.

## 🎯 What You'll Find Here

The renderer system provides Unity-style visual components with modern web features. All renderer components include debug gizmos and work seamlessly with the transform system for positioning and rotation.

## 📚 Renderer Components Documentation

### 🎨 Visual Components
- **[SpriteRendererComponent](SpriteRendererComponent.md)** - Render sprites with scaling, tinting, flipping, and opacity effects
- **[ImageComponent](ImageComponent.md)** - Display individual image files with width/height control
- **[ShapeComponent](ShapeComponent.md)** - Draw geometric shapes (rectangle, circle, triangle, polygon) with metadata support
- **[RendererComponents](RendererComponents.md)** - Overview and comparison of all renderer components

### 🗃️ Asset Management
- **[Sprite and Spritesheet](Sprite.md)** - Sprite asset loading and spritesheet management

## 🚀 Quick Start Guide

For visual game development, we recommend this learning path:

1. **[SpriteRendererComponent](SpriteRendererComponent.md)** - Start with sprite rendering for game objects
2. **[Sprite and Spritesheet](Sprite.md)** - Learn asset management and spritesheet usage
3. **[ShapeComponent](ShapeComponent.md)** - Add geometric shapes for UI and effects
4. **[ImageComponent](ImageComponent.md)** - Use for backgrounds and simple image display

## 🎮 Common Rendering Patterns

### Basic Game Object Rendering
```javascript
// Create a game character with sprite
const player = new GameObject("Player");
player.addComponent(new SpriteRendererComponent("player_idle", {
    width: 64,
    height: 64,
    opacity: 1.0
}));

// Add a health bar with shapes
const healthBar = new GameObject("HealthBar");
healthBar.addComponent(new ShapeComponent("rectangle", 100, 10, {
    color: "#00FF00",
    filled: true
}));
```

### UI Elements
```javascript
// Background image
const background = new GameObject("Background");
background.addComponent(new ImageComponent("assets/bg.png", 800, 600));

// UI button with shape
const button = new GameObject("Button");
button.addComponent(new ShapeComponent("rectangle", 120, 40, {
    color: "#4CAF50",
    filled: true
}));
```

### Visual Effects
```javascript
// Particle with metadata system (perfect for editors)
const particle = Component.createFromMetadata(ShapeComponent, {
    shapeType: "circle",
    radius: 5,
    color: "#FFD700",
    filled: true
});
```

## 🎯 Unity Developers

The renderer system is designed to feel like Unity's rendering:

- **SpriteRendererComponent** = Unity's **SpriteRenderer**
- **ImageComponent** = Unity's **Image** (UI) or custom image rendering
- **ShapeComponent** = Unity's **Line Renderer** + custom geometry
- **Transform Integration** = Unity's **Transform** positioning and rotation
- **Material Properties** = Unity's **Material** tinting and opacity

## 🔧 Renderer Features

### Unified Sprite System
- **SpriteAsset** - Individual sprite files
- **SpritesheetAsset** - Packed sprite collections
- **Colon Notation** - Access sprites with "sheet:sprite" syntax
- **Automatic Caching** - Efficient sprite loading and management

### Visual Options
- **Scaling** - Custom width/height rendering
- **Tinting** - Color overlay effects with hex/rgba colors
- **Opacity** - Alpha transparency (0.0 to 1.0)
- **Flipping** - Horizontal/vertical sprite flipping
- **Rotation** - Automatic rotation support through transforms

### Metadata Integration
- **Visual Editor Ready** - All components support metadata creation
- **JSON Configuration** - Define visuals declaratively
- **Property Validation** - Built-in validation for visual properties
- **Runtime Updates** - Dynamic property changes

### Debug Features
- **Gizmos System** - Visual debugging for all renderer components
- **Boundary Visualization** - See sprite and shape boundaries
- **Transform Gizmos** - Position and rotation indicators

## 💡 Pro Tips

- **Performance**: Use SpriteRendererComponent for game objects, ImageComponent for static backgrounds
- **Organization**: Group related sprites in spritesheets for better performance
- **Metadata**: Use the metadata system for data-driven visual configuration
- **Debugging**: Enable gizmos during development to visualize rendering boundaries

## 🎮 Use Cases by Component

### Use **SpriteRendererComponent** for:
- **Game Characters** - Players, enemies, NPCs
- **Game Items** - Pickups, weapons, collectibles
- **Animated Objects** - Sprites that change over time
- **Interactive Elements** - Objects that need visual effects
- **Tiled Graphics** - Sprites from spritesheets

### Use **ImageComponent** for:
- **Static Backgrounds** - Level backgrounds, skyboxes
- **UI Elements** - Buttons, frames, decorations
- **Simple Graphics** - Logos, individual image files
- **Loading Screens** - Static images during transitions

### Use **ShapeComponent** for:
- **UI Elements** - Buttons, progress bars, panels
- **Debug Visualization** - Collision bounds, debug markers
- **Geometric Effects** - Particles, visual indicators
- **Procedural Graphics** - Runtime-generated shapes
- **Prototype Graphics** - Quick placeholder visuals

## 🔄 Workflow Integration

### Asset Pipeline
1. **Create Assets** - Use SpriteAsset or SpritesheetAsset
2. **Register Sprites** - Assets auto-register with SpriteRegistry
3. **Render Components** - Use unified sprite keys in components
4. **Runtime Updates** - Modify properties through component methods

### Visual Editor Workflow
```javascript
// Define component in JSON (perfect for editors)
const visualConfig = {
    type: "SpriteRendererComponent",
    metadata: {
        spriteName: "player_idle",
        width: 64,
        height: 64,
        opacity: 0.9,
        color: "#FFFFFF"
    }
};

// Create from configuration
const sprite = Component.createFromMetadata(
    SpriteRendererComponent, 
    visualConfig.metadata
);
```

## 📊 Performance Guidelines

### Optimization Tips
1. **Sprite Atlasing** - Pack multiple sprites into spritesheets
2. **Consistent Sizing** - Use consistent sprite dimensions when possible
3. **Minimal Color Changes** - Avoid frequent tint color updates
4. **Static vs Dynamic** - Use ImageComponent for static content

### Memory Management
- **Sprite Caching** - Sprites are automatically cached and reused
- **Texture Limits** - Be mindful of large image file sizes
- **Component Cleanup** - Renderer components clean up automatically

---

**Next:** Explore [Physics Components](../physics/) for collision and movement, or [Animation System](../animations/) for sprite animation.
