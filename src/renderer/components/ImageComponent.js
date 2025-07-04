import { Component } from '../../common/Component.js';

// === ImageComponent.js ===
export class ImageComponent extends Component {
    constructor(src) {
        super();
        this.src = src;
        this.image = null;
    }

    async preload() {
        return new Promise(resolve => {
            const img = new Image();
            img.src = this.src;
            img.onload = () => {
                this.image = img;
                resolve();
            };
        });
    }

    draw(ctx) {
        if (this.image) {
            const x = this.gameObject.getGlobalX();
            const y = this.gameObject.getGlobalY();
            ctx.drawImage(this.image, x, y);
        }
    }
}