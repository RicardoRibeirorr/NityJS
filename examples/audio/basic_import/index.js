import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2,
    AudioAsset,
    AudioSourceComponent,
    ShapeComponent,
    Input
} from '../../../dist/nity.module.js';

// 🎵 Step 1: Import audio files (automatically registered)
const jumpSound = new AudioAsset('jump', '../../_assets/jump.wav');
const backgroundMusic = new AudioAsset('bgMusic', '../../_assets/background.wav', {
    loop: true,
    volume: 0.3
});

class BasicAudioScene extends Scene {
    create() {
        // Create a simple player object
        this.player = new GameObject(new Vector2(400, 300));
        this.player.addComponent(ShapeComponent.meta({
            shapeType: 'rectangle',
            options: { width: 32, height: 32, color: '#4a90e2', filled: true }
        }));
        
        // Add audio source for jump sound
        this.player.addComponent(AudioSourceComponent.meta({
            clip: 'jump',  // String reference to AudioAsset
            volume: 0.8
        }));
        this.add(this.player);

        // Create background music source
        this.musicSource = new GameObject(new Vector2(0, 0));
        this.musicSource.addComponent(AudioSourceComponent.meta({
            clip: 'bgMusic',
            volume: 0.3,
            loop: true
        }));
        this.add(this.musicSource);

        console.log('🎵 Basic audio example loaded!');
        console.log('Press SPACE to play jump sound, M to toggle music');
    }

    update() {
        const playerAudio = this.player.getComponent(AudioSourceComponent);
        const musicAudio = this.musicSource.getComponent(AudioSourceComponent);

        
        // Play jump sound
        if (Input.isKeyDown('Space')) {
            playerAudio.play();
            console.log('🎵 Playing jump sound');
        }

        // Toggle background music
        if (Input.isKeyDown('KeyM')) {
            if (musicAudio.isPlaying) {
                musicAudio.pause();
                console.log('🎵 Music paused');
            } else {
                musicAudio.play();
                console.log('🎵 Music playing');
            }
        }
    }
}

// Initialize game
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const game = new Game();
game.configure({ canvas });

// Start game (audio loads automatically)
const scene = new BasicAudioScene();
game.launch(scene);
