import { Component } from '../../common/Component.js';
/**
 * ImageComponent is a component that allows a GameObject to display an image.
 * It loads the image from a given source URL and draws it on the canvas.
 * This component can be used to render images as part of the GameObject's visual representation.
 */
export class ImageComponent extends Component {
    /**
     * @param {string} src - The source URL of the image to be loaded.
     * @param {number} [width] - Optional width to draw the image.
     * @param {number} [height] - Optional height to draw the image.
     */
    constructor(src, width = null, height = null) {
        super();
        this.src = src;
        this.image = null;
        this.width = width;
        this.height = height;
    }

    /**
     * Preloads the image from the source URL.
     * 
     * @returns {Promise<void>} A promise that resolves when the image is loaded.
     */
    async preload() {
        return new Promise(resolve => {
            const img = new Image();
            img.src = this.src;
            img.onload = () => {
                this.image = img;
                // Fallback to natural size if width/height not provided
                if (this.width === null) this.width = img.width;
                if (this.height === null) this.height = img.height;
                resolve();
            };
        });
    }

    /**
     * Draws the image on the canvas at the GameObject's global position with rotation support.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
        if (this.image) {
            const position = this.gameObject.getGlobalPosition();
            const rotation = this.gameObject.getGlobalRotation();

            ctx.save();
            
            // Translate to the GameObject's position
            ctx.translate(position.x, position.y);
            
            // Apply rotation if any
            if (rotation !== 0) {
                ctx.rotate(rotation);
            }
            
            // Draw image centered on the position (like Unity)
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            
            ctx.restore();
        }
    }
}
3