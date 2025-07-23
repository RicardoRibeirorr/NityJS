# Animation System Classes

The animation system in NityJS consists of two main classes that work together to provide sprite-based animations: `SpriteAnimationClip` and `SpriteAnimationComponent`. Both classes support comprehensive metadata functionality for declarative creation and configuration.

## Overview

- **SpriteAnimationClip**: Defines an animation sequence using sprite names from a spritesheet with full metadata support
- **SpriteAnimationComponent**: Manages and plays animation clips on GameObjects with metadata configuration

## SpriteAnimationClip Class

### Traditional Constructor

```javascript
new SpriteAnimationClip(name, spriteNames, fps, loop)
```

**Parameters:**
- `name` (string) - Unique identifier for the animation clip
- `spriteNames` (string[], default: []) - Array of sprite names for the animation sequence
- `fps` (number, default: 10) - Frames per second for playback
- `loop` (boolean, default: true) - Whether to loop when reaching the end

### Metadata Creation

```javascript
const walkClip = SpriteAnimationClip.meta({
    name: "walk",
    spriteNames: ["player:walk_0", "player:walk_1", "player:walk_2", "player:walk_3"],
    fps: 8,
    loop: true
});
```

### Metadata Methods

#### `static meta(metadata)`
Creates a SpriteAnimationClip from metadata configuration.

**Metadata Properties:**
- `name` (string, required) - Unique identifier for the animation clip
- `spriteNames` (string[], default: []) - Array of sprite names that make up the animation sequence
- `fps` (number, default: 10) - Frames per second for the animation playback  
- `loop` (boolean, default: true) - Whether the animation should loop when it reaches the end

#### `static getDefaultMeta()`
Returns default metadata configuration:
```javascript
{
    name: "",
    spriteNames: [],
    fps: 10,
    loop: true
}
```

#### `applyMeta(metadata)`
Applies metadata to existing SpriteAnimationClip instance with validation.

#### `toMeta()`
Exports current clip configuration as metadata object for serialization.

#### `clone()`
Creates an independent copy of the animation clip.

### Validation Rules
- **name**: Must be non-empty string
- **spriteNames**: Must be array of strings
- **fps**: Must be positive number
- **loop**: Must be boolean

### Properties

- `name` - The clip's unique identifier
- `spriteNames` - Array of sprite names in sequence
- `fps` - Playback speed in frames per second
- `loop` - Loop behavior

## SpriteAnimationComponent Class

### Traditional Constructor

```javascript
new SpriteAnimationComponent(sheetName, defaultClipName)
```

**Parameters:**
- `sheetName` (string) - Name of the spritesheet to use
- `defaultClipName` (string, optional) - Default clip to play on start

### Metadata Creation

```javascript
const animator = SpriteAnimationComponent.meta({
    defaultClipName: "idle",
    autoPlay: true
});
```

### Metadata Methods

#### `static meta(metadata)`
Creates a SpriteAnimationComponent from metadata configuration.

**Metadata Properties:**
- `defaultClipName` (string, default: null) - Default animation clip name to play on start
- `autoPlay` (boolean, default: true) - Whether to automatically play the default clip

#### `static getDefaultMeta()`
Returns default metadata configuration:
```javascript
{
    defaultClipName: null,
    autoPlay: true
}
```

### Properties

- `autoPlay` (boolean) - Whether to automatically play the default clip
- `currentClip` - Currently playing animation clip
- `currentFrame` - Current frame index in the animation

### Methods

#### addClip(clip)
Adds an animation clip to the component.

#### play(name)
Plays the specified animation clip by name.

## Usage Examples

### Basic Character Animation

```javascript
import { SpriteAnimationClip } from './src/animations/SpriteAnimationClip.js';
import { SpriteAnimationComponent } from './src/animations/components/SpriteAnimationComponent.js';
import { SpriteRendererComponent } from './src/renderer/components/SpriteRendererComponent.js';

// Create spritesheet
const characterSheet = new Spritesheet("character", "assets/character.png", 64, 64, 8, 4);

// Create animation clips
const idleClip = new SpriteAnimationClip("idle", [
    "sprite_0_0", "sprite_1_0", "sprite_2_0", "sprite_3_0"
], 4, true);

const walkClip = new SpriteAnimationClip("walk", [
// ===== METADATA-DRIVEN ANIMATION CREATION =====

// Create animation clips with metadata (recommended)
const idleClip = SpriteAnimationClip.meta({
    name: "idle",
    spriteNames: ["sprite_0_0", "sprite_1_0"],
    fps: 2,
    loop: true
});

const walkClip = SpriteAnimationClip.meta({
    name: "walk",
    spriteNames: [
        "sprite_0_1", "sprite_1_1", "sprite_2_1", "sprite_3_1", 
        "sprite_4_1", "sprite_5_1", "sprite_6_1", "sprite_7_1"
    ],
    fps: 8,
    loop: true
});

const jumpClip = SpriteAnimationClip.meta({
    name: "jump",
    spriteNames: ["sprite_0_2", "sprite_1_2", "sprite_2_2"],
    fps: 12,
    loop: false
});

// Create animation component with metadata
const animator = SpriteAnimationComponent.meta({
    defaultClipName: "idle",
    autoPlay: true
});

// ===== TRADITIONAL CREATION (still supported) =====

// Traditional animation clips
const idleClipTraditional = new SpriteAnimationClip("idle", [
    "sprite_0_0", "sprite_1_0"
], 2, true);

const walkClipTraditional = new SpriteAnimationClip("walk", [
    "sprite_0_1", "sprite_1_1", "sprite_2_1", "sprite_3_1", 
    "sprite_4_1", "sprite_5_1", "sprite_6_1", "sprite_7_1"
], 8, true);

// Create animated character with metadata
class AnimatedCharacter extends GameObject {
    constructor() {
        super("Character");
        
        // Add sprite renderer with metadata
        const renderer = SpriteRendererComponent.meta({
            spriteName: "character:sprite_0_0",
            width: 64,
            height: 64
        });
        this.addComponent(renderer);
        
        // Add animation component with metadata
        const animator = SpriteAnimationComponent.meta({
            defaultClipName: "idle",
            autoPlay: true
        });
        
        // Add clips created with metadata
        animator.addClip(idleClip);
        animator.addClip(walkClip);
        animator.addClip(jumpClip);
        
        this.addComponent(animator);
    }
}
```

### State-Based Animation Controller

```javascript
class CharacterAnimationController extends Component {
    constructor() {
        super();
        this.state = "idle";
        this.animator = null;
    }
    
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        this.setupAnimations();
    }
    
    setupAnimations() {
        // Create different animation clips with metadata
        const idle = SpriteAnimationClip.meta({
            name: "idle", 
            spriteNames: ["sprite_0_0", "sprite_1_0"], 
            fps: 2, 
            loop: true
        });
        
        const walk = SpriteAnimationClip.meta({
            name: "walk", 
            spriteNames: ["sprite_0_1", "sprite_1_1", "sprite_2_1", "sprite_3_1"], 
            fps: 8, 
            loop: true
        });
        
        const run = SpriteAnimationClip.meta({
            name: "run", 
            spriteNames: ["sprite_0_2", "sprite_1_2", "sprite_2_2", "sprite_3_2"], 
            fps: 12, 
            loop: true
        });
        
        const attack = SpriteAnimationClip.meta({
            name: "attack", 
            spriteNames: ["sprite_0_3", "sprite_1_3", "sprite_2_3"], 
            fps: 15, 
            loop: false
        });
        
        this.animator.addClip(idle);
        this.animator.addClip(walk);
        this.animator.addClip(run);
        this.animator.addClip(attack);
    }
    
    update() {
        this.updateAnimationState();
    }
    
    updateAnimationState() {
        const newState = this.determineState();
        
        if (newState !== this.state) {
            this.state = newState;
            this.animator.play(this.state);
        }
    }
    
    determineState() {
        if (Input.isKeyDown('Space')) {
            return "attack";
        }
        
        const isMoving = Input.isKeyDown('ArrowLeft') || 
                        Input.isKeyDown('ArrowRight') || 
                        Input.isKeyDown('ArrowUp') || 
                        Input.isKeyDown('ArrowDown');
        
        if (isMoving) {
            return Input.isKeyDown('Shift') ? "run" : "walk";
        }
        
        return "idle";
    }
}
```

### Directional Animation System

```javascript
class DirectionalAnimationController extends Component {
    constructor() {
        super();
        this.direction = "down"; // down, up, left, right
        this.state = "idle";
        this.animator = null;
    }
    
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        this.setupDirectionalAnimations();
    }
    
    setupDirectionalAnimations() {
        // Idle animations for each direction
        this.animator.addClip(new SpriteAnimationClip("idle_down", ["sprite_0_0"], 1, true));
        this.animator.addClip(new SpriteAnimationClip("idle_up", ["sprite_0_1"], 1, true));
        this.animator.addClip(new SpriteAnimationClip("idle_left", ["sprite_0_2"], 1, true));
        this.animator.addClip(new SpriteAnimationClip("idle_right", ["sprite_0_3"], 1, true));
        
        // Walk animations for each direction
        this.animator.addClip(new SpriteAnimationClip("walk_down", 
            ["sprite_0_0", "sprite_1_0", "sprite_2_0", "sprite_3_0"], 8, true));
        this.animator.addClip(new SpriteAnimationClip("walk_up", 
            ["sprite_0_1", "sprite_1_1", "sprite_2_1", "sprite_3_1"], 8, true));
        this.animator.addClip(new SpriteAnimationClip("walk_left", 
            ["sprite_0_2", "sprite_1_2", "sprite_2_2", "sprite_3_2"], 8, true));
        this.animator.addClip(new SpriteAnimationClip("walk_right", 
            ["sprite_0_3", "sprite_1_3", "sprite_2_3", "sprite_3_3"], 8, true));
    }
    
    update() {
        this.updateDirection();
        this.updateAnimation();
    }
    
    updateDirection() {
        if (Input.isKeyDown('ArrowDown')) this.direction = "down";
        else if (Input.isKeyDown('ArrowUp')) this.direction = "up";
        else if (Input.isKeyDown('ArrowLeft')) this.direction = "left";
        else if (Input.isKeyDown('ArrowRight')) this.direction = "right";
    }
    
    updateAnimation() {
        const isMoving = Input.isKeyDown('ArrowLeft') || 
                        Input.isKeyDown('ArrowRight') || 
                        Input.isKeyDown('ArrowUp') || 
                        Input.isKeyDown('ArrowDown');
        
        const newState = isMoving ? "walk" : "idle";
        const animationName = `${newState}_${this.direction}`;
        
        this.animator.play(animationName);
    }
}
```

### Animation Event System

```javascript
class AnimationEventHandler extends Component {
    constructor() {
        super();
        this.animator = null;
        this.previousFrame = -1;
        this.animationEvents = new Map();
    }
    
    start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        this.setupEvents();
    }
    
    setupEvents() {
        // Define events for specific animations and frames
        this.animationEvents.set("attack", new Map([
            [1, () => this.onAttackStart()],
            [2, () => this.onAttackHit()],
            [3, () => this.onAttackEnd()]
        ]));
        
        this.animationEvents.set("jump", new Map([
            [0, () => this.onJumpStart()],
            [2, () => this.onJumpLand()]
        ]));
    }
    
    update() {
        if (!this.animator.currentClip) return;
        
        const currentFrame = this.animator.currentFrame;
        const clipName = this.animator.currentClip.name;
        
        // Check if frame changed
        if (currentFrame !== this.previousFrame) {
            this.triggerFrameEvents(clipName, currentFrame);
            this.previousFrame = currentFrame;
        }
    }
    
    triggerFrameEvents(clipName, frame) {
        const clipEvents = this.animationEvents.get(clipName);
        if (clipEvents && clipEvents.has(frame)) {
            clipEvents.get(frame)();
        }
    }
    
    onAttackStart() {
        console.log("Attack started!");
    }
    
    onAttackHit() {
        console.log("Attack hit!");
        // Deal damage, check collisions, etc.
    }
    
    onAttackEnd() {
        console.log("Attack ended!");
    }
    
    onJumpStart() {
        console.log("Jump started!");
    }
    
    onJumpLand() {
        console.log("Landed!");
    }
}
```

### Dynamic Animation Loading

```javascript
class DynamicAnimator extends Component {
    constructor(characterType) {
        super();
        this.characterType = characterType;
        this.animator = null;
        this.animationConfigs = null;
    }
    
    async start() {
        this.animator = this.gameObject.getComponent(SpriteAnimationComponent);
        await this.loadAnimationConfigs();
        this.createAnimationsFromConfig();
    }
    
    async loadAnimationConfigs() {
        // Load animation configuration from JSON file
        const response = await fetch(`assets/animations/${this.characterType}.json`);
        this.animationConfigs = await response.json();
    }
    
    createAnimationsFromConfig() {
        for (const config of this.animationConfigs.animations) {
            const clip = new SpriteAnimationClip(
                config.name,
                config.frames,
                config.fps,
                config.loop
            );
            this.animator.addClip(clip);
        }
        
        // Play default animation
        if (this.animationConfigs.defaultAnimation) {
            this.animator.play(this.animationConfigs.defaultAnimation);
        }
    }
}

// Example JSON configuration file (warrior.json):
/*
{
    "defaultAnimation": "idle",
    "animations": [
        {
            "name": "idle",
            "frames": ["sprite_0_0", "sprite_1_0", "sprite_2_0"],
            "fps": 4,
            "loop": true
        },
        {
            "name": "walk",
            "frames": ["sprite_0_1", "sprite_1_1", "sprite_2_1", "sprite_3_1"],
            "fps": 8,
            "loop": true
        },
        {
            "name": "attack",
            "frames": ["sprite_0_2", "sprite_1_2", "sprite_2_2"],
            "fps": 12,
            "loop": false
        }
    ]
}
*/
```

## Best Practices

1. **Consistent frame rates** - Use appropriate FPS for different animation types (idle: 2-4, walk: 6-8, attack: 12-15)
2. **Meaningful names** - Use descriptive names for animations ("walk_left", "attack_sword")
3. **Loop vs. one-shot** - Use looping for continuous actions, non-looping for events
4. **Frame events** - Add events for important animation frames (hit frames, sound cues)
5. **State management** - Use state machines for complex animation logic

## Common Patterns

### Animation Blending (Smooth Transitions)

```javascript
class BlendedAnimator extends Component {
    constructor() {
        super();
        this.targetAnimation = null;
        this.blendDuration = 0.2; // seconds
        this.blendTime = 0;
        this.isBlending = false;
    }
    
    smoothTransitionTo(animationName) {
        if (this.animator.currentClip?.name === animationName) return;
        
        this.targetAnimation = animationName;
        this.blendTime = 0;
        this.isBlending = true;
    }
    
    update() {
        if (this.isBlending) {
            this.blendTime += Time.deltaTime();
            
            if (this.blendTime >= this.blendDuration) {
                this.animator.play(this.targetAnimation);
                this.isBlending = false;
            }
        }
    }
}
```

## Related Classes

- [SpriteRendererComponent](../renderer/SpriteRendererComponent.md) - Required for displaying animated sprites
- [Spritesheet](../renderer/Sprite.md) - Source of sprite frames for animations
- [Time](../core/Time.md) - Used for animation timing
- [Component](../core/Component.md) - Base class for animation components
