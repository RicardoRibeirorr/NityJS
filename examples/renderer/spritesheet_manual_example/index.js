// === Manual Spritesheet Example ===
import {
    Game,
    Scene,
    GameObject,
    SpriteRendererComponent,
    SpritesheetAsset,
    SpriteRegistry,
    ImageComponent,
    CameraComponent,
    Component,
    Vector2,
    ShapeComponent
} from '../../../dist/nity.module.js';


// Initialize the game
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Create manual spritesheet with pixel coordinates
// 24x8 spritesheet with 3 sprites of 8x8 each
new SpritesheetAsset('tiles', './assets/environment_tiles.png', {
    sprites: [
        { name: "tile1", startX: 0, startY: 0, endX: 8, endY: 8 },
        { name: "tile2", startX: 8, startY: 0, endX: 16, endY: 8 },
        { name: "tile3", startX: 16, startY: 0, endX: 24, endY: 8 }
    ]
});
const scene = new Scene({
  create(scene) {
    
    // 1. Display the full spritesheet image (24x8)
    const fullSheetObj = new GameObject(new Vector2(150, 100));
    fullSheetObj.addComponent(new ImageComponent('./assets/environment_tiles.png', 240, 80)); // Scale up 10x for visibility
    scene.add(fullSheetObj);
    
    // Add label for full spritesheet
    const fullSheetLabel = new GameObject(new Vector2(150, 50));
    fullSheetLabel.addComponent(new class extends Component {
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Full Spritesheet (24x8 pixels)', this.gameObject.position.x, this.gameObject.position.y);
            ctx.restore();
        }
    });
    scene.add(fullSheetLabel);
    
    // 2. Display individual sprites with borders
    const spriteNames = ['tile1', 'tile2', 'tile3'];
    const spritePositions = [
        new Vector2(-100, -100),
        new Vector2(0, -100),
        new Vector2(100, -100)
    ];
    
    spriteNames.forEach((spriteName, index) => {
        // Create sprite object
        const spriteObj = new GameObject(spritePositions[index]);
        
        // Add scaled sprite renderer (scale 8x8 to 64x64)
        spriteObj.addComponent(new SpriteRendererComponent(`tiles:${spriteName}`, {
            width: 64, // Scale to 64x64
            height: 64,
        }));
        
        scene.add(spriteObj);
        
        // Add label for each sprite
    });
    
    // Add section label for individual sprites
    const individualLabel = new GameObject(new Vector2(0, -160));
    individualLabel.addComponent(new class extends Component {
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Individual Sprites (8x8 each, scaled 8x with red borders)', this.gameObject.position.x, this.gameObject.position.y);
            ctx.restore();
        }
    });
    scene.add(individualLabel);
    
    // Add camera
    const cameraObject = new GameObject(new Vector2(0, 0));
    cameraObject.addComponent(new CameraComponent(game.canvas, 1)); // 1x zoom
    scene.add(cameraObject);
    game.mainCamera = cameraObject;
            }
});
    
    // Start the game
    game.configure({debug: true});
    game.launch(scene);
