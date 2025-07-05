
import { Component } from '../../../dist/nity.module.min.js';

export class ScrollingBlock extends Component {
  constructor(speed = 100, resetX = 400) {
    super();
    this.speed = speed;
    this.resetX = resetX; // where to teleport the block when it exits left
    this.startX = 0;
    this.width = 0;
  }

  start() {
    this.startX = this.gameObject.x;
    this.width = this.gameObject.width || 100; // fallback if no ShapeComponent provides size
  }

  update(dt) {
    this.gameObject.x -= this.speed * dt;

    if (this.gameObject.x + this.width < 0) {
      this.gameObject.x = this.resetX;
    }
  }
}