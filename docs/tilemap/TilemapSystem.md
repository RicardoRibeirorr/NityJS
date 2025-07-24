# NityJS Tilemap System Documentation

The NityJS Tilemap System provides a comprehensive solution for tile-based level design, following Unity-inspired patterns while optimizing for web development workflows.

## Overview

The tilemap system consists of four main components:
- **Tile**: Data container for tile properties
- **TileAsset**: Auto-registering tile with metadata support
- **TileRegistry**: Central tile management system
- **TilemapComponent**: Grid-based rendering and collision component

## Architecture

### Data Flow
```
SpriteAssets/Spritesheets → SpriteRegistry
         ↓
TileAssets → TileRegistry → TilemapComponent → Rendered Tilemap
         ↓
   Collision Metadata
```

### Key Design Principles
1. **Data-Only Tiles**: Tiles are pure data containers with no behavior
2. **Mixed Asset Sources**: Support tiles from different spritesheets and individual sprites
3. **Auto-Registration**: Tiles register automatically like sprites
4. **Unity-Style API**: Familiar patterns for Unity developers
5. **Performance-Focused**: Efficient rendering and collision generation

## Core Classes

### Tile Class
```javascript
/**
 * Pure data container for tile information
 * - No components or behavior
 * - Rendering properties (width, height, opacity, color, flip)
 * - Collision metadata (box/circle, trigger/solid)
 * - Can be extended for custom tiles
 */
const basicTile = new Tile("grass", "terrain:grass_01");
const complexTile = new Tile("lava", "hazards:lava", {
    opacity: 0.9,
    color: "#FF6600",
    collider: { width: 32, height: 32, trigger: true }
});
```

### TileAsset Class
```javascript
/**
 * Auto-registering tile with metadata support
 * - Extends Tile class
 * - Automatically registers in TileRegistry
 * - Metadata export/import for serialization
 * - Factory methods for declarative creation
 */
const wallTile = new TileAsset("wall", "structures:brick", {
    collider: { width: 32, height: 32, type: "box" }
});

// Metadata factory method
const fireTile = TileAsset.meta({
    name: "fire",
    spriteName: "effects:flame",
    options: { opacity: 0.8, color: "#FF4444" }
});
```

### TileRegistry Class
```javascript
/**
 * Central tile management system
 * - Mirrors SpriteRegistry architecture
 * - Name-based tile retrieval
 * - Batch operations and filtering
 * - Debug utilities
 */
const grassTile = TileRegistry.getTile("grass");
const allSolidTiles = TileRegistry.getTilesByFilter(tile => tile.isSolid());
const tileNames = TileRegistry.getAllTileNames();
```

### TilemapComponent Class
```javascript
/**
 * Grid-based rendering and collision component
 * - Mixed tile references (names, objects, null)
 * - Automatic sprite resolution
 * - Collision metadata generation
 * - Coordinate conversion utilities
 */
const tilemap = new TilemapComponent({
    tileSize: 32,
    tiles: {
        0: null,                    // Empty
        1: "grass",                 // Registry name
        2: new Tile("sky", "bg:sky") // Direct object
    },
    grid: [
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ]
});
```

## Usage Patterns

### Basic Level Creation
```javascript
// 1. Create sprites/spritesheets
new SpritesheetAsset("terrain", "terrain.png", {
    spriteWidth: 16, spriteHeight: 16, columns: 4, rows: 4
});

// 2. Create tiles (auto-registered)
new TileAsset("grass", "terrain:sprite_0");
new TileAsset("stone", "terrain:sprite_1", {
    collider: { width: 16, height: 16 }
});
new TileAsset("water", "terrain:sprite_2", {
    opacity: 0.8,
    collider: { width: 16, height: 16, trigger: true }
});

// 3. Create tilemap
const level = new TilemapComponent({
    tileSize: 16,
    tiles: { 0: null, 1: "grass", 2: "stone", 3: "water" },
    grid: [
        [2,2,2,2,2],
        [2,1,1,1,2],
        [2,1,3,1,2],
        [2,1,1,1,2],
        [2,2,2,2,2]
    ]
});

// 4. Add to scene
const tilemapObject = new GameObject(new Vector2(100, 100));
tilemapObject.addComponent(level);
scene.add(tilemapObject);
```

### Mixed Asset Sources
```javascript
// Tiles from different sources
new SpriteAsset("player", "player.png");
new SpritesheetAsset("environment", "env.png", { /* config */ });
new SpritesheetAsset("items", "items.png", { /* config */ });

// Create tiles from various sources
new TileAsset("spawn", "player");              // Single sprite
new TileAsset("grass", "environment:sprite_0"); // From spritesheet
new TileAsset("coin", "items:sprite_5");       // From different sheet

// Use in tilemap
const tilemap = new TilemapComponent({
    tiles: {
        1: "spawn",   // Player spawn point
        2: "grass",   // Environment tile
        3: "coin"     // Item tile
    },
    grid: [[1,2,2,3,2]]
});
```

### Runtime Tile Manipulation
```javascript
// Query tiles
const tileAt = tilemap.getTileAt(5, 3);
console.log("Tile:", tileAt?.toString());

// Find tiles by criteria
const solidTiles = tilemap.getTilesWhere(tile => tile.isSolid());
const triggers = tilemap.getTilesWhere(tile => tile.isTrigger());

// Coordinate conversion
const worldPos = tilemap.gridToWorld(5, 3);
const gridPos = tilemap.worldToGrid(200, 150);

// Change tiles at runtime
tilemap.setTileAt(5, 3, 2); // Change tile ID at position
```

### Serialization and Loading
```javascript
// Export tilemap data
const tilesMetadata = TileRegistry.exportAllToMetadata();
const tilemapData = {
    tiles: tilemap.tiles,
    grid: tilemap.grid,
    tileSize: tilemap.tileSize
};

// Save to file/storage
const levelData = {
    tiles: tilesMetadata,
    tilemap: tilemapData
};
localStorage.setItem('level1', JSON.stringify(levelData));

// Load from file/storage
const savedData = JSON.parse(localStorage.getItem('level1'));
const recreatedTiles = TileRegistry.createTilesFromMetadata(savedData.tiles);
const recreatedTilemap = new TilemapComponent(savedData.tilemap);
```

## Performance Considerations

### Efficient Rendering
- Uses sprite's built-in `draw()` method for proper scaling
- Batch rendering in single draw call
- Supports camera culling (future enhancement)

### Memory Management
- Tiles are lightweight data containers
- Sprites shared across multiple tiles
- Collision metadata generated once

### Collision Optimization
- Collision data pre-generated during initialization
- Spatial partitioning for large tilemaps (future enhancement)
- Trigger/solid separation for efficient queries

## Integration Points

### With Existing Systems
- **SpriteRegistry**: Unified sprite access for tiles
- **Component System**: Standard component lifecycle
- **Collision System**: Metadata integration for physics
- **Coordinate System**: Vector2-based positioning

### Future Enhancements
- Animated tiles support
- Chunk-based rendering for large maps
- Tile layers and z-ordering
- Procedural tile generation
- Visual tile editor integration

## Best Practices

### Tile Organization
```javascript
// Group related tiles
new TileAsset("grass_01", "terrain:grass_light");
new TileAsset("grass_02", "terrain:grass_dark");
new TileAsset("grass_03", "terrain:grass_flowers");

// Use descriptive names
new TileAsset("wall_brick_solid", "structures:brick");
new TileAsset("door_wood_trigger", "structures:door");
```

### Performance Optimization
```javascript
// Prefer registry references over direct objects
const tilemap = new TilemapComponent({
    tiles: {
        1: "grass",        // ✓ Registry reference (efficient)
        2: grassTileObject // ✗ Direct object (less efficient)
    }
});

// Use appropriate tile sizes
const smallTilemap = new TilemapComponent({
    tileSize: 16,      // ✓ Good for detailed pixel art
    // tileSize: 4,    // ✗ Too small, performance issues
    // tileSize: 256   // ✗ Too large, memory issues
});
```

### Error Handling
```javascript
// Check tile existence
if (!TileRegistry.hasTile("required_tile")) {
    console.error("Missing required tile");
    // Create fallback or show error
}

// Validate grid data
const isValidGrid = grid.every(row => 
    row.every(tileId => tileId === null || tiles.hasOwnProperty(tileId))
);
```

## Example Projects

See the complete examples in:
- `examples/renderer/tilemap_example/` - Basic tilemap demonstration
- `examples/physics/tilemap_collision/` - Collision integration
- `examples/procedural/tilemap_generation/` - Procedural generation

## API Reference

For detailed API documentation, see:
- [Tile.md](./Tile.md)
- [TileAsset.md](./TileAsset.md) 
- [TileRegistry.md](./TileRegistry.md)
- [TilemapComponent.md](./TilemapComponent.md)
