import { Component } from '../../common/Component.js';

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