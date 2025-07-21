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
      obj.addComponent(new BoxColliderComponent(30, 30));
      scene.add(obj);


    obj.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('Someone collided with me the static object');;
      }
    });

    const player = new GameObject(100, 100);
    player.addComponent(new ShapeComponent("square", {
      width: 10,
      height: 10,
      color: 'red'
    }));
    player.addComponent(new BoxColliderComponent(10, 10));
    player.addComponent(new RigidbodyComponent());
    player.addComponent(new MovementComponent(1000));

    // Add camera following the player
    const cameraObject = new GameObject(0, 0);
    cameraObject.addComponent(new CameraComponent(game.canvas, 2));
    player.addChild(cameraObject);

    player.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('Collision Enter:', other);
      }
      onCollisionStay(other) {
        other.getComponent(ShapeComponent).color = 'orange';
      }
      onCollisionExit(other) {
        console.log('Collision Exit:', other);
        other.getComponent(ShapeComponent).color = 'blue';
      }
    });


    scene.add(player);
    game.mainCamera = cameraObject;
  }
});


 game._internalGizmos = true;

        game.configure({
            debug: true
        });
game.launch(scene);