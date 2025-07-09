// === Setup Example ===
import {
  Game,
  Scene,
  GameObject,
  Component,
  CameraComponent,
  ShapeComponent,
  RigidbodyComponent,
  CircleColliderComponent,
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {

    //FLOORING OBJECT
      const obj = new GameObject(50, 200);
      obj.addComponent(new ShapeComponent("circle", {
        radius: 50,
        color: 'blue'
      }));
      obj.addComponent(new CircleColliderComponent(50, false));
      scene.add(obj);

      // GENERATE PLAYER
    const player = new GameObject(100, 100);
    player.addComponent(new ShapeComponent("circle", {
      radius: 10,
      color: 'red'
    }));
    player.addComponent(new CircleColliderComponent(10, false));
    player.addComponent(new RigidbodyComponent({gravity: true, gravityScale: 300}));
    // player.addComponent(new MovementComponent(50));

    // ADD CAMERA FOLLOWING THE PLAYER
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