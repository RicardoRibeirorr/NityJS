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
- **[Input System](./docs/input/Input.md)** - Keyboard, mouse, events, callbacks
- **[Physics System](./docs/physics/)** - Movement, collision, gravity
- **[Rendering System](./docs/renderer/)** - Sprites, animations, shapes
- **[Asset Management](./docs/asset/)** - Loading, caching, optimization

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
import { Game, Scene, GameObject, SpriteAsset, SpritesheetAsset, SpriteRendererComponent } from './dist/nity.module.min.js';

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
    player.x = 100;
    player.y = 100;
    
    // Add sprite component (like Unity's AddComponent)
    player.addComponent(new SpriteRendererComponent("player"));
    
    // Add enemy with spritesheet animation
    const enemy = new GameObject("Enemy");
    enemy.x = 200;
    enemy.y = 100;
    enemy.addComponent(new SpriteRendererComponent("enemies", "sprite_0")); 
      height: 50, 
      color: "blue"
    }));
    
    // Add to scene (like Unity's Instantiate)
    Instantiate.create(player);
  }
});

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
- **Mobile Touch** - Touch input and gestures
- **Debug Tools** - Visual debugging and profilers

### 🌟 Future (v2.0+)
- **3D Support** - Basic 3D rendering capabilities
- **Visual Editor** - Browser-based scene editor
- **Plugin System** - Extend engine functionality
- **WebXR Support** - VR/AR game development
- **Performance Profiler** - Built-in optimization tools

## 📈 Performance & Compatibility

- **⚡ Lightweight** - ~23KB minified
- **🔧 Zero Dependencies** - Pure JavaScript
- **🌐 Universal** - Works in all modern browsers
- **📱 Mobile Ready** - Touch-optimized input
- **⚙️ Node.js Compatible** - Server-side game logic

## 📄 License

MIT License - Use it anywhere, build anything!

## 🙏 Credits

Built with ❤️ for the game development community. Inspired by Unity's elegance and the web's accessibility.

---

### 🎮 Ready to Build Your Game?

**[📖 Start with the Documentation](./docs/)** | **[🎯 Try the Examples](./examples/)** | **[🤝 Join the Project](https://github.com/yourusername/nityjs/issues)**

*"The game engine that speaks Unity, thinks JavaScript, and runs everywhere."*
