import { Game } from '../core/Game.js';
import { Sprite } from './Sprite.js';

// === Spritesheet.js ===
export class Spritesheet {
    constructor(name, src, frameWidth, frameHeight, cols, rows) {
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

    getSprite(name) {
        return this.sprites.get(name);
    }
}