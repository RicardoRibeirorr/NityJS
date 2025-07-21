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
        const position = this.gameObject.getGlobalPosition();
        let w = this.width;
        let h = this.height;

        // const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
        // if ((w === null || h === null) && sprite) {
        //     w = w ?? sprite.width;
        //     h = h ?? sprite.height;
        // }

        // Center the collider on the GameObject's position (Unity-style)
        return { 
            x: position.x - w / 2, 
            y: position.y - h / 2, 
            width: w, 
            height: h 
        };
    }

    /**
     * Draws gizmos for the box collider bounds.
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
        
        // Draw the collision bounds rectangle
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Draw a small cross at the center for reference
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const crossSize = 3;
        
        ctx.setLineDash([]); // Solid line for cross
        ctx.beginPath();
        ctx.moveTo(centerX - crossSize, centerY);
        ctx.lineTo(centerX + crossSize, centerY);
        ctx.moveTo(centerX, centerY - crossSize);
        ctx.lineTo(centerX, centerY + crossSize);
        ctx.stroke();
        
        ctx.restore();
    }
}