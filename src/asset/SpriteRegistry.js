/**
 * SpriteRegistry manages the loading and storage of spritesheets for the game.
 * It provides a centralized way to register spritesheets and preload them before the game starts.
 * 
 * @example
 * // Registry is automatically used when creating spritesheets
 * const playerSheet = new Spritesheet("player", "assets/player.png", 32, 32, 4, 2);
 * // Retrieve later using Game.instance.spriteRegistry.getSheet("player")
 */
// === SpriteRegistry.js ===
export class SpriteRegistry {
    /**
     * Creates a new SpriteRegistry instance.
     */
    constructor() {
        this.sheets = new Map();
    }

    /**
     * Adds a spritesheet to the registry.
     * This is automatically called when creating a new Spritesheet.
     * 
     * @param {Spritesheet} sheet - The spritesheet to add
     */
    add(sheet) {
        this.sheets.set(sheet.name, sheet);
    }

    /**
     * Preloads all registered spritesheets.
     * This method is called during the game's preload phase.
     * 
     * @returns {Promise<void>} Promise that resolves when all spritesheets are loaded
     */
    async preload() {
        for (const sheet of this.sheets.values()) {
            await sheet.load();
        }
    }

    /**
     * Retrieves a spritesheet by name.
     * 
     * @param {string} name - The name of the spritesheet
     * @returns {Spritesheet|undefined} The requested spritesheet or undefined if not found
     */
    getSheet(name) {
        return this.sheets.get(name);
    }
}