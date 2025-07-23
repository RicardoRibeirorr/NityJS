# ImageComponent

> **Unity Equivalent:** `Image` (UI) or custom image rendering - Direct image file rendering with width/height control

The `ImageComponent` is a simple component for displaying individual image files directly. Unlike SpriteRendererComponent which works with the sprite registry system, ImageComponent loads and displays images directly from file paths.

## Constructor

```javascript
new ImageComponent(src, width, height)
```

**Parameters:**
- `src` (string) - Path to the image file
- `width` (number, optional) - Display width (defaults to image's natural width)
- `height` (number, optional) - Display height (defaults to image's natural height)

## Basic Usage

```javascript
// Natural size
gameObject.addComponent(new ImageComponent("assets/background.png"));

// Custom size
gameObject.addComponent(new ImageComponent("assets/player.png", 64, 64));

// Different aspect ratio
gameObject.addComponent(new ImageComponent("assets/banner.png", 200, 50));
```

## Methods

### Lifecycle Methods

#### `async preload()`
Loads the image file asynchronously. This is called automatically by the engine during the preload phase.

```javascript
// Manual preloading (usually not needed)
const imageComp = gameObject.getComponent(ImageComponent);
await imageComp.preload();
```

### Rendering Methods

#### `draw(ctx)`
Draws the image on the canvas with proper rotation and positioning support.

**Parameters:**
- `ctx` (CanvasRenderingContext2D) - The 2D rendering context

This method is called automatically by the renderer. It handles:
- Image positioning based on GameObject transform
- Rotation around the GameObject's center
- Proper scaling based on width/height parameters

## Properties

### Core Properties
- `src` (string) - The image file path
- `width` (number) - Display width
- `height` (number) - Display height
- `image` (HTMLImageElement) - The loaded image element
- `loaded` (boolean) - Whether the image has finished loading

## Practical Examples

### Background Image

```javascript
class GameBackground extends Component {
    start() {
        // Add a full-screen background
        const canvas = Game.instance.canvas;
        this.gameObject.addComponent(new ImageComponent(
            "assets/background.jpg",
            canvas.width,
            canvas.height
        ));
        
        // Position at screen center
        this.gameObject.position.set(canvas.width / 2, canvas.height / 2);
    }
}
```

### UI Element

```javascript
class HealthBar extends Component {
    constructor() {
        super();
        this.maxHealth = 100;
        this.currentHealth = 100;
    }
    
    start() {
        // Health bar background
        this.gameObject.addComponent(new ImageComponent(
            "assets/ui/health_bar_bg.png",
            200, 20
        ));
        
        // Position in top-left corner
        this.gameObject.position.set(110, 30);
    }
}
```

### Rotating Logo

```javascript
class RotatingLogo extends Component {
    start() {
        this.gameObject.addComponent(new ImageComponent(
            "assets/logo.png",
            100, 100
        ));
        
        this.rotationSpeed = 45; // degrees per second
    }
    
    update() {
        // Rotate the logo
        this.gameObject.rotation += this.rotationSpeed * Time.deltaTime * (Math.PI / 180);
    }
}
```

### Dynamic Image Loading

```javascript
class DynamicImageLoader extends Component {
    constructor(imagePaths) {
        super();
        this.imagePaths = imagePaths;
        this.currentIndex = 0;
        this.switchInterval = 2.0; // Switch every 2 seconds
        this.timer = 0;
    }
    
    start() {
        this.imageComponent = new ImageComponent(this.imagePaths[0], 128, 128);
        this.gameObject.addComponent(this.imageComponent);
    }
    
    update() {
        this.timer += Time.deltaTime;
        
        if (this.timer >= this.switchInterval) {
            this.timer = 0;
            this.currentIndex = (this.currentIndex + 1) % this.imagePaths.length;
            
            // Remove old component and add new one
            this.gameObject.removeComponent(ImageComponent);
            this.imageComponent = new ImageComponent(
                this.imagePaths[this.currentIndex], 
                128, 128
            );
            this.gameObject.addComponent(this.imageComponent);
        }
    }
}

// Usage
const slideshow = new GameObject("Slideshow");
slideshow.addComponent(new DynamicImageLoader([
    "assets/slide1.png",
    "assets/slide2.png", 
    "assets/slide3.png"
]));
```

## When to Use ImageComponent vs SpriteRendererComponent

### Use **ImageComponent** for:
- **Simple image display** - Individual image files
- **UI elements** - Buttons, backgrounds, frames
- **One-off graphics** - Logos, decorations, static elements
- **Dynamic image loading** - Runtime image switching
- **Backgrounds** - Level backgrounds, skyboxes

### Use **SpriteRendererComponent** for:
- **Game sprites** - Characters, enemies, items
- **Animated objects** - Sprites that change frames
- **Spritesheet graphics** - Efficient packed sprites
- **Game objects** - Interactive elements that need sprite features
- **Visual effects** - Objects with tinting, flipping, opacity effects

## Performance Considerations

### Advantages
- **Direct loading** - No sprite registry overhead
- **Simple usage** - Straightforward file-to-display workflow
- **Memory efficient** - Only loads what you use

### Limitations
- **No sprite features** - No tinting, flipping, or opacity control
- **Individual files** - Each image is a separate HTTP request
- **Less optimized** - No batching or caching like SpriteRendererComponent

### Best Practices

```javascript
// ✅ Good - Use for static backgrounds
gameObject.addComponent(new ImageComponent("assets/background.png"));

// ✅ Good - Use for UI elements
gameObject.addComponent(new ImageComponent("assets/button.png", 100, 40));

// ❌ Avoid - Use SpriteRendererComponent instead for game sprites
// gameObject.addComponent(new ImageComponent("assets/player.png"));
// Better: gameObject.addComponent(new SpriteRendererComponent("player"));
```

## Troubleshooting

### Common Issues

1. **Image not loading**: Check file path and ensure the image exists
2. **Wrong size**: Verify width/height parameters are correct
3. **Image appears blurry**: Ensure displayed size matches natural image size for pixel-perfect rendering
4. **Performance issues**: Consider using SpriteRendererComponent for frequently used images

### Debug Tips

```javascript
const imageComp = gameObject.getComponent(ImageComponent);
console.log("Image source:", imageComp.src);
console.log("Loaded:", imageComp.loaded);
console.log("Natural size:", imageComp.image?.naturalWidth, "x", imageComp.image?.naturalHeight);
console.log("Display size:", imageComp.width, "x", imageComp.height);
```

## Integration with Other Systems

ImageComponent works seamlessly with:
- **Transform System** - Respects GameObject position and rotation
- **Scene Management** - Automatic preloading during scene transitions
- **Game Loop** - Automatic rendering each frame
- **Component System** - Can be combined with other components

The ImageComponent provides a straightforward way to display images when you don't need the advanced features of the sprite system.
