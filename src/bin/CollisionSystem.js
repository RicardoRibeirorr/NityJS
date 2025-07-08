import {
    AbstractColliderComponent
} from '../physics/AbstractColliderComponent.js';

// === CollisionSystem.js ===
export class CollisionSystem {
    constructor() {
        this.colliders = new Set();
        CollisionSystem.instance = this;
    }

    register(collider) {
        this.colliders.add(collider);
    }

    unregister(collider) {
        this.colliders.delete(collider);
    }

    update() {
        // Comment out the collision detection to avoid duplicate events
        // RigidbodyComponent handles collision detection and events
    }

    intersects(a, b) {
        if (a instanceof AbstractColliderComponent && b instanceof AbstractColliderComponent) {
            return a.checkCollisionWith(b);
        }

        console.warn("INTERNAL_ERROR:At least one object is not an collider component:", a, b);
        return false;
    }
}

CollisionSystem.instance = undefined;