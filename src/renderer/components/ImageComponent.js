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
     * Get default metadata configuration for ImageComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            src: "",
            width: null,
            height: null
        };
    }

    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(src, width = null, height = null) {
        const metadata = {
            src: src || "",
            width: width,
            height: height
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
        this.src = this.__meta.src;
        this.width = this.__meta.width;
        this.height = this.__meta.height;
        
        // Reset image when src changes
        if (this.image && this.image.src !== this.src) {
            this.image = null;
        }
    }

    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (typeof meta.src !== 'string') {
            throw new Error('src must be a string');
        }
        
        if (meta.width !== null && (typeof meta.width !== 'number' || meta.width <= 0)) {
            throw new Error('width must be null or a positive number');
        }
        
        if (meta.height !== null && (typeof meta.height !== 'number' || meta.height <= 0)) {
            throw new Error('height must be null or a positive number');
        }
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

    /**
     * Draws gizmos for the image component bounds.
     * Shows the image's bounding box and center point for debugging.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __internalGizmos(ctx) {
        if (!this.image) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation to gizmos as well
        ctx.translate(position.x, position.y);
        if (rotation !== 0) ctx.rotate(rotation);
        
        // Set gizmo styling - magenta for image components
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]); // Different dash pattern for images
        
        // Draw the image bounds rectangle (centered)
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw center point
        ctx.setLineDash([]); // Solid line for center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw image source label
        ctx.fillStyle = '#FF00FF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const filename = this.src.split('/').pop(); // Get just the filename
        ctx.fillText(filename, 0, -this.height / 2 - 8);
        
        // Draw dimensions
        ctx.fillText(`${this.width}x${this.height}`, 0, this.height / 2 + 15);
        
        ctx.restore();
    }
}
3