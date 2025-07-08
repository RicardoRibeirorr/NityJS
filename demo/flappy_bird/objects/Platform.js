import { BoxColliderComponent, GameObject, ShapeComponent, Game, SpriteRendererComponent, Spritesheet, ImageComponent } from "../../../dist/nity.module.min.js";

export class Platform extends GameObject{
  constructor(x,y){
    super(x,y);
      const width = Game.instance.canvas.width;
      const height =50;
    this.addComponent(new ShapeComponent("rect", {
      width: 672,
      height: height,
      color:"green"
    }));
    this.addComponent(new BoxColliderComponent(width, height, false)); // optional if needed
  }
}