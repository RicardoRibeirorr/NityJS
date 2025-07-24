/**
 * NityJS Tilemap Example
 * Demonstrates the complete tilemap system with spritesheet-based tiles
 */

import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2,
    SpritesheetAsset,
    Tile,
    TileAsset, 
    TileRegistry,
    TilemapComponent,
    CameraComponent
} from '../../../src/index.js';

class TilemapExampleScene extends Scene {
    preload() {
        console.log("🎮 Loading tilemap example assets...");
        
        // Create spritesheet with 3 horizontal tiles (8x8 pixels each)
        // Tiles: wood, wall, grass
        new SpritesheetAsset("environment", "../../_assets/environment_tiles.png", {
            spriteWidth: 8,
            spriteHeight: 8,
            columns: 3,
            rows: 1
        });
    }

    start() {
        console.log("🏗️ Setting up tilemap scene...");
        
        // Setup camera for better view
        const cameraObject = new GameObject(new Vector2(0, 0));
        const camera = new CameraComponent(2.0); // 2x zoom for pixel art
        cameraObject.addComponent(camera);
        this.add(cameraObject);
        
        // Create tile assets using the spritesheet
        console.log("📦 Registering tile assets...");
        
        // Wood tile (sprite_0) - decorative, no collision
        const woodTile = new TileAsset("wood", "environment:sprite_0");
        
        // Wall tile (sprite_1) - solid collision
        const wallTile = new TileAsset("wall", "environment:sprite_1", {
            collider: {
                width: 64,
                height: 64,
                type: "box",
                trigger: false
            }
        });
        
        // Grass tile (sprite_2) - walkable, no collision
        const grassTile = new TileAsset("grass", "environment:sprite_2");
        
        // Debug: Show what's in the registry
        console.log("🗂️ TileRegistry contents:");
        TileRegistry.debugPrint(true);
        
        // Create the tilemap with your requested layout
        console.log("🗺️ Creating tilemap...");
        
        const tilemap = new TilemapComponent({
            tileSize: 64, // Each tile is 64x64 pixels in the world
            tiles: {
                0: null,      // Empty space
                1: "wall",    // Wall tiles (around the border) - sprite_1
                2: "grass",   // Grass tiles (middle area) - sprite_2  
                3: "wood",    // Wood tiles (center blocks) - sprite_0
                // You can also mix with direct tile objects:
                4: new Tile("special_wood", "environment:sprite_0", { 
                    opacity: 0.8,
                    color: "#FFFF88" // Slight yellow tint for special wood
                })
            },
            grid: [
                // Layout: Wall border, grass middle, wood center
                // W W W W W W W W W W
                // W . G G G G G . . W  
                // W . G O O O G . . W
                // W . G O S O G . . W  (S = special wood)
                // W . G O O O G . . W
                // W . G G G G G . . W
                // W W W W W W W W W W
                [1,1,1,1,1,1,1,1,1,1],
                [1,0,2,2,2,2,2,0,0,1],
                [1,0,2,3,3,3,2,0,0,1],
                [1,0,2,3,4,3,2,0,0,1], // Special wood in center
                [1,0,2,3,3,3,2,0,0,1],
                [1,0,2,2,2,2,2,0,0,1],
                [1,1,1,1,1,1,1,1,1,1]
            ],
            enableCollision: true
        });
        
        // Position the tilemap in the center of the screen
        const tilemapObject = new GameObject(new Vector2(300, 200));
        tilemapObject.addComponent(tilemap);
        this.add(tilemapObject);
        
        console.log("✅ Tilemap created successfully!");
        console.log(`📏 Grid dimensions: ${tilemap.gridWidth} x ${tilemap.gridHeight}`);
        console.log(`🔧 Colliders created: ${tilemap.colliders.length}`);
        
        // Demo some tilemap functionality
        this.demonstrateTilemapFeatures(tilemap);
        
        // Add some debug info to the console
        this.logTilemapInfo(tilemap);
    }
    
    /**
     * Demonstrate various tilemap features
     */
    demonstrateTilemapFeatures(tilemap) {
        console.log("\n🔍 Demonstrating tilemap features:");
        
        // Test coordinate conversion
        const worldPos = tilemap.gridToWorld(5, 3);
        const gridPos = tilemap.worldToGrid(worldPos.x, worldPos.y);
        console.log(`🗺️ Grid(5,3) -> World(${worldPos.x},${worldPos.y}) -> Grid(${gridPos.col},${gridPos.row})`);
        
        // Find specific tile types
        const solidTiles = tilemap.getTilesWhere(tile => tile.isSolid());
        const decorativeTiles = tilemap.getTilesWhere(tile => !tile.hasCollision());
        
        console.log(`🧱 Solid tiles found: ${solidTiles.length}`);
        console.log(`🌿 Decorative tiles found: ${decorativeTiles.length}`);
        
        // Test tile retrieval
        const centerTile = tilemap.getTileAt(5, 3);
        console.log(`🎯 Center tile:`, centerTile?.toString());
        
        // Show collision info
        console.log(`💥 Collision data:`, tilemap.colliders.map(c => 
            `${c.tile.name} at (${c.gridX},${c.gridY})`
        ));
    }
    
    /**
     * Log detailed tilemap information
     */
    logTilemapInfo(tilemap) {
        console.log("\n📋 Detailed Tilemap Information:");
        console.log("=====================================");
        
        // Grid visualization
        console.log("Grid layout:");
        tilemap.grid.forEach((row, y) => {
            const rowStr = row.map(tileId => {
                if (tileId === 0) return "·"; // Empty
                if (tileId === 1) return "W"; // Wall
                if (tileId === 2) return "G"; // Grass
                if (tileId === 3) return "O"; // Wood
                if (tileId === 4) return "S"; // Special
                return "?";
            }).join(" ");
            console.log(`Row ${y}: [${rowStr}]`);
        });
        
        console.log("\nTile Legend:");
        console.log("· = Empty, W = Wall, G = Grass, O = Wood, S = Special Wood");
        
        // Tile registry summary
        console.log(`\n📦 Total tiles in registry: ${TileRegistry.getCount()}`);
        console.log(`🏷️ Registered tile names: [${TileRegistry.getAllTileNames().join(', ')}]`);
    }

    update(deltaTime) {
        // Scene update logic (tilemap is static, so nothing needed here)
        // You could add animated tiles or dynamic tile changes here
    }
}

// Initialize and start the game
console.log("🚀 Starting NityJS Tilemap Example...");

const game = new Game(document.getElementById('gameCanvas'));
const scene = new TilemapExampleScene();

game.launch(scene);

console.log("🎮 Game started! Check the canvas and console for tilemap demo.");
