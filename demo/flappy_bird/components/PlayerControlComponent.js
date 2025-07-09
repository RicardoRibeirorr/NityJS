import { Component, Input, RigidbodyComponent, Time } from "../../../dist/nity.module.min.js";

export class PlayerControlComponent extends Component {

  rigidbody = null;

  start(){
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent)
  }
 
  update(){
      if (Input.isKeyDown(" ")) {
      console.log("Flap!");
      // Apply an upward force to the bird
      this.rigidbody.velocity.y = -100;
    }
  }
}