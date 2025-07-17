# SpriteRegistry Class

The `SpriteRegistry` class manages the unified storage of all sprites and spritesheets for the game. It provides a centralized way to access both single sprites and sprites from spritesheets using a unified key system.

## Overview

The SpriteRegistry acts as a central repository for all sprites in your game, whether they come from single `SpriteAsset` files or `SpritesheetAsset` collections. It uses a colon-separated key system to unify access:

- **Single sprites**: accessed by name (e.g., `"player"`)
- **Spritesheet sprites**: accessed by `"sheetName:spriteName"` (e.g., `"enemies:sprite_0"`)

Assets are automatically registered when created using the `SpriteAsset` or `SpritesheetAsset` constructors.

## Key Features

- **Unified Access**: Single method `getSprite()` for all sprite types
- **Auto-Registration**: Assets register themselves when created
- **Colon Notation**: Clear separation between sheet and sprite names
- **Static Methods**: No need to instantiate registry objects
- **Name Validation**: Prevents conflicts by rejecting colons in asset names

## Static Methods

### getSprite(name)

Retrieves any sprite (single or from spritesheet) using unified key system.

**Parameters:**
- `name` (string) - Sprite key: `"spriteName"` for single sprites or `"sheetName:spriteName"` for spritesheet sprites

**Returns:** `SpriteAsset|Object|null` - The sprite asset or sprite wrapper, or null if not found

**Examples:**
```javascript
// Get single sprite
const player = SpriteRegistry.getSprite("player");

// Get sprite from spritesheet
const enemy = SpriteRegistry.getSprite("enemies:sprite_0");
```

### getSpritesheet(name)

Retrieves a spritesheet asset by name.

**Parameters:**
- `name` (string) - Name of the spritesheet

**Returns:** `SpritesheetAsset|null` - The spritesheet asset or null if not found

### preloadAll()

Preloads all registered sprites and spritesheets.

**Returns:** `Promise<void>` - Promise that resolves when all assets are loaded

### hasSprite(name)

Checks if a sprite is registered using unified key system.

**Parameters:**
- `name` (string) - Sprite key to check

**Returns:** `boolean` - True if sprite exists

### hasSpritesheet(name)

Checks if a spritesheet is registered.

**Parameters:**
- `name` (string) - Name of the spritesheet

**Returns:** `boolean` - True if spritesheet exists

### getSpriteNames()

Gets all registered sprite keys (includes both single sprites and spritesheet sprites).

**Returns:** `Array<string>` - Array of all sprite keys

### getSpritesheetNames()

Gets all registered spritesheet names.

**Returns:** `Array<string>` - Array of spritesheet names

### getSpritesFromSheet(sheetName)

Gets all sprite keys from a specific spritesheet.

**Parameters:**
- `sheetName` (string) - Name of the spritesheet

**Returns:** `Array<string>` - Array of sprite keys with colon notation

### removeSprite(name)

Removes a sprite from the registry.

**Parameters:**
- `name` (string) - Sprite key to remove

**Returns:** `boolean` - True if sprite was removed

### removeSpritesheet(name)

Removes a spritesheet from the registry.

**Parameters:**
- `name` (string) - Name of the spritesheet to remove

**Returns:** `boolean` - True if spritesheet was removed

### clear()

Clears all registered sprites and spritesheets.

## Internal Methods

### _addSprite(name, spriteAsset)

**Private method** used by `SpriteAsset` and `SpritesheetAsset` constructors to register sprites.

### _addSpritesheet(name, spritesheetAsset)

**Private method** used by `SpritesheetAsset` constructor to register spritesheets.

## Usage Examples

### Basic Asset Creation and Registration

```javascript
import { SpriteAsset, SpritesheetAsset, SpriteRegistry } from 'nity-engine';

// Single sprites - automatically registered
const playerSprite = new SpriteAsset("player", "assets/player.png");
const bulletSprite = new SpriteAsset("bullet", "assets/bullet.png");

// Spritesheets - automatically registered (individual sprites accessible via colon notation)
const enemySheet = new SpritesheetAsset("enemies", "assets/enemies.png", {
    spriteWidth: 32,
    spriteHeight: 32,
    columns: 4,
    rows: 2
});

const uiSheet = new SpritesheetAsset("ui", "assets/ui.png", {
    spriteWidth: 64,
    spriteHeight: 64,
    columns: 3,
    rows: 3,
    sprites: {
        "button": { x: 0, y: 0, width: 64, height: 64 },
        "panel": { x: 64, y: 0, width: 64, height: 64 }
    }
});
```

### Unified Sprite Access

```javascript
// Access single sprites
const player = SpriteRegistry.getSprite("player");
const bullet = SpriteRegistry.getSprite("bullet");

// Access sprites from spritesheets using colon notation
const enemy1 = SpriteRegistry.getSprite("enemies:sprite_0");
const enemy2 = SpriteRegistry.getSprite("enemies:sprite_1");
const uiButton = SpriteRegistry.getSprite("ui:button");
const uiPanel = SpriteRegistry.getSprite("ui:panel");

// Check if sprites exist
if (SpriteRegistry.hasSprite("player")) {
    console.log("Player sprite is loaded!");
}

if (SpriteRegistry.hasSprite("enemies:sprite_5")) {
    console.log("Enemy sprite 5 is available!");
}
```

### Using with SpriteRendererComponent

```javascript
import { GameObject, SpriteRendererComponent } from 'nity-engine';

// Create game objects with unified sprite keys
const playerObj = new GameObject(100, 100);
playerObj.addComponent(new SpriteRendererComponent("player"));

const enemyObj = new GameObject(200, 100);
enemyObj.addComponent(new SpriteRendererComponent("enemies:sprite_0"));

// Legacy support (with deprecation warning)
const legacyObj = new GameObject(300, 100);
legacyObj.addComponent(new SpriteRendererComponent("enemies", "sprite_1"));
```

### Using with SpriteAnimationComponent

```javascript
import { SpriteAnimationComponent, SpriteAnimationClip } from 'nity-engine';

// Create animations using unified sprite keys
const animator = new SpriteAnimationComponent("walk");
animator.addClip(new SpriteAnimationClip("walk", [
    "player:walk_0",
    "player:walk_1", 
    "player:walk_2",
    "player:walk_3"
], 8, true));

animator.addClip(new SpriteAnimationClip("idle", [
    "player:idle_0",
    "player:idle_1"
], 2, true));

playerObj.addComponent(animator);
```

### Registry Management

```javascript
// Get registry information
console.log("All sprites:", SpriteRegistry.getSpriteNames());
console.log("All spritesheets:", SpriteRegistry.getSpritesheetNames());
console.log("Sprites from enemies sheet:", SpriteRegistry.getSpritesFromSheet("enemies"));

// Preload all assets
await SpriteRegistry.preloadAll();

// Remove specific sprites or sheets
SpriteRegistry.removeSprite("old_sprite");
SpriteRegistry.removeSpritesheet("unused_sheet");

// Clear everything (useful for scene transitions)
SpriteRegistry.clear();
```

### Error Handling and Validation

```javascript
try {
    // This will throw an error - colons are not allowed in asset names
    new SpriteAsset("invalid:name", "sprite.png");
} catch (error) {
    console.error("Asset name validation failed:", error.message);
}

try {
    // This will also throw an error
    new SpritesheetAsset("invalid:sheet", "sheet.png", config);
} catch (error) {
    console.error("Spritesheet name validation failed:", error.message);
}

// Safe sprite access
const sprite = SpriteRegistry.getSprite("might_not_exist");
if (sprite) {
    // Use sprite
} else {
    console.warn("Sprite not found");
}
```

### Dynamic Spritesheet Loading

```javascript
class AssetLoader {
    static async loadCharacterSprites() {
        // Create spritesheets (automatically registered)
        const warrior = new Spritesheet("warrior", "assets/characters/warrior.png", 64, 64, 8, 4);
        const mage = new Spritesheet("mage", "assets/characters/mage.png", 64, 64, 8, 4);
        const archer = new Spritesheet("archer", "assets/characters/archer.png", 64, 64, 8, 4);
        
        // Registry handles preloading automatically
        console.log("Character sprites loaded!");
    }
    
    static getCharacterSheet(characterType) {
        return Game.instance.spriteRegistry.getSheet(characterType);
    }
}
```

### Sprite Management System

```javascript
class SpriteManager {
    static init() {
        // Register all game spritesheets
        this.registerPlayerSprites();
        this.registerEnemySprites();
        this.registerEnvironmentSprites();
        this.registerUISprites();
    }
    
    static registerPlayerSprites() {
        new Spritesheet("player_warrior", "assets/player/warrior.png", 32, 32, 8, 4);
        new Spritesheet("player_mage", "assets/player/mage.png", 32, 32, 8, 4);
        new Spritesheet("player_archer", "assets/player/archer.png", 32, 32, 8, 4);
    }
    
    static registerEnemySprites() {
        new Spritesheet("goblin", "assets/enemies/goblin.png", 24, 24, 4, 2);
        new Spritesheet("orc", "assets/enemies/orc.png", 32, 32, 4, 2);
        new Spritesheet("dragon", "assets/enemies/dragon.png", 128, 128, 6, 3);
    }
    
    static registerEnvironmentSprites() {
        new Spritesheet("tileset_dungeon", "assets/tiles/dungeon.png", 32, 32, 16, 16);
        new Spritesheet("tileset_forest", "assets/tiles/forest.png", 32, 32, 16, 16);
        new Spritesheet("objects", "assets/objects/items.png", 32, 32, 8, 8);
    }
    
    static registerUISprites() {
        new Spritesheet("ui_buttons", "assets/ui/buttons.png", 128, 32, 3, 2);
        new Spritesheet("ui_icons", "assets/ui/icons.png", 32, 32, 8, 8);
        new Spritesheet("ui_panels", "assets/ui/panels.png", 256, 256, 2, 2);
    }
    
    static getPlayerSheet(playerClass) {
        return Game.instance.spriteRegistry.getSheet(`player_${playerClass}`);
    }
    
    static getEnemySheet(enemyType) {
        return Game.instance.spriteRegistry.getSheet(enemyType);
    }
}

// Initialize in your scene
class GameScene extends Scene {
    constructor() {
        super({
            create: () => {
                SpriteManager.init();
            }
        });
    }
}
```

### Asset Validation

```javascript
class AssetValidator {
    static validateSprites() {
        const registry = Game.instance.spriteRegistry;
        const requiredSprites = [
            "player", "enemy", "ui", "tileset", "effects"
        ];
        
        const missing = [];
        for (const spriteName of requiredSprites) {
            if (!registry.getSheet(spriteName)) {
                missing.push(spriteName);
            }
        }
        
        if (missing.length > 0) {
            console.error("Missing required spritesheets:", missing);
            return false;
        }
        
        console.log("All required spritesheets loaded successfully!");
        return true;
    }
}
```

### Loading Progress Tracking

```javascript
class LoadingManager {
    static trackSpritesheetLoading() {
        const registry = Game.instance.spriteRegistry;
        const totalSheets = registry.sheets.size;
        let loadedSheets = 0;
        
        // Override the preload method to track progress
        const originalPreload = registry.preload.bind(registry);
        registry.preload = async function() {
            const promises = [];
            
            for (const sheet of this.sheets.values()) {
                const promise = sheet.load().then(() => {
                    loadedSheets++;
                    const progress = (loadedSheets / totalSheets) * 100;
                    LoadingManager.updateProgress(progress, sheet.name);
                });
                promises.push(promise);
            }
            
            return Promise.all(promises);
        };
    }
    
    static updateProgress(percentage, currentAsset) {
        console.log(`Loading: ${percentage.toFixed(1)}% - ${currentAsset}`);
        // Update loading bar UI here
    }
}
```

## Best Practices

1. **Organize by category** - Use descriptive names like "player_warrior", "tileset_dungeon"
2. **Consistent naming** - Use a naming convention throughout your project
3. **Validate assets** - Check that required spritesheets are loaded before game starts
4. **Group related sprites** - Put related sprites in the same spritesheet for efficiency
5. **Handle missing assets** - Provide fallbacks or error handling for missing spritesheets

## Common Patterns

### Sprite Factory Pattern

```javascript
class SpriteFactory {
    static createSprite(category, type, spriteName) {
        const sheetName = `${category}_${type}`;
        const sheet = Game.instance.spriteRegistry.getSheet(sheetName);
        
        if (!sheet) {
            console.error(`Spritesheet not found: ${sheetName}`);
            return null;
        }
        
        return sheet.getSprite(spriteName);
    }
    
    static createPlayerSprite(playerClass, spriteName) {
        return this.createSprite("player", playerClass, spriteName);
    }
    
    static createEnemySprite(enemyType, spriteName) {
        return this.createSprite("enemy", enemyType, spriteName);
    }
}
```

### Asset Bundles

```javascript
class AssetBundle {
    constructor(name, spritesheets) {
        this.name = name;
        this.spritesheets = spritesheets;
        this.loaded = false;
    }
    
    async load() {
        for (const config of this.spritesheets) {
            new Spritesheet(config.name, config.src, config.frameWidth, config.frameHeight, config.cols, config.rows);
        }
        this.loaded = true;
    }
    
    unload() {
        // Remove spritesheets from registry if needed
        const registry = Game.instance.spriteRegistry;
        for (const config of this.spritesheets) {
            registry.sheets.delete(config.name);
        }
        this.loaded = false;
    }
}

// Usage
const levelOneBundle = new AssetBundle("level1", [
    { name: "level1_tiles", src: "assets/level1/tiles.png", frameWidth: 32, frameHeight: 32, cols: 8, rows: 8 },
    { name: "level1_enemies", src: "assets/level1/enemies.png", frameWidth: 24, frameHeight: 24, cols: 4, rows: 3 }
]);
```

## Integration with Game Loop

The SpriteRegistry is automatically integrated into the game's preload phase:

```javascript
// In Game.js, the registry is used like this:
async preload() {
    await this.spriteRegistry.preload(); // Loads all registered spritesheets
    // ... other preload operations
}
```

## Related Classes

- [Spritesheet](Sprite.md) - Individual spritesheets managed by the registry
- [Game](../core/Game.md) - Contains the sprite registry instance
- [SpriteRendererComponent](../renderer/SpriteRendererComponent.md) - Uses sprites from the registry
