import {
    Component
} from "../../common/Component.js";
import {
    CollisionSystem
} from "../../bin/CollisionSystem.js";
Game
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

        const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 1);
        const stepX = dx / steps;
        const stepY = dy / steps;

        let currentCollisions = new Set();
        let resolved = false;

        for (let i = 0; i < steps; i++) {
            this._doMove(stepX, stepY);

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
                    this.#eventStay(this.gameObject, otherObj);
                    if (!otherObj.hasComponent?.(RigidbodyComponent))
                        this.#eventStay(otherObj, this.gameObject);
                }

                if (!isTrigger && !resolved) {
                    // Bounce logic based on movement direction
                    if (Math.abs(stepY) > Math.abs(stepX)) {
                        this.velocity.y *= -this.bounciness;
                    } else {
                        this.velocity.x *= -this.bounciness;
                    }

                    this._doMove(-stepX, -stepY);
                    resolved = true;
                    break;
                }
            }

            if (resolved) break;
        }

        // Handle collision exit
        for (const obj of this.#_lastCollisions) {
            if (!currentCollisions.has(obj)) {
                this.#eventExit(this.gameObject, obj);
                if (!obj?.hasComponent?.(RigidbodyComponent))
                    this.#eventExit(obj, this.gameObject);
            }
        }

        this.#_lastCollisions = currentCollisions;
        return true;
    }

    #step(dx, dy) {
        this.gameObject.x += dx;
        this.gameObject.y += dy;
    }

    #rollbackStep(dx, dy) {
        this.gameObject.x -= dx;
        this.gameObject.y -= dy;
    }

    #shouldResolve(other) {
        return !this.#_collider.isTrigger() && !other.isTrigger();
    }

    #handleEnterOrStay(other, otherObj) {
        const wasColliding = this.#_lastCollisions.has(otherObj);
        const isTrigger = this.#_collider.isTrigger() || other.isTrigger();

        if (!wasColliding) {
            this.#eventEnter(this.gameObject, otherObj);
            if (!otherObj?.hasComponent?.(RigidbodyComponent))
                this.#eventEnter(otherObj, this.gameObject);
        } else {
            this.#eventStay(this.gameObject, otherObj);
            if (!otherObj?.hasComponent?.(RigidbodyComponent))
                this.#eventStay(otherObj, this.gameObject);
        }
    }

    #handleExit(currentCollisions) {
        for (const obj of this.#_lastCollisions) {
            if (!currentCollisions.has(obj)) {
                const otherCol = obj.getComponent?.(AbstractColliderComponent);
                const isTrigger = this.#_collider.isTrigger() || otherCol?.isTrigger();
                this.#eventExit(this.gameObject, obj);
                if (!otherCol?.hasComponent?.(RigidbodyComponent))
                    this.#eventExit(obj, this.gameObject);
            }
        }
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
}