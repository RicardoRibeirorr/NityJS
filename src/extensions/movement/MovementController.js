import { Component } from '../../common/Component.js';
import { Time } from '../../core/Time.js';
import { Input } from '../../input/Input.js';
import { RigidbodyComponent } from '../../physics/components/RigidbodyComponent.js';

// === MovementComponent.js ===
export class MovementComponent extends Component {
    rigidbody;
    constructor(speed = 100) {
        super();
        this.speed = speed;
    }

    start() {
        this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
        if(!this.rigidbody) {
            console.warn("MovementComponent requires RigidbodyComponent to function properly.");
        }
    }

    update() {
        let dx = 0, dy = 0;

        if (Input.isKeyDown('ArrowRight')) dx += this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowLeft'))  dx -= this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowDown'))  dy += this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowUp'))    dy -= this.speed * Time.deltaTime();

        if (dx !== 0 || dy !== 0) {
            this.rigidbody.move(dx, dy);
        }
    }
}