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
        // for (let a of this.colliders) {
        //     for (let b of this.colliders) {
        //         if (a === b) continue;
        //         if (this.intersects(a, b)) {

        //             //ON TRIGGER ENTER or ON COLLISION ENTER:
        //             if (!a._lastCollisions.has(b)) {
        //                 a._lastCollisions.add(b);

        //                 if (a.isTrigger()) a.gameObject.onTriggerEnter?.(b.gameObject);
        //                 else a.gameObject.onCollisionEnter?.(b.gameObject);

        //                 if (b.isTrigger()) b.gameObject.onTriggerEnter?.(a.gameObject);
        //                 else b.gameObject.onCollisionEnter?.(a.gameObject);

        //                 //ON TRIGGER STAY or ON COLLISION STAY:
        //             } else {
        //                 if (a.isTrigger()) a.gameObject.onTriggerStay?.(b.gameObject);
        //                 else a.gameObject.onCollisionStay?.(b.gameObject);

        //                 if (b.isTrigger()) b.gameObject.onTriggerStay?.(a.gameObject);
        //                 else b.gameObject.onCollisionStay?.(a.gameObject);
        //             }

        //             //ON TRIGGER EXIT or ON COLLISION EXIT:
        //         } else if (a._lastCollisions.has(b)) {
        //             a._lastCollisions.delete(b);

        //             if (a.isTrigger()) a.gameObject.onTriggerExit?.(b.gameObject);
        //             else a.gameObject.onCollisionExit?.(b.gameObject);

        //             if (b.isTrigger()) b.gameObject.onTriggerExit?.(a.gameObject);
        //             else b.gameObject.onCollisionExit?.(a.gameObject);
        //         }
        //     }
        // }
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