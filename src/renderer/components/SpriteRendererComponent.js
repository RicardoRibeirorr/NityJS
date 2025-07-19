import { Component } from '../../common/Component.js';
import { SpriteRegistry } from '../../asset/SpriteRegistry.js';
import { Vector2 } from '../../math/Vector2.js';

/**
 * SpriteRendererComponent renders sprites from both single sprites and spritesheets on GameObjects.
 * This component works with the unified SpriteRegistry to display sprites using colon-separated keys.
 * 
 * @example
 * // Render a single sprite
 * const renderer = new SpriteRendererComponent("player");
 * gameObject.addComponent(renderer);
 * 
 * // Render a specific sprite from a spritesheet using colon notation
 * const renderer = new SpriteRendererComponent("enemies:sprite_0");
 * gameObject.addComponent(renderer);
 * 
 * // Legacy support (will be converted internally)
 * const renderer = new SpriteRendererComponent("enemies", "sprite_0");
 * gameObject.addComponent(renderer);
 */
export class SpriteRendererComponent extends Component {
    /**
     * Creates a new SpriteRendererComponent.
     * 
     * @param {string} spriteKey - Unified sprite key ("name" or "sheet:sprite") or legacy assetName
     * @param {string} [spriteName] - Legacy: sprite name for spritesheets (deprecated, use colon notation)
     */
    constructor(spriteKey, spriteName = null) {
        super();
        
        // Handle legacy two-parameter format
        if (spriteName !== null) {
            console.warn(`SpriteRendererComponent: Two-parameter constructor is deprecated. Use "${spriteKey}:${spriteName}" instead.`);
            this.spriteKey = `${spriteKey}:${spriteName}`;
        } else {
            this.spriteKey = spriteKey;
        }
        
        this.sprite = null;
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
     * Draws the sprite on the canvas at the GameObject's global position.
     * Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
        if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
        
        const position = this.gameObject.getGlobalPosition();
        
        // Use the sprite's draw method for consistent rendering
        this.sprite.draw(ctx, position.x, position.y, null, null, this.gameObject.rotation || 0);
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
}