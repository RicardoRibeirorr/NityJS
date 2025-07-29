import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2,
    Time,
    AudioAsset,
    AudioListenerComponent,
    AudioSourceComponent,
    ShapeComponent,
    Input,
    Keyboard
} from '../../../dist/nity.module.js';

// Import audio for 3D positioning
const coinSound = new AudioAsset('coin', '../../_assets/beep.wav');

class SpatialAudioScene extends Scene {
    create() {
        // Player with audio listener (the "ears")
        this.player = new GameObject(new Vector2(200, 300));
        this.player.addComponent(ShapeComponent.meta({
            shapeType: 'rectangle',
            options: { width: 32, height: 32, color: '#4a90e2', filled: true }
        }));
        this.player.addComponent(AudioListenerComponent.meta({
            isMainListener: true,
            masterVolume: 0.8
        }));
        this.add(this.player);

        // Coin with 3D audio source
        this.coin = new GameObject(new Vector2(600, 200));
        this.coin.addComponent(ShapeComponent.meta({
            shapeType: 'circle',
            options: { radius: 15, color: '#ffd700', filled: true }
        }));
        this.coin.addComponent(AudioSourceComponent.meta({
            clip: 'coin',
            volume: 1.0,
            is3D: true,           // Enable 3D spatial audio
            maxDistance: 300,     // Maximum hearing distance
            minDistance: 50       // Distance for full volume
        }));
        this.add(this.coin);

        console.log('🔊 3D Spatial audio example loaded!');
        console.log('Move with arrow keys, press SPACE to play sound');
    }

    update() {
        const moveSpeed = 200;
        const audioListener = this.player.getComponent(AudioListenerComponent);
        const coinAudio = this.coin.getComponent(AudioSourceComponent);

        // Move player (and audio listener)
        if (Input.isKeyPressed(Keyboard.ArrowLeft)) {
            this.player.position.x -= moveSpeed * Time.deltaTime;
        }
        if (Input.isKeyPressed(Keyboard.ArrowRight)) {
            this.player.position.x += moveSpeed * Time.deltaTime;
        }
        if (Input.isKeyPressed(Keyboard.ArrowUp)) {
            this.player.position.y -= moveSpeed * Time.deltaTime;
        }
        if (Input.isKeyPressed(Keyboard.ArrowDown)) {
            this.player.position.y += moveSpeed * Time.deltaTime;
        }

        // Play 3D positioned sound
        if (Input.isKeyDown('Space')) {
            coinAudio.play();
            console.log('🎵 Playing 3D positioned coin sound');
        }

        // Display distance for demonstration
        const distance = Vector2.distance(this.player.position, this.coin.position);
        document.title = `Distance: ${Math.round(distance)}px - Volume: ${Math.round((1 - Math.min(distance / 300, 1)) * 100)}%`;
    }
}

// Initialize game
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const game = new Game();
game.configure({ canvas });

const scene = new SpatialAudioScene();
game.launch(scene);
