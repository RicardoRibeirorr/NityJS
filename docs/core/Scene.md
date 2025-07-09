# Scene Class Documentation

The `Scene` class is a container that holds and manages all GameObjects in your game. It handles the lifecycle of objects and coordinates updates and rendering.

## Overview

```javascript
import { Scene, GameObject } from 'nity-engine';

const scene = new Scene({
  create(scene) {
    // Setup your scene here
  }
});
```

## Constructor

### `new Scene({ create })`

Creates a new scene with an optional creation function.

**Parameters:**
- `options` (Object)
  - `create` (Function) - Function called when the scene is loaded

**Example:**
```javascript
const scene = new Scene({
  create(scene) {
    const player = new GameObject(100, 100);
    scene.add(player);
  }
});
```

## Properties

### `objects`
- **Type:** `GameObject[]`
- **Description:** Array of all GameObjects in the scene

## Methods

### `add(obj)` ⚠️ **Deprecated**

Adds an object to the scene. Use `Instantiate.create()` instead.

**Parameters:**
- `obj` (GameObject) - The GameObject to add

**Example:**
```javascript
// Deprecated
scene.add(gameObject);

// Preferred
import { Instantiate } from 'nity-engine';
Instantiate.create(GameObject, { x: 100, y: 100 });
```

### `findByName(name)`

Finds a GameObject by its name.

**Parameters:**
- `name` (string) - The name to search for

**Returns:** `GameObject | undefined`

**Example:**
```javascript
const player = scene.findByName("Player");
if (player) {
  console.log("Found player at:", player.x, player.y);
}
```

### `findByTag(tag)`

Finds all GameObjects with a specific tag.

**Parameters:**
- `tag` (string) - The tag to search for

**Returns:** `GameObject[]`

**Example:**
```javascript
const enemies = scene.findByTag("enemy");
enemies.forEach(enemy => {
  // Do something with each enemy
  enemy.takeDamage(10);
});
```

### Lifecycle Methods

#### `preload()`
Called before the scene starts. Use for loading assets.

```javascript
const scene = new Scene({
  async create(scene) {
    // This runs during preload
    const sprite = await loadSprite('player.png');
    const player = new GameObject(100, 100);
    player.addComponent(new SpriteRendererComponent(sprite));
    scene.add(player);
  }
});
```

#### `start()`
Called after preload, when the scene becomes active.

#### `update()`
Called every frame. Override for scene-level logic.

#### `lateUpdate()`
Called after all GameObject updates. Use for cleanup or final calculations.

## Scene Creation Patterns

### Basic Scene Setup
```javascript
const gameScene = new Scene({
  create(scene) {
    // Create background
    const background = new GameObject(0, 0);
    background.addComponent(new ImageComponent('background.jpg'));
    scene.add(background);
    
    // Create player
    const player = new GameObject(400, 300);
    player.name = "Player";
    player.addComponent(new ShapeComponent(40, 40, '#ff4444'));
    player.addComponent(new RigidbodyComponent());
    scene.add(player);
    
    // Create enemies
    for (let i = 0; i < 5; i++) {
      const enemy = new GameObject(
        Math.random() * 800,
        Math.random() * 600
      );
      enemy.name = `Enemy${i}`;
      enemy.addTag("enemy");
      enemy.addComponent(new ShapeComponent(30, 30, '#444444'));
      scene.add(enemy);
    }
  }
});
```

### Scene with Custom Logic
```javascript
class GameScene extends Scene {
  constructor() {
    super({
      create: (scene) => this.createScene(scene)
    });
    this.score = 0;
    this.gameTime = 0;
  }
  
  createScene(scene) {
    // Setup scene objects
    this.createPlayer();
    this.createEnemies();
    this.createUI();
  }
  
  update() {
    // Custom scene logic
    this.gameTime += Time.deltaTime();
    
    // Spawn enemies over time
    if (this.gameTime > this.nextSpawn) {
      this.spawnEnemy();
      this.nextSpawn = this.gameTime + 2; // Every 2 seconds
    }
    
    // Check win condition
    const enemies = this.findByTag("enemy");
    if (enemies.length === 0) {
      this.onAllEnemiesDefeated();
    }
  }
  
  createPlayer() {
    const player = new GameObject(100, 100);
    player.name = "Player";
    player.addComponent(new PlayerController());
    this.add(player);
  }
  
  spawnEnemy() {
    const enemy = new GameObject(800, Math.random() * 600);
    enemy.addTag("enemy");
    enemy.addComponent(new EnemyAI());
    this.add(enemy);
  }
  
  onAllEnemiesDefeated() {
    console.log("Level complete! Score:", this.score);
  }
}
```

### Menu Scene
```javascript
const menuScene = new Scene({
  create(scene) {
    // Title
    const title = new GameObject(400, 100);
    title.addComponent(new TextComponent("My Game", { 
      fontSize: 48, 
      color: '#ffffff',
      align: 'center'
    }));
    scene.add(title);
    
    // Start button
    const startButton = new GameObject(400, 300);
    startButton.addComponent(new ButtonComponent("Start Game", {
      onClick: () => switchToGameScene()
    }));
    scene.add(startButton);
    
    // Instructions
    const instructions = new GameObject(400, 500);
    instructions.addComponent(new TextComponent(
      "Use WASD to move, Space to shoot", 
      { fontSize: 24, align: 'center' }
    ));
    scene.add(instructions);
  }
});
```

## GameObject Management

### Adding Objects
```javascript
// Method 1: In scene creation
const scene = new Scene({
  create(scene) {
    const obj = new GameObject(100, 100);
    scene.add(obj); // Deprecated but still works
  }
});

// Method 2: Using Instantiate (Recommended)
import { Instantiate } from 'nity-engine';

const scene = new Scene({
  create(scene) {
    const obj = Instantiate.create(GameObject, { x: 100, y: 100 });
    // Automatically added to current scene
  }
});
```

### Finding Objects
```javascript
// By name
const player = scene.findByName("Player");

// By tag
const enemies = scene.findByTag("enemy");
const powerups = scene.findByTag("powerup");

// By component type
const allRigidbodies = scene.objects.filter(obj => 
  obj.hasComponent(RigidbodyComponent)
);
```

### Removing Objects
```javascript
// Mark for destruction
gameObject.destroy();

// Objects are removed at end of frame
// Use GameObject.destroy(), not scene methods
```

## Scene Transitions

### Loading New Scene
```javascript
async function loadLevel2() {
  const level2Scene = new Scene({
    create: createLevel2
  });
  
  await game.loadScene(level2Scene);
}
```

### Scene Data Persistence
```javascript
class GameData {
  static score = 0;
  static level = 1;
  static playerHealth = 100;
}

const gameScene = new Scene({
  create(scene) {
    const player = new GameObject(100, 100);
    const healthComponent = player.addComponent(new HealthComponent());
    healthComponent.health = GameData.playerHealth;
    
    scene.add(player);
  }
});
```

## Best Practices

1. **Use Instantiate.create()** instead of scene.add() for new objects
2. **Name your GameObjects** for easier debugging and finding
3. **Use tags** to group related objects
4. **Keep scene creation functions focused** - break complex setups into methods
5. **Clean up resources** in lateUpdate() if needed
6. **Don't store direct object references** across scenes - use findByName() instead

## Common Patterns

### Object Pooling
```javascript
class BulletPool {
  constructor(scene, poolSize = 20) {
    this.scene = scene;
    this.pool = [];
    
    // Pre-create bullets
    for (let i = 0; i < poolSize; i++) {
      const bullet = new GameObject(-1000, -1000); // Off-screen
      bullet.addComponent(new BulletComponent());
      bullet.active = false;
      this.pool.push(bullet);
      scene.add(bullet);
    }
  }
  
  getBullet() {
    return this.pool.find(bullet => !bullet.active);
  }
  
  releaseBullet(bullet) {
    bullet.active = false;
    bullet.x = -1000;
    bullet.y = -1000;
  }
}
```

### Level System
```javascript
class LevelManager {
  static currentLevel = 1;
  
  static loadLevel(levelNumber) {
    const levelScene = new Scene({
      create: (scene) => this.createLevel(scene, levelNumber)
    });
    
    game.loadScene(levelScene);
  }
  
  static createLevel(scene, levelNumber) {
    // Load level data
    const levelData = this.getLevelData(levelNumber);
    
    // Create objects based on level data
    levelData.enemies.forEach(enemyData => {
      const enemy = new GameObject(enemyData.x, enemyData.y);
      enemy.addComponent(new EnemyComponent(enemyData.type));
      scene.add(enemy);
    });
  }
}
```
