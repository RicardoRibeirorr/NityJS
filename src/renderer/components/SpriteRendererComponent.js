import { Component } from '../../common/Component.js';
import { SpriteRegistry } from '../../asset/SpriteRegistry.js';
import { Vector2 } from '../../math/Vector2.js';

/**
 * SpriteRendererComponent renders sprites from both single sprites and spritesheets on GameObjects.
 * This component works with the unified SpriteRegistry to display sprites using colon-separated keys.
 * Supports custom scaling and rendering options through an options object.
 * 
 * @example
 * // Render a single sprite at natural size
 * const renderer = new SpriteRendererComponent("player");
 * gameObject.addComponent(renderer);
 * 
 * // Render a sprite with custom scaling
 * const scaledRenderer = new SpriteRendererComponent("player", { width: 64, height: 64 });
 * gameObject.addComponent(scaledRenderer);
 * 
 * // Render a specific sprite from a spritesheet using colon notation
 * const renderer = new SpriteRendererComponent("enemies:sprite_0");
 * gameObject.addComponent(renderer);
 * 
 * // Render a spritesheet sprite with custom scaling and other options
 * const scaledRenderer = new SpriteRendererComponent("tiles:tile1", { 
 *     width: 128, 
 *     height: 128,
 *     flipX: false,
 *     flipY: false 
 * });
 * gameObject.addComponent(scaledRenderer);
 */
export class SpriteRendererComponent extends Component {
    /**
     * Creates a new SpriteRendererComponent.
     * 
     * @param {string} spriteName - Unified sprite key ("name" or "sheet:sprite") or legacy assetName
     * @param {Object} [options={}] - Rendering options
     * @param {number} [options.width] - Custom width for scaling. If not provided, uses sprite's natural width
     * @param {number} [options.height] - Custom height for scaling. If not provided, uses sprite's natural height
     * @param {boolean} [options.flipX=false] - Flip sprite horizontally
     * @param {boolean} [options.flipY=false] - Flip sprite vertically
     */
    constructor(spriteName, options = {}) {
        super();
        this.spriteKey = spriteName;
        this.sprite = null;
        
        // Extract options with defaults
        this.options = {
            width: options.width || null,
            height: options.height || null,
            flipX: options.flipX || false,
            flipY: options.flipY || false
        };
    }

    /**
     * Preloads the sprite from the unified registry. Called automatically during GameObject preload.
     * 
     * @throws {Error} If the sprite is not found
     */
    preload() {
        this.sprite = SpriteRegistry.getSprite(this.spriteKey);
        
        if (!this.sprite) {
            throw new Error(`Sprite '${this.spriteKey}' not found in SpriteRegistry. Make sure the sprite or spritesheet is loaded.`);
        }
    }

    /**
     * Draws the sprite on the canvas at the GameObject's global position with optional custom scaling.
     * Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
        if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        // Get dimensions (custom or natural)
        const width = this.options.width || null;
        const height = this.options.height || null;
        
        // Use the sprite's draw method for simple cases (no flipping for now)
        this.sprite.draw(ctx, position.x, position.y, width, height, rotation);
    }

    /**
     * Change the sprite being rendered using unified sprite key
     * @param {string} newSpriteKey - New sprite key ("name" or "sheet:sprite")
     */
    setSprite(newSpriteKey) {
        this.spriteKey = newSpriteKey;
        this.sprite = SpriteRegistry.getSprite(newSpriteKey);
        
        if (!this.sprite) {
            console.warn(`Sprite '${newSpriteKey}' not found in SpriteRegistry.`);
        }
    }

    /**
     * Set custom scale dimensions for the sprite
     * @param {number} width - Custom width for scaling
     * @param {number} height - Custom height for scaling
     */
    setScale(width, height) {
        this.options.width = width;
        this.options.height = height;
    }

    /**
     * Update sprite rendering options
     * @param {Object} newOptions - New options to merge with existing ones
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * Get the actual rendered width of the sprite (custom or natural)
     * @returns {number} The rendered width
     */
    getRenderedWidth() {
        if (!this.sprite) return 0;
        return this.options.width || this.sprite.width;
    }

    /**
     * Get the actual rendered height of the sprite (custom or natural)
     * @returns {number} The rendered height
     */
    getRenderedHeight() {
        if (!this.sprite) return 0;
        return this.options.height || this.sprite.height;
    }

    /**
     * Draws gizmos for the sprite renderer bounds.
     * Shows the sprite's bounding box and center point for debugging.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __internalGizmos(ctx) {
        if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation to gizmos as well
        ctx.translate(position.x, position.y);
        if (rotation !== 0) ctx.rotate(rotation);
        
        // Set gizmo styling - magenta for sprite renderers (matching ImageComponent)
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]); // Same dash pattern as ImageComponent
        
        // Get actual rendered dimensions (custom scale or natural size)
        const width = this.getRenderedWidth();
        const height = this.getRenderedHeight();
        
        // Draw the sprite bounds rectangle (centered)
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        
        // Draw center point
        ctx.setLineDash([]); // Solid line for center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw sprite key label
        ctx.fillStyle = '#FF00FF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.spriteKey, 0, -height / 2 - 8);
        
        // Draw dimensions
        ctx.fillText(`${width}x${height}`, 0, height / 2 + 15);
        
        ctx.restore();
    }
}