# Physics Documentation

Welcome to the **Physics** documentation section! This is where you'll find all the components that handle movement, collision detection, and physics simulation in NityJS.

## 🎯 What You'll Find Here

The physics system provides Unity-style collision detection and physics-based movement. All components include visual gizmos for debugging and work together seamlessly to create realistic game physics.

## 📚 Physics Components Documentation

### 🏃 Movement & Forces
- **[RigidbodyComponent](RigidbodyComponent.md)** - Physics-based movement with velocity and mass
- **[GravityComponent](GravityComponent.md)** - Gravity simulation and gravitational effects

### 🎯 Collision Detection
- **[BoxColliderComponent](BoxColliderComponent.md)** - Rectangle collision detection with precise edge handling
- **[CircleColliderComponent](CircleColliderComponent.md)** - Circle collision detection for round objects

## 🚀 Quick Start Guide

For physics-based games, we recommend this learning path:

1. **[RigidbodyComponent](RigidbodyComponent.md)** - Start with basic physics movement
2. **[BoxColliderComponent](BoxColliderComponent.md)** - Add collision detection
3. **[CircleColliderComponent](CircleColliderComponent.md)** - Learn about different collision shapes
4. **[GravityComponent](GravityComponent.md)** - Add realistic gravity effects

## 🎮 Common Physics Patterns

### Basic Physics Setup
```javascript
// Create a physics-enabled GameObject
const player = new GameObject("Player");
player.addComponent(new RigidbodyComponent());
player.addComponent(new BoxColliderComponent(32, 48));

// Add movement
const playerMovement = new class extends Component {
    update() {
        const rb = this.gameObject.getComponent(RigidbodyComponent);
        if (Input.isKeyDown('d')) rb.velocity.x = 200;
        if (Input.isKeyDown('a')) rb.velocity.x = -200;
    }
};
player.addComponent(playerMovement);
```

### Collision Detection
```javascript
// Detect collisions with other objects
class CollisionHandler extends Component {
    onCollisionEnter(collision) {
        console.log(`Hit ${collision.gameObject.name}`);
    }
    
    onTriggerEnter(trigger) {
        console.log(`Entered trigger zone`);
    }
}
```

## 🎯 Unity Developers

The physics system is designed to feel like Unity's 2D physics:

- **RigidbodyComponent** = Unity's **Rigidbody2D**
- **BoxColliderComponent** = Unity's **BoxCollider2D**  
- **CircleColliderComponent** = Unity's **CircleCollider2D**
- **Collision Events** = Unity's **OnCollisionEnter**, **OnTriggerEnter**
- **Physics Properties** = Unity's **mass**, **velocity**, **drag**

## 🔧 Physics Features

### Collision System
- **Precise Detection** - Pixel-perfect collision detection
- **Multiple Shapes** - Box and circle colliders with more coming
- **Trigger Zones** - Non-solid collision areas for pickups and zones
- **Collision Events** - `onCollisionEnter`, `onCollisionExit`, `onTriggerEnter`, `onTriggerExit`

### Physics Simulation
- **Velocity-Based** - Smooth, predictable movement
- **Mass System** - Realistic physics interactions
- **Gravity Effects** - Customizable gravity for each object
- **Performance Optimized** - Efficient collision detection algorithms

### Visual Debugging
- **Collision Gizmos** - See collision boundaries in real-time
- **Physics Visualization** - Velocity vectors and force indicators
- **Debug Colors** - Green for colliders, blue for triggers, red for collisions

## 💡 Pro Tips

- **Performance**: Use `BoxColliderComponent` for most objects, `CircleColliderComponent` for round objects
- **Triggers**: Set `isTrigger: true` for non-solid collision zones (pickups, damage areas)
- **Debugging**: Enable gizmos to visualize collision boundaries during development
- **Optimization**: Group static objects and use efficient collision shapes

## 🎮 Example Games

Perfect for building:
- **Platformers** - Player movement with gravity and platform collision
- **Top-Down Games** - Character movement with obstacle collision
- **Physics Puzzles** - Objects that interact realistically
- **Action Games** - Fast collision detection for bullets and enemies

---

**Next:** Explore [Renderer Components](../renderer/) for visual display, or [Input System](../input/) for player controls.
