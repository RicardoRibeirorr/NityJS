import { Component } from '../../common/Component.js';

// === CameraComponent.js ===
export class CameraComponent extends Component {
    constructor(canvas, zoom = 1) {
        super();
        this.canvas = canvas;
        this.zoom = zoom;
    }

    applyTransform(ctx) {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
        ctx.setTransform(
            this.zoom, 0,
            0, this.zoom,
            -x * this.zoom + this.canvas.width / 2,
            -y * this.zoom + this.canvas.height / 2
        );
    }
}