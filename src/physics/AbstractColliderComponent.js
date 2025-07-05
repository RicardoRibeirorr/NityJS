import {
    Component
} from '../common/Component.js';
import {
    CollisionSystem
} from '../bin/CollisionSystem.js';

export class AbstractColliderComponent extends Component {
    constructor() {
        super();
        this.trigger = false; // Default to non-trigger collider
        this._lastCollisions = new Set(); // Track last collisions for collision events
    }

    isTrigger() {
        return this.trigger === true;
    }

    start() {
        CollisionSystem.instance.register(this);
    }

    destroy() {
        CollisionSystem.instance.unregister(this);
    }

    checkCollisionWith(other) {
        throw new Error('checkCollisionWith must be implemented');
    }

    getBounds() {
        throw new Error('getBounds must be implemented');
    }
}