import { Component } from '../../common/Component.js';
import { Time } from '../../core/Time.js';
import { Vector2 } from '../../math/Vector2.js';

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
        this.velocity = new Vector2(0, 0);
    }

    /**
     * Updates the gravity effect. Called automatically each frame.
     * Increases the Y velocity based on gravity scale and delta time.
     */
    update() {
        if (this.gravity) {
            this.velocity.y += this.gravityScale * Time.deltaTime;
        }
    }

    /**
     * Moves the GameObject by the specified offset.
     * @private
     * 
     * @param {number|Vector2} dx - X offset or Vector2 offset
     * @param {number} [dy] - Y offset (ignored if dx is Vector2)
     */
    _doMove(dx, dy) {
        if (dx instanceof Vector2) {
            this.gameObject.translate(dx);
        } else {
            this.gameObject.translate(dx, dy);
        }
    }
}