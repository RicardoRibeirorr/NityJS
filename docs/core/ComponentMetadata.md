# Component Metadata System

The NityJS metadata system provides a comprehensive, type-safe approach to component creation and configuration. All 8 components and `SpriteAnimationClip` support full metadata functionality, enabling declarative object creation, runtime configuration, and seamless integration with visual editors.

## Overview

The metadata system transforms how you create and configure components, moving from imperative constructor calls to declarative configuration objects. This approach is perfect for:

- **Visual Editors** - Property panels and drag-drop configuration
- **JSON Scene Files** - Serializable scene definitions
- **Configuration-Driven Development** - Data-driven component creation
- **Runtime Modification** - Dynamic property updates with validation

## Core Features

### 🏭 Static Factory Methods
Every component supports `ComponentClass.meta(metadata)` for clean, declarative creation:

```javascript
// Instead of: new SpriteRendererComponent("player", { width: 64, height: 64, opacity: 0.8 })
const sprite = SpriteRendererComponent.meta({
    spriteName: "player",
    width: 64,
    height: 64,
    opacity: 0.8,
    color: "#FF6B6B",
    flipX: true
});
```

### 🔧 Default Configuration
Access default metadata for any component with `ComponentClass.getDefaultMeta()`:

```javascript
const defaults = SpriteRendererComponent.getDefaultMeta();
// Returns: { spriteName: '', width: null, height: null, opacity: 1, color: '#FFFFFF', flipX: false, flipY: false }

const physicsDefaults = RigidbodyComponent.getDefaultMeta();
// Returns: { gravity: false, gravityScale: 300, bounciness: 0 }
```

### ✅ Type-Safe Validation
Comprehensive validation with helpful error messages:

```javascript
// ❌ These will throw descriptive errors:
SpriteRendererComponent.meta({ opacity: 1.5 }); // "opacity must be between 0 and 1"
BoxColliderComponent.meta({ width: -10 });       // "width must be positive"
SpriteAnimationClip.meta({ name: "" });          // "name cannot be empty"
```

### 🔄 Runtime Configuration
Update existing components with `applyMeta()`:

```javascript
const renderer = gameObject.getComponent(SpriteRendererComponent);
renderer.applyMeta({
    opacity: 0.5,
    color: "#00FF00",
    flipX: true
});
```

### 📦 Serialization Support
Export and import component state with `toMeta()`:

```javascript
const metadata = renderer.toMeta();
const jsonString = JSON.stringify(metadata);

// Later...
const restored = SpriteRendererComponent.meta(JSON.parse(jsonString));
```
    filled: true
});

// 3. JSON Configuration (declarative)
const componentData = {
    type: "ShapeComponent",
    metadata: {
        shapeType: "rectangle",
        width: 100,
        height: 50,
        color: "#00FF00"
    }
};
```

## Base Component API
## Supported Components

### 1. SpriteRendererComponent
```javascript
const sprite = SpriteRendererComponent.meta({
    spriteName: "player_idle",    // Sprite name (required)
    width: 64,                    // Width in pixels (null = auto)
    height: 64,                   // Height in pixels (null = auto)
    opacity: 0.9,                 // Opacity 0-1 (default: 1)
    color: "#FF6B6B",             // Color tint (default: "#FFFFFF")
    flipX: true,                  // Horizontal flip (default: false)
    flipY: false                  // Vertical flip (default: false)
});
```

### 2. ImageComponent
```javascript
const image = ImageComponent.meta({
    src: "path/to/image.png",     // Image source (required)
    width: 100,                   // Width in pixels (null = auto)
    height: 80                    // Height in pixels (null = auto)
});
```

### 3. ShapeComponent
```javascript
const shape = ShapeComponent.meta({
    shapeType: "circle",          // "rectangle", "circle", "triangle", "polygon"
    options: {
        radius: 25,               // For circles
        width: 50,                // For rectangles
        height: 30,               // For rectangles
        color: "#00FF00",         // Fill/stroke color
        filled: true              // Filled or outline
    }
});
```

### 4. RigidbodyComponent
```javascript
const physics = RigidbodyComponent.meta({
    gravity: true,                // Enable gravity (default: false)
    gravityScale: 400,            // Gravity strength (default: 300)
    bounciness: 0.2               // Bounce factor (default: 0)
});
```

### 5. BoxColliderComponent
```javascript
const boxCollider = BoxColliderComponent.meta({
    width: 32,                    // Collision width (null = auto)
    height: 48,                   // Collision height (null = auto)
    trigger: false                // Is trigger (default: false)
});
```

### 6. CircleColliderComponent
```javascript
const circleCollider = CircleColliderComponent.meta({
    radius: 20,                   // Collision radius (null = auto)
    trigger: true                 // Is trigger (default: false)
});
```

### 7. SpriteAnimationComponent
```javascript
const animator = SpriteAnimationComponent.meta({
    defaultClipName: "idle",      // Default animation (null = none)
    autoPlay: true                // Auto-start animation (default: true)
});
```

### 8. CameraComponent
```javascript
const camera = CameraComponent.meta({
    zoom: 1.5                     // Camera zoom level (default: 1)
});
// Note: canvas must be set manually after creation
camera.canvas = canvas;
```

## SpriteAnimationClip Metadata

Animation clips also support the full metadata system:

```javascript
const walkClip = SpriteAnimationClip.meta({
    name: "walk",                 // Unique identifier (required)
    spriteNames: [                // Array of sprite names
        "player:walk_0",
        "player:walk_1", 
        "player:walk_2",
        "player:walk_3"
    ],
    fps: 8,                       // Frames per second (default: 10)
    loop: true                    // Loop animation (default: true)
});

// Use with animation component
const animator = SpriteAnimationComponent.meta({
    defaultClipName: "walk",
    autoPlay: true
});
animator.addClip(walkClip);
```

## Usage Patterns

### Configuration-Driven Development
Perfect for JSON-based scene definitions:

```javascript
const sceneConfig = {
    "entities": [
        {
            "name": "Player",
            "position": { "x": 100, "y": 100 },
            "components": [
                {
                    "type": "SpriteRendererComponent",
                    "metadata": {
                        "spriteName": "player_idle",
                        "width": 64,
                        "height": 64,
                        "opacity": 0.9
                    }
                },
                {
                    "type": "RigidbodyComponent", 
                    "metadata": {
                        "gravity": true,
                        "gravityScale": 400
                    }
                }
            ]
        }
    ]
};

// Create from configuration
sceneConfig.entities.forEach(entityData => {
    const gameObject = new GameObject(entityData.name);
    gameObject.position.set(entityData.position.x, entityData.position.y);
    
    entityData.components.forEach(compData => {
        const ComponentClass = getComponentClass(compData.type);
        const component = ComponentClass.meta(compData.metadata);
        gameObject.addComponent(component);
    });
});
```

### Visual Editor Integration
The metadata system is designed for visual editors:

```javascript
// Property panel would call getDefaultMeta() to build UI
const defaults = SpriteRendererComponent.getDefaultMeta();

// Build form fields based on metadata schema
Object.entries(defaults).forEach(([property, defaultValue]) => {
    createPropertyField(property, typeof defaultValue, defaultValue);
});

// Apply changes in real-time
function onPropertyChange(property, value) {
    const currentMeta = selectedComponent.toMeta();
    currentMeta[property] = value;
    selectedComponent.applyMeta(currentMeta);
}
```

### Runtime Modification
Dynamic property updates with validation:

```javascript
// Safe runtime updates
function fadeOut(gameObject, duration) {
    const renderer = gameObject.getComponent(SpriteRendererComponent);
    const startOpacity = renderer.opacity;
    
    // Animate using metadata for validation
    animateValue(startOpacity, 0, duration, (value) => {
        renderer.applyMeta({ opacity: value });
    });
}

function changeColor(gameObject, newColor) {
    const renderer = gameObject.getComponent(SpriteRendererComponent);
    renderer.applyMeta({ color: newColor }); // Validates color format
}
```

## Validation Rules

### SpriteRendererComponent
- `spriteName`: Must be non-empty string
- `width/height`: Must be positive number or null
- `opacity`: Must be between 0 and 1
- `color`: Must be valid CSS color string
- `flipX/flipY`: Must be boolean

### RigidbodyComponent  
- `gravity`: Must be boolean
- `gravityScale`: Must be positive number
- `bounciness`: Must be non-negative number

### Collider Components
- `width/height/radius`: Must be positive number or null
- `trigger`: Must be boolean

### SpriteAnimationClip
- `name`: Must be non-empty string
- `spriteNames`: Must be array of strings
- `fps`: Must be positive number
- `loop`: Must be boolean

## Migration Guide

### From Traditional to Metadata
```javascript
// Old way
const sprite = new SpriteRendererComponent("player", {
    width: 64,
    height: 64,
    opacity: 0.8,
    color: "#FF0000"
});

// New way (both work!)
const sprite = SpriteRendererComponent.meta({
    spriteName: "player",
    width: 64,
    height: 64,
    opacity: 0.8,
    color: "#FF0000"
});
```

### Benefits of Migration
- **Type Safety** - Validation catches errors early
- **Consistency** - Same pattern across all components
- **Tooling** - Better IDE support and debugging
- **Future-Proof** - Ready for visual editors

## Best Practices

1. **Use metadata for new components** - Cleaner and more maintainable
2. **Leverage defaults** - Only specify non-default values
3. **Validate early** - Let the system catch configuration errors
4. **Export for debugging** - Use `toMeta()` to inspect component state
5. **Document metadata schemas** - Help team members understand options

The metadata system represents the future of NityJS development, enabling powerful tooling while maintaining the familiar Unity-like experience developers love.
        return {
            param1: "default",
            param2: 100,
            option1: true,
            option2: "value"
        };
    }
    
    _applyConstructorArgs(param1, param2, options) {
        const metadata = {
            param1: param1 || this.constructor.getDefaultMeta().param1,
            param2: param2 || this.constructor.getDefaultMeta().param2,
            ...options
        };
        
        this.applyMeta(metadata);
    }
    
    _validateMeta(meta) {
        // Custom validation logic
        if (typeof meta.param1 !== 'string') {
            throw new Error('param1 must be a string');
        }
        
        if (meta.param2 < 0) {
            throw new Error('param2 cannot be negative');
        }
    }
    
    applyMeta(metadata) {
        this._validateMeta(metadata);
        
        // Apply the metadata to component properties
        this.param1 = metadata.param1;
        this.param2 = metadata.param2;
        this.option1 = metadata.option1;
        this.option2 = metadata.option2;
    }
}
```

The metadata system provides a powerful foundation for data-driven development and future visual editor integration while maintaining full backward compatibility with traditional constructor-based workflows.
