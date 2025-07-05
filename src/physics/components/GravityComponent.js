import { Component } from '../../common/Component.js';

export class GravityComponent extends Component {

    /**
     * GravityComponent applies a gravity effect to the GameObject.
     * It modifies the GameObject's position based on the gravity scale and delta time.
     * 
     * @param {boolean} [gravity=true] - Whether to apply gravity.
     * @param {number} [gravityScale=300] - The scale of the gravity effect.
     */
    constructor(options = { gravityScale: 300 }) {
        super();
        this.gravity = true;
        this.gravityScale = options.gravityScale || 300;
        this.velocity = { x: 0, y: 0 };
    }

    update(deltaTime) {
        if (this.gravity) {
            this.velocity.y += this.gravityScale * deltaTime;
        }
    }

    _doMove(dx, dy) {
        this.gameObject.x += dx;
        this.gameObject.y += dy;
    }
}