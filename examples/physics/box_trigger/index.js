// === Setup Example ===
import {
  Game,
  Scene,
  GameObject,
  Component,
  CameraComponent,
  BoxColliderComponent,
  ShapeComponent,
  RigidbodyComponent,
  MovementComponent
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {

    //GENERATE STATIC OBJECT
    const obj = new GameObject(90, 50);
    obj.addComponent(new ShapeComponent("square", {
      width: 30,
      height: 30,
      color: 'blue'
    }));
    obj.addComponent(new BoxColliderComponent(30, 30, true)); // Set as trigger
    scene.add(obj);

    const player = new GameObject(100, 100);
    player.addComponent(new ShapeComponent("square", {
      width: 10,
      height: 10,
      color: 'red'
    }));
    player.addComponent(new BoxColliderComponent(10, 10));
    player.addComponent(new RigidbodyComponent());
    player.addComponent(new MovementComponent(50));

    // Add camera following the player
    const cameraObject = new GameObject(0, 0);
    cameraObject.addComponent(new CameraComponent(game.canvas, 2));
    player.addChild(cameraObject);

    player.addComponent(new class extends Component {
      onCollisionEnter(other) {
        other.getComponent(ShapeComponent).color = 'green';
      }
      onCollisionExit(other) {
        other.getComponent(ShapeComponent).color = 'blue';
      }
    });


    scene.add(player);
    game.mainCamera = cameraObject;
  }
});


game.launch(scene);