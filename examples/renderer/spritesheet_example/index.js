// === Setup Example ===
import {
  Game,
  Scene,
  GameObject,
  SpriteRendererComponent,
  CameraComponent,
  Spritesheet,
  Component
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    // Load the spritesheet
    new Spritesheet("SPS_Player_Walk", "./assets/player_walk_spritesheet.png", 16, 16, 12, 8);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 12; x++) {
        const go = new GameObject(x * 20 - 100, y * 20 - 80);

        // Add sprite renderer
        go.addComponent(new SpriteRendererComponent("SPS_Player_Walk", `sprite_${x}_${y}`));

        // Add border as an inline component
        go.addComponent(new class extends Component {
          draw(ctx) {
            const gx = this.gameObject.getGlobalX();
            const gy = this.gameObject.getGlobalY();
            ctx.strokeStyle = "red";
            ctx.strokeRect(gx - 1, gy - 1, 18, 18);
          }
        });

        scene.add(go);
      }
    }

    // Add camera
    const cameraObject = new GameObject(0, 0);
    cameraObject.addComponent(new CameraComponent(game.canvas, 2));
    scene.add(cameraObject);
    game.mainCamera = cameraObject;
  }
});


game.launch(scene);