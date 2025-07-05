import { Component } from '../../../dist/nity.module.min.js';

export class FollowTarget extends Component {
  constructor(target) {
    super();
    this.target = target;
  }

  update() {
    if (!this.target) return;
    this.gameObject.x = this.target.x;
  }
}