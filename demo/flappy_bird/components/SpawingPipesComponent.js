
import { Component, Game, Random, Time } from '../../../dist/nity.module.min.js';
import { Pipe } from '../objects/Pipe.js';

export class SpawingPipesComponent extends Component {
  instantiatedPipes = [];
  countdownTime = 3;
  #countdownInstantiate = 0;

  update(dt) {
    //update the countdown timer
    if(this.#countdownInstantiate > 0){
       this.#countdownInstantiate -= Time.deltaTime();
       return;
    }

    //destroy the previous pipes if they are too far left
    this.instantiatedPipes.forEach(pipe => {
      if(pipe && pipe.gameObject.x < Game.instance.canvas.width / 2 - 100)
        pipe.destroy();
    });

    //add new pipe and reset the countdown
    this.#countdownInstantiate = this.countdownTime;
    this.gameObject.addChild(new Pipe(0,Random.range(-100,100)));

  }
}