
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
        for (let a of this.colliders) {
            for (let b of this.colliders) {
                if (a === b) continue;

                const boundsA = a.getBounds();
                const boundsB = b.getBounds();

                if (this.intersects(boundsA, boundsB)) {
                    if (!a._lastCollisions.has(b)) {
                        a._lastCollisions.add(b);
                        a.gameObject.onCollisionEnter?.(b.gameObject);
                    } else {
                        a.gameObject.onCollisionStay?.(b.gameObject);
                    }
                } else if (a._lastCollisions.has(b)) {
                    a._lastCollisions.delete(b);
                    a.gameObject.onCollisionExit?.(b.gameObject);
                }
            }
        }
    }

    intersects(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}