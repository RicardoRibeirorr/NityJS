# 🎮 NityJS - Unity's Power in Pure JavaScript

> **"From C# to JavaScript - Same patterns, zero learning curve!"**

**The JavaScript game engine that feels like home for Unity developers.** Build 2D games with familiar GameObject-Component architecture, physics, animations, and input handling - all in vanilla JavaScript with **zero dependencies**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-green.svg)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-blue.svg)]()
[![Documentation](https://img.shields.io/badge/Docs-Complete-brightgreen.svg)](./docs/)

## 🚀 Why Choose NityJS?

### For Unity Developers
- **🎯 Instant Familiarity** - GameObject, Component, Scene... exactly what you know
- **🔄 Same Patterns** - `Start()`, `Update()`, `OnCollisionEnter()` - it's all here
- **📦 Component-Based** - Add/remove functionality just like Unity prefabs
- **🎨 Visual Scripting** - Write code the Unity way, run it in the browser

### For Web Developers  
- **⚡ Zero Dependencies** - Pure JavaScript, no libraries needed
- **📱 Cross-Platform** - Works everywhere JavaScript runs
- **🔧 Easy Integration** - Drop into any web project instantly
- **📦 Dual Distribution** - ES6 modules OR global objects

### For Everyone
- **🎓 Learn Game Development** - Perfect stepping stone into game programming
- **⚡ Rapid Prototyping** - From idea to playable in minutes
- **🏗️ Production Ready** - Stable collision system, optimized performance
- **📖 Comprehensive Docs** - Every class documented with examples

## ✨ Features That Unity Developers Will Love

```javascript
// Looks familiar? That's the point! 😊
class Player extends GameObject {
    constructor() {
        super("Player");
        
        // Add components just like Unity
        this.addComponent(new SpriteRendererComponent("player", "idle"));
        this.addComponent(new RigidbodyComponent());
        this.addComponent(new BoxColliderComponent(32, 32));
        this.addComponent(new PlayerController());
    }
}

// Unity-style Destroy system - exactly what you expect!
Destroy(player);                              // Destroy GameObject
DestroyComponent(player, RigidbodyComponent);  // Remove specific component
DestroyAll();                                 // Clear entire scene

// Metadata-driven components - ALL components support this!
const playerSprite = SpriteRendererComponent.meta({
    spriteName: "player_idle",
    width: 64,
    height: 64,
    opacity: 0.9,
    color: "#FF6B6B",
    flipX: true,
    flipY: false
});

const physics = RigidbodyComponent.meta({
    gravity: true,
    gravityScale: 400,
    bounciness: 0.2
});

const collider = BoxColliderComponent.meta({
    width: 32,
    height: 48,
    trigger: false
});

// Animation clips with metadata too!
const walkClip = SpriteAnimationClip.meta({
    name: "walk",
    spriteNames: ["player:walk_0", "player:walk_1", "player:walk_2"],
    fps: 8,
    loop: true
});

// Perfect for visual editors and JSON scene files
const componentData = {
    type: "SpriteRendererComponent",
    metadata: {
        spriteName: "enemy_walk",
        width: 48,
        height: 48,
        color: "#FF6B6B",
        opacity: 0.8
    }
};

// ALL 8 components + SpriteAnimationClip support metadata:
// SpriteRenderer, Image, Shape, Rigidbody, BoxCollider, 
// CircleCollider, SpriteAnimation, Camera + SpriteAnimationClip!

// Component - the new MonoBehavior but with more style! 😊
class PlayerController extends Component {
    start() {
        this.speed = 200;
        this.jumpForce = 400;
    }
    
    update() {
        // Input handling you already know
        if (Input.isKeyDown('Space')) {
            this.jump();
        }
        
        // Frame-rate independent movement
        const moveX = Input.isKeyDown('d') ? 1 : 0 - Input.isKeyDown('a') ? 1 : 0;
        this.rigidbody.velocity.x = moveX * this.speed;
    }
    
    onCollisionEnter(collision) {
        if (collision.gameObject.hasTag("Enemy")) {
            this.takeDamage();
        }
    }
}
```

## 🛠️ Core Systems

| System | Unity Equivalent | Status |
|--------|------------------|--------|
| **GameObject-Component** | GameObject/MonoBehaviour | ✅ Complete |
| **Unity-Style Destroy** | Destroy/DestroyImmediate | ✅ Complete |
| **Layer System** | Sorting Layers/Canvas | ✅ Complete |
| **Metadata Components** | Editor Inspector | ✅ Complete |
| **Scene Management** | Scene System | ✅ Complete |
| **Physics & Collision** | Rigidbody2D/Collider2D | ✅ Stable |
| **Input System** | Input Manager | ✅ Enhanced |
| **Sprite Animation** | Animator/Animation | ✅ Complete |
| **Asset Management** | Resources/AssetDatabase | ✅ Complete |
| **Time & Delta** | Time.deltaTime | ✅ Complete |

## 📚 Comprehensive Documentation

**Everything is documented!** From beginner tutorials to advanced patterns:

### 📖 **[Complete Documentation Hub](./docs/)**

#### 🎯 Getting Started
- **[Quick Start Guide](./docs/README.md)** - Build your first game in 5 minutes
- **[Unity Developer's Guide](./docs/index.md)** - Transition from Unity seamlessly
- **[Architecture Overview](./docs/core/Game.md)** - Understand the engine structure

#### 🔧 Core Systems
- **[Game & Scene Management](./docs/core/)** - Game loop, scenes, lifecycle
- **[GameObject & Components](./docs/core/GameObject.md)** - Entity-component architecture
- **[LayerManager](./docs/core/LayerManager.md)** - Internal OffscreenCanvas layer system for depth-based rendering
- **[Browser Compatibility](./docs/core/BrowserCompatibility.md)** - Cross-browser support, polyfills, and compatibility guidance
- **[Component Metadata System](./docs/core/ComponentMetadata.md)** - Data-driven development & visual editor integration
- **[Input System](./docs/input/Input.md)** - Keyboard, mouse, events, callbacks
- **[Physics System](./docs/physics/)** - Movement, collision, gravity
- **[Rendering System](./docs/renderer/)** - Sprites, animations, shapes
- **[Asset Management](./docs/asset/)** - Loading, caching, optimization

#### ⚡ Advanced Features
- **Universal Metadata Support** - All 8 component types + SpriteAnimationClip support metadata creation
- **JSON Scene Serialization** - Perfect for visual editors and level designers  
- **Unity-Style Validation** - Type-safe metadata with helpful error messages
- **Static Factory Methods** - Component.meta() for declarative creation
- **Runtime Metadata Application** - Update components with applyMeta()
- **Backward Compatibility** - Traditional constructors still work perfectly

#### 🎮 By Game Type
- **Platformers** - Player movement, collision, gravity
- **Puzzle Games** - Input handling, state management  
- **Action Games** - Fast collision, animations, effects
- **Physics Simulations** - Realistic movement and forces

#### 🚀 Advanced Topics
- **Performance Optimization** - Object pooling, efficient rendering
- **Architecture Patterns** - Component composition, state machines
- **Integration** - Embedding in web apps, build systems

## 🚀 Quick Start

### Build Commands
```bash
npm install
npm run build        # Build all versions (dev + prod)
npm run build:dev    # Development builds only (readable code)
npm run build:prod   # Production builds only (minified)
```

### Build Outputs
- **`dist/nity.js`** - IIFE format, non-minified (development, browser script tags)
- **`dist/nity.min.js`** - IIFE format, minified (production, browser script tags)
- **`dist/nity.module.js`** - ES6 modules, non-minified (development, modern apps)
- **`dist/nity.module.min.js`** - ES6 modules, minified (production, modern apps)

### Your First Game (Unity Style!)
```javascript
import { Game, Scene, GameObject, SpriteAsset, SpritesheetAsset, SpriteRendererComponent, ShapeComponent, Destroy } from './dist/nity.module.min.js';

// Create game (like Unity's Game window)
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Create scene (like Unity's Scene)
const gameScene = new Scene({
  create() {
    // Load assets - they register automatically!
    new SpriteAsset("player", "assets/player.png");
    new SpritesheetAsset("enemies", "assets/enemies.png", {
      spriteWidth: 32,
      spriteHeight: 32,
      columns: 4,
      rows: 2
    });

    // Create player (like Unity's GameObject)
    const player = new GameObject("Player");
    player.position.set(100, 100);
    
    // Add sprite component (like Unity's AddComponent)
    player.addComponent(new SpriteRendererComponent("player"));
    
    // Create shape with metadata (perfect for visual editors!)
    const enemy = new GameObject("Enemy");
    enemy.position.set(200, 100);
    
    // Multiple component creation methods:
    // 1. Traditional constructor
    enemy.addComponent(new ShapeComponent("circle", { radius: 25, color: "red" }));
    
    // 2. Metadata-driven (ideal for editors)
    const healthBar = ShapeComponent.meta({
        shapeType: "rectangle",
        options: {
            width: 50,
            height: 8,
            color: "#00FF00",
            filled: true
        }
    });
    
    // 3. All components support metadata factory
    const camera = CameraComponent.meta({ zoom: 1.5 });
    const animation = SpriteAnimationComponent.meta({ 
        defaultClipName: "idle", 
        autoPlay: true 
    });
    
    // 4. Animation clips with metadata
    const idleClip = SpriteAnimationClip.meta({
        name: "idle",
        spriteNames: ["player:idle_0", "player:idle_1"],
        fps: 4,
        loop: true
    });
    
    // Unity-style destruction
    setTimeout(() => {
      Destroy(enemy);  // Just like Unity!
    }, 3000);
    
    // Add to scene (like Unity's Instantiate)
    Instantiate.create(player);
    Instantiate.create(enemy);
  }
});

// Enable Layer System (like Unity's Sorting Layers)
game.configure({
    useLayerSystem: true  // Enables 3 default layers: background, default, ui
});

// Objects automatically go to 'default' layer, or set explicitly:
// background.layer = 'background';  // Background objects
// ui.layer = 'ui';                  // UI elements

// Launch game (like Unity's Play button)
game.launch(gameScene);
```

## 🎯 Examples & Demos

Explore complete game examples in the [`examples/`](./examples/) directory:

- **🏃 Basic Movement** - [`examples/basic.js`](./examples/basic.js)
- **🎮 Input Handling** - [`examples/inputs/`](./examples/inputs/)
- **⚽ Physics Systems** - [`examples/physics/`](./examples/physics/)
- **🎨 Animations** - [`examples/animation/`](./examples/animation/)
- **🕹️ Complete Games** - [`demo/flappy_bird/`](./demo/flappy_bird/)

Each example includes:
- ✅ Fully commented code
- ✅ Step-by-step explanations  
- ✅ Unity comparison notes
- ✅ Live demos (where applicable)

## 🤝 Looking for Collaborators!

**Help us make NityJS the go-to JavaScript game engine!**

### 🎯 What We Need
- **Unity Developers** - Help us perfect the Unity-like experience
- **Web Developers** - Optimize for modern web standards
- **Game Designers** - Create example games and tutorials
- **Documentation Writers** - Improve guides and examples
- **Performance Engineers** - Optimize rendering and physics
- **Community Builders** - Grow the ecosystem

### 🚀 How to Contribute
1. **⭐ Star this repo** - Show your support!
2. **🐛 Report issues** - Found a bug? Let us know!
3. **💡 Suggest features** - What would make this better?
4. **📝 Improve docs** - Help others learn faster
5. **🎮 Build games** - Show what's possible!
6. **🔧 Submit PRs** - Code contributions welcome!

### 💬 Join the Community
- **GitHub Discussions** - Share ideas and get help
- **Issue Tracker** - Report bugs and request features
- **Pull Requests** - Contribute code and documentation

## 🎯 Roadmap

### ✅ Current (v1.0)
- Complete GameObject-Component system
- Stable physics and collision
- Comprehensive input handling
- Sprite animation system
- Full documentation

### 🚧 Coming Next (v1.1)
- **Audio System** - Sound effects and music
- **Tilemap Renderer** - Efficient tile-based graphics  
- **Particle System** - Visual effects and animations
- **Raycast System** - Physics raycasting for line-of-sight and collision detection
- **Enhanced ShapeComponent** - Additional shapes like polygon, star, arrow, and custom paths
- **Browser Compatibility Polyfills** - OffscreenCanvas fallback for older browsers and mobile Safari
- **Mobile Touch** - Touch input and gestures
- **Debug Tools** - Visual debugging and profilers
- **Visual Editor** - Browser-based scene editor with metadata integration

### 🌟 Future (v2.0+)
- **3D Support** - Basic 3D rendering capabilities
- **Advanced Editor** - Full visual scripting with metadata system
- **Plugin System** - Extend engine functionality
- **WebXR Support** - VR/AR game development
- **Performance Profiler** - Built-in optimization tools

## 📈 Performance & Compatibility

- **⚡ Lightweight** - ~23KB minified
- **🔧 Zero Dependencies** - Pure JavaScript
- **🌐 Universal** - Works in all modern browsers
- **📱 Mobile Ready** - Touch-optimized input
- **⚙️ Node.js Compatible** - Server-side game logic

### Browser Support
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 16.4+ for LayerManager)
- **Mobile Browsers**: Full support on modern devices
- **Legacy Support**: Automatic fallbacks for older browsers

### Layer System Compatibility
- **OffscreenCanvas**: Chrome 69+, Firefox 105+, Safari 16.4+
- **Fallback Mode**: Graceful degradation to single canvas rendering
- **Detection**: Automatic capability detection with console warnings

## 📄 License

MIT License - Use it anywhere, build anything!

## 🙏 Credits

Built with ❤️ for the game development community. Inspired by Unity's elegance and the web's accessibility.

---

### 🎮 Ready to Build Your Game?

**[📖 Start with the Documentation](./docs/)** | **[🎯 Try the Examples](./examples/)** | **[🤝 Join the Project](https://github.com/yourusername/nityjs/issues)**

*"The game engine that speaks Unity, thinks JavaScript, and runs everywhere."*
