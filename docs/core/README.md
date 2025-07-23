# Core Documentation

Welcome to the **Core** documentation section! This is where you'll find the fundamental classes that power the NityJS game engine. These are the essential building blocks that every NityJS game uses.

## 🎯 What You'll Find Here

The core system provides the foundational architecture that makes NityJS work like Unity but in JavaScript. If you're coming from Unity, these classes will feel immediately familiar.

## 📚 Core Classes Documentation

### 🎮 Engine Foundation
- **[Game](Game.md)** - Main game engine class with lifecycle, canvas management, and game loop
- **[Scene](Scene.md)** - Scene management, object lifecycle, and game state handling
- **[Time](Time.md)** - Delta time calculations and frame-rate independent programming

### 🎯 GameObject System  
- **[GameObject](GameObject.md)** - Base entity class with Vector2 transform, rotation, and component system
- **[Component](Component.md)** - Base component class and component patterns with metadata system
- **[MonoBehaviour](MonoBehaviour.md)** - Unity-style alias for Component (exact same functionality)

### 🔧 Advanced Systems
- **[Component Metadata](ComponentMetadata.md)** - Data-driven component creation and visual editor integration
- **[Destroy System](Destroy.md)** - Unity-style GameObject destruction (Destroy, DestroyComponent, DestroyAll)

## 🚀 Quick Start Guide

If you're new to NityJS, we recommend reading the documentation in this order:

1. **[Game](Game.md)** - Understand how the game engine works
2. **[Scene](Scene.md)** - Learn about scene management
3. **[GameObject](GameObject.md)** - Master the entity system
4. **[Component](Component.md)** - Create modular functionality
5. **[Time](Time.md)** - Handle frame-rate independent logic

## 🎯 Unity Developers

These classes are designed to feel exactly like Unity:

- **Game** = Unity's **Game Manager** + **Application**
- **Scene** = Unity's **Scene** + **SceneManager**
- **GameObject** = Unity's **GameObject** (with Vector2 transform)
- **Component** = Unity's **MonoBehaviour**
- **MonoBehaviour** = Unity's **MonoBehaviour** (exact alias)
- **Destroy()** = Unity's **Destroy()** (exact API match)

## 💡 Pro Tips

- Use **MonoBehaviour** if you prefer Unity's exact naming
- The **metadata system** is perfect for building visual editors
- **Destroy functions** work exactly like Unity with deferred destruction
- All core classes integrate seamlessly with physics, rendering, and input systems

---

**Next:** Explore [Physics Components](../physics/) for movement and collision detection, or [Renderer Components](../renderer/) for visual display.
