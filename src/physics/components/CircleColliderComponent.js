import { AbstractColliderComponent } from "../AbstractColliderComponent";
import { SpriteRendererComponent } from "../../renderer/components/SpriteRendererComponent";

export class CircleColliderComponent extends AbstractColliderComponent {
    constructor(radius = null, trigger = false) {
        super();
        this.radius = radius;
        this.trigger = trigger;
    }

    checkCollisionWith(other) {
        if (other instanceof CircleColliderComponent) {
            const a = this.getBounds();
            const b = other.getBounds();
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.hypot(dx, dy);
            return distance < a.radius + b.radius;
        } else {
            return this.circleBoxCollision(other);
        }
    }

    circleBoxCollision(box) {
        const circle = this.getBounds();
        const b = box.getBounds();
        const closestX = Math.max(b.x, Math.min(circle.x, b.x + b.width));
        const closestY = Math.max(b.y, Math.min(circle.y, b.y + b.height));
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        return dx * dx + dy * dy < circle.radius * circle.radius;
    }

    getBounds() {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
        let r = this.radius;
        const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
        if (r === null && sprite) {
            r = sprite.width / 2;
        }
        return { x, y, radius: r };
    }
}
