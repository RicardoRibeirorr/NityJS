
    import { Game, Scene, GameObject, SpriteRendererComponent, CameraComponent, Spritesheet, Component } from '../../../dist/nity.module.min.js';
import { SpriteAnimationComponent } from '../../../dist/nity.module.min.js';
import { SpriteAnimationClip } from '../../../dist/nity.module.min.js';

// === Setup Example ===
console.log('Nity.js Game Engine Example');
const canvas = document.getElementById('game');
const game = new Game(canvas);

        const scene = new Scene({
  create(scene) {
    
        const player = new GameObject(100, 100);
        new Spritesheet("SPS_Player_Walk", "./assets/player_walk_spritesheet.png", 16, 16, 12, 8);
        player.addComponent(new SpriteRendererComponent("SPS_Player_Walk", "sprite_0_0"));
        player.name = 'Player';
        player.addTag('hero');
        
        const anim = new SpriteAnimationComponent("SPS_Player_Walk", "walk");
        anim.addClip(new SpriteAnimationClip("walk", ["sprite_0_0", "sprite_1_0", "sprite_2_0","sprite_1_0"], 8, true));
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