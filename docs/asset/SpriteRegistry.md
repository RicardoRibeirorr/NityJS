# SpriteRegistry Class

The `SpriteRegistry` class manages the loading and storage of spritesheets for the game. It provides a centralized way to register spritesheets and preload them before the game starts.

## Overview

The SpriteRegistry acts as a central repository for all spritesheets in your game. It automatically handles the registration of spritesheets when they are created and provides methods to retrieve them by name throughout your game.

## Methods

### add(sheet)

Adds a spritesheet to the registry. This is automatically called when creating a new Spritesheet.

**Parameters:**
- `sheet` (Spritesheet) - The spritesheet to add

### async preload()

Preloads all registered spritesheets. This method is called during the game's preload phase.

**Returns:** `Promise<void>` - Promise that resolves when all spritesheets are loaded

### getSheet(name)

Retrieves a spritesheet by name.

**Parameters:**
- `name` (string) - The name of the spritesheet

**Returns:** `Spritesheet` - The requested spritesheet

## Usage Examples

### Basic Usage

```javascript
import { Spritesheet } from './src/renderer/Spritesheet.js';
import { Game } from './src/core/Game.js';

// Spritesheets are automatically registered when created
const playerSheet = new Spritesheet("player", "assets/player.png", 32, 32, 4, 2);
const enemySheet = new Spritesheet("enemy", "assets/enemy.png", 24, 24, 3, 3);
const uiSheet = new Spritesheet("ui", "assets/ui.png", 64, 64, 2, 2);

// Later, retrieve spritesheets by name
const registry = Game.instance.spriteRegistry;
const playerSprites = registry.getSheet("player");
const enemySprites = registry.getSheet("enemy");
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
