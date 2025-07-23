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
import { Vector2 } from "../../math/Vector2.js";

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
     * Get default metadata configuration for RigidbodyComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            gravity: false,
            gravityScale: 300,
            bounciness: 0
        };
    }

    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(options = {}) {
        const metadata = {
            gravity: options.gravity !== null ? options.gravity : false,
            gravityScale: options.gravityScale || 300,
            bounciness: options.bounciness || 0
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
        this.gravity = this.__meta.gravity;
        this.gravityScale = this.__meta.gravityScale;
        this.bounciness = this.__meta.bounciness;
    }

    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (typeof meta.gravity !== 'boolean') {
            throw new Error('gravity must be a boolean');
        }
        
        if (typeof meta.gravityScale !== 'number' || meta.gravityScale < 0) {
            throw new Error('gravityScale must be a non-negative number');
        }
        
        if (typeof meta.bounciness !== 'number' || meta.bounciness < 0 || meta.bounciness > 1) {
            throw new Error('bounciness must be a number between 0 and 1');
        }
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
        const movement = this.velocity.multiply(Time.deltaTime);
        this.move(movement.x, movement.y);
    }

    /**
     * Moves the GameObject and handles collision resolution.
     * @param {number|Vector2} dx - The change in x position or Vector2 movement.
     * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
     * @returns {boolean} - Returns true if the movement was successful.
     */
     move(dx, dy) {

        // Handle Vector2 input
        let moveX, moveY;
        if (dx instanceof Vector2) {
            moveX = dx.x;
            moveY = dx.y;
        } else {
            moveX = dx;
            moveY = dy;
        }

        // Better step calculation for more accurate collision detection
        const maxSpeed = Math.max(Math.abs(moveX), Math.abs(moveY));
        const steps = Math.max(1, Math.ceil(maxSpeed / 0.25)); // Even smaller steps for better precision
        const stepX = moveX / steps;
        const stepY = moveY / steps;

        let currentCollisions = new Set();
        let resolved = false;
        let totalMoved = new Vector2(0, 0);
        
        for (let i = 0; i < steps; i++) {
            // Store position before move
            const prevPos = this.gameObject.position.clone();
            
            this._doMove(stepX, stepY);
            totalMoved = totalMoved.add(new Vector2(stepX, stepY));

        if (this.#_collider){
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
                    this.gameObject.setPosition(prevPos);
                    
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
            }

            if (resolved) break;

        // Enhanced exit detection with hysteresis
        this.#handleExitEvents(currentCollisions);

        this.#_lastCollisions = currentCollisions;
    }
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
     * @param {number|Vector2} dx - The change in x position or Vector2 movement.
     * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
     */
    _doMove(dx, dy) {
        if (dx instanceof Vector2) {
            this.gameObject.translate(dx);
        } else {
            this.gameObject.translate(dx, dy);
        }
    }
}