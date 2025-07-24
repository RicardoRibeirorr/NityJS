/**
 * Tile - Simple data container for tile information in tilemaps.
 * Unity equivalent: Similar to Unity's Tile or TileBase class but simplified as data-only
 * 
 * This is a pure data class designed to hold only the essential information needed
 * for tile-based level design. It contains no components or behavior - just data.
 * If custom behavior is required, developers should extend this class.
 * 
 * The Tile class serves as the foundation for the NityJS tilemap system, providing
 * a lightweight way to define tiles with rendering and collision properties that
 * can be used by TilemapComponent for efficient level creation.
 * 
 * @example
 * // Basic tile with just sprite reference
 * const grassTile = new Tile("grass", "terrain:grass_01");
 * 
 * // Tile with custom rendering options
 * const coinTile = new Tile("coin", "items:coin", {
 *     width: 16,
 *     height: 16,
 *     opacity: 0.9,
 *     color: "#FFD700"
 * });
 * 
 * // Tile with collision properties
 * const wallTile = new Tile("wall", "structures:brick_wall", {
 *     width: 32,
 *     height: 32,
 *     collider: {
 *         width: 32,
 *         height: 32,
 *         type: "box",
 *         trigger: false
 *     }
 * });
 * 
 * // Tile with flipping
 * const mirroredTile = new Tile("mirrored", "player:idle", {
 *     flipX: true,
 *     flipY: false
 * });
 * 
 * // Custom tile class for special behavior
 * class MovingPlatformTile extends Tile {
 *     constructor(name, spriteName, options = {}) {
 *         super(name, spriteName, options);
 *         this.speed = options.speed || 50;
 *         this.direction = options.direction || "horizontal";
 *     }
 * }
 * 
 * @class Tile
 * @author NityJS Team
 * @since 1.0.0
 */
export class Tile {
    /**
     * Create a new tile data container.
     * 
     * Initializes a tile with a unique name, sprite reference, and optional rendering/collision
     * properties. The tile serves as a data container that TilemapComponent uses to render
     * and manage collision for grid-based levels.
     * 
     * @param {string} name - Unique identifier for this tile type (used for debugging and identification)
     * @param {string} spriteName - Sprite reference supporting unified sprite notation
     *                             Format: "spriteName" for single sprites or "sheet:sprite" for spritesheets
     * @param {Object} [options={}] - Optional configuration for rendering and collision behavior
     * @param {number} [options.width] - Custom render width in pixels (null = use tilemap's tileWidth)
     * @param {number} [options.height] - Custom render height in pixels (null = use tilemap's tileHeight)
     * @param {number} [options.opacity=1] - Tile transparency (0.0 = fully transparent, 1.0 = fully opaque)
     * @param {string} [options.color="#FFFFFF"] - Color tint applied during rendering (hex or rgba format)
     * @param {boolean} [options.flipX=false] - Horizontally flip the sprite during rendering
     * @param {boolean} [options.flipY=false] - Vertically flip the sprite during rendering
     * @param {Object} [options.collider] - Collision detection configuration (null = no collision)
     * @param {number} [options.collider.width] - Collision box width in pixels
     * @param {number} [options.collider.height] - Collision box height in pixels  
     * @param {number} [options.collider.radius] - Collision circle radius in pixels (for circle type)
     * @param {boolean} [options.collider.trigger=false] - Whether collider is a trigger (no physics blocking)
     * @param {string} [options.collider.type="box"] - Collision shape type: "box" or "circle"
     * 
     * @throws {Error} Throws if name is not provided or is empty
     * @throws {Error} Throws if spriteName is not provided or is empty
     * 
     * @example
     * // Simple decorative tile
     * const flower = new Tile("flower", "nature:flower_red");
     * 
     * // Scaled tile with transparency
     * const cloud = new Tile("cloud", "weather:cloud", {
     *     width: 48,
     *     height: 32,
     *     opacity: 0.7
     * });
     * 
     * // Solid collision tile
     * const platform = new Tile("platform", "terrain:stone_block", {
     *     collider: {
     *         width: 32,
     *         height: 16,
     *         type: "box",
     *         trigger: false
     *     }
     * });
     * 
     * // Trigger tile with custom visuals
     * const powerup = new Tile("powerup", "items:star", {
     *     color: "#FFFF00",
     *     opacity: 0.9,
     *     collider: {
     *         radius: 12,
     *         type: "circle", 
     *         trigger: true
     *     }
     * });
     */
    constructor(name, spriteName, options = {}) {
        this.name = name;
        this.spriteName = spriteName;
        
        // Rendering properties (will be used by TilemapComponent)
        this.width = options.width || null;
        this.height = options.height || null;
        this.opacity = options.opacity !== undefined ? options.opacity : 1;
        this.color = options.color || "#FFFFFF";
        this.flipX = options.flipX || false;
        this.flipY = options.flipY || false;
        
        // Collision properties (will be used by TilemapComponent)
        this.collider = options.collider ? {
            width: options.collider.width || null,
            height: options.collider.height || null,
            radius: options.collider.radius || null,
            trigger: options.collider.trigger || false,
            type: options.collider.type || "box"
        } : null;
    }

    /**
     * Check if this tile has collision detection enabled.
     * 
     * Determines whether this tile has any collision configuration that would
     * allow it to interact with physics systems or trigger events.
     * 
     * @returns {boolean} True if tile has collision data configured, false otherwise
     * 
     * @example
     * const wall = new Tile("wall", "terrain:brick", {
     *     collider: { width: 32, height: 32 }
     * });
     * console.log(wall.hasCollision()); // true
     * 
     * const decoration = new Tile("flower", "nature:flower");
     * console.log(decoration.hasCollision()); // false
     */
    hasCollision() {
        return this.collider !== null;
    }

    /**
     * Check if this tile is configured as a trigger.
     * 
     * Trigger tiles can detect collisions but don't block movement, making them
     * ideal for pickups, switches, or detection zones.
     * 
     * @returns {boolean} True if tile is a trigger, false if solid or no collision
     * 
     * @example
     * const pickup = new Tile("coin", "items:coin", {
     *     collider: { radius: 8, trigger: true }
     * });
     * console.log(pickup.isTrigger()); // true
     * 
     * const wall = new Tile("wall", "terrain:stone", {
     *     collider: { width: 32, height: 32, trigger: false }
     * });
     * console.log(wall.isTrigger()); // false
     */
    isTrigger() {
        return this.collider && this.collider.trigger;
    }

    /**
     * Check if this tile is solid (has collision but is not a trigger).
     * 
     * Solid tiles block movement and provide physical barriers in the game world.
     * 
     * @returns {boolean} True if tile has collision and is not a trigger
     * 
     * @example
     * const platform = new Tile("platform", "terrain:wood", {
     *     collider: { width: 64, height: 16, trigger: false }
     * });
     * console.log(platform.isSolid()); // true
     * 
     * const sensor = new Tile("sensor", "tech:detector", {
     *     collider: { radius: 16, trigger: true }
     * });
     * console.log(sensor.isSolid()); // false
     */
    isSolid() {
        return this.collider && !this.collider.trigger;
    }

    /**
     * Get the collision detection type for this tile.
     * 
     * Returns the geometric shape used for collision detection, or null if
     * the tile has no collision configured.
     * 
     * @returns {string|null} "box", "circle", or null if no collider configured
     * 
     * @example
     * const boxTile = new Tile("crate", "objects:crate", {
     *     collider: { width: 32, height: 32, type: "box" }
     * });
     * console.log(boxTile.getColliderType()); // "box"
     * 
     * const ballTile = new Tile("ball", "objects:sphere", {
     *     collider: { radius: 16, type: "circle" }
     * });
     * console.log(ballTile.getColliderType()); // "circle"
     * 
     * const noCollision = new Tile("background", "bg:sky");
     * console.log(noCollision.getColliderType()); // null
     */
    getColliderType() {
        return this.collider ? this.collider.type : null;
    }

    /**
     * Create a copy of this tile with optional property overrides.
     * 
     * Performs a deep clone of the tile including all collision data, while allowing
     * specific properties to be overridden in the new instance. Useful for creating
     * variations of existing tiles.
     * 
     * @param {Object} [overrides={}] - Properties to override in the cloned tile
     * @param {string} [overrides.name] - New name for the cloned tile
     * @param {string} [overrides.spriteName] - New sprite reference for the cloned tile
     * @param {number} [overrides.width] - Override width property
     * @param {number} [overrides.height] - Override height property
     * @param {number} [overrides.opacity] - Override opacity property
     * @param {string} [overrides.color] - Override color property
     * @param {boolean} [overrides.flipX] - Override flipX property
     * @param {boolean} [overrides.flipY] - Override flipY property
     * @param {Object} [overrides.collider] - Override entire collider configuration
     * 
     * @returns {Tile} New tile instance with same properties plus any overrides
     * 
     * @example
     * // Create base tile
     * const grassTile = new Tile("grass", "terrain:grass", {
     *     width: 32,
     *     height: 32,
     *     opacity: 1.0
     * });
     * 
     * // Create darker variant
     * const darkGrass = grassTile.clone({
     *     name: "dark_grass",
     *     color: "#447744",
     *     opacity: 0.8
     * });
     * 
     * // Create solid version with collision
     * const solidGrass = grassTile.clone({
     *     name: "solid_grass",
     *     collider: {
     *         width: 32,
     *         height: 32,
     *         type: "box",
     *         trigger: false
     *     }
     * });
     */
    clone(overrides = {}) {
        const clonedOptions = {
            width: this.width,
            height: this.height,
            opacity: this.opacity,
            color: this.color,
            flipX: this.flipX,
            flipY: this.flipY,
            collider: this.collider ? { ...this.collider } : null,
            ...overrides
        };
        
        return new this.constructor(
            overrides.name || this.name,
            overrides.spriteName || this.spriteName,
            clonedOptions
        );
    }

    /**
     * Convert tile to a human-readable string representation.
     * 
     * Provides a concise description of the tile including its name, sprite reference,
     * and collision status for debugging and logging purposes.
     * 
     * @returns {string} Formatted string describing this tile
     * 
     * @example
     * const wall = new Tile("wall", "terrain:brick", {
     *     collider: { width: 32, height: 32, trigger: false }
     * });
     * console.log(wall.toString()); // "Tile[wall: terrain:brick (solid)]"
     * 
     * const pickup = new Tile("coin", "items:gold", {
     *     collider: { radius: 8, trigger: true }
     * });
     * console.log(pickup.toString()); // "Tile[coin: items:gold (trigger)]"
     * 
     * const decoration = new Tile("flower", "nature:rose");
     * console.log(decoration.toString()); // "Tile[flower: nature:rose]"
     */
    toString() {
        const collision = this.hasCollision() ? ` (${this.isTrigger() ? 'trigger' : 'solid'})` : '';
        return `Tile[${this.name}: ${this.spriteName}${collision}]`;
    }
}
