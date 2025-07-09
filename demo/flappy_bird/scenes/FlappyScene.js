// FlappyScene.js
import {
  Scene,
  GameObject,
  CameraComponent,
  RigidbodyComponent,
  ImageComponent,
  Game,
} from '../../../dist/nity.module.min.js';
import { PipeComponent } from '../components/PipeComponent.js';
import { PlayerControlComponent } from '../components/PlayerControlComponent.js';
import { SpawingPipesComponent } from '../components/SpawingPipesComponent.js';
import { Bird } from '../objects/Bird.js';
import { Pipe } from '../objects/Pipe.js';
import { Platform } from '../objects/Platform.js';

// import { setupPipeSpawner } from './PipeSpawner.js';

export function createFlappyScene(game) {
  return new Scene({
    create(scene) {
      // Background color (if needed)
      scene.clearColor = '#87ceeb';

      const canvasW = Game.instance.canvas.width;
      const canvasH = Game.instance.canvas.height;
      
      //background image
      console.log(canvasW);
      const background = new GameObject(-canvasW/2 - 50,-canvasH/2 - 50);
      background.addComponent(new ImageComponent('./assets/background.png', canvasW + 100, canvasH +100));
      scene.add(background);


      // Bird
      const bird = new Bird(0,0);
      bird.addComponent(new PlayerControlComponent())
      scene.add(bird);


      // Create camera
      const cameraObject = new GameObject(0, 0);
      cameraObject.addComponent(new CameraComponent(game.canvas, 1));
      scene.add(cameraObject);
      game.mainCamera = cameraObject;

      
      //create ground and ceiling
      const cei = new Platform(-canvasW/2,-canvasH/2 - 50);
      scene.add(cei); // ground 1

      const ground = new Platform(-canvasW/2,canvasH/2 - 50);
      scene.add(ground); // ceiling 2
      
      // Setup pipe spawner
      // setupPipeSpawner(scene, bird);

      const pipeSpawner = new GameObject(Game.instance.canvas.width,0);
      pipeSpawner.addComponent(new SpawingPipesComponent())
      scene.add(pipeSpawner);

    }
  });
}
