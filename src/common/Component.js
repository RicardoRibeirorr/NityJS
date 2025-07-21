import { Game } from '../core/Game.js';

// === Component.js ===
export class Component {
    constructor() {
        this.gameObject = null;
        this.enabled = true;
        this._started = false;
        this._internalGizmos = this._internalGizmos || (Game.instance?._internalGizmos ?? false);
    }

    __lateStart(){}
    __update(){}
    __draw(ctx) {
        if (this.enabled && typeof this.draw === 'function') {
            this.draw(ctx);
        }
        if(this._internalGizmos) {
            this.__internalGizmos(ctx);
        }
        if(this.OnDrawGizmos && typeof this.OnDrawGizmos === 'function') {
            this.OnDrawGizmos(ctx);
        }
    }
    __preload() {}
    __internalGizmos(ctx){}

    start() {}
    update() {}
    draw(ctx) {}
    async preload() {}
    destroy() {}
    lateUpdate() {}
}