import { Component } from '../../common/Component.js';
import { Input } from '../../input/Input.js';

// === MovementComponent.js ===
export class MovementComponent extends Component {
    constructor(speed = 100) {
        super();
        this.speed = speed;
    }

    update(deltaTime) {
        if (Input.isKeyDown('ArrowRight')) this.gameObject.x += this.speed * deltaTime;
        if (Input.isKeyDown('ArrowLeft')) this.gameObject.x -= this.speed * deltaTime;
        if (Input.isKeyDown('ArrowDown')) this.gameObject.y += this.speed * deltaTime;
        if (Input.isKeyDown('ArrowUp')) this.gameObject.y -= this.speed * deltaTime;
    }
}