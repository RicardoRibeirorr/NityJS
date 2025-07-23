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
 *     opacity: 0.8,
 *     color: "rgba(255, 68, 68, 0.7)", // Semi-transparent red tint
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
     * @param {number} [options.opacity=1.0] - Sprite opacity/alpha (0.0 to 1.0)
     * @param {string} [options.color="#FFFFFF"] - Tint color in hex format (e.g., "#FF0000") or rgba format (e.g., "rgba(255, 0, 0, 0.5)")
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
            opacity: options.opacity !== undefined ? options.opacity : 1.0,
            color: options.color || "#FFFFFF",
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
     * Draws the sprite on the canvas at the GameObject's global position with optional custom scaling, opacity, and color tinting.
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
        
        // Check if we need any special rendering (opacity or color tinting)
        const needsOpacity = this.options.opacity !== 1.0;
        const needsTinting = this.options.color !== "#FFFFFF";
        
        // Apply opacity if needed
        if (needsOpacity) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, this.options.opacity));
        }
        
        // Draw the sprite normally first
        this.sprite.draw(ctx, position.x, position.y, width, height, rotation);
        
        // Apply color tinting if needed using source-atop blend mode
        if (needsTinting) {
            ctx.save();
            
            // Use source-atop to only tint existing pixels
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = this.options.color;
            
            // Get final dimensions for the color overlay
            const finalWidth = width || this.sprite.width;
            const finalHeight = height || this.sprite.height;
            
            // Sprites are drawn from center, so we need to adjust the tint rectangle position
            if (rotation !== 0) {
                ctx.translate(position.x, position.y);
                ctx.rotate(rotation);
                ctx.fillRect(-finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
            } else {
                // Draw tint rectangle from center position (same as sprite)
                ctx.fillRect(position.x - finalWidth / 2, position.y - finalHeight / 2, finalWidth, finalHeight);
            }
            
            ctx.restore();
        }
        
        // Restore opacity context if it was applied
        if (needsOpacity) {
            ctx.restore();
        }
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
     * Get the current opacity of the sprite
     * @returns {number} The opacity value (0.0 to 1.0)
     */
    getOpacity() {
        return this.options.opacity;
    }

    /**
     * Set the opacity of the sprite
     * @param {number} opacity - Opacity value (0.0 to 1.0)
     */
    setOpacity(opacity) {
        this.options.opacity = Math.max(0, Math.min(1, opacity));
    }

    /**
     * Get the current tint color of the sprite
     * @returns {string} The tint color in hex format
     */
    getColor() {
        return this.options.color;
    }

    /**
     * Set the tint color of the sprite
     * @param {string} color - Tint color in hex format (e.g., "#FF0000") or rgba format (e.g., "rgba(255, 0, 0, 0.5)")
     */
    setColor(color) {
        this.options.color = color;
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