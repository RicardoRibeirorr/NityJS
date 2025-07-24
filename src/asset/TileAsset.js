/**
 * TileAsset - Manages a single tile and automatically registers it in TileRegistry.
 * Similar to SpriteAsset but for tiles, providing auto-registration and metadata management.
 * Unity equivalent: Similar to Unity's ScriptableTile or custom TileBase asset
 * 
 * TileAsset extends the base Tile class to provide automatic registration in the
 * TileRegistry system, enabling easy tile management and retrieval for tilemaps.
 * It also includes comprehensive metadata support for serialization and visual editors.
 * 
 * The auto-registration feature mirrors the SpriteAsset behavior, ensuring that
 * tiles are immediately available for use in TilemapComponent without manual registration.
 * 
 * @example
 * // Create and automatically register a basic tile
 * const grassTile = new TileAsset("grass", "terrain:grass_01");
 * 
 * // Create tile with full configuration
 * const wallTile = new TileAsset("wall", "structures:brick", {
 *     width: 32,
 *     height: 32,
 *     opacity: 0.9,
 *     color: "#CCCCCC",
 *     collider: {
 *         width: 32,
 *         height: 32,
 *         type: "box",
 *         trigger: false
 *     }
 * });
 * 
 * // Create trigger tile for pickups
 * const coinTile = new TileAsset("coin", "items:gold_coin", {
 *     width: 16,
 *     height: 16,
 *     opacity: 0.95,
 *     collider: {
 *         radius: 8,
 *         type: "circle",
 *         trigger: true
 *     }
 * });
 * 
 * // Use metadata factory method
 * const fireTile = TileAsset.meta({
 *     name: "fire",
 *     spriteName: "effects:flame",
 *     options: {
 *         opacity: 0.8,
 *         color: "#FF4444"
 *     }
 * });
 * 
 * @extends Tile
 * @class TileAsset
 * @author NityJS Team
 * @since 1.0.0
 */
import { Tile } from './Tile.js';
import { TileRegistry } from './TileRegistry.js';

export class TileAsset extends Tile {
    /**
     * Create a new tile asset and automatically register it in TileRegistry.
     * 
     * Initializes a new TileAsset with the specified configuration and immediately
     * registers it in the global TileRegistry for use in tilemaps. The tile name
     * must be unique and cannot contain colons (reserved for future notation).
     * 
     * @param {string} name - Unique identifier for registry registration (no colons allowed)
     * @param {string} spriteName - Sprite reference supporting unified notation ("sprite" or "sheet:sprite")
     * @param {Object} [options={}] - Tile configuration options (same as base Tile class)
     * @param {number} [options.width] - Custom render width in pixels
     * @param {number} [options.height] - Custom render height in pixels
     * @param {number} [options.opacity=1] - Tile transparency (0.0-1.0)
     * @param {string} [options.color="#FFFFFF"] - Color tint for rendering
     * @param {boolean} [options.flipX=false] - Horizontal flip during rendering
     * @param {boolean} [options.flipY=false] - Vertical flip during rendering
     * @param {Object} [options.collider] - Collision configuration
     * @param {number} [options.collider.width] - Collision box width
     * @param {number} [options.collider.height] - Collision box height
     * @param {number} [options.collider.radius] - Collision circle radius
     * @param {boolean} [options.collider.trigger=false] - Is collider a trigger
     * @param {string} [options.collider.type="box"] - Collision type: "box" or "circle"
     * 
     * @throws {Error} If name contains colons (reserved for future tile notation)
     * @throws {Error} If name is not provided or is empty
     * @throws {Error} If spriteName is not provided or is empty
     * 
     * @example
     * // Simple tile registration
     * const grass = new TileAsset("grass", "terrain:grass");
     * 
     * // Complex tile with all options
     * const lava = new TileAsset("lava", "hazards:lava_flow", {
     *     width: 32,
     *     height: 32,
     *     opacity: 0.9,
     *     color: "#FF6600",
     *     collider: {
     *         width: 30,
     *         height: 30,
     *         type: "box",
     *         trigger: true
     *     }
     * });
     */
    constructor(name, spriteName, options = {}) {
        // Validate name doesn't contain colons (reserved for potential future tile notation)
        if (name.includes(':')) {
            throw new Error(`TileAsset name "${name}" cannot contain colons. Colons are reserved for potential future tile notation.`);
        }
        
        super(name, spriteName, options);
        
        // Automatically register this tile
        this._registerSelf();
    }

    /**
     * Automatically register this tile asset in the TileRegistry.
     * 
     * Internal method called during construction to ensure the tile is immediately
     * available for use in tilemaps and other systems.
     * 
     * @private
     * @since 1.0.0
     */
    _registerSelf() {
        TileRegistry._addTile(this.name, this);
    }

    /**
     * Create a tile asset from metadata configuration (factory method).
     * 
     * Provides a declarative way to create tiles from configuration objects,
     * ideal for loading tiles from JSON, visual editors, or serialized data.
     * 
     * @param {Object} metadata - Complete tile configuration object
     * @param {string} metadata.name - Unique tile identifier for registry
     * @param {string} metadata.spriteName - Sprite reference for rendering
     * @param {Object} [metadata.options] - Tile configuration options
     * @param {number} [metadata.options.width] - Custom render width
     * @param {number} [metadata.options.height] - Custom render height
     * @param {number} [metadata.options.opacity=1] - Tile transparency
     * @param {string} [metadata.options.color="#FFFFFF"] - Color tint
     * @param {boolean} [metadata.options.flipX=false] - Horizontal flip
     * @param {boolean} [metadata.options.flipY=false] - Vertical flip
     * @param {Object} [metadata.options.collider] - Collision configuration
     * 
     * @returns {TileAsset} New tile asset instance registered in TileRegistry
     * 
     * @throws {Error} If metadata.name is missing or invalid
     * @throws {Error} If metadata.spriteName is missing or invalid
     * 
     * @example
     * // Create from metadata object
     * const stoneTile = TileAsset.meta({
     *     name: "stone",
     *     spriteName: "terrain:stone_block",
     *     options: {
     *         width: 32,
     *         height: 32,
     *         collider: {
     *             width: 32,
     *             height: 32,
     *             type: "box"
     *         }
     *     }
     * });
     * 
     * // Load multiple tiles from JSON
     * const tilesConfig = [
     *     { name: "dirt", spriteName: "terrain:dirt", options: {} },
     *     { name: "water", spriteName: "liquids:water", options: { opacity: 0.7 } }
     * ];
     * const tiles = tilesConfig.map(config => TileAsset.meta(config));
     * 
     * @static
     * @since 1.0.0
     */
    static meta(metadata) {
        if (!metadata.name || typeof metadata.name !== 'string' || metadata.name.trim() === '') {
            throw new Error('TileAsset.meta() requires a valid name string');
        }
        if (!metadata.spriteName || typeof metadata.spriteName !== 'string' || metadata.spriteName.trim() === '') {
            throw new Error('TileAsset.meta() requires a valid spriteName string');
        }
        
        return new TileAsset(metadata.name, metadata.spriteName, metadata.options || {});
    }

    /**
     * Get default metadata structure for TileAsset.
     * 
     * Returns a complete metadata template with all supported properties
     * and their default values, useful for documentation and tooling.
     * 
     * @returns {Object} Default metadata object with all properties
     * @returns {string} returns.name - Default empty name
     * @returns {string} returns.spriteName - Default empty sprite name
     * @returns {Object} returns.options - Default options configuration
     * @returns {number|null} returns.options.width - Default width (null = use tilemap size)
     * @returns {number|null} returns.options.height - Default height (null = use tilemap size)
     * @returns {number} returns.options.opacity - Default opacity (1.0 = fully opaque)
     * @returns {string} returns.options.color - Default color ('#FFFFFF' = white/no tint)
     * @returns {boolean} returns.options.flipX - Default horizontal flip (false)
     * @returns {boolean} returns.options.flipY - Default vertical flip (false)
     * @returns {Object|null} returns.options.collider - Default collision (null = no collision)
     * 
     * @example
     * // Get template for tile creation
     * const template = TileAsset.getDefaultMeta();
     * console.log(template);
     * // {
     * //   name: '',
     * //   spriteName: '',
     * //   options: {
     * //     width: null,
     * //     height: null,
     * //     opacity: 1,
     * //     color: '#FFFFFF',
     * //     flipX: false,
     * //     flipY: false,
     * //     collider: null
     * //   }
     * // }
     * 
     * // Use template for tile editor UI
     * const editorDefaults = TileAsset.getDefaultMeta();
     * editorDefaults.name = "new_tile";
     * editorDefaults.spriteName = "terrain:grass";
     * const newTile = TileAsset.meta(editorDefaults);
     * 
     * @static
     * @since 1.0.0
     */
    static getDefaultMeta() {
        return {
            name: '',
            spriteName: '',
            options: {
                width: null,
                height: null,
                opacity: 1,
                color: '#FFFFFF',
                flipX: false,
                flipY: false,
                collider: null
            }
        };
    }

    /**
     * Export this tile to metadata format for serialization.
     * 
     * Converts the tile asset to a plain object suitable for JSON serialization,
     * saving to files, or transmission over networks. The exported metadata can
     * be used with TileAsset.meta() to recreate the tile.
     * 
     * @returns {Object} Metadata object representing this tile's complete state
     * @returns {string} returns.name - Tile's registered name
     * @returns {string} returns.spriteName - Tile's sprite reference
     * @returns {Object} returns.options - Tile's configuration options
     * @returns {number|null} returns.options.width - Custom width or null
     * @returns {number|null} returns.options.height - Custom height or null
     * @returns {number} returns.options.opacity - Tile transparency
     * @returns {string} returns.options.color - Color tint value
     * @returns {boolean} returns.options.flipX - Horizontal flip state
     * @returns {boolean} returns.options.flipY - Vertical flip state
     * @returns {Object|null} returns.options.collider - Collision configuration or null
     * 
     * @example
     * // Create a tile and export it
     * const iceTile = new TileAsset("ice", "terrain:ice_block", {
     *     opacity: 0.8,
     *     color: "#AAFFFF",
     *     collider: { width: 32, height: 32, type: "box" }
     * });
     * 
     * const metadata = iceTile.toMeta();
     * console.log(JSON.stringify(metadata, null, 2));
     * // {
     * //   "name": "ice",
     * //   "spriteName": "terrain:ice_block",
     * //   "options": {
     * //     "width": null,
     * //     "height": null,
     * //     "opacity": 0.8,
     * //     "color": "#AAFFFF",
     * //     "flipX": false,
     * //     "flipY": false,
     * //     "collider": {
     * //       "width": 32,
     * //       "height": 32,
     * //       "type": "box",
     * //       "trigger": false
     * //     }
     * //   }
     * // }
     * 
     * // Recreate the tile from metadata
     * const recreatedTile = TileAsset.meta(metadata);
     * 
     * @since 1.0.0
     */
    toMeta() {
        return {
            name: this.name,
            spriteName: this.spriteName,
            options: {
                width: this.width,
                height: this.height,
                opacity: this.opacity,
                color: this.color,
                flipX: this.flipX,
                flipY: this.flipY,
                collider: this.collider ? { ...this.collider } : null
            }
        };
    }

    /**
     * Apply metadata to this tile at runtime (dynamic configuration).
     * 
     * Updates the tile's properties from a metadata object, allowing for
     * runtime reconfiguration without creating new instances. Useful for
     * tile editors, dynamic tile systems, or loading saved configurations.
     * 
     * @param {Object} metadata - Metadata object with properties to update
     * @param {string} [metadata.name] - New tile name (updates registry key)
     * @param {string} [metadata.spriteName] - New sprite reference
     * @param {Object} [metadata.options] - New configuration options
     * @param {number} [metadata.options.width] - New custom width
     * @param {number} [metadata.options.height] - New custom height
     * @param {number} [metadata.options.opacity] - New transparency value
     * @param {string} [metadata.options.color] - New color tint
     * @param {boolean} [metadata.options.flipX] - New horizontal flip state
     * @param {boolean} [metadata.options.flipY] - New vertical flip state
     * @param {Object|null} [metadata.options.collider] - New collision configuration
     * 
     * @example
     * // Create base tile
     * const stoneTile = new TileAsset("stone", "terrain:stone");
     * 
     * // Apply new configuration at runtime
     * stoneTile.applyMeta({
     *     spriteName: "terrain:marble",
     *     options: {
     *         opacity: 0.9,
     *         color: "#F0F0F0",
     *         collider: {
     *             width: 32,
     *             height: 32,
     *             type: "box",
     *             trigger: false
     *         }
     *     }
     * });
     * 
     * // Partial updates are supported
     * stoneTile.applyMeta({
     *     options: {
     *         opacity: 0.7  // Only changes opacity, keeps other properties
     *     }
     * });
     * 
     * @since 1.0.0
     */
    applyMeta(metadata) {
        if (metadata.name !== undefined) {
            this.name = metadata.name;
        }
        if (metadata.spriteName !== undefined) {
            this.spriteName = metadata.spriteName;
        }
        if (metadata.options) {
            const opts = metadata.options;
            if (opts.width !== undefined) this.width = opts.width;
            if (opts.height !== undefined) this.height = opts.height;
            if (opts.opacity !== undefined) this.opacity = opts.opacity;
            if (opts.color !== undefined) this.color = opts.color;
            if (opts.flipX !== undefined) this.flipX = opts.flipX;
            if (opts.flipY !== undefined) this.flipY = opts.flipY;
            if (opts.collider !== undefined) {
                this.collider = opts.collider ? { ...opts.collider } : null;
            }
        }
    }
}
