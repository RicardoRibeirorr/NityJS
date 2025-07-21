// === Setup Example ===
import {
  Game,
  Scene,
  GameObject,
  SpriteRendererComponent,
  CameraComponent,
  SpritesheetAsset,
  Component,
  Vector2,
  ImageComponent
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    // Load the spritesheet - automatically registers individual sprites with colon notation
    const obj = new GameObject(new Vector2(0, 0));
    obj.addComponent(new ImageComponent("./assets/logo.png"));
    obj.addComponent(new class extends Component{
      update(){
        console.log(this.gameObject.rotation);
        this.gameObject.rotation += 0.1; // Rotate the image
      }
    })

    // Add camera
    scene.add(obj);
    const cameraObject = new GameObject(new Vector2(250, 250));
    cameraObject.addComponent(new CameraComponent(game.canvas, 1));
    scene.add(cameraObject);
    game.mainCamera = cameraObject;
  }
});


game.launch(scene);