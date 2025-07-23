# Component Metadata System

> **Unity Equivalent:** Inspector properties, `[SerializeField]` attributes, and Editor scripting

The metadata system enables data-driven component creation and configuration, perfect for visual editors and JSON-based scene definitions. All components can be created and configured through metadata objects instead of constructor parameters.

## Core Concepts

### What is Metadata?

Metadata describes how a component should be configured without requiring code changes. It's perfect for:

- **Visual Editors** - Property panels and inspector windows
- **JSON Scene Files** - Declarative scene definitions
- **Runtime Configuration** - Dynamic component creation
- **Template Systems** - Reusable component configurations

### Three Creation Methods

Components in NityJS can be created in three different ways:

```javascript
// 1. Traditional Constructor (code-first)
const shape1 = new ShapeComponent("circle", 25, { color: "red" });

// 2. Metadata Creation (data-driven)
const shape2 = Component.createFromMetadata(ShapeComponent, {
    shapeType: "circle",
    radius: 25,
    color: "red",
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

All components inherit these metadata methods from the base `Component` class:

### `static createFromMetadata(ComponentClass, metadata)`

Creates a component instance from metadata object.

**Parameters:**
- `ComponentClass` (Class) - The component class to instantiate
- `metadata` (Object) - Configuration data

**Returns:**
- Component instance with metadata applied

**Example:**
```javascript
const sprite = Component.createFromMetadata(SpriteRendererComponent, {
    spriteName: "player",
    width: 64,
    height: 64,
    opacity: 0.8,
    flipX: true
});
```

### `getDefaultMeta()`

Returns the default metadata configuration for this component type.

**Returns:**
- Object with default values for all configurable properties

**Example:**
```javascript
const defaults = ShapeComponent.getDefaultMeta();
console.log(defaults);
// {
//     shapeType: "rectangle",
//     width: 50,
//     height: 50,
//     radius: 25,
//     color: "#FF0000",
//     filled: true
// }
```

### `applyMeta(metadata)`

Applies metadata to an existing component instance.

**Parameters:**
- `metadata` (Object) - Configuration to apply

**Example:**
```javascript
const shape = new ShapeComponent();
shape.applyMeta({
    shapeType: "circle",
    radius: 30,
    color: "#0066FF"
});
```

### `static meta(metadata)`

Static method for quickly creating instances with metadata.

**Parameters:**
- `metadata` (Object) - Configuration data

**Returns:**
- Component instance

**Example:**
```javascript
const component = ShapeComponent.meta({
    shapeType: "triangle",
    width: 40,
    height: 60,
    color: "yellow"
});
```

## Component-Specific Metadata

All NityJS components now support the metadata system for editor integration and data-driven development. Here are the metadata configurations for each component:

### SpriteRendererComponent Metadata

```javascript
const spriteDefaults = {
    spriteName: "",         // Sprite asset name ("name" or "sheet:sprite")
    width: null,            // Display width (null = auto)
    height: null,           // Display height (null = auto)
    opacity: 1.0,           // Transparency (0-1)
    color: "#FFFFFF",       // Tint color
    flipX: false,           // Horizontal flip
    flipY: false            // Vertical flip
};

// Create sprite with metadata
const playerSprite = SpriteRendererComponent.meta({
    spriteName: "player_idle",
    width: 64,
    height: 64,
    opacity: 0.9,
    flipX: true
});
```

### ImageComponent Metadata

```javascript
const imageDefaults = {
    src: "",                // Image source URL
    width: null,            // Display width (null = natural width)
    height: null            // Display height (null = natural height)
};

// Create image with metadata
const background = ImageComponent.meta({
    src: "assets/background.png",
    width: 800,
    height: 600
});
```

### ShapeComponent Metadata

```javascript
const shapeDefaults = {
    shapeType: "rectangle",  // "rectangle", "circle", "triangle", "polygon"
    width: 50,              // Rectangle/triangle width
    height: 50,             // Rectangle/triangle height  
    radius: 25,             // Circle radius
    color: "#FF0000",       // Fill/stroke color
    filled: true,           // Whether shape is filled
    points: []              // Polygon points (array of {x, y})
};

// Create different shapes
const circle = ShapeComponent.meta({
    shapeType: "circle",
    radius: 35,
    color: "#00FF00"
});

const triangle = ShapeComponent.meta({
    shapeType: "triangle", 
    width: 60,
    height: 80,
    color: "#0000FF",
    filled: false
});
```

### RigidbodyComponent Metadata

```javascript
const rigidbodyDefaults = {
    gravity: false,         // Enable gravity
    gravityScale: 300,      // Gravity strength
    bounciness: 0           // Bounce factor (0-1)
};

// Create physics body with metadata
const physicsBall = RigidbodyComponent.meta({
    gravity: true,
    gravityScale: 500,
    bounciness: 0.8
});
```

### BoxColliderComponent Metadata

```javascript
const boxColliderDefaults = {
    width: null,            // Collider width (null = auto from sprite)
    height: null,           // Collider height (null = auto from sprite)
    trigger: false          // Is trigger (no physics response)
};

// Create box collider with metadata
const playerCollider = BoxColliderComponent.meta({
    width: 32,
    height: 48,
    trigger: false
});
```

### CircleColliderComponent Metadata

```javascript
const circleColliderDefaults = {
    radius: null,           // Collider radius (null = auto from sprite)
    trigger: false          // Is trigger (no physics response)
};

// Create circle collider with metadata
const ballCollider = CircleColliderComponent.meta({
    radius: 25,
    trigger: true
});
```

### GravityComponent Metadata

```javascript
const gravityDefaults = {
    gravityScale: 300       // Gravity strength in pixels/second²
};

// Create gravity component with metadata
const gravity = GravityComponent.meta({
    gravityScale: 450
});
```

### SpriteAnimationComponent Metadata

```javascript
const animationDefaults = {
    defaultClipName: null,  // Default animation clip name
    autoPlay: true          // Auto-play default clip on start
};

// Create animation component with metadata
const animator = SpriteAnimationComponent.meta({
    defaultClipName: "idle",
    autoPlay: true
});
```

### CameraComponent Metadata

```javascript
const cameraDefaults = {
    zoom: 1                 // Camera zoom level
};

// Create camera with metadata
const camera = CameraComponent.meta({
    zoom: 1.5
});
// Note: Canvas must be set separately as it's not serializable
camera.canvas = canvas;
```

## Validation System

The metadata system includes built-in validation to catch configuration errors:

### Automatic Validation

```javascript
// This will throw an error - invalid shape type
try {
    const shape = ShapeComponent.meta({
        shapeType: "hexagon"  // Not a valid shape type
    });
} catch (error) {
    console.error("Invalid metadata:", error.message);
}
```

### Custom Validation

Components can implement custom validation:

```javascript
class MyComponent extends Component {
    static getDefaultMeta() {
        return {
            health: 100,
            speed: 5.0,
            level: 1
        };
    }
    
    _validateMeta(meta) {
        if (meta.health < 0) {
            throw new Error("Health cannot be negative");
        }
        if (meta.level < 1 || meta.level > 99) {
            throw new Error("Level must be between 1 and 99");
        }
        if (meta.speed <= 0) {
            throw new Error("Speed must be positive");
        }
    }
}
```

## Visual Editor Integration

The metadata system is designed for future visual editor support:

### Property Panels

```javascript
// Visual editor can generate property panels from metadata
class EditorPropertyPanel {
    static generateFor(ComponentClass) {
        const defaults = ComponentClass.getDefaultMeta();
        const panel = document.createElement('div');
        
        for (const [key, defaultValue] of Object.entries(defaults)) {
            const input = this.createInputFor(key, defaultValue);
            panel.appendChild(input);
        }
        
        return panel;
    }
    
    static createInputFor(property, defaultValue) {
        if (typeof defaultValue === 'boolean') {
            return this.createCheckbox(property, defaultValue);
        } else if (typeof defaultValue === 'number') {
            return this.createNumberInput(property, defaultValue);
        } else if (typeof defaultValue === 'string') {
            return this.createTextInput(property, defaultValue);
        }
    }
}
```

### Scene Serialization

```javascript
// Save scene to JSON with metadata
class SceneSerializer {
    static saveScene(scene) {
        const sceneData = {
            gameObjects: scene.gameObjects.map(obj => ({
                name: obj.name,
                position: { x: obj.position.x, y: obj.position.y },
                rotation: obj.rotation,
                components: obj.components.map(comp => ({
                    type: comp.constructor.name,
                    metadata: comp.getMetadata()
                }))
            }))
        };
        
        return JSON.stringify(sceneData, null, 2);
    }
    
    static loadScene(sceneJson) {
        const data = JSON.parse(sceneJson);
        const scene = new Scene();
        
        for (const objData of data.gameObjects) {
            const obj = new GameObject(objData.name);
            obj.position.set(objData.position.x, objData.position.y);
            obj.rotation = objData.rotation;
            
            for (const compData of objData.components) {
                const ComponentClass = this.getComponentClass(compData.type);
                const component = Component.createFromMetadata(
                    ComponentClass, 
                    compData.metadata
                );
                obj.addComponent(component);
            }
            
            scene.addGameObject(obj);
        }
        
        return scene;
    }
}
```

## Performance Considerations

### Metadata Caching

```javascript
// Components cache their metadata for efficiency
class OptimizedComponent extends Component {
    constructor() {
        super();
        this._metadataCache = null;
    }
    
    getMetadata() {
        if (!this._metadataCache) {
            this._metadataCache = this._generateMetadata();
        }
        return { ...this._metadataCache }; // Return copy
    }
    
    applyMeta(metadata) {
        super.applyMeta(metadata);
        this._metadataCache = null; // Invalidate cache
    }
}
```

### Batch Creation

```javascript
// Efficient batch creation from metadata
class BatchFactory {
    static createComponents(metadataArray) {
        return metadataArray.map(({ type, metadata }) => {
            const ComponentClass = this.getComponentClass(type);
            return Component.createFromMetadata(ComponentClass, metadata);
        });
    }
    
    static createGameObjects(gameObjectsData) {
        return gameObjectsData.map(objData => {
            const obj = new GameObject(objData.name);
            obj.position.set(objData.x, objData.y);
            
            const components = this.createComponents(objData.components);
            components.forEach(comp => obj.addComponent(comp));
            
            return obj;
        });
    }
}
```

## Common Patterns

### Template System

```javascript
// Define component templates
const ComponentTemplates = {
    player: {
        SpriteRendererComponent: {
            spriteName: "player_idle",
            width: 64,
            height: 64
        },
        RigidbodyComponent: {
            mass: 1.0,
            gravityScale: 1.0
        },
        BoxColliderComponent: {
            width: 32,
            height: 48
        }
    },
    
    enemy: {
        SpriteRendererComponent: {
            spriteName: "enemy",
            width: 48,
            height: 48
        },
        AIComponent: {
            speed: 2.0,
            detectRange: 100
        }
    }
};

// Create from template
function createFromTemplate(templateName) {
    const template = ComponentTemplates[templateName];
    const obj = new GameObject(templateName);
    
    for (const [componentType, metadata] of Object.entries(template)) {
        const ComponentClass = getComponentClass(componentType);
        const component = Component.createFromMetadata(ComponentClass, metadata);
        obj.addComponent(component);
    }
    
    return obj;
}
```

### Configuration Files

```javascript
// Load components from JSON config
async function loadFromConfig(configPath) {
    const response = await fetch(configPath);
    const config = await response.json();
    
    return config.components.map(compConfig => 
        Component.createFromMetadata(
            getComponentClass(compConfig.type),
            compConfig.metadata
        )
    );
}
```

## Creating Custom Metadata Components

When creating your own components, implement these methods:

```javascript
class CustomComponent extends Component {
    constructor(param1, param2, options = {}) {
        super();
        
        // Store constructor parameters
        this._constructorArgs = [param1, param2, options];
        
        // Apply constructor arguments as metadata
        this._applyConstructorArgs(param1, param2, options);
    }
    
    static getDefaultMeta() {
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
