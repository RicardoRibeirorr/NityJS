/**
 * TileRegistry manages the storage and retrieval of tile assets for tilemaps.
 * All tiles are stored in a unified registry for easy access by tilemaps and other systems.
 * Unity equivalent: Similar to Unity's TileAssetDatabase or custom tile management system
 * 
 * The TileRegistry serves as the central hub for tile management in the NityJS engine,
 * providing automatic registration, retrieval, and management capabilities. It mirrors
 * the SpriteRegistry architecture to ensure consistency across asset management systems.
 * 
 * Features:
 * - Automatic registration via TileAsset constructor
 * - Name-based tile retrieval for tilemaps
 * - Batch operations for loading multiple tiles
 * - Metadata export/import for serialization
 * - Debug and inspection utilities
 * - Filtering and querying capabilities
 * 
 * @example
 * // Tiles are automatically registered when created
 * const grassTile = new TileAsset("grass", "terrain:grass_01");
 * const wallTile = new TileAsset("wall", "structures:brick_wall", {
 *     collider: { width: 32, height: 32 }
 * });
 * const coinTile = new TileAsset("coin", "items:gold_coin", {
 *     width: 16,
 *     height: 16,
 *     collider: { width: 12, height: 12, trigger: true }
 * });
 * 
 * // Retrieve tiles for use in tilemaps
 * const grassTileData = TileRegistry.getTile("grass");
 * const wallTileData = TileRegistry.getTile("wall");
 * 
 * // Check tile existence before use
 * if (TileRegistry.hasTile("secret_door")) {
 *     const door = TileRegistry.getTile("secret_door");
 *     console.log("Secret door tile found:", door.toString());
 * }
 * 
 * // Get all registered tiles for inspection
 * const allTileNames = TileRegistry.getAllTileNames();
 * console.log("Available tiles:", allTileNames);
 * 
 * // Filter tiles by properties
 * const solidTiles = TileRegistry.getTilesByFilter(tile => tile.isSolid());
 * const triggerTiles = TileRegistry.getTilesByFilter(tile => tile.isTrigger());
 * 
 * // Export all tiles for saving
 * const tilesMetadata = TileRegistry.exportAllToMetadata();
 * localStorage.setItem('tiles', JSON.stringify(tilesMetadata));
 * 
 * @class TileRegistry
 * @author NityJS Team
 * @since 1.0.0
 */
export class TileRegistry {
    static tiles = new Map(); // Storage for all registered tiles: name -> TileAsset

    /**
     * Internal method to add a tile asset (used by TileAsset constructor).
     * 
     * Registers a tile in the internal storage map, making it available for
     * retrieval by name. This method is called automatically during TileAsset
     * construction and should not be called directly by user code.
     * 
     * @param {string} name - Unique name to register the tile under
     * @param {TileAsset} tileAsset - The tile asset instance to register
     * 
     * @private
     * @since 1.0.0
     */
    static _addTile(name, tileAsset) {
        this.tiles.set(name, tileAsset);
    }

    /**
     * Get a registered tile asset by name.
     * 
     * Retrieves a tile from the registry using its unique name. Returns null
     * if the tile is not found, allowing for safe existence checking.
     * 
     * @param {string} name - Name of the tile to retrieve
     * @returns {TileAsset|null} The tile asset if found, null otherwise
     * 
     * @example
     * // Register a tile
     * const grassTile = new TileAsset("grass", "terrain:grass");
     * 
     * // Retrieve the tile
     * const retrievedTile = TileRegistry.getTile("grass");
     * console.log(retrievedTile.toString()); // "Tile[grass: terrain:grass]"
     * 
     * // Handle missing tiles safely
     * const missingTile = TileRegistry.getTile("nonexistent");
     * if (missingTile) {
     *     console.log("Found tile:", missingTile.name);
     * } else {
     *     console.log("Tile not found");
     * }
     * 
     * @since 1.0.0
     */
    static getTile(name) {
        return this.tiles.get(name) || null;
    }

    /**
     * Check if a tile is registered in the registry.
     * 
     * Performs a fast existence check without retrieving the actual tile object.
     * Useful for conditional logic and validation.
     * 
     * @param {string} name - Name of the tile to check
     * @returns {boolean} True if tile exists in registry, false otherwise
     * 
     * @example
     * // Check before using a tile
     * if (TileRegistry.hasTile("lava")) {
     *     const lavaTile = TileRegistry.getTile("lava");
     *     console.log("Lava tile is available");
     * } else {
     *     console.log("Lava tile needs to be created");
     *     new TileAsset("lava", "hazards:lava");
     * }
     * 
     * // Validate tile names in configuration
     * const requiredTiles = ["grass", "stone", "water"];
     * const missingTiles = requiredTiles.filter(name => !TileRegistry.hasTile(name));
     * if (missingTiles.length > 0) {
     *     console.error("Missing tiles:", missingTiles);
     * }
     * 
     * @since 1.0.0
     */
    static hasTile(name) {
        return this.tiles.has(name);
    }

    /**
     * Get all registered tile names
     * @returns {string[]} Array of all registered tile names
     */
    static getAllTileNames() {
        return Array.from(this.tiles.keys());
    }

    /**
     * Get all registered tiles
     * @returns {TileAsset[]} Array of all registered tile assets
     */
    static getAllTiles() {
        return Array.from(this.tiles.values());
    }

    /**
     * Remove a tile from the registry
     * @param {string} name - Name of the tile to remove
     * @returns {boolean} True if tile was removed, false if it didn't exist
     */
    static removeTile(name) {
        return this.tiles.delete(name);
    }

    /**
     * Clear all registered tiles
     * Useful for scene transitions or testing
     */
    static clear() {
        this.tiles.clear();
    }

    /**
     * Get the number of registered tiles
     * @returns {number} Number of registered tiles
     */
    static getCount() {
        return this.tiles.size;
    }

    /**
     * Register a tile manually (if not using TileAsset constructor)
     * @param {string} name - Name to register the tile under
     * @param {Tile|TileAsset} tile - The tile to register
     * @returns {boolean} True if registered successfully, false if name already exists
     */
    static registerTile(name, tile) {
        if (this.hasTile(name)) {
            console.warn(`TileRegistry: Tile "${name}" already exists. Use forceRegisterTile() to override.`);
            return false;
        }
        this.tiles.set(name, tile);
        return true;
    }

    /**
     * Register a tile, overriding any existing tile with the same name
     * @param {string} name - Name to register the tile under
     * @param {Tile|TileAsset} tile - The tile to register
     */
    static forceRegisterTile(name, tile) {
        this.tiles.set(name, tile);
    }

    /**
     * Create multiple tiles from metadata objects
     * @param {Object[]} tilesMetadata - Array of tile metadata objects
     * @returns {TileAsset[]} Array of created tile assets
     * 
     * @example
     * const tiles = TileRegistry.createTilesFromMetadata([
     *     { name: "grass", spriteName: "terrain:grass", options: {} },
     *     { name: "stone", spriteName: "terrain:stone", options: { collider: { width: 32, height: 32 } } }
     * ]);
     */
    static createTilesFromMetadata(tilesMetadata) {
        const { TileAsset } = require('./TileAsset.js'); // Dynamic import to avoid circular dependency
        return tilesMetadata.map(metadata => TileAsset.meta(metadata));
    }

    /**
     * Export all registered tiles to metadata format
     * @returns {Object[]} Array of tile metadata objects
     */
    static exportAllToMetadata() {
        return Array.from(this.tiles.values()).map(tile => 
            tile.toMeta ? tile.toMeta() : {
                name: tile.name,
                spriteName: tile.spriteName,
                options: {
                    width: tile.width,
                    height: tile.height,
                    opacity: tile.opacity,
                    color: tile.color,
                    flipX: tile.flipX,
                    flipY: tile.flipY,
                    collider: tile.collider
                }
            }
        );
    }

    /**
     * Get tiles by filter criteria
     * @param {function} filterFn - Function to filter tiles (tile) => boolean
     * @returns {TileAsset[]} Array of tiles matching the filter
     * 
     * @example
     * // Get all solid tiles
     * const solidTiles = TileRegistry.getTilesByFilter(tile => tile.isSolid());
     * 
     * // Get all trigger tiles
     * const triggerTiles = TileRegistry.getTilesByFilter(tile => tile.isTrigger());
     * 
     * // Get tiles using specific sprite
     * const grassTiles = TileRegistry.getTilesByFilter(tile => tile.spriteName.includes("grass"));
     */
    static getTilesByFilter(filterFn) {
        return Array.from(this.tiles.values()).filter(filterFn);
    }

    /**
     * Debug method to print all registered tiles
     * @param {boolean} [detailed=false] - Whether to show detailed tile information
     */
    static debugPrint(detailed = false) {
        console.log(`TileRegistry: ${this.getCount()} tiles registered`);
        
        if (detailed) {
            this.tiles.forEach((tile, name) => {
                console.log(`  - ${name}: ${tile.toString()}`);
            });
        } else {
            console.log(`  Names: [${this.getAllTileNames().join(', ')}]`);
        }
    }
}
