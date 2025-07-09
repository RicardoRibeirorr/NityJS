import {
  GameObject,
  ShapeComponent,
  RigidbodyComponent,
  CircleColliderComponent,
} from "../../../dist/nity.module.min.js";

export class Bird extends GameObject {
  rigidbody = null;
  constructor(x, y) {
    super(x, y);

    this.x = x;
    this.y = y;

    this.addComponent(new ShapeComponent("circle", {
      radius: 20,
      color: "yellow",
    }));

    this.addComponent(new CircleColliderComponent(20));

    this.rigidbody = new RigidbodyComponent({
      gravity: true,
      // gravity: false,
      bounciness: 0.3,
      gravityScale: 500,
      bounce: 0.3,
    });
    this.addComponent(this.rigidbody);

    // this.addComponent(new BirdControlComponent());
  }

  onCollisionEnter(other){
    console.log("GAME OVER");
    // Game.instance.pause();
  }
}


