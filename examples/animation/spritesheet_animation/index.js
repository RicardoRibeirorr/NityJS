
import { Game, Scene, GameObject, SpriteRendererComponent, CameraComponent, SpritesheetAsset, Component } from '../../../dist/nity.module.min.js';
import { SpriteAnimationComponent } from '../../../dist/nity.module.min.js';
import { SpriteAnimationClip } from '../../../dist/nity.module.min.js';

// === Setup Example ===
console.log('Nity.js Game Engine Example');
const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    
    const player = new GameObject(100, 100);
    
    // Load the spritesheet - automatically registers individual sprites with colon notation
    new SpritesheetAsset("SPS_Player_Walk", "./assets/player_walk_spritesheet.png", {
      spriteWidth: 16,
      spriteHeight: 16,
      columns: 12,
      rows: 8
    });
    
    // Add sprite renderer using unified sprite key
    player.addComponent(new SpriteRendererComponent("SPS_Player_Walk:sprite_0"));
    player.name = 'Player';
    player.addTag('hero');
    
    // Create animation component with unified sprite keys
    const anim = new SpriteAnimationComponent("walk");
    anim.addClip(new SpriteAnimationClip("walk", [
      "SPS_Player_Walk:sprite_0", 
      "SPS_Player_Walk:sprite_1", 
      "SPS_Player_Walk:sprite_2",
      "SPS_Player_Walk:sprite_1"
    ], 8, true));
    player.addComponent(anim);

    const cameraObject = new GameObject(0, 0);
    cameraObject.addComponent(new CameraComponent(game.canvas, 6));
    cameraObject.name = 'MainCamera';
    player.addChild(cameraObject);

    scene.add(player);
    Game.instance.mainCamera = cameraObject;

    // Add camera
    scene.add(cameraObject);
    game.mainCamera = cameraObject;
  }
});

game.launch(scene);