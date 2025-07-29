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

        if (Input.keyboard.isDown('ArrowRight') || Input.keyboard.isDown('d') || Input.keyboard.isDown('D')) movement.x += this.speed * Time.deltaTime;
        if (Input.keyboard.isDown('ArrowLeft') || Input.keyboard.isDown('a') || Input.keyboard.isDown('A'))  movement.x -= this.speed * Time.deltaTime;
        if (Input.keyboard.isDown('ArrowDown') || Input.keyboard.isDown('s') || Input.keyboard.isDown('S'))  movement.y += this.speed * Time.deltaTime;
        if (Input.keyboard.isDown('ArrowUp') || Input.keyboard.isDown('w') || Input.keyboard.isDown('W'))    movement.y -= this.speed * Time.deltaTime;

        if (movement.magnitude > 0) {
            this.rigidbody.move(movement);
        }
    }
}
export class MovementController extends MovementComponent{}