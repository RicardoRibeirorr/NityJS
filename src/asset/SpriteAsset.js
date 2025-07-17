/**
 * SpriteAsset - Manages a single sprite image
 * Unity equivalent: Unity's Sprite class for individual sprite assets
 */
import { SpriteRegistry } from './SpriteRegistry.js';

export class SpriteAsset {
    /**
     * Create a new sprite asset and automatically register it
     * @param {string} name - Name to register the sprite under (cannot contain colons)
     * @param {string} imagePath - Path to the sprite image
     * @param {Object} [config] - Optional configuration
     * @param {number} [config.width] - Override width
     * @param {number} [config.height] - Override height
     * @param {number} [config.pivotX=0.5] - Pivot point X (0-1)
     * @param {number} [config.pivotY=0.5] - Pivot point Y (0-1)
     */
    constructor(name, imagePath, config = {}) {
        // Validate name doesn't contain colons (reserved for spritesheet notation)
        if (name.includes(':')) {
            throw new Error(`SpriteAsset name "${name}" cannot contain colons. Colons are reserved for spritesheet sprite notation (e.g., "sheet:sprite").`);
        }
        
        this.name = name;
        this.imagePath = imagePath;
        this.image = null;
        this.isLoaded = false;
        this.width = config.width || null;
        this.height = config.height || null;
        this.pivotX = config.pivotX || 0.5;
        this.pivotY = config.pivotY || 0.5;
        
        // Automatically register this sprite
        this.#_registerSelf();
        
        this.load();
    }

    /**
     * Automatically register this sprite asset
     * @private
     */
    #_registerSelf() {
        SpriteRegistry._addSprite(this.name, this);
    }

    /**
     * Load the sprite image
     * @returns {Promise} Promise that resolves when image is loaded
     */
    load() {
        return new Promise((resolve, reject) => {
            this.image = new Image();
            this.image.onload = () => {
                this.isLoaded = true;
                // Use image dimensions if not specified
                if (!this.width) this.width = this.image.width;
                if (!this.height) this.height = this.image.height;
                resolve(this);
            };
            this.image.onerror = reject;
            this.image.src = this.imagePath;
        });
    }

    /**
     * Draw the sprite to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position to draw at
     * @param {number} y - Y position to draw at
     * @param {number} [width] - Width to draw (defaults to sprite width)
     * @param {number} [height] - Height to draw (defaults to sprite height)
     * @param {number} [rotation=0] - Rotation in radians
     * @param {number} [scaleX=1] - X scale factor
     * @param {number} [scaleY=1] - Y scale factor
     */
    draw(ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) {
        if (!this.isLoaded) return;
        
        const drawWidth = width || this.width;
        const drawHeight = height || this.height;
        
        ctx.save();
        
        // Apply transformations
        ctx.translate(x, y);
        if (rotation !== 0) ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        
        // Draw with pivot offset
        const offsetX = -drawWidth * this.pivotX;
        const offsetY = -drawHeight * this.pivotY;
        
        ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
        
        ctx.restore();
    }

    /**
     * Get sprite bounds for collision detection
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} [width] - Width override
     * @param {number} [height] - Height override
     * @returns {Object} Bounds object with x, y, width, height
     */
    getBounds(x, y, width, height) {
        const w = width || this.width;
        const h = height || this.height;
        
        return {
            x: x - (w * this.pivotX),
            y: y - (h * this.pivotY),
            width: w,
            height: h
        };
    }

    /**
     * Clone this sprite asset with different configuration
     * @param {Object} [newConfig] - New configuration options
     * @returns {SpriteAsset} New sprite asset instance
     */
    clone(newConfig = {}) {
        const config = {
            width: this.width,
            height: this.height,
            pivotX: this.pivotX,
            pivotY: this.pivotY,
            ...newConfig
        };
        return new SpriteAsset(this.imagePath, config);
    }
}