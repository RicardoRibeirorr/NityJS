/**
 * Basic Audio Example for NityJS
 * Demonstrates Unity-style Audio System usage
 */

import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2, 
    AudioClip, 
    AudioListenerComponent, 
    AudioSourceComponent,
    SpriteRendererComponent,
    Input
} from '../../dist/nity.module.js';

// Audio clips
const musicClip = new AudioClip('background', './audio_assets/background_music.mp3');
const jumpSfx = new AudioClip('jump', './audio_assets/jump.wav');
const coinSfx = new AudioClip('coin', './audio_assets/coin.wav');

class AudioTestScene extends Scene {
    create() {
        // Audio Listener (main camera/player ears)
        this.listener = new GameObject(new Vector2(400, 300));
        this.listener.addComponent(AudioListenerComponent.meta({
            isMainListener: true,
            masterVolume: 0.8
        }));
        this.add(this.listener);

        // Background Music Source (2D - no position)
        this.musicSource = new GameObject(new Vector2(0, 0));
        this.musicSource.addComponent(AudioSourceComponent.meta({
            clip: musicClip,
            volume: 0.3,
            loop: true,
            playOnAwake: true,
            is3D: false
        }));
        this.add(this.musicSource);

        // Player with Jump SFX
        this.player = new GameObject(new Vector2(200, 300));
        this.player.addComponent(new SpriteRendererComponent('player', { width: 32, height: 32 }));
        this.player.addComponent(AudioSourceComponent.meta({
            clip: jumpSfx,
            volume: 0.7,
            is3D: false
        }));
        this.add(this.player);

        // Coin with 3D positioned audio
        this.coin = new GameObject(new Vector2(600, 200));
        this.coin.addComponent(new SpriteRendererComponent('coin', { width: 24, height: 24 }));
        this.coin.addComponent(AudioSourceComponent.meta({
            clip: coinSfx,
            volume: 1.0,
            is3D: true,
            maxDistance: 300,
            minDistance: 50
        }));
        this.add(this.coin);

        console.log('Audio Test Scene loaded!');
        console.log('Controls:');
        console.log('SPACE - Jump (play jump sound)');
        console.log('C - Collect coin (play 3D positioned sound)');
        console.log('M - Toggle background music');
        console.log('Arrow Keys - Move player (affects 3D audio)');
    }

    update() {
        const playerAudio = this.player.getComponent(AudioSourceComponent);
        const coinAudio = this.coin.getComponent(AudioSourceComponent);
        const musicAudio = this.musicSource.getComponent(AudioSourceComponent);

        // Player movement (affects 3D audio listening position)
        const moveSpeed = 200;
        if (Input.isKeyPressed('ArrowLeft')) {
            this.player.position.x -= moveSpeed * Time.deltaTime;
            this.listener.position.x = this.player.position.x;
        }
        if (Input.isKeyPressed('ArrowRight')) {
            this.player.position.x += moveSpeed * Time.deltaTime;
            this.listener.position.x = this.player.position.x;
        }
        if (Input.isKeyPressed('ArrowUp')) {
            this.player.position.y -= moveSpeed * Time.deltaTime;
            this.listener.position.y = this.player.position.y;
        }
        if (Input.isKeyPressed('ArrowDown')) {
            this.player.position.y += moveSpeed * Time.deltaTime;
            this.listener.position.y = this.player.position.y;
        }

        // Audio controls
        if (Input.isKeyDown('Space')) {
            playerAudio.play();
        }

        if (Input.isKeyDown('KeyC')) {
            coinAudio.play();
        }

        if (Input.isKeyDown('KeyM')) {
            if (musicAudio.isPlaying) {
                musicAudio.pause();
            } else {
                musicAudio.play();
            }
        }

        // Display distance to coin for 3D audio demonstration
        const distance = Vector2.distance(this.player.position, this.coin.position);
        document.title = `Distance to coin: ${Math.round(distance)}px - Audio Volume adjusts with distance`;
    }
}

// Initialize game
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const game = new Game();
game.configure({
    canvas: canvas,
    useLayerSystem: true
});

// Load audio and start
async function init() {
    try {
        await musicClip.load();
        await jumpSfx.load();
        await coinSfx.load();

        console.log('All audio clips loaded successfully!');
        
        // Start game
        const scene = new AudioTestScene();
        game.launch(scene);
    } catch (error) {
        console.error('Failed to load audio:', error);
        console.log('Starting without audio...');
        const scene = new AudioTestScene();
        game.launch(scene);
    }
}

init();
