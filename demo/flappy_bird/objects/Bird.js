import {
  GameObject,
  ShapeComponent,
  RigidbodyComponent,
  CircleColliderComponent,
  Component,
  Input
} from "../../../dist/nity.module.min.js";

export class Bird extends GameObject {
  rigidbody = null;
  constructor(x, y) {
    super(x, y);

    this.addComponent(new ShapeComponent("circle", {
      radius: 10,
      color: "yellow",
    }));

    this.addComponent(new CircleColliderComponent(10));

    this.rigidbody = new RigidbodyComponent({
      gravity: true,
      // gravity: false,
      bounciness: 0.3,
      gravityScale: 500,
      bounce: 0.3,
    });
    this.addComponent(this.rigidbody);

    this.addComponent(new BirdControlComponent());
  }
 
  update(time){
    super.update(time);
      this.rigidbody.velocity.x = 100; // constant horizontal movement
  }
}

class BirdControlComponent extends Component {
  update(dt) {
    if (Input.isKeyDown(" ")) {
      console.log("Flap!");
      // Apply an upward force to the bird
      const rb = this.gameObject.getComponent(RigidbodyComponent);
      rb.velocity.y = -250;
    }
  }
}
