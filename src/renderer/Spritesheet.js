import { Game } from '../core/Game.js';
import { Sprite } from './Sprite.js';

/**
 * Spritesheet manages a collection of sprites loaded from a single image file.
 * It automatically divides the image into individual sprites based on frame dimensions
 * and provides methods to retrieve specific sprites by name.
 * 
 * @example
 * // Create a spritesheet with 4 columns and 2 rows
 * const playerSheet = new Spritesheet("player", "assets/player.png", 32, 32, 4, 2);
 */
// === Spritesheet.js ===
export class Spritesheet {
    /**
     * Creates a new Spritesheet instance and registers it with the game.
     * 
     * @param {string} name - Unique identifier for the spritesheet
     * @param {string} src - Path to the image file
     * @param {number} [frameWidth=null] - Width of each frame in pixels
     * @param {number} [frameHeight=null] - Height of each frame in pixels
     * @param {number} [cols=1] - Number of columns in the spritesheet
     * @param {number} [rows=1] - Number of rows in the spritesheet
     */
    constructor(name, src, frameWidth = null, frameHeight = null, cols = 1, rows = 1) {
        this.name = name;
        this.src = src;
        this.image = null;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.cols = cols;
        this.rows = rows;
        this.sprites = new Map();

        Game.instance.spriteRegistry.add(this);
    }

    /**
     * Loads the spritesheet image and creates individual sprites.
     * This method is automatically called during the game's preload phase.
     * 
     * @returns {Promise<void>} Promise that resolves when the image is loaded and sprites are created
     */
    async load() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = this.src;
            img.onload = () => {
                this.image = img;
                for (let y = 0; y < this.rows; y++) {
                    for (let x = 0; x < this.cols; x++) {
                        const name = `sprite_${x}_${y}`;
                        const sprite = new Sprite(
                            img,
                            x * this.frameWidth,
                            y * this.frameHeight,
                            this.frameWidth,
                            this.frameHeight
                        );
                        this.sprites.set(name, sprite);
                    }
                }
                resolve();
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${this.src}`));
            };
        });
    }

    /**
     * Retrieves a specific sprite by name.
     * 
     * @param {string} name - The name of the sprite (e.g., "sprite_0_0")
     * @returns {Sprite|undefined} The requested sprite or undefined if not found
     */
    getSprite(name) {
        return this.sprites.get(name);
    }
}