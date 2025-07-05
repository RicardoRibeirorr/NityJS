import { Component } from '../../common/Component.js';

/**
 * ImageComponent is a component that allows a GameObject to display an image.
 * It loads the image from a given source URL and draws it on the canvas.
 * This component can be used to render images as part of the GameObject's visual representation.
 */
export class ImageComponent extends Component {
    /**
     * ImageComponent is used to render an image on the GameObject.
     * It loads the image from the provided source URL and draws it on the canvas.
     * 
     * @param {string} src - The source URL of the image to be loaded.
     */
    constructor(src) {
        super();
        this.src = src;
        this.image = null;
    }

    /**
     * Preloads the image from the source URL.
     * This method returns a promise that resolves when the image is loaded.
     * It should be called before the image is drawn to ensure it is available.
     * 
     * @returns {Promise<void>} A promise that resolves when the image is loaded.
     */
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

    /**
     * Draws the image on the canvas at the GameObject's global position.
     * This method should be called during the rendering phase to display the image.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
        if (this.image) {
            const x = this.gameObject.getGlobalX();
            const y = this.gameObject.getGlobalY();
            ctx.drawImage(this.image, x, y);
        }
    }
}