# ShapeComponent

> **Unity Equivalent:** Custom geometry rendering - Draw geometric shapes (rectangle, circle, triangle, polygon) with full metadata support

The `ShapeComponent` is a versatile rendering component for drawing geometric shapes. It supports multiple shape types with customizable properties and includes full metadata system integration for visual editors.

## Constructor

```javascript
new ShapeComponent(shapeType, size, options = {})
// OR
new ShapeComponent(shapeType, width, height, options = {})
```

**Parameters:**
- `shapeType` (string) - Shape type: "rectangle", "circle", "triangle", "polygon"
- `size/width` (number) - Primary dimension
- `height` (number, optional) - Secondary dimension for rectangles
- `options` (Object, optional) - Additional shape properties

## Metadata System Support

ShapeComponent includes full metadata support for visual editors:

```javascript
// Create with metadata (perfect for editors!)
const shape = Component.createFromMetadata(ShapeComponent, {
    shapeType: "circle",
    radius: 25,
    color: "#00FF00",
    filled: true
});

// Get default metadata
const defaults = ShapeComponent.getDefaultMeta();
console.log(defaults);
// {
//     shapeType: "rectangle",
//     width: 50,
//     height: 50,
//     radius: 25,
//     color: "#FF0000",
//     filled: true,
//     points: []
// }
```

## Shape Types and Properties

### Rectangle
```javascript
// Traditional constructor
gameObject.addComponent(new ShapeComponent("rectangle", 100, 50, { 
    color: "blue",
    filled: true 
}));

// Metadata creation
const rect = Component.createFromMetadata(ShapeComponent, {
    shapeType: "rectangle",
    width: 100,
    height: 50,
    color: "#0000FF",
    filled: true
});
```

**Properties:**
- `width` (number) - Rectangle width
- `height` (number) - Rectangle height
- `color` (string) - Fill/stroke color
- `filled` (boolean) - Whether to fill the shape

### Circle
```javascript
// Traditional constructor
gameObject.addComponent(new ShapeComponent("circle", 25, { 
    color: "red",
    filled: true 
}));

// Metadata creation
const circle = Component.createFromMetadata(ShapeComponent, {
    shapeType: "circle",
    radius: 25,
    color: "#FF0000",
    filled: true
});
```

**Properties:**
- `radius` (number) - Circle radius
- `color` (string) - Fill/stroke color
- `filled` (boolean) - Whether to fill the shape

### Triangle
```javascript
// Traditional constructor
gameObject.addComponent(new ShapeComponent("triangle", 60, 80, { 
    color: "green",
    filled: true 
}));

// Metadata creation
const triangle = Component.createFromMetadata(ShapeComponent, {
    shapeType: "triangle",
    width: 60,
    height: 80,
    color: "#00FF00",
    filled: true
});
```

**Properties:**
- `width` (number) - Triangle base width
- `height` (number) - Triangle height
- `color` (string) - Fill/stroke color
- `filled` (boolean) - Whether to fill the shape

### Polygon
```javascript
// Traditional constructor
gameObject.addComponent(new ShapeComponent("polygon", 0, 0, { 
    points: [[0, -20], [20, 10], [-20, 10]],
    color: "purple",
    filled: true 
}));

// Metadata creation
const polygon = Component.createFromMetadata(ShapeComponent, {
    shapeType: "polygon",
    points: [
        { x: 0, y: -20 },   // Top point
        { x: 20, y: 10 },   // Bottom right
        { x: -20, y: 10 }   // Bottom left
    ],
    color: "#800080",
    filled: true
});
```

**Properties:**
- `points` (Array) - Array of {x, y} coordinate points
- `color` (string) - Fill/stroke color
- `filled` (boolean) - Whether to fill the shape

## Methods

### Metadata Methods
- `static getDefaultMeta()` - Returns default metadata configuration
- `applyMeta(metadata)` - Applies metadata to component
- `static meta(metadata)` - Quick factory method

### Property Accessors
- `setColor(color)` - Change shape color
- `setFilled(filled)` - Toggle filled/outlined rendering
- `setSize(width, height)` - Update dimensions (rectangles/triangles)
- `setRadius(radius)` - Update radius (circles)

## Practical Examples

### UI Button
```javascript
class ShapeButton extends Component {
    start() {
        // Create button background
        this.background = Component.createFromMetadata(ShapeComponent, {
            shapeType: "rectangle",
            width: 120,
            height: 40,
            color: "#4CAF50",
            filled: true
        });
        this.gameObject.addComponent(this.background);
        
        this.isHovered = false;
    }
    
    update() {
        const mousePos = Input.getMousePosition();
        const bounds = this.getBounds();
        
        // Check if mouse is over button
        this.isHovered = mousePos.x >= bounds.left && 
                        mousePos.x <= bounds.right &&
                        mousePos.y >= bounds.top && 
                        mousePos.y <= bounds.bottom;
        
        // Update button color based on state
        if (this.isHovered) {
            this.background.setColor("#66BB6A"); // Lighter green
            if (Input.isLeftMousePressed()) {
                this.onClick();
            }
        } else {
            this.background.setColor("#4CAF50"); // Normal green
        }
    }
    
    getBounds() {
        const pos = this.gameObject.position;
        const meta = this.background.getDefaultMeta();
        return {
            left: pos.x - meta.width / 2,
            right: pos.x + meta.width / 2,
            top: pos.y - meta.height / 2,
            bottom: pos.y + meta.height / 2
        };
    }
    
    onClick() {
        console.log("Button clicked!");
    }
}
```

### Health Bar System
```javascript
class HealthBarComponent extends Component {
    constructor() {
        super();
        this.maxHealth = 100;
        this.currentHealth = 100;
    }
    
    start() {
        // Background bar (red)
        this.backgroundBar = Component.createFromMetadata(ShapeComponent, {
            shapeType: "rectangle",
            width: 100,
            height: 12,
            color: "#8B0000",
            filled: true
        });
        this.gameObject.addComponent(this.backgroundBar);
        
        // Health bar (green)
        this.healthBar = Component.createFromMetadata(ShapeComponent, {
            shapeType: "rectangle",
            width: 100,
            height: 10,
            color: "#00FF00",
            filled: true
        });
        this.gameObject.addComponent(this.healthBar);
    }
    
    setHealth(health) {
        this.currentHealth = Math.max(0, Math.min(health, this.maxHealth));
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        const healthPercentage = this.currentHealth / this.maxHealth;
        
        // Update width based on health
        this.healthBar.applyMeta({
            width: 100 * healthPercentage
        });
        
        // Change color based on health level
        let color;
        if (healthPercentage > 0.6) {
            color = "#00FF00"; // Green
        } else if (healthPercentage > 0.3) {
            color = "#FFFF00"; // Yellow
        } else {
            color = "#FF0000"; // Red
        }
        
        this.healthBar.setColor(color);
    }
}
```

### Animated Shapes
```javascript
class PulsingCircle extends Component {
    start() {
        this.circle = Component.createFromMetadata(ShapeComponent, {
            shapeType: "circle",
            radius: 20,
            color: "#00AAFF",
            filled: true
        });
        this.gameObject.addComponent(this.circle);
        
        this.baseRadius = 20;
        this.pulseSpeed = 3.0;
        this.pulseAmount = 8;
        this.time = 0;
    }
    
    update() {
        this.time += Time.deltaTime;
        
        // Pulsing animation
        const pulse = Math.sin(this.time * this.pulseSpeed);
        const newRadius = this.baseRadius + pulse * this.pulseAmount;
        
        this.circle.applyMeta({ radius: newRadius });
        
        // Color cycling
        const hue = (this.time * 60) % 360;
        this.circle.setColor(`hsl(${hue}, 100%, 50%)`);
    }
}
```

### Particle Effect with Shapes
```javascript
class ShapeParticleSystem extends Component {
    constructor(particleCount = 20) {
        super();
        this.particleCount = particleCount;
        this.particles = [];
    }
    
    start() {
        // Create particle objects
        for (let i = 0; i < this.particleCount; i++) {
            const particle = new GameObject(`Particle_${i}`);
            
            // Random shape type
            const shapes = ["circle", "rectangle", "triangle"];
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            
            let shapeData;
            if (shapeType === "circle") {
                shapeData = {
                    shapeType: "circle",
                    radius: Math.random() * 5 + 2,
                    color: this.randomColor(),
                    filled: true
                };
            } else if (shapeType === "rectangle") {
                shapeData = {
                    shapeType: "rectangle",
                    width: Math.random() * 8 + 4,
                    height: Math.random() * 8 + 4,
                    color: this.randomColor(),
                    filled: true
                };
            } else { // triangle
                shapeData = {
                    shapeType: "triangle",
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    color: this.randomColor(),
                    filled: true
                };
            }
            
            const shape = Component.createFromMetadata(ShapeComponent, shapeData);
            particle.addComponent(shape);
            
            // Random position and velocity
            particle.position.set(
                Math.random() * 200 - 100,
                Math.random() * 200 - 100
            );
            
            particle.velocity = new Vector2(
                Math.random() * 100 - 50,
                Math.random() * 100 - 50
            );
            
            this.particles.push(particle);
            Instantiate.create(particle);
        }
    }
    
    update() {
        // Update particle positions
        this.particles.forEach(particle => {
            particle.position.add(
                particle.velocity.multiply(Time.deltaTime)
            );
            
            // Fade out over time
            const shape = particle.getComponent(ShapeComponent);
            const currentColor = shape.color;
            // Implement alpha reduction logic here
        });
    }
    
    randomColor() {
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
```

## Visual Editor Integration

The metadata system makes ShapeComponent perfect for visual editors:

```javascript
// Editor can generate property panels from metadata
class ShapeEditor {
    static createPropertyPanel(component) {
        const defaults = component.constructor.getDefaultMeta();
        const panel = document.createElement('div');
        
        // Shape type dropdown
        const shapeSelect = document.createElement('select');
        ['rectangle', 'circle', 'triangle', 'polygon'].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            shapeSelect.appendChild(option);
        });
        
        // Color picker
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = defaults.color;
        
        // Size inputs
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.value = defaults.width;
        
        // Apply changes
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.onclick = () => {
            component.applyMeta({
                shapeType: shapeSelect.value,
                color: colorInput.value,
                width: parseInt(widthInput.value)
            });
        };
        
        panel.appendChild(shapeSelect);
        panel.appendChild(colorInput);
        panel.appendChild(widthInput);
        panel.appendChild(applyButton);
        
        return panel;
    }
}
```

## Performance Tips

1. **Static Shapes**: For shapes that don't change, avoid frequent metadata updates
2. **Color Strings**: Use hex colors (#FF0000) rather than named colors for better performance
3. **Polygon Complexity**: Keep polygon point counts reasonable for smooth rendering
4. **Batching**: Group similar shapes together when possible

## Troubleshooting

### Common Issues
- **Shape not visible**: Check if `filled` is true or if stroke is enabled
- **Wrong position**: Verify GameObject position and shape dimensions
- **Color not applying**: Ensure color format is valid (hex or rgb/rgba)
- **Metadata validation errors**: Check that all required properties are provided

### Debug Tips
```javascript
const shape = gameObject.getComponent(ShapeComponent);
console.log("Shape metadata:", shape.getDefaultMeta());
console.log("Current properties:", {
    shapeType: shape.shapeType,
    color: shape.color,
    filled: shape.filled
});
```

The ShapeComponent provides a powerful and flexible way to render geometric shapes with full metadata system integration, making it perfect for both runtime graphics and visual editor development.
