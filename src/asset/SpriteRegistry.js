/**
 * SpriteRegistry manages the loading and storage of sprites and spritesheets for the game.
 * All sprites (single and from spritesheets) are stored in a unified registry using colon-separated keys.
 * Unity equivalent: Similar to Unity's Resources system or AssetDatabase
 * 
 * @example
 * // Create and automatically register a single sprite
 * const playerSprite = new SpriteAsset("player", "assets/player.png");
 * 
 * // Create and automatically register a spritesheet (individual sprites accessible as "enemies:sprite_0", "enemies:sprite_1", etc.)
 * const enemySheet = new SpritesheetAsset("enemies", "assets/enemies.png", {
 *     spriteWidth: 32,
 *     spriteHeight: 32,
 *     columns: 4,
 *     rows: 2
 * });
 * 
 * // Retrieve sprites using unified system
 * const playerSprite = SpriteRegistry.getSprite("player");          // Single sprite
 * const enemySprite = SpriteRegistry.getSprite("enemies:sprite_0"); // Sprite from sheet
 * const enemySheet = SpriteRegistry.getSpritesheet("enemies");      // Full spritesheet asset
 */
export class SpriteRegistry {
    static sprites = new Map();      // Unified storage: "name" or "sheet:sprite"
    static spritesheets = new Map(); // Asset storage for spritesheet metadata

    /**
     * Internal method to add a sprite asset (used by SpriteAsset constructor)
     * @param {string} name - Name to register the sprite under
     * @param {SpriteAsset} spriteAsset - The sprite asset to register
     * @private
     */
    static _addSprite(name, spriteAsset) {
        this.sprites.set(name, spriteAsset);
    }

    /**
     * Internal method to add a spritesheet asset and register its individual sprites
     * @param {string} name - Name to register the spritesheet under
     * @param {SpritesheetAsset} spritesheetAsset - The spritesheet asset to register
     * @private
     */
    static _addSpritesheet(name, spritesheetAsset) {
        this.spritesheets.set(name, spritesheetAsset);
        // Individual sprites will be registered by the SpritesheetAsset itself once loaded
    }

    /**
     * Get a registered sprite asset (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {SpriteAsset|Object|null} The sprite asset or sprite wrapper, or null if not found
     */
    static getSprite(name) {
        return this.sprites.get(name) || null;
    }

    /**
     * Get a registered spritesheet asset
     * @param {string} name - Name of the spritesheet
     * @returns {SpritesheetAsset|null} The spritesheet asset or null if not found
     */
    static getSpritesheet(name) {
        return this.spritesheets.get(name) || null;
    }

    /**
     * Preload all registered sprites and spritesheets
     * This method should be called during the game's preload phase
     * @returns {Promise<void>} Promise that resolves when all assets are loaded
     */
    static async preloadAll() {
        // Only load actual SpriteAsset objects (not sprite wrappers from spritesheets)
        const spritePromises = Array.from(this.sprites.values())
            .filter(sprite => sprite.load && typeof sprite.load === 'function') // Only assets with load method
            .map(sprite => sprite.isLoaded ? Promise.resolve() : sprite.load());
        
        const spritesheetPromises = Array.from(this.spritesheets.values()).map(sheet => 
            sheet.isLoaded ? Promise.resolve() : sheet.load()
        );
        
        await Promise.all([...spritePromises, ...spritesheetPromises]);
    }

    /**
     * Check if a sprite is registered (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {boolean} True if sprite exists
     */
    static hasSprite(name) {
        return this.sprites.has(name);
    }

    /**
     * Check if a spritesheet is registered
     * @param {string} name - Name of the spritesheet
     * @returns {boolean} True if spritesheet exists
     */
    static hasSpritesheet(name) {
        return this.spritesheets.has(name);
    }

    /**
     * Get all registered sprite names
     * @returns {Array<string>} Array of sprite names
     */
    static getSpriteNames() {
        return Array.from(this.sprites.keys());
    }

    /**
     * Get all registered spritesheet names
     * @returns {Array<string>} Array of spritesheet names
     */
    static getSpritesheetNames() {
        return Array.from(this.spritesheets.keys());
    }
    
    /**
     * Get all sprite names from a specific spritesheet
     * @param {string} sheetName - Name of the spritesheet
     * @returns {Array<string>} Array of sprite keys with colon notation ("sheetName:spriteName")
     */
    static getSpritesFromSheet(sheetName) {
        const spriteKeys = [];
        for (const key of this.sprites.keys()) {
            if (key.startsWith(sheetName + ':')) {
                spriteKeys.push(key);
            }
        }
        return spriteKeys;
    }

    /**
     * Clear all registered sprites and spritesheets
     */
    static clear() {
        this.sprites.clear();
        this.spritesheets.clear();
    }

    /**
     * Remove a specific sprite from the registry (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {boolean} True if sprite was removed
     */
    static removeSprite(name) {
        return this.sprites.delete(name);
    }

    /**
     * Remove a specific spritesheet from the registry
     * @param {string} name - Name of the spritesheet to remove
     * @returns {boolean} True if spritesheet was removed
     */
    static removeSpritesheet(name) {
        return this.spritesheets.delete(name);
    }

    // Legacy instance-based methods for backward compatibility
    /**
     * Creates a new SpriteRegistry instance (legacy support)
     * @deprecated Use static methods instead
     */
    constructor() {
        this.sheets = new Map();
        console.warn('SpriteRegistry instance methods are deprecated. Use static methods instead.');
    }

    /**
     * Adds a spritesheet to the registry (legacy support)
     * @deprecated Use new SpritesheetAsset() instead
     * @param {Object} sheet - The spritesheet to add
     */
    add(sheet) {
        console.warn('SpriteRegistry.add() is deprecated. Use new SpritesheetAsset() instead.');
        this.sheets.set(sheet.name, sheet);
    }

    /**
     * Preloads all registered spritesheets (legacy support)
     * @deprecated Use SpriteRegistry.preloadAll() instead
     * @returns {Promise<void>} Promise that resolves when all spritesheets are loaded
     */
    async preload() {
        console.warn('SpriteRegistry.preload() is deprecated. Use SpriteRegistry.preloadAll() instead.');
        for (const sheet of this.sheets.values()) {
            await sheet.load();
        }
    }

    /**
     * Retrieves a spritesheet by name (legacy support)
     * @deprecated Use SpriteRegistry.getSpritesheet() instead
     * @param {string} name - The name of the spritesheet
     * @returns {Object|undefined} The requested spritesheet or undefined if not found
     */
    getSheet(name) {
        console.warn('SpriteRegistry.getSheet() is deprecated. Use SpriteRegistry.getSpritesheet() instead.');
        return this.sheets.get(name);
    }
}
