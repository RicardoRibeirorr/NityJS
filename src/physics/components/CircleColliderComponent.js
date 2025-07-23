import { AbstractColliderComponent } from "../AbstractColliderComponent.js";
import { SpriteRendererComponent } from "../../renderer/components/SpriteRendererComponent.js";

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
     * Get default metadata configuration for CircleColliderComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            radius: null,
            trigger: false
        };
    }

    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(radius = null, trigger = false) {
        const metadata = {
            radius: radius,
            trigger: trigger
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
        this.radius = this.__meta.radius;
        this.trigger = this.__meta.trigger;
    }

    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (meta.radius !== null && (typeof meta.radius !== 'number' || meta.radius <= 0)) {
            throw new Error('radius must be null or a positive number');
        }
        
        if (typeof meta.trigger !== 'boolean') {
            throw new Error('trigger must be a boolean');
        }
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
        const position = this.gameObject.getGlobalPosition();
        let r = this.radius;
        // const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
        // if (r === null && sprite) {
        //     r = sprite.width / 2;
        // }
        return { x: position.x, y: position.y, radius: r };
    }

    /**
     * Draws gizmos for the circle collider bounds.
     * This method is called automatically by the engine for debugging visualization.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __internalGizmos(ctx) {
        const bounds = this.getBounds();
        
        ctx.save();
        
        // Set gizmo styling
        ctx.strokeStyle = this.trigger ? '#00ffddff' : '#00FF00'; // Green for triggers, red for colliders
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]); // Dashed line for gizmos
        
        // Draw the collision bounds circle
        ctx.beginPath();
        ctx.arc(bounds.x, bounds.y, bounds.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw a small cross at the center for reference
        const crossSize = 3;
        ctx.setLineDash([]); // Solid line for cross
        ctx.beginPath();
        ctx.moveTo(bounds.x - crossSize, bounds.y);
        ctx.lineTo(bounds.x + crossSize, bounds.y);
        ctx.moveTo(bounds.x, bounds.y - crossSize);
        ctx.lineTo(bounds.x, bounds.y + crossSize);
        ctx.stroke();
        
        ctx.restore();
    }
}
