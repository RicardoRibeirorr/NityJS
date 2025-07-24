/**
 * TilemapComponent - Renders and manages grid-based tiles using the TileRegistry system.
 * Unity equivalent: Unity's Tilemap and TilemapRenderer combined into a single component
 * 
 * TilemapComponent provides a complete solution for tile-based level design, supporting
 * mixed tile references, collision generation, and efficient grid-based rendering. It
 * integrates seamlessly with the TileRegistry and SpriteRegistry systems to provide
 * flexible tile management with support for multiple asset sources.
 * 
 * Key Features:
 * - Mixed tile references (registry names, direct Tile objects, null for empty)
 * - Automatic sprite resolution through SpriteRegistry
 * - Collision system integration with metadata
 * - Grid-to-world coordinate conversion
 * - Tile querying and manipulation
 * - Efficient rendering with proper sprite scaling
 * - Support for tiles from different spritesheets and assets
 * 
 * The component uses a two-stage system: tile mapping (defines what tiles exist)
 * and grid layout (defines where tiles are placed), providing maximum flexibility
 * for level design while maintaining performance.
 * 
 * @example
 * // Register tiles first (happens automatically with TileAsset)
 * const grassTile = new TileAsset("grass", "terrain:grass");
 * const wallTile = new TileAsset("wall", "structures:brick", {
 *     collider: { width: 32, height: 32, trigger: false }
 * });
 * const coinTile = new TileAsset("coin", "items:coin", {
 *     collider: { width: 16, height: 16, trigger: true }
 * });
 * 
 * // Create tilemap with mixed tile references
 * const tilemap = new TilemapComponent({
 *     tileSize: 32,                    // 32x32 pixel tiles
 *     tiles: {
 *         0: null,                     // Empty space
 *         1: "grass",                  // Reference by name from registry
 *         2: "wall",                   // Reference by name from registry
 *         3: new Tile("sky", "bg:sky"), // Direct tile object (not in registry)
 *         4: "coin"                    // Reference by name from registry
 *     },
 *     grid: [
 *         [2,2,2,2,2,2,2,2,2,2],       // Wall border
 *         [2,0,0,0,4,0,0,0,0,2],       // Empty space with coin
 *         [2,0,1,1,1,1,1,0,0,2],       // Grass platform
 *         [2,0,0,0,0,0,0,0,0,2],       // Empty space
 *         [2,0,0,3,3,3,0,0,0,2],       // Sky tiles
 *         [2,1,1,1,1,1,1,1,1,2],       // Grass ground
 *         [2,2,2,2,2,2,2,2,2,2]        // Wall border
 *     ],
 *     enableCollision: true            // Generate collision metadata
 * });
 * 
 * // Add to GameObject and scene
 * const tilemapObject = new GameObject(new Vector2(100, 100));
 * tilemapObject.addComponent(tilemap);
 * scene.add(tilemapObject);
 * 
 * // Query tiles at runtime
 * const tileAt5x3 = tilemap.getTileAt(5, 3);
 * console.log("Tile at (5,3):", tileAt5x3?.toString());
 * 
 * // Convert coordinates
 * const worldPos = tilemap.gridToWorld(5, 3);
 * const gridPos = tilemap.worldToGrid(worldPos.x, worldPos.y);
 * 
 * // Find tiles by properties
 * const solidTiles = tilemap.getTilesWhere(tile => tile.isSolid());
 * const triggers = tilemap.getTilesWhere(tile => tile.isTrigger());
 * 
 * @extends Component
 * @class TilemapComponent
 * @author NityJS Team
 * @since 1.0.0
 */
import { Component } from '../../common/Component.js';
import { TileRegistry } from '../../asset/TileRegistry.js';
import { SpriteRegistry } from '../../asset/SpriteRegistry.js';
import { Tile } from '../../asset/Tile.js';

export class TilemapComponent extends Component {
    /**
     * Create a new tilemap component with the specified configuration.
     * 
     * Initializes a tilemap with tile definitions, grid layout, and rendering options.
     * The tilemap supports mixed tile references, allowing tiles from the registry,
     * direct tile objects, and empty spaces to be used together in a single map.
     * 
     * @param {Object} config - Complete tilemap configuration object
     * @param {number} [config.tileSize=32] - Default size for both width and height of tiles in pixels
     * @param {number} [config.tileWidth] - Custom tile width in pixels (overrides tileSize)
     * @param {number} [config.tileHeight] - Custom tile height in pixels (overrides tileSize)
     * @param {Object} config.tiles - Tile mapping defining available tiles by ID
     *                               Format: { id: tileReference } where tileReference can be:
     *                               - null/undefined: Empty space
     *                               - string: Tile name from TileRegistry
     *                               - Tile: Direct tile object
     * @param {Array[]} config.grid - 2D array defining tile placement using tile IDs
     *                               Format: [[row0_tiles], [row1_tiles], ...]
     * @param {number} [config.zIndex=0] - Rendering layer depth for sorting
     * @param {boolean} [config.enableCollision=true] - Whether to generate collision metadata for tiles
     * @param {string} [config.sortingLayer="Default"] - Sorting layer name for rendering organization
     * 
     * @throws {Error} If config.tiles is not provided
     * @throws {Error} If config.grid is not provided or is empty
     * 
     * @example
     * // Basic tilemap configuration
     * const simpleTilemap = new TilemapComponent({
     *     tileSize: 16,
     *     tiles: {
     *         0: null,           // Empty space
     *         1: "grass",        // Registry reference
     *         2: "stone"         // Registry reference
     *     },
     *     grid: [
     *         [2,2,2,2],
     *         [2,1,1,2],
     *         [2,2,2,2]
     *     ]
     * });
     * 
     * // Advanced tilemap with mixed references
     * const advancedTilemap = new TilemapComponent({
     *     tileWidth: 32,
     *     tileHeight: 24,        // Non-square tiles
     *     tiles: {
     *         0: null,
     *         1: "grass",        // From registry
     *         2: new Tile("custom", "special:tile", { opacity: 0.8 }), // Direct object
     *         3: "water"         // From registry
     *     },
     *     grid: [
     *         [1,1,1,1,1],
     *         [1,2,0,2,1],
     *         [3,3,3,3,3]
     *     ],
     *     enableCollision: true,
     *     zIndex: 1,
     *     sortingLayer: "Environment"
     * });
     */
    constructor(config = {}) {
        super();
        
        // Tile dimensions
        this.tileSize = config.tileSize || 32;
        this.tileWidth = config.tileWidth || this.tileSize;
        this.tileHeight = config.tileHeight || this.tileSize;
        
        // Tilemap data
        this.tiles = config.tiles || {};
        this.grid = config.grid || [];
        
        // Rendering properties
        this.zIndex = config.zIndex || 0;
        this.sortingLayer = config.sortingLayer || "Default";
        
        // Collision settings
        this.enableCollision = config.enableCollision !== false; // Default to true
        
        // Cached tile instances and sprites
        this.resolvedTiles = new Map(); // Cache resolved tile objects
        this.resolvedSprites = new Map(); // Cache resolved sprite objects
        this.colliders = []; // Store created colliders for cleanup
        
        // Grid dimensions
        this.gridWidth = this.grid.length > 0 ? this.grid[0].length : 0;
        this.gridHeight = this.grid.length;
    }

    /**
     * Initialize the tilemap component when added to a GameObject.
     * 
     * Performs initial setup including tile resolution from the TileRegistry
     * and SpriteRegistry, and collision generation. This method is called
     * automatically by the component system.
     * 
     * @since 1.0.0
     */
    start() {
        this.resolveTiles();
        this.createColliders();
    }

    /**
     * Resolve all tile references to actual tile and sprite objects.
     * 
     * Processes the tile mapping to convert string references into actual tile objects
     * from the TileRegistry and resolves their sprites from the SpriteRegistry.
     * Invalid references are logged as warnings but don't stop processing.
     * 
     * @private
     * @since 1.0.0
     */
    resolveTiles() {
        this.resolvedTiles.clear();
        this.resolvedSprites.clear();
        
        for (const [id, tileRef] of Object.entries(this.tiles)) {
            if (tileRef === null || tileRef === undefined) {
                this.resolvedTiles.set(id, null);
                continue;
            }
            
            let tile = null;
            
            // Handle different tile reference types
            if (typeof tileRef === 'string') {
                // String reference - look up in TileRegistry
                tile = TileRegistry.getTile(tileRef);
                if (!tile) {
                    console.warn(`TilemapComponent: Tile "${tileRef}" not found in TileRegistry`);
                    continue;
                }
            } else if (tileRef instanceof Tile) {
                // Direct tile object
                tile = tileRef;
            } else {
                console.warn(`TilemapComponent: Invalid tile reference for id "${id}":`, tileRef);
                continue;
            }
            
            this.resolvedTiles.set(id, tile);
            
            // Resolve sprite for this tile
            const sprite = SpriteRegistry.getSprite(tile.spriteName);
            if (!sprite) {
                console.warn(`TilemapComponent: Sprite "${tile.spriteName}" not found for tile "${tile.name}"`);
            } else {
                this.resolvedSprites.set(id, sprite);
            }
        }
    }

    /**
     * Create colliders for solid tiles
     * @private
     */
    createColliders() {
        if (!this.enableCollision) return;
        
        // Clear existing colliders
        this.clearColliders();
        
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const tileId = this.grid[row][col];
                const tile = this.resolvedTiles.get(String(tileId));
                
                if (tile && tile.hasCollision()) {
                    this.createTileCollider(tile, col, row);
                }
            }
        }
    }

    /**
     * Create a collider for a specific tile
     * @param {Tile} tile - The tile to create collision for
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @private
     */
    createTileCollider(tile, col, row) {
        // Calculate world position
        const worldX = this.gameObject.x + (col * this.tileWidth);
        const worldY = this.gameObject.y + (row * this.tileHeight);
        
        // Create collider data (this would integrate with your collision system)
        const colliderData = {
            x: worldX,
            y: worldY,
            width: tile.collider.width || this.tileWidth,
            height: tile.collider.height || this.tileHeight,
            radius: tile.collider.radius,
            type: tile.collider.type || "box",
            trigger: tile.collider.trigger || false,
            tile: tile,
            gridX: col,
            gridY: row
        };
        
        this.colliders.push(colliderData);
        
        // TODO: Integrate with your actual collision system
        // This is where you'd create BoxColliderComponent or CircleColliderComponent
    }

    /**
     * Clear all tile colliders
     * @private
     */
    clearColliders() {
        // TODO: Clean up actual collider components
        this.colliders = [];
    }

    /**
     * Render the tilemap
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    __draw(ctx) {
        ctx.save();
        
        // Apply GameObject transform
        ctx.translate(this.gameObject.x, this.gameObject.y);
        
        // Render each tile
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                this.renderTile(ctx, col, row);
            }
        }
        
        ctx.restore();
    }

    draw(ctx) {}

    /**
     * Render a single tile
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @private
     */
    renderTile(ctx, col, row) {
        const tileId = this.grid[row][col];
        const tile = this.resolvedTiles.get(String(tileId));
        const sprite = this.resolvedSprites.get(String(tileId));
        
        if (!tile || !sprite) return;
        
        // Calculate tile position
        const x = col * this.tileWidth;
        const y = row * this.tileHeight;
        
        ctx.save();
        
        // Apply tile-specific rendering properties
        if (tile.opacity !== 1) {
            ctx.globalAlpha = tile.opacity;
        }
        
        // Apply color tint if not white
        if (tile.color !== "#FFFFFF") {
            ctx.fillStyle = tile.color;
            ctx.globalCompositeOperation = "multiply";
        }
        
        // Apply flipping
        if (tile.flipX || tile.flipY) {
            ctx.translate(x + this.tileWidth / 2, y + this.tileHeight / 2);
            ctx.scale(tile.flipX ? -1 : 1, tile.flipY ? -1 : 1);
            ctx.translate(-this.tileWidth / 2, -this.tileHeight / 2);
        } else {
            ctx.translate(x, y);
        }
        
        // Determine render dimensions
        const renderWidth = tile.width || this.tileWidth;
        const renderHeight = tile.height || this.tileHeight;
        
        // Render the sprite using its built-in draw method for proper scaling
        if (sprite.image && sprite.image.complete) {
            // Use sprite's draw method which handles scaling properly
            sprite.draw(ctx, renderWidth / 2, renderHeight / 2, renderWidth, renderHeight, 0);
        }
        
        ctx.restore();
    }

    /**
     * Get the tile at specific grid coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @returns {Tile|null} The tile at the position or null
     */
    getTileAt(col, row) {
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
            return null;
        }
        
        const tileId = this.grid[row][col];
        return this.resolvedTiles.get(String(tileId)) || null;
    }

    /**
     * Set a tile at specific grid coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @param {string|number} tileId - Tile ID to set
     */
    setTileAt(col, row, tileId) {
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
            return;
        }
        
        this.grid[row][col] = tileId;
        
        // Update colliders if needed
        if (this.enableCollision) {
            this.createColliders();
        }
    }

    /**
     * Convert world coordinates to grid coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} { col, row } grid coordinates
     */
    worldToGrid(worldX, worldY) {
        const localX = worldX - this.gameObject.x;
        const localY = worldY - this.gameObject.y;
        
        return {
            col: Math.floor(localX / this.tileWidth),
            row: Math.floor(localY / this.tileHeight)
        };
    }

    /**
     * Convert grid coordinates to world coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @returns {Object} { x, y } world coordinates
     */
    gridToWorld(col, row) {
        return {
            x: this.gameObject.x + (col * this.tileWidth),
            y: this.gameObject.y + (row * this.tileHeight)
        };
    }

    /**
     * Get all tiles matching a filter
     * @param {function} filterFn - Filter function (tile, col, row) => boolean
     * @returns {Array} Array of { tile, col, row } objects
     */
    getTilesWhere(filterFn) {
        const results = [];
        
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const tile = this.getTileAt(col, row);
                if (tile && filterFn(tile, col, row)) {
                    results.push({ tile, col, row });
                }
            }
        }
        
        return results;
    }

    /**
     * Update tilemap (called every frame)
     */
    update(deltaTime) {
        // Tilemaps are generally static, but this allows for animated tiles
        // or dynamic tile updates in the future
    }

    /**
     * Clean up tilemap resources
     */
    destroy() {
        this.clearColliders();
        this.resolvedTiles.clear();
        this.resolvedSprites.clear();
        super.destroy();
    }
}
