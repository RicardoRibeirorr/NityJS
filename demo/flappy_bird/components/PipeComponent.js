import { Component, Input, RigidbodyComponent, Time } from "../../../dist/nity.module.min.js";

export class PipeComponent extends Component{
    speed = 1.6;

    update(){
      this.gameObject.x -= this.speed; // constant horizontal movement
    }
}