// FlappyScene.js
import {
  Scene,
  GameObject,
  CameraComponent,
  FollowTarget,
} from '../../../dist/nity.module.min.js';
import { Bird } from '../objects/Bird.js';
import { createScrollingTile } from '../utils/createScrollingTile.js';
// import { setupPipeSpawner } from './PipeSpawner.js';

export function createFlappyScene(game) {
  return new Scene({
    create(scene) {
      // Background color (if needed)
      scene.clearColor = '#87ceeb';


      // Create player
      const bird = new Bird(400,0);
      scene.add(bird);


      // Create camera
      const cameraObject = new GameObject(0, 0);
      cameraObject.addComponent(new CameraComponent(game.canvas, 1));
      bird.addChild(cameraObject);
      game.mainCamera = cameraObject;

      
      //create ground and ceiling
      const cei = createScrollingTile(0, 280, 400, 40, 'green');
      cei.addComponent(new FollowTarget(bird))
      scene.add(); // ground 1
      // scene.add(createScrollingTile(400, 280, 400, 40, 'green')); // ground 2

      // scene.add(createScrollingTile(0, -100, 400, 40, 'blue')); // ceiling 1
      const ground = createScrollingTile(400, -100, 400, 40, 'blue');
      ground.addComponent(new FollowTarget(bird))
      scene.add(); // ceiling 2
      // Setup pipe spawner
      // setupPipeSpawner(scene, bird);
    }
  });
}
