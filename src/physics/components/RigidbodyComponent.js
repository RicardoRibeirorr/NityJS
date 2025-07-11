import {
    Component
} from "../../common/Component.js";
import {
    CollisionSystem
} from "../../bin/CollisionSystem.js";
import {
    AbstractColliderComponent
} from "../AbstractColliderComponent.js";
import {
    Game
} from "../../core/Game.js";
import {
    GameObject
} from "../../common/GameObject.js";

import {
    GravityComponent
} from "./GravityComponent.js";
import { Time } from "../../core/Time.js";

// === RigidbodyComponent.js ===
export class RigidbodyComponent extends GravityComponent {
    #_collider;
    #_lastCollisions = new Set();
    bounciness = 0; // 0 = no bounce, 1 = full bounce
    gravity= false;
    gravityScale= 300;


    constructor(options = {
        gravity: false,
        gravityScale: 300,
        bounciness: 0
    }) {
        super(options);
        this.gravity = options.gravity!=null ? options.gravity : false;
        this.bounciness = options.bounciness || 0;
    }

    /**
     * Initializes the RigidbodyComponent, ensuring it has a collider.
     * @returns {void}
     */
    start() {
        this.#_collider = this.gameObject.getComponent(AbstractColliderComponent);
        if (!this.#_collider) {
            console.warn("RigidbodyComponent requires a collider.");
        }
    }

    /**
     * Updates the RigidbodyComponent, applying gravity and moving the GameObject.
     */
    update() {
        super.update(); // apply gravity
        this.move(this.velocity.x * Time.deltaTime(), this.velocity.y * Time.deltaTime());
    }

    /**
     * Moves the GameObject and handles collision resolution.
     * @param {number} dx - The change in x position.
     * @param {number} dy - The change in y position.
     * @returns {boolean} - Returns true if the movement was successful.
     */
     move(dx, dy) {
        if (!this.#_collider) return true;

        // Better step calculation for more accurate collision detection
        const maxSpeed = Math.max(Math.abs(dx), Math.abs(dy));
        const steps = Math.max(1, Math.ceil(maxSpeed / 0.25)); // Even smaller steps for better precision
        const stepX = dx / steps;
        const stepY = dy / steps;

        let currentCollisions = new Set();
        let resolved = false;
        let totalMoved = { x: 0, y: 0 };

        for (let i = 0; i < steps; i++) {
            // Store position before move
            const prevX = this.gameObject.x;
            const prevY = this.gameObject.y;
            
            this._doMove(stepX, stepY);
            totalMoved.x += stepX;
            totalMoved.y += stepY;

            for (const other of CollisionSystem.instance.colliders) {
                if (other === this.#_collider) continue;
                if (!this.#_collider.checkCollisionWith(other)) continue;

                const otherObj = other.gameObject;
                currentCollisions.add(otherObj);

                const wasColliding = this.#_lastCollisions.has(otherObj);
                const isTrigger = this.#_collider.isTrigger() || other.isTrigger();

                if (!wasColliding) {
                    this.#eventEnter(this.gameObject, otherObj);
                    if (!otherObj.hasComponent?.(RigidbodyComponent))
                        this.#eventEnter(otherObj, this.gameObject);
                } else {
                    // Fire collision stay events
                    this.#eventStay(this.gameObject, otherObj);
                    if (!otherObj.hasComponent?.(RigidbodyComponent))
                        this.#eventStay(otherObj, this.gameObject);
                }

                if (!isTrigger && !resolved) {
                    // Simple and reliable collision resolution: move back to previous position
                    this.gameObject.x = prevX;
                    this.gameObject.y = prevY;
                    
                    // Apply bounce based on movement direction
                    if (Math.abs(stepY) > Math.abs(stepX)) {
                        this.velocity.y *= -this.bounciness;
                    } else {
                        this.velocity.x *= -this.bounciness;
                    }
                    
                    resolved = true;
                    break;
                }
            }

            if (resolved) break;
        }

        // Enhanced exit detection with hysteresis
        this.#handleExitEvents(currentCollisions);

        this.#_lastCollisions = currentCollisions;
        return true;
    }

    /**
     * Handle exit events with improved stability for edge cases
     * @param {Set} currentCollisions - Set of currently colliding objects
     */
    #handleExitEvents(currentCollisions) {
        for (const obj of this.#_lastCollisions) {
            if (!currentCollisions.has(obj)) {
                const otherCollider = obj.getComponent(AbstractColliderComponent);
                if (otherCollider) {
                    // Use a larger tolerance for exit detection to prevent flicker
                    if (!this.#isNearCollision(otherCollider, 2.5)) {
                        // Objects are truly separated, fire exit immediately
                        this.#eventExit(this.gameObject, obj);
                        if (!obj?.hasComponent?.(RigidbodyComponent))
                            this.#eventExit(obj, this.gameObject);
                    } else {
                        // Still very close, keep in collision set to prevent rapid enter/exit
                        currentCollisions.add(obj);
                    }
                } else {
                    // No collider, fire exit immediately
                    this.#eventExit(this.gameObject, obj);
                    if (!obj?.hasComponent?.(RigidbodyComponent))
                        this.#eventExit(obj, this.gameObject);
                }
            }
        }
    }

    /**
     * Check if two colliders are near each other within tolerance
     * @param {AbstractColliderComponent} other - The other collider
     * @param {number} tolerance - Distance tolerance
     * @returns {boolean} True if objects are within tolerance distance
     */
    #isNearCollision(other, tolerance = 2.0) {
        const myBounds = this.#_collider.getBounds();
        const otherBounds = other.getBounds();
        
        return (
            myBounds.x < otherBounds.x + otherBounds.width + tolerance &&
            myBounds.x + myBounds.width + tolerance > otherBounds.x &&
            myBounds.y < otherBounds.y + otherBounds.height + tolerance &&
            myBounds.y + myBounds.height + tolerance > otherBounds.y
        );
    }

    #eventEnter(gameObject, otherGameObject) {
        const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);

        if (selfCol?.isTrigger()) {
            gameObject?.onTriggerEnter?.(otherGameObject);
        } else {
            gameObject?.onCollisionEnter?.(otherGameObject);
        }
    }
    #eventStay(gameObject, otherGameObject) {
        const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);

        if (selfCol?.isTrigger()) {
            gameObject?.onTriggerStay?.(otherGameObject);
        } else {
            gameObject?.onCollisionStay?.(otherGameObject);
        }
    }
    #eventExit(gameObject, otherGameObject) {
        const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);

        if (selfCol?.isTrigger()) {
            gameObject?.onTriggerExit?.(otherGameObject);
        } else {
            gameObject?.onCollisionExit?.(otherGameObject);
        }
    }

    /**
     * Directly moves the GameObject without collision checking.
     * @param {number} dx - The change in x position.
     * @param {number} dy - The change in y position.
     */
    _doMove(dx, dy) {
        this.gameObject.x += dx;
        this.gameObject.y += dy;
    }
}