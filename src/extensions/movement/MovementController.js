import { Component } from '../../common/Component.js';
import { Time } from '../../core/Time.js';
import { Input } from '../../input/Input.js';
import { RigidbodyComponent } from '../../physics/components/RigidbodyComponent.js';
import { Vector2 } from '../../math/Vector2.js';

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
        const movement = new Vector2(0, 0);

        if (Input.isKeyDown('ArrowRight') || Input.isKeyDown('d') || Input.isKeyDown('D')) movement.x += this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowLeft') || Input.isKeyDown('a') || Input.isKeyDown('A'))  movement.x -= this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('s') || Input.isKeyDown('S'))  movement.y += this.speed * Time.deltaTime();
        if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('w') || Input.isKeyDown('W'))    movement.y -= this.speed * Time.deltaTime();

        if (movement.magnitude > 0) {
            this.rigidbody.move(movement);
        }
    }
}