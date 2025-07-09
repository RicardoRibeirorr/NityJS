import { Component } from '../../common/Component.js';
import { Time } from '../../core/Time.js';

/**
 * GravityComponent applies a gravity effect to GameObjects.
 * It modifies the GameObject's velocity based on the gravity scale and delta time,
 * creating realistic falling behavior when combined with RigidbodyComponent.
 * 
 * @example
 * // Create a falling object
 * const gravity = new GravityComponent({ gravityScale: 500 });
 * gameObject.addComponent(gravity);
 */
export class GravityComponent extends Component {

    /**
     * Creates a new GravityComponent.
     * 
     * @param {Object} [options={ gravityScale: 300 }] - Configuration options
     * @param {number} [options.gravityScale=300] - The scale of the gravity effect (pixels per second squared)
     */
    constructor(options = { gravityScale: 300 }) {
        super();
        this.gravity = true;
        this.gravityScale = options.gravityScale || 300;
        this.velocity = { x: 0, y: 0 };
    }

    /**
     * Updates the gravity effect. Called automatically each frame.
     * Increases the Y velocity based on gravity scale and delta time.
     */
    update() {
        if (this.gravity) {
            this.velocity.y += this.gravityScale * Time.deltaTime();
        }
    }

    /**
     * Moves the GameObject by the specified offset.
     * @private
     * 
     * @param {number} dx - X offset
     * @param {number} dy - Y offset
     */
    _doMove(dx, dy) {
        this.gameObject.x += dx;
        this.gameObject.y += dy;
    }
}