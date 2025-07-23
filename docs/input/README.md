# Input Documentation

Welcome to the **Input** documentation section! This is where you'll find everything related to handling player input in NityJS games. From keyboard to mouse to touch controls, the input system provides Unity-familiar patterns with modern web enhancements.

## 🎯 What You'll Find Here

The input system provides comprehensive input handling with Unity-style APIs plus modern web features like event callbacks and enhanced input detection.

## 📚 Input System Documentation

### 🎮 Input Handling
- **[Input](Input.md)** - Comprehensive keyboard and mouse input with events and callbacks

## 🚀 Quick Start Guide

Input handling in NityJS is designed to feel exactly like Unity:

```javascript
// Unity-style input checking
class PlayerController extends Component {
    update() {
        // Keyboard input (Unity-style)
        if (Input.isKeyDown('w')) {
            this.moveUp();
        }
        
        // Mouse input (Unity-style)
        if (Input.isLeftMouseDown()) {
            this.shoot();
        }
        
        // Get mouse position
        const mousePos = Input.getMousePosition();
        console.log(`Mouse at: ${mousePos.x}, ${mousePos.y}`);
    }
}
```

## 🎮 Unity Compatibility

The input system provides exact Unity equivalents:

| Unity Method | NityJS Equivalent | Description |
|-------------|-------------------|-------------|
| `Input.GetKeyDown()` | `Input.isKeyPressed()` | Key pressed this frame |
| `Input.GetKey()` | `Input.isKeyDown()` | Key held down |
| `Input.GetKeyUp()` | `Input.isKeyReleased()` | Key released this frame |
| `Input.GetMouseButtonDown()` | `Input.isLeftMousePressed()` | Mouse pressed this frame |
| `Input.GetMouseButton()` | `Input.isLeftMouseDown()` | Mouse held down |
| `Input.mousePosition` | `Input.getMousePosition()` | Mouse position |

## 🔧 Enhanced Features

Beyond Unity compatibility, NityJS Input provides:

### Event-Driven Input
```javascript
// Modern event-driven approach
Input.onKeyPressed('Space', () => {
    console.log("Space key pressed!");
});

Input.onMouseClick((mousePos) => {
    console.log(`Mouse clicked at: ${mousePos.x}, ${mousePos.y}`);
});
```

### Multiple Input Methods
- **Polling** - Check input state each frame (Unity-style)
- **Events** - React to input events as they happen (modern web)
- **Callbacks** - Register functions to handle specific inputs

### Advanced Input Detection
- **Key combinations** - Check multiple keys at once
- **Mouse wheel** - Scroll detection and values
- **Touch support** - Ready for mobile devices
- **Input buffering** - Handle rapid input sequences

## 💡 Pro Tips

1. **Performance**: Use events for one-time actions, polling for continuous movement
2. **Responsiveness**: Combine both polling and events for the best user experience
3. **Key Codes**: Use standard key names ('w', 'a', 's', 'd', 'Space', 'Enter')
4. **Mouse Coordinates**: Mouse position is in canvas coordinates (not screen)

## 🎮 Common Input Patterns

### Character Movement
```javascript
class MovementController extends Component {
    update() {
        const speed = 200;
        const movement = new Vector2(0, 0);
        
        // WASD movement
        if (Input.isKeyDown('w')) movement.y -= 1;
        if (Input.isKeyDown('s')) movement.y += 1;
        if (Input.isKeyDown('a')) movement.x -= 1;
        if (Input.isKeyDown('d')) movement.x += 1;
        
        // Apply movement
        if (movement.magnitude > 0) {
            movement.normalize();
            const rb = this.gameObject.getComponent(RigidbodyComponent);
            rb.velocity = movement.multiply(speed);
        }
    }
}
```

### Menu Navigation
```javascript
class MenuController extends Component {
    start() {
        // Event-driven menu controls
        Input.onKeyPressed('Enter', () => this.selectMenuItem());
        Input.onKeyPressed('Escape', () => this.closeMenu());
        
        Input.onMouseClick((pos) => this.handleMenuClick(pos));
    }
    
    selectMenuItem() {
        console.log("Menu item selected!");
    }
    
    closeMenu() {
        console.log("Menu closed!");
    }
    
    handleMenuClick(mousePos) {
        // Check which menu item was clicked
        console.log(`Menu clicked at: ${mousePos.x}, ${mousePos.y}`);
    }
}
```

### Combat System
```javascript
class CombatController extends Component {
    start() {
        // Action-based combat
        Input.onKeyPressed('Space', () => this.attack());
        Input.onKeyPressed('Shift', () => this.block());
        
        Input.onMousePressed('left', () => this.primaryAttack());
        Input.onMousePressed('right', () => this.secondaryAttack());
    }
    
    update() {
        // Continuous aiming
        const mousePos = Input.getMousePosition();
        this.aimAt(mousePos);
    }
}
```

## 🎯 Learning Path

1. **[Start with Input basics](Input.md)** - Learn Unity-style input polling
2. **Explore event system** - Add event-driven input for responsive controls
3. **Combine approaches** - Use polling for movement, events for actions
4. **Add advanced features** - Implement key combinations and complex input sequences

## 🚀 Next Steps

- **[Input Documentation](Input.md)** - Complete API reference and examples
- **[Physics Components](../physics/)** - Combine input with physics for realistic movement
- **[Component System](../core/)** - Build input-responsive game components

---

**The input system is designed to feel like Unity while providing modern web enhancements for the best of both worlds!**
