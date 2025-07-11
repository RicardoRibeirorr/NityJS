import { AbstractColliderComponent } from "../AbstractColliderComponent";
import { SpriteRendererComponent } from "../../renderer/components/SpriteRendererComponent";

/**
 * CircleColliderComponent provides circular collision detection for GameObjects.
 * It can detect collisions with other circle colliders and box colliders,
 * and can be configured as either a solid collider or a trigger.
 * 
 * @example
 * // Create a circular collider with specific radius
 * const collider = new CircleColliderComponent(25, false);
 * gameObject.addComponent(collider);
 */
export class CircleColliderComponent extends AbstractColliderComponent {
    /**
     * Creates a new CircleColliderComponent.
     * 
     * @param {number} [radius=null] - Radius of the collider in pixels. If null, uses sprite width/2
     * @param {boolean} [trigger=false] - Whether this collider acts as a trigger (no physics response)
     */
    constructor(radius = null, trigger = false) {
        super();
        this.radius = radius;
        this.trigger = trigger;
    }

    /**
     * Checks collision with another collider component.
     * 
     * @param {AbstractColliderComponent} other - The other collider to check against
     * @returns {boolean} True if colliding, false otherwise
     */
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

    /**
     * Performs circle-box collision detection.
     * 
     * @param {BoxColliderComponent} box - The box collider to check against
     * @returns {boolean} True if colliding, false otherwise
     */
    circleBoxCollision(box) {
        const circle = this.getBounds();
        const b = box.getBounds();
        const closestX = Math.max(b.x, Math.min(circle.x, b.x + b.width));
        const closestY = Math.max(b.y, Math.min(circle.y, b.y + b.height));
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        return dx * dx + dy * dy < circle.radius * circle.radius;
    }

    /**
     * Gets the bounds of this collider for collision detection.
     * 
     * @returns {Object} Bounds object with x, y, and radius properties
     */
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
