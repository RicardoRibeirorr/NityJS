/**
 * Sprite represents a single sprite or image region within a spritesheet.
 * It contains information about the image source and the specific region to display.
 * 
 * @example
 * // Create a sprite from a region of a larger image
 * const sprite = new Sprite(image, 32, 0, 32, 32);
 */
// === Sprite.js ===
// export class Sprite {
//     /**
//      * Creates a new Sprite instance.
//      * 
//      * @param {HTMLImageElement} image - The source image element
//      * @param {number} x - The x coordinate of the sprite region in the source image
//      * @param {number} y - The y coordinate of the sprite region in the source image
//      * @param {number} width - The width of the sprite region
//      * @param {number} height - The height of the sprite region
//      */
//     constructor(image, x, y, width, height) {
//         this.image = image;
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.isLoaded = true; // For compatibility
//     }

//     /**
//      * Draws the sprite on the canvas with optional rotation.
//      * 
//      * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
//      * @param {number} drawX - The x coordinate to draw the sprite at
//      * @param {number} drawY - The y coordinate to draw the sprite at
//      * @param {number} [drawWidth] - Optional width to scale the sprite to
//      * @param {number} [drawHeight] - Optional height to scale the sprite to
//      * @param {number} [rotation=0] - Rotation in radians
//      */
//     draw(ctx, drawX, drawY, drawWidth, drawHeight, rotation = 0) {
//         if (!this.image) return;

//         const finalWidth = drawWidth || this.width;
//         const finalHeight = drawHeight || this.height;

//         ctx.save();

//         if (rotation !== 0) {
//             // Translate to the center of the sprite for rotation
//             ctx.translate(drawX + finalWidth / 2, drawY + finalHeight / 2);
//             ctx.rotate(rotation);
//             // Draw relative to the center
//             ctx.drawImage(
//                 this.image,
//                 this.x, this.y, this.width, this.height,
//                 -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight
//             );
//         } else {
//             // No rotation, simple draw
//             ctx.drawImage(
//                 this.image,
//                 this.x, this.y, this.width, this.height,
//                 drawX, drawY, finalWidth, finalHeight
//             );
//         }

//         ctx.restore();
//     }
// }