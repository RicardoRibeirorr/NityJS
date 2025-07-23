import { Component } from '../../common/Component.js';
import { Vector2 } from '../../math/Vector2.js';

// === CameraComponent.js ===
export class CameraComponent extends Component {
    constructor(canvas, zoom = 1) {
        super();
        this.canvas = canvas;
        this.zoom = zoom;
    }

    /**
     * Get default metadata configuration for CameraComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            zoom: 1
        };
    }

    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(canvas, zoom = 1) {
        const metadata = {
            zoom: zoom
        };
        
        // Canvas cannot be set via metadata as it's a complex object
        this.canvas = canvas;
        this.applyMeta(metadata);
    }

    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
        this.zoom = this.__meta.zoom;
    }

    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (typeof meta.zoom !== 'number' || meta.zoom <= 0) {
            throw new Error('zoom must be a positive number');
        }
    }

    applyTransform(ctx) {
        const position = this.gameObject.getGlobalPosition();
        ctx.setTransform(
            this.zoom, 0,
            0, this.zoom,
            -position.x * this.zoom + this.canvas.width / 2,
            -position.y * this.zoom + this.canvas.height / 2
        );
    }
}