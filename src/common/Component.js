// === Component.js ===
export class Component {
    constructor() {
        this.gameObject = null;
        this.enabled = true;
        this._started = false;
    }

    start() {}
    update(deltaTime) {}
    draw(ctx) {}
    async preload() {}
    destroy() {}
    lateUpdate(deltaTime) {}
}