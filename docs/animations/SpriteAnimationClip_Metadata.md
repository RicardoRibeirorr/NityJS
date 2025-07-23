# SpriteAnimationClip Metadata System

The `SpriteAnimationClip` class supports a comprehensive metadata system for creating, configuring, and managing animation clips declaratively.

## Basic Usage

### Creating with Metadata
```javascript
import { SpriteAnimationClip } from './src/animations/SpriteAnimationClip.js';

// Create a walking animation
const walkClip = SpriteAnimationClip.meta({
    name: "walk",
    spriteNames: ["walk_0", "walk_1", "walk_2", "walk_3"],
    fps: 8,
    loop: true
});

// Create an idle animation with minimal configuration
const idleClip = SpriteAnimationClip.meta({
    name: "idle",
    spriteNames: ["idle_0", "idle_1"]
    // fps and loop will use defaults (10, true)
});
```

### Default Metadata
```javascript
const defaults = SpriteAnimationClip.getDefaultMeta();
// Returns: { name: "", spriteNames: [], fps: 10, loop: true }
```

## Advanced Features

### Validation
The metadata system includes comprehensive validation:
```javascript
// ❌ These will throw validation errors:
SpriteAnimationClip.meta({ name: "" }); // Empty name
SpriteAnimationClip.meta({ name: "test", fps: -5 }); // Invalid FPS
SpriteAnimationClip.meta({ name: "test", spriteNames: [123] }); // Non-string sprite names
```

### Runtime Metadata Application
```javascript
const clip = new SpriteAnimationClip("original", ["sprite1"], 10, false);

// Apply new metadata
clip.applyMeta({
    name: "modified",
    fps: 15,
    loop: true,
    spriteNames: ["new1", "new2", "new3"]
});
```

### Export and Clone
```javascript
// Export to metadata object
const metadata = clip.toMeta();
console.log(metadata);
// { name: "walk", spriteNames: ["walk_0", "walk_1"], fps: 8, loop: true }

// Create independent clone
const clonedClip = clip.clone();
clonedClip.name = "run"; // Won't affect original
```

## Integration with Components

Use with `SpriteAnimationComponent`:
```javascript
// Create clips with metadata
const walkClip = SpriteAnimationClip.meta({
    name: "walk",
    spriteNames: ["player:walk_0", "player:walk_1", "player:walk_2"],
    fps: 8,
    loop: true
});

const idleClip = SpriteAnimationClip.meta({
    name: "idle", 
    spriteNames: ["player:idle_0"],
    fps: 2,
    loop: true
});

// Add to animation component
const animator = gameObject.addComponent(new SpriteAnimationComponent());
animator.addClip(walkClip);
animator.addClip(idleClip);
animator.playClip("walk");
```

## Configuration-Driven Development

Perfect for JSON-based configuration:
```javascript
const animationConfig = {
    "walk": {
        name: "walk",
        spriteNames: ["char:walk_0", "char:walk_1", "char:walk_2", "char:walk_3"],
        fps: 8,
        loop: true
    },
    "jump": {
        name: "jump",
        spriteNames: ["char:jump_0", "char:jump_1"],
        fps: 6,
        loop: false
    }
};

// Create clips from configuration
const clips = Object.values(animationConfig).map(config => 
    SpriteAnimationClip.meta(config)
);
```

## Metadata Schema

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `""` | Unique identifier for the animation clip |
| `spriteNames` | `string[]` | `[]` | Array of sprite names (supports spritesheet notation) |
| `fps` | `number` | `10` | Frames per second for animation playback |
| `loop` | `boolean` | `true` | Whether animation should loop when it reaches the end |

## Validation Rules

- **name**: Must be non-empty string
- **spriteNames**: Must be array of strings
- **fps**: Must be positive number
- **loop**: Must be boolean value

This metadata system enables declarative animation clip creation, runtime configuration, and seamless integration with visual editors and configuration systems.
