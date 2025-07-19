import { Component } from '../../common/Component.js';
import { Vector2 } from '../../math/Vector2.js';

export class FollowTarget extends Component {
  constructor(target) {
    super();
    this.target = target;
  }

  update() {
    if (!this.target) return;
    
    if (this.target instanceof Vector2) {
      this.gameObject.setPosition(this.target);
    } else if (this.target.position) {
      // Target is a GameObject
      this.gameObject.setPosition(this.target.position);
    } else {
      // Target has x,y properties (legacy support)
      this.gameObject.setPosition(this.target.x, this.target.y);
    }
  }
}