# NityJS Engine API Standards

## Summary of Corrections Made

This document outlines the correct API usage patterns for the NityJS engine after fixing multiple incorrect usages throughout the codebase.

## Corrected API Patterns

### 1. Game Initialization and Launch

**❌ INCORRECT (Old Pattern):**
```javascript
const game = new Game(canvas);
game.loadScene(scene);
game.start(); // This method does NOT exist!
```

**✅ CORRECT (Fixed Pattern):**
```javascript
const game = new Game(canvas);
game.configure({ useLayerSystem: true }); // Optional configuration
game.launch(scene); // Use launch() to start the game
```

### 2. Scene Constructor Pattern

**❌ INCORRECT (Old Pattern):**
```javascript
class GameScene extends Scene {
  async start() {
    // Scene setup
  }
}
```

**✅ CORRECT (Dual Pattern Support):**
```javascript
// Pattern 1: Constructor-based
const scene = new Scene({
  create(scene) {
    const player = new GameObject(100, 100);
    scene.add(player);
  }
});

// Pattern 2: Class extension with create method
class GameScene extends Scene {
  create(scene) {
    const player = new GameObject(100, 100);
    scene.add(player);
  }
}
const scene = new GameScene();
```

### 3. Runtime Scene Switching

**✅ CORRECT:**
```javascript
// For switching scenes during gameplay
await game.loadScene(newScene);
```

## Files Corrected

### Documentation Files
- `docs/input/Input.md` - Fixed game initialization example
- `docs/core/Game.md` - Added API clarification and quick start guide

### Test Files
- `tests/test_auto_registration.html` - Changed `game.start()` to `game.launch(scene)`
- `tests/test_dev_build.html` - Changed `game.start()` to `game.launch(scene)`  
- `tests/test_spriterenderer.html` - Changed `game.start()` to `game.launch(scene)`

### Example Files
- `examples/compatibility_test/index.js` - Fixed Scene API and game launch pattern

### Development Guidelines
- `.vscode/copilot-instructions.md` - Created comprehensive API standards document

## Key API Methods

### Game Class
- `new Game(canvas)` - Constructor
- `game.configure(options)` - Configure before launch
- `game.launch(scene)` - Start the game ⭐ **Main launch method**
- `game.loadScene(scene)` - Switch scenes during runtime
- `game.pause()` / `game.resume()` - Flow control
- `game.addToLayer()` / `game.removeFromLayer()` - Layer management
- `game.getLayerManager()` - Access layer system

### Scene Class  
- `new Scene({ create(scene) {} })` - Constructor with setup function
- `new Scene()` + override `create(scene)` method - Class extension pattern
- `scene.add(gameObject)` - Add objects to scene
- `scene.preload()` - Asset loading phase
- `scene.start()` - Initialization phase (called by engine)
- `scene.update()` - Per-frame updates
- `scene.lateUpdate()` - Post-update phase
- `scene.draw()` - Rendering phase

### GameObject Class
- `new GameObject(x, y)` - Constructor with Vector2 position
- `gameObject.addComponent(component)` - Add functionality
- `gameObject.getComponent(ComponentClass)` - Access components
- `gameObject.layer = 'layerName'` - Set rendering layer

## Browser Compatibility Notes

The engine includes comprehensive browser compatibility detection and graceful fallbacks:
- Feature detection for OffscreenCanvas, Performance API, ES6+ features
- Automatic fallbacks for unsupported features
- Console warnings with upgrade recommendations
- Polyfill roadmap for v1.1 release

## Development Standards

1. **Always use `game.launch(scene)`** - Never `game.start()`
2. **Scene constructor pattern** - Use `create(scene){}` property
3. **Layer system** - Enable via `configure()` before launch
4. **Component architecture** - Extend `Component` base class
5. **Error handling** - Validate inputs and provide clear messages
6. **Documentation** - Include working examples with proper API usage

## Verification

All examples and tests now use the correct API patterns. The Copilot instructions document ensures future development follows these standards.

### Quick Verification Command
```bash
grep -r "game\.start" . --exclude-dir=node_modules --exclude-dir=dist
```
Should only return text references, not method calls.

---

**Last Updated:** July 25, 2025  
**Status:** All incorrect API usages corrected and documented
