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

// === RigidbodyComponent.js ===
export class RigidbodyComponent extends Component {
    #_collider;
    #_lastCollisions = new Set();
    #_lastX: 0;
    #_lastY: 0;


    constructor() {
        super();
    }

    start() {
        this.#_collider = this.gameObject.getComponent(AbstractColliderComponent);
        if (!this.#_collider) {
            console.warn("RigidbodyComponent requires a collider.");
        }
    }

    move(dx, dy) {
        if (!this.#_collider) return true;

        this.#saveLastPosition();

        const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 1);
        const stepX = dx / steps;
        const stepY = dy / steps;

        let currentCollisions = new Set();
        let resolved = false;

        for (let i = 0; i < steps; i++) {
            this.#step(stepX, stepY);

            for (const other of CollisionSystem.instance.colliders) {
                if (other === this.#_collider) continue;
                if (!this.#_collider.checkCollisionWith(other)) continue;

                const otherObj = other.gameObject;
                currentCollisions.add(otherObj);

                this.#handleEnterOrStay(other, otherObj);

                if (!this.#shouldResolve(other)) continue;

                this.#rollbackStep(stepX, stepY);
                resolved = true;
                break;
            }

            if (resolved) break;
        }

        this.#handleExit(currentCollisions);
        this.#_lastCollisions = currentCollisions;

        return true;
    }


    #saveLastPosition() {
        this.#_lastX = this.gameObject.x;
        this.#_lastY = this.gameObject.y;
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
                const otherCol = (obj as GameObject).getComponent?.(AbstractColliderComponent);
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