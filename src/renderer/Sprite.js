/**
 * Sprite represents a single sprite or image region within a spritesheet.
 * It contains information about the image source and the specific region to display.
 * 
 * @example
 * // Create a sprite from a region of a larger image
 * const sprite = new Sprite(image, 32, 0, 32, 32);
 */
// === Sprite.js ===
export class Sprite {
    /**
     * Creates a new Sprite instance.
     * 
     * @param {HTMLImageElement} image - The source image element
     * @param {number} x - The x coordinate of the sprite region in the source image
     * @param {number} y - The y coordinate of the sprite region in the source image
     * @param {number} width - The width of the sprite region
     * @param {number} height - The height of the sprite region
     */
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}