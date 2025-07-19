import { Component } from '../../common/Component.js';
import { Vector2 } from '../../math/Vector2.js';

// === CameraComponent.js ===
export class CameraComponent extends Component {
    constructor(canvas, zoom = 1) {
        super();
        this.canvas = canvas;
        this.zoom = zoom;
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