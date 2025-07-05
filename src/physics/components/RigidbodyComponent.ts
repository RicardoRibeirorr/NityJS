import { Component } from "../../common/Component.js";
import { CollisionSystem } from "../../bin/CollisionSystem.js";
import { AbstractColliderComponent } from "../AbstractColliderComponent.js";

// === RigidbodyComponent.js ===
export class RigidbodyComponent extends Component {
    #_collider;
    #_lastCollisions = new Set();
    #_lastX: 0;
    #_lastY: 0;
    #_shouldResolve = false;


    constructor() {
        super();
    }

    start() {
        this.#_collider = this.gameObject.getComponent(AbstractColliderComponent);
        if (!this.#_collider) {
            console.warn("RigidbodyComponent requires a Collider component to function properly.");
        }
    }

    move(dx, dy) {
        this.#_lastX = this.gameObject.x;
        this.#_lastY = this.gameObject.y;

        this.gameObject.x += dx;
        this.gameObject.y += dy;

        this.#_shouldResolve = true;
    }

    onCollisionEnter(other) {
        if (!this.#_shouldResolve || !this.#_collider || other === this.#_collider) return;

            const otherCollider = other.getComponent(AbstractColliderComponent);

            if (!otherCollider.isTrigger() &&
                !this.#_collider.isTrigger() &&
                !otherCollider.isTrigger() &&
                this.#_collider.checkCollisionWith(otherCollider)
            ) {
                // Restore to last safe position
                this.gameObject.x = this.#_lastX;
                this.gameObject.y = this.#_lastY;
                return;
            }

        this.#_shouldResolve = false;
    }




    #triggerCollisionEnter(object, other) {
            object.onCollisionEnter?.(other.gameObject);
    }



    // update(deltaTime) {
    //     if (!this.#_collider) return;

    //     const oldX = this.gameObject.x;
    //     const oldY = this.gameObject.y;

    //     // Move object
    //     this.gameObject.x += this.velocity.x * deltaTime;
    //     this.gameObject.y += this.velocity.y * deltaTime;

    //     // Handle solid collision resolution
    //     for (const other of CollisionSystem.instance.colliders) {
    //         if (other === this.#_collider) continue;
    //         if (!this.#_collider.checkCollisionWith(other)) continue;

    //         // Resolve only if both are non-trigger
    //         if (!this.#_collider.trigger && !other.trigger) {
    //             this.gameObject.x = oldX;
    //             this.gameObject.y = oldY;
    //             break;
    //         }
    //     }
    // }
}
