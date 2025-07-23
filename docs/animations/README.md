# Animation Documentation

Welcome to the **Animation** documentation section! This is where you'll find everything related to sprite animation in NityJS. From simple frame cycling to complex animation clips, create smooth and engaging animations for your games.

## 🎯 What You'll Find Here

The animation system provides Unity-style animation with sprite sheets, animation clips, and smooth frame transitions. Perfect for character animations, UI effects, and visual storytelling.

## 📚 Animation System Documentation

### 🎬 Animation Components
- **[SpriteAnimation](SpriteAnimation.md)** - Complete sprite animation system with clips and frame management

## 🚀 Quick Start Guide

Creating animations in NityJS is designed to feel familiar to Unity developers:

```javascript
// Create spritesheet for animation
const playerSheet = new SpritesheetAsset("player", "assets/player.png", {
    spriteWidth: 32,
    spriteHeight: 32,
    columns: 4,
    rows: 2
});

// Create animation clip
const walkAnimation = new SpriteAnimationClip("walk", [
    "player:sprite_0_0",  // Frame 1
    "player:sprite_1_0",  // Frame 2  
    "player:sprite_2_0",  // Frame 3
    "player:sprite_3_0"   // Frame 4
], {
    frameRate: 8,         // 8 frames per second
    looping: true         // Loop the animation
});

// Add animation to GameObject
const player = new GameObject("Player");
const animator = new SpriteAnimationComponent();
animator.addClip(walkAnimation);
animator.play("walk");
player.addComponent(animator);
```

## 🎮 Unity Equivalents

The animation system maps closely to Unity's animation features:

| Unity Feature | NityJS Equivalent | Description |
|--------------|-------------------|-------------|
| **Animator** | `SpriteAnimationComponent` | Manages and plays animation clips |
| **Animation Clip** | `SpriteAnimationClip` | Sequence of sprite frames |
| **Animation Controller** | Built into component | State management and transitions |
| **Frame Rate** | `frameRate` property | Frames per second control |
| **Looping** | `looping` property | Whether animation repeats |

## 🔧 Animation Features

### Animation Clips
- **Frame Sequences** - Define sprite frame order and timing
- **Frame Rate Control** - Adjust playback speed (FPS)
- **Looping Options** - Loop, play once, or ping-pong
- **Event Callbacks** - Trigger code at specific frames or completion

### Animation Control
- **Play/Pause/Stop** - Full playback control
- **Animation States** - Track current animation and frame
- **Smooth Transitions** - Blend between different animations
- **Dynamic Speed** - Change playback speed at runtime

### Integration
- **SpriteRenderer** - Works seamlessly with sprite rendering
- **Component System** - Full component lifecycle support
- **Event System** - Animation events and completion callbacks

## 💡 Common Animation Types

### Character Animations
```javascript
// Idle animation
const idleClip = new SpriteAnimationClip("idle", [
    "character:idle_0",
    "character:idle_1"
], { frameRate: 2, looping: true });

// Walking animation  
const walkClip = new SpriteAnimationClip("walk", [
    "character:walk_0",
    "character:walk_1", 
    "character:walk_2",
    "character:walk_3"
], { frameRate: 8, looping: true });

// Jump animation (one-shot)
const jumpClip = new SpriteAnimationClip("jump", [
    "character:jump_0",
    "character:jump_1",
    "character:jump_2"
], { frameRate: 12, looping: false });
```

### UI Animations
```javascript
// Button hover effect
const buttonHover = new SpriteAnimationClip("hover", [
    "ui:button_normal",
    "ui:button_glow"
], { frameRate: 4, looping: true });

// Loading spinner
const spinner = new SpriteAnimationClip("spin", [
    "ui:spinner_0", "ui:spinner_1", "ui:spinner_2", "ui:spinner_3",
    "ui:spinner_4", "ui:spinner_5", "ui:spinner_6", "ui:spinner_7"
], { frameRate: 16, looping: true });
```

### Effect Animations
```javascript
// Explosion effect
const explosion = new SpriteAnimationClip("explode", [
    "effects:explosion_0", "effects:explosion_1", "effects:explosion_2",
    "effects:explosion_3", "effects:explosion_4", "effects:explosion_5"
], { 
    frameRate: 20, 
    looping: false,
    onComplete: () => {
        // Destroy effect after animation
        Destroy(this.gameObject);
    }
});

// Power-up glow (ping-pong)
const powerGlow = new SpriteAnimationClip("glow", [
    "effects:glow_0", "effects:glow_1", "effects:glow_2"
], { frameRate: 6, looping: true, pingPong: true });
```

## 🎯 Animation Patterns

### State-Based Animation
```javascript
class CharacterAnimator extends Component {
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        this.movement = this.gameObject.getComponent(MovementController);
        
        // Set up animation clips
        this.setupAnimations();
    }
    
    update() {
        // Switch animations based on character state
        if (this.movement.isJumping) {
            this.animator.play("jump");
        } else if (this.movement.isMoving) {
            this.animator.play("walk");
        } else {
            this.animator.play("idle");
        }
    }
    
    setupAnimations() {
        // Add all character animation clips
        this.animator.addClip(this.createIdleAnimation());
        this.animator.addClip(this.createWalkAnimation());
        this.animator.addClip(this.createJumpAnimation());
    }
}
```

### Event-Driven Animation
```javascript
class AttackAnimator extends Component {
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        
        // Create attack animation with event
        const attackClip = new SpriteAnimationClip("attack", [
            "player:attack_0", "player:attack_1", "player:attack_2"
        ], {
            frameRate: 12,
            looping: false,
            onFrameEvent: (frameIndex) => {
                if (frameIndex === 1) { // Hit frame
                    this.dealDamage();
                }
            },
            onComplete: () => {
                this.returnToIdle();
            }
        });
        
        this.animator.addClip(attackClip);
    }
    
    attack() {
        this.animator.play("attack");
    }
    
    dealDamage() {
        console.log("Damage dealt!");
        // Damage logic here
    }
    
    returnToIdle() {
        this.animator.play("idle");
    }
}
```

## 🚀 Performance Tips

1. **Spritesheet Optimization** - Pack animation frames into spritesheets for better performance
2. **Frame Rate Management** - Use appropriate frame rates (8-12 FPS for most game animations)
3. **Memory Usage** - Reuse animation clips across multiple GameObjects
4. **Conditional Updates** - Only update animations when visible or active

## 🎮 Integration Examples

### With Input System
```javascript
class PlayerAnimationController extends Component {
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        
        // Input-driven animations
        Input.onKeyPressed('Space', () => {
            this.animator.play("jump");
        });
    }
    
    update() {
        // Movement-based animations
        if (Input.isKeyDown('a') || Input.isKeyDown('d')) {
            this.animator.play("walk");
        } else {
            this.animator.play("idle");
        }
    }
}
```

### With Physics System
```javascript
class PhysicsAnimationSync extends Component {
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    }
    
    update() {
        const velocity = this.rigidbody.velocity;
        
        // Sync animation with physics
        if (Math.abs(velocity.x) > 50) {
            this.animator.play("run");
        } else if (Math.abs(velocity.x) > 10) {
            this.animator.play("walk");
        } else {
            this.animator.play("idle");
        }
        
        // Adjust animation speed based on movement speed
        const speedMultiplier = Math.abs(velocity.x) / 100;
        this.animator.setSpeed(speedMultiplier);
    }
}
```

## 🎯 Learning Path

1. **[Start with SpriteAnimation](SpriteAnimation.md)** - Learn the complete animation system
2. **Create Simple Clips** - Start with basic frame cycling animations
3. **Add State Logic** - Implement state-based animation switching  
4. **Use Events** - Add animation events and callbacks
5. **Optimize Performance** - Learn best practices for smooth animations

## 🚀 Next Steps

- **[SpriteAnimation Documentation](SpriteAnimation.md)** - Complete animation system reference
- **[Renderer Components](../renderer/)** - Understanding sprite rendering for animations
- **[Asset Management](../asset/)** - Managing spritesheet assets for animations

---

**Create smooth, engaging animations that bring your games to life with Unity-familiar patterns and modern web performance!**
