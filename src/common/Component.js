// === Component.js ===
export class Component {
    constructor() {
        this.gameObject = null;
        this.enabled = true;
        this._started = false;
    }

    
    __lateStart(){}
    __update(){}
    __draw(ctx) {
        if (this.enabled && typeof this.draw === 'function') {
            this.draw(ctx);
        }
    }
    __preload() {}

    start() {}
    update() {}
    draw(ctx) {}
    async preload() {}
    destroy() {}
    lateUpdate() {}
}