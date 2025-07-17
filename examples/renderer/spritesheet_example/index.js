// === Setup Example ===
import {
  Game,
  Scene,
  GameObject,
  SpriteRendererComponent,
  CameraComponent,
  SpritesheetAsset,
  Component
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    // Load the spritesheet - automatically registers individual sprites with colon notation
    new SpritesheetAsset("SPS_Player_Walk", "./assets/player_walk_spritesheet.png", {
      spriteWidth: 16,
      spriteHeight: 16,
      columns: 12,
      rows: 8
    });
    

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 12; x++) {

        const go = new GameObject(x * 20 - 100, y * 20 - 80);

        // Add sprite renderer using the new unified sprite key format
        const spriteIndex = y * 12 + x;
        // Add sprite renderer
        go.addComponent(new SpriteRendererComponent(`SPS_Player_Walk:sprite_${spriteIndex}`));

        // Add border as an inline component
        go.addComponent(new class extends Component {
          draw(ctx) {
            const gx = this.gameObject.getGlobalX();
            const gy = this.gameObject.getGlobalY();
            ctx.strokeStyle = "red";
            ctx.strokeRect(gx - 8, gy - 8, 18, 18);
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