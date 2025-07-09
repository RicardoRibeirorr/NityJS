import { Component } from '../../common/Component.js';
import { Game } from '../../core/Game.js';

/**
 * SpriteRendererComponent renders sprites from spritesheets on GameObjects.
 * This component works with the SpriteRegistry to display specific sprites
 * and is commonly used with SpriteAnimationComponent for animated graphics.
 * 
 * @example
 * // Render a specific sprite from a spritesheet
 * const renderer = new SpriteRendererComponent("player", "sprite_0_0");
 * gameObject.addComponent(renderer);
 */
// === SpriteRendererComponent.js ===
export class SpriteRendererComponent extends Component {
    /**
     * Creates a new SpriteRendererComponent.
     * 
     * @param {string} sheetName - Name of the spritesheet containing the sprite
     * @param {string} spriteName - Name of the specific sprite to render
     */
    constructor(sheetName, spriteName) {
        super();
        this.sheetName = sheetName;
        this.spriteName = spriteName;
        this.sprite = null;
    }

    /**
     * Preloads the sprite from the spritesheet. Called automatically during GameObject preload.
     * 
     * @throws {Error} If the spritesheet or sprite is not found
     */
    preload() {
        const sheet = Game.instance.spriteRegistry.getSheet(this.sheetName);
        if (!sheet) throw new Error(`Spritesheet '${this.sheetName}' not found.`);
        this.sprite = sheet.getSprite(this.spriteName);
        if (!this.sprite) throw new Error(`Sprite '${this.spriteName}' not found in sheet '${this.sheetName}'.`);
    }

    /**
     * Draws the sprite on the canvas at the GameObject's global position.
     * Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
        if (!this.sprite) return;
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
        ctx.drawImage(
            this.sprite.image,
            this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height,
            x, y, this.sprite.width, this.sprite.height
        );
    }
}