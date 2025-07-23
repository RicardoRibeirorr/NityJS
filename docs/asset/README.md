# Asset Documentation

Welcome to the **Asset** documentation section! This is where you'll find everything related to loading, managing, and organizing game assets in NityJS. From individual sprites to complex spritesheets, master the unified asset system.

## 🎯 What You'll Find Here

The asset system provides Unity-style asset management with modern web loading capabilities. All assets are centrally managed through the SpriteRegistry with automatic caching and unified access patterns.

## 📚 Asset Management Documentation

### 🗃️ Asset System
- **[SpriteRegistry](SpriteRegistry.md)** - Centralized sprite loading, caching, and unified access with colon notation

## 🚀 Quick Start Guide

The asset system is designed to be simple yet powerful:

```javascript
// Load individual sprite
new SpriteAsset("player", "assets/player.png");

// Load spritesheet
new SpritesheetAsset("enemies", "assets/enemies.png", {
    spriteWidth: 32,
    spriteHeight: 32,
    columns: 4,
    rows: 2
});

// Use assets with unified notation
gameObject.addComponent(new SpriteRendererComponent("player"));          // Individual sprite
gameObject.addComponent(new SpriteRendererComponent("enemies:sprite_0_0")); // Spritesheet sprite
```

## 🎮 Unity Equivalents

The asset system provides Unity-familiar workflows:

| Unity Feature | NityJS Equivalent | Description |
|--------------|-------------------|-------------|
| **Resources.Load()** | `SpriteAsset` | Load individual assets |
| **Texture2D** | `SpriteAsset` | Individual sprite files |
| **Sprite Atlas** | `SpritesheetAsset` | Packed sprite collections |
| **AssetDatabase** | `SpriteRegistry` | Central asset management |
| **Asset References** | Colon notation | Unified asset access |

## 🔧 Asset System Features

### Unified Access
- **Colon Notation** - Access sprites with "sheet:sprite" syntax
- **Automatic Registration** - Assets register themselves on creation
- **Centralized Management** - All assets managed through SpriteRegistry
- **Error Handling** - Graceful handling of missing assets

### Loading and Caching
- **Automatic Preloading** - Assets load during scene preload phase
- **Smart Caching** - Efficient memory usage with asset reuse
- **Async Loading** - Non-blocking asset loading
- **Load Progress** - Track loading progress for loading screens

### Spritesheet Support
- **Grid-Based** - Define sprites by grid position
- **Pixel-Based** - Define sprites by exact pixel coordinates
- **Dual Methods** - Both grid and pixel methods available
- **Flexible Naming** - Custom sprite naming schemes

## 💡 Asset Organization Patterns

### Individual Sprites
```javascript
// Character sprites
new SpriteAsset("player_idle", "assets/characters/player_idle.png");
new SpriteAsset("player_walk", "assets/characters/player_walk.png");
new SpriteAsset("player_jump", "assets/characters/player_jump.png");

// UI elements
new SpriteAsset("button_normal", "assets/ui/button_normal.png");
new SpriteAsset("button_hover", "assets/ui/button_hover.png");
new SpriteAsset("health_bar", "assets/ui/health_bar.png");

// Use individual sprites
gameObject.addComponent(new SpriteRendererComponent("player_idle"));
```

### Spritesheets (Recommended)
```javascript
// Character spritesheet
new SpritesheetAsset("player", "assets/player_sheet.png", {
    spriteWidth: 32,
    spriteHeight: 32,
    columns: 8,
    rows: 4
});

// UI spritesheet
new SpritesheetAsset("ui", "assets/ui_sheet.png", {
    spriteWidth: 64,
    spriteHeight: 32,
    columns: 4,
    rows: 2
});

// Use spritesheet sprites
gameObject.addComponent(new SpriteRendererComponent("player:sprite_0_0"));
gameObject.addComponent(new SpriteRendererComponent("ui:sprite_1_0"));
```

### Custom Sprite Definitions
```javascript
// Define specific sprite regions
const characterSheet = new SpritesheetAsset("characters", "assets/characters.png");

// Add named sprites with pixel coordinates
characterSheet.addSprite("hero_idle", 0, 0, 32, 32);
characterSheet.addSprite("hero_walk_1", 32, 0, 32, 32);
characterSheet.addSprite("hero_walk_2", 64, 0, 32, 32);
characterSheet.addSprite("hero_jump", 96, 0, 32, 32);

// Use named sprites
gameObject.addComponent(new SpriteRendererComponent("characters:hero_idle"));
gameObject.addComponent(new SpriteRendererComponent("characters:hero_walk_1"));
```

## 🎯 Asset Loading Strategies

### Preload Everything (Small Games)
```javascript
class AssetLoader {
    static loadAllAssets() {
        // Characters
        new SpritesheetAsset("player", "assets/player.png", {
            spriteWidth: 32, spriteHeight: 32, columns: 4, rows: 2
        });
        
        // Enemies
        new SpritesheetAsset("enemies", "assets/enemies.png", {
            spriteWidth: 32, spriteHeight: 32, columns: 8, rows: 4
        });
        
        // UI
        new SpritesheetAsset("ui", "assets/ui.png", {
            spriteWidth: 64, spriteHeight: 32, columns: 4, rows: 2
        });
        
        // Effects
        new SpritesheetAsset("effects", "assets/effects.png", {
            spriteWidth: 48, spriteHeight: 48, columns: 6, rows: 3
        });
    }
}

// Load all assets at game start
AssetLoader.loadAllAssets();
```

### Lazy Loading (Large Games)
```javascript
class LevelAssetManager {
    static async loadLevelAssets(levelName) {
        switch(levelName) {
            case "forest":
                new SpritesheetAsset("forest_tiles", "assets/levels/forest_tiles.png", {
                    spriteWidth: 32, spriteHeight: 32, columns: 8, rows: 8
                });
                new SpritesheetAsset("forest_enemies", "assets/levels/forest_enemies.png", {
                    spriteWidth: 32, spriteHeight: 32, columns: 4, rows: 2
                });
                break;
                
            case "dungeon":
                new SpritesheetAsset("dungeon_tiles", "assets/levels/dungeon_tiles.png", {
                    spriteWidth: 32, spriteHeight: 32, columns: 8, rows: 8
                });
                new SpritesheetAsset("dungeon_enemies", "assets/levels/dungeon_enemies.png", {
                    spriteWidth: 32, spriteHeight: 32, columns: 6, rows: 3
                });
                break;
        }
        
        // Wait for assets to load
        await this.waitForAssetsToLoad();
    }
    
    static async waitForAssetsToLoad() {
        // Wait for all pending assets to complete loading
        while (SpriteRegistry.isLoading()) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}
```

### Progressive Loading
```javascript
class ProgressiveLoader {
    constructor() {
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
    
    async loadGameAssets(onProgress) {
        const assetList = [
            { name: "player", path: "assets/player.png" },
            { name: "enemies", path: "assets/enemies.png" },
            { name: "ui", path: "assets/ui.png" },
            { name: "effects", path: "assets/effects.png" }
        ];
        
        this.totalAssets = assetList.length;
        
        for (const asset of assetList) {
            await this.loadSingleAsset(asset);
            this.loadedAssets++;
            this.loadingProgress = this.loadedAssets / this.totalAssets;
            
            if (onProgress) {
                onProgress(this.loadingProgress, asset.name);
            }
        }
    }
    
    async loadSingleAsset(assetInfo) {
        return new Promise((resolve) => {
            const spriteAsset = new SpriteAsset(assetInfo.name, assetInfo.path);
            spriteAsset.onLoad = resolve;
        });
    }
}

// Usage with loading screen
const loader = new ProgressiveLoader();
loader.loadGameAssets((progress, assetName) => {
    console.log(`Loading ${assetName}: ${Math.round(progress * 100)}%`);
    updateLoadingBar(progress);
});
```

## 🔧 Asset Optimization

### File Organization
```
assets/
├── characters/
│   ├── player.png (spritesheet)
│   ├── enemies.png (spritesheet)
│   └── npcs.png (spritesheet)
├── environment/
│   ├── tiles.png (spritesheet)
│   ├── props.png (spritesheet)
│   └── backgrounds/ (individual files)
├── ui/
│   ├── interface.png (spritesheet)
│   └── icons.png (spritesheet)
└── effects/
    ├── particles.png (spritesheet)
    └── explosions.png (spritesheet)
```

### Performance Best Practices
```javascript
// ✅ Good - Use spritesheets for related sprites
new SpritesheetAsset("characters", "assets/characters.png", {
    spriteWidth: 32, spriteHeight: 32, columns: 8, rows: 4
});

// ✅ Good - Consistent sprite sizes
new SpritesheetAsset("tiles", "assets/tiles.png", {
    spriteWidth: 32, spriteHeight: 32, columns: 16, rows: 16
});

// ❌ Avoid - Many individual small files
// new SpriteAsset("tile1", "assets/tile1.png");
// new SpriteAsset("tile2", "assets/tile2.png");
// ... (hundreds of tiles)

// ✅ Good - Power-of-2 texture dimensions
// 256x256, 512x512, 1024x1024, etc.

// ✅ Good - Logical grouping
new SpritesheetAsset("ui_buttons", "assets/ui_buttons.png", {
    spriteWidth: 128, spriteHeight: 64, columns: 4, rows: 2
});
```

## 🚀 Integration Examples

### With Animation System
```javascript
// Create character spritesheet
new SpritesheetAsset("player", "assets/player.png", {
    spriteWidth: 32, spriteHeight: 32, columns: 4, rows: 4
});

// Create animation using spritesheet
const walkAnimation = new SpriteAnimationClip("walk", [
    "player:sprite_0_0",  // Walk frame 1
    "player:sprite_1_0",  // Walk frame 2
    "player:sprite_2_0",  // Walk frame 3
    "player:sprite_3_0"   // Walk frame 4
], {
    frameRate: 8,
    looping: true
});
```

### With Scene Management
```javascript
class GameScene extends Scene {
    async preload() {
        // Load scene-specific assets
        new SpritesheetAsset("level1", "assets/level1.png", {
            spriteWidth: 32, spriteHeight: 32, columns: 8, rows: 8
        });
        
        // Wait for loading to complete
        await this.waitForAssets();
    }
    
    create() {
        // Assets are now ready to use
        const background = new GameObject("Background");
        background.addComponent(new SpriteRendererComponent("level1:sprite_0_0"));
        this.add(background);
    }
}
```

## 🎯 Learning Path

1. **[Start with SpriteRegistry](SpriteRegistry.md)** - Learn the core asset management system
2. **Load Individual Sprites** - Begin with simple SpriteAsset loading
3. **Use Spritesheets** - Move to efficient SpritesheetAsset organization
4. **Implement Loading Screens** - Add progressive asset loading
5. **Optimize Performance** - Apply best practices for large games

## 🚀 Next Steps

- **[SpriteRegistry Documentation](SpriteRegistry.md)** - Complete asset system reference
- **[Renderer Components](../renderer/)** - Using assets with rendering components
- **[Animation System](../animations/)** - Creating animations from spritesheet assets

---

**Master the asset system to efficiently organize and load all your game's visual content with Unity-familiar patterns!**
