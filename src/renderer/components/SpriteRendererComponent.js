import { Component } from '../../common/Component.js';
import { Game } from '../../core/Game.js';

// === SpriteRendererComponent.js ===
export class SpriteRendererComponent extends Component {
    constructor(sheetName, spriteName) {
        super();
        this.sheetName = sheetName;
        this.spriteName = spriteName;
        this.sprite = null;
    }

    preload() {
        const sheet = Game.instance.spriteRegistry.getSheet(this.sheetName);
        if (!sheet) throw new Error(`Spritesheet '${this.sheetName}' not found.`);
        this.sprite = sheet.getSprite(this.spriteName);
        if (!this.sprite) throw new Error(`Sprite '${this.spriteName}' not found in sheet '${this.sheetName}'.`);
    }

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