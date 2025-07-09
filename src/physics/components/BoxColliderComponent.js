import { AbstractColliderComponent } from "../AbstractColliderComponent.js";
import { CollisionSystem } from "../../bin/CollisionSystem.js";
import { SpriteRendererComponent } from "../../renderer/components/SpriteRendererComponent.js";
import { CircleColliderComponent } from "./CircleColliderComponent.js";

// === BoxColliderComponent.js ===
export class BoxColliderComponent extends AbstractColliderComponent {
    constructor(width = null, height = null, trigger = false) {
        super();
        this.width = width;
        this.height = height;
        this.trigger = trigger;
    }

    checkCollisionWith(other) {
        if (other instanceof BoxColliderComponent) {
            return this.checkBoxBoxCollision(other);
        } else if (other instanceof CircleColliderComponent) {
            return other.checkCollisionWith(this); // Delegate to Circle
        }
        return false;
    }

    checkBoxBoxCollision(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        // Smaller tolerance for more precise collision detection
        const tolerance = 0.01; // Very small tolerance to prevent penetration
        
        return (
            a.x < b.x + b.width + tolerance &&
            a.x + a.width + tolerance > b.x &&
            a.y < b.y + b.height + tolerance &&
            a.y + a.height + tolerance > b.y
        );
    }

    getBounds() {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
        let w = this.width;
        let h = this.height;

        const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
        if ((w === null || h === null) && sprite) {
            w = w ?? sprite.width;
            h = h ?? sprite.height;
        }

        return { x, y, width: w, height: h };
    }
}