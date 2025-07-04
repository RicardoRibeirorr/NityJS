import { Component } from "../../common/Component.js";
import { CollisionSystem } from "../../bin/CollisionSystem.js";
import { SpriteRendererComponent } from "../../renderer/components/SpriteRendererComponent.js";

// === BoxColliderComponent.js ===
export class BoxColliderComponent extends Component {
    constructor(width = null, height = null, trigger = false) {
        super();
        this.width = width;
        this.height = height;
        this.trigger = trigger;
        this._lastCollisions = new Set();
    }

    start() {
        CollisionSystem.instance.register(this);
    }

    destroy() {
        CollisionSystem.instance.unregister(this);
    }

    getBounds() {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();

        let w = this.width;
        let h = this.height;

        if (w === null || h === null) {
            const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
            if (spriteRenderer?.sprite) {
                w = w ?? spriteRenderer.sprite.width;
                h = h ?? spriteRenderer.sprite.height;
            }
        }

        // Fallback to 0 if still undefined (prevent invalid collision boxes)
        w = w ?? 0;
        h = h ?? 0;

        return { x, y, width: w, height: h };
    }
}