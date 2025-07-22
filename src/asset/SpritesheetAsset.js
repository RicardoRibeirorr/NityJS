/**
 * SpritesheetAsset - Manages a collection of sprites from a single image
 * Unity equivalent: Similar to Unity's Sprite Atlas or Texture2D with multiple sprites
 */
import { SpriteRegistry } from './SpriteRegistry.js';

export class SpritesheetAsset {
    /**
     * Create a new spritesheet asset and automatically register it
     * @param {string} name - Name to register the spritesheet under (cannot contain colons)
     * @param {string} imagePath - Path to the spritesheet image
     * @param {Object} spriteData - Configuration for individual sprites
     * @param {number} [spriteData.spriteWidth] - Width of each sprite (for grid-based)
     * @param {number} [spriteData.spriteHeight] - Height of each sprite (for grid-based)
     * @param {number} [spriteData.columns] - Number of columns in the sheet (for grid-based)
     * @param {number} [spriteData.rows] - Number of rows in the sheet (for grid-based)
     * @param {Array} [spriteData.sprites] - Array of pixel coordinate-based sprite definitions: 
     *                                        [{name, startX, startY, endX, endY}, ...]
     * @param {Object} [spriteData.namedSprites] - Object of named sprite definitions (legacy support)
     */
    constructor(name, imagePath, spriteData) {
        // Validate name doesn't contain colons (reserved for sprite notation)
        if (name.includes(':')) {
            throw new Error(`SpritesheetAsset name "${name}" cannot contain colons. Colons are reserved for sprite notation within sheets.`);
        }
        
        this.name = name;
        this.imagePath = imagePath;
        this.spriteData = spriteData;
        this.image = null;
        this.isLoaded = false;
        this.sprites = new Map();
        
        // Generate sprite definitions immediately (before image loads)
        this.generateSprites();
        
        // Automatically register this spritesheet and its sprites
        this._registerSelf();
        
        this.load();
    }

    /**
     * Automatically register this spritesheet asset and its individual sprites
     * @private
     */
    _registerSelf() {
        // Register the spritesheet asset itself
        SpriteRegistry._addSpritesheet(this.name, this);
        
        // Register individual sprites immediately
        this._registerIndividualSprites();
    }

    /**
     * Load the spritesheet image
     * @returns {Promise} Promise that resolves when image is loaded
     */
    load() {
        return new Promise((resolve, reject) => {
            this.image = new Image();
            this.image.onload = () => {
                this.isLoaded = true;
                // Update the sprite wrappers with the loaded image
                this._updateSpriteWrappers();
                resolve(this);
            };
            this.image.onerror = reject;
            this.image.src = this.imagePath;
        });
    }

    /**
     * Generate sprite definitions from the spritesheet and register them in the unified registry
     * Supports both grid-based and pixel coordinate-based sprite definitions
     * @private
     */
    generateSprites() {
        const { spriteWidth, spriteHeight, columns, rows, sprites, namedSprites } = this.spriteData;
        
        // METHOD 1: Generate grid-based sprites if columns/rows specified
        if (columns != null && rows != null && spriteWidth != null && spriteHeight != null) {
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < columns; col++) {
                    const index = row * columns + col;
                    const spriteName = `sprite_${index}`;
                    const spriteConfig = {
                        x: col * spriteWidth,
                        y: row * spriteHeight,
                        width: spriteWidth,
                        height: spriteHeight
                    };
                    this.sprites.set(spriteName, spriteConfig);
                }
            }
        }
        
        // METHOD 2: Add pixel coordinate-based sprites if provided as array
        if (sprites != null && Array.isArray(sprites)) {
            sprites.forEach(sprite => {
                if (sprite.name && sprite.startX != null && sprite.startY != null && 
                    sprite.endX != null && sprite.endY != null) {
                    const spriteConfig = {
                        x: sprite.startX,
                        y: sprite.startY,
                        width: sprite.endX - sprite.startX,
                        height: sprite.endY - sprite.startY
                    };
                    this.sprites.set(sprite.name, spriteConfig);
                } else {
                    console.warn(`Invalid sprite definition in "${this.name}":`, sprite);
                }
            });
        }
        
        // LEGACY: Add named sprites if provided as object (backward compatibility)
        if (namedSprites != null && typeof namedSprites === 'object' && !Array.isArray(namedSprites)) {
            Object.entries(namedSprites).forEach(([name, config]) => {
                this.sprites.set(name, config);
            });
        }
    }
    
    /**
     * Update sprite wrappers after image loads
     * @private
     */
    _updateSpriteWrappers() {
        // Update the isLoaded state and image reference for all registered sprite wrappers
        for (const spriteName of this.sprites.keys()) {
            const unifiedKey = `${this.name}:${spriteName}`;
            const spriteWrapper = SpriteRegistry.getSprite(unifiedKey);
            if (spriteWrapper) {
                spriteWrapper.image = this.image;
                spriteWrapper.isLoaded = this.isLoaded;
            }
        }
    }
    
    /**
     * Register individual sprites in the unified SpriteRegistry using colon notation
     * @private
     */
    _registerIndividualSprites() {
        for (const spriteName of this.sprites.keys()) {
            const unifiedKey = `${this.name}:${spriteName}`;
            SpriteRegistry._addSprite(unifiedKey, this._createSpriteWrapper(spriteName));
        }
    }
    
    /**
     * Create a sprite wrapper that acts like a SpriteAsset for individual spritesheet sprites
     * @param {string} spriteName - Name of the sprite within the sheet
     * @returns {Object} Sprite wrapper object
     * @private
     */
    _createSpriteWrapper(spriteName) {
        const spriteConfig = this.sprites.get(spriteName);
        if (!spriteConfig) return null;
        
        return {
            name: `${this.name}:${spriteName}`,
            image: this.image, // Will be null initially, updated when image loads
            isLoaded: this.isLoaded, // Will be false initially, updated when image loads
            width: spriteConfig.width,
            height: spriteConfig.height,
            pivotX: 0.5, // Default pivot for spritesheet sprites
            pivotY: 0.5,
            sourceX: spriteConfig.x,
            sourceY: spriteConfig.y,
            sourceWidth: spriteConfig.width,
            sourceHeight: spriteConfig.height,
            
            // Draw method for individual sprite from sheet
            draw: (ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) => {
                if (!this.isLoaded || !this.image) return;
                
                const drawWidth = width || spriteConfig.width;
                const drawHeight = height || spriteConfig.height;
                
                ctx.save();
                
                // Apply transformations
                ctx.translate(x, y);
                if (rotation !== 0) ctx.rotate(rotation);
                ctx.scale(scaleX, scaleY);
                
                // Draw with pivot offset
                const offsetX = -drawWidth * 0.5; // Default pivot 0.5
                const offsetY = -drawHeight * 0.5;
                
                ctx.drawImage(
                    this.image,
                    spriteConfig.x, spriteConfig.y, spriteConfig.width, spriteConfig.height,
                    offsetX, offsetY, drawWidth, drawHeight
                );
                
                ctx.restore();
            },
            
            // Get bounds method for collision detection
            getBounds: (x, y, width, height) => {
                const w = width || spriteConfig.width;
                const h = height || spriteConfig.height;
                
                return {
                    x: x - (w * 0.5),
                    y: y - (h * 0.5),
                    width: w,
                    height: h
                };
            }
        };
    }

    /**
     * Get a specific sprite from the sheet
     * @param {string} spriteName - Name or index of the sprite
     * @returns {Object|null} Sprite configuration object
     */
    getSprite(spriteName) {
        return this.sprites.get(spriteName) || null;
    }

    /**
     * Get all available sprite names
     * @returns {Array<string>} Array of sprite names
     */
    getSpriteNames() {
        return Array.from(this.sprites.keys());
    }

    /**
     * Draw a specific sprite to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} spriteName - Name of the sprite to draw
     * @param {number} x - X position to draw at
     * @param {number} y - Y position to draw at
     * @param {number} [width] - Width to draw (defaults to sprite width)
     * @param {number} [height] - Height to draw (defaults to sprite height)
     */
    drawSprite(ctx, spriteName, x, y, width, height) {
        if (!this.isLoaded) return;
        
        const sprite = this.getSprite(spriteName);
        if (!sprite) return;
        
        const drawWidth = width || sprite.width;
        const drawHeight = height || sprite.height;
        
        ctx.drawImage(
            this.image,
            sprite.x, sprite.y, sprite.width, sprite.height,
            x, y, drawWidth, drawHeight
        );
    }
}