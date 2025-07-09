import { BoxColliderComponent, GameObject, ShapeComponent, Game } from "../../../dist/nity.module.min.js";
import { PipeComponent } from "../components/PipeComponent.js";

export class Pipe extends GameObject {
    constructor(x,y){
      super(x,y);
        const width = 50;
        const height = Game.instance.canvas.height - 60;
        
        //top pipe
        const pipeTop = new GameObject(0,-Game.instance.canvas.height);
        pipeTop.addComponent(new ShapeComponent("rect", {
          width,
          height,
          color: "blue"
        }));
        pipeTop.addComponent(new BoxColliderComponent(width, height, false)); // optional if needed

        //bottom pipe
        const pipeBottom = new GameObject(0,25);
        pipeBottom.addComponent(new ShapeComponent("rect", {
          width,
          height,
          color: "blue"
        }));
        pipeBottom.addComponent(new BoxColliderComponent(width, height, false)); // optional if needed

        //add both to the "pipe" object
        this.addChildren([
          pipeTop,
          pipeBottom
        ]);

        this.addComponent(new PipeComponent());
    }
}