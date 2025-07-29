import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2,
    ProceduralAudioClip,
    RandomAudioGenerator,
    AudioSourceComponent,
    ShapeComponent
} from '../../../dist/nity.module.js';

let lastGeneratedClip = null;

class ProceduralAudioScene extends Scene {
    create() {
        // Audio player object
        this.audioPlayer = new GameObject(new Vector2(400, 300));
        this.audioPlayer.addComponent(ShapeComponent.meta({
            shapeType: 'circle',
            options: { radius: 50, color: '#4a90e2', filled: true }
        }));
        this.audioPlayer.addComponent(AudioSourceComponent.meta({
            volume: 0.7
        }));
        this.add(this.audioPlayer);

        console.log('🎛️ Procedural audio generator ready!');
        console.log('Use the buttons to generate different audio types');
    }
}

// Audio generation functions (attached to window for button access)
window.generateBeep = function() {
    console.log('🎵 Generating beep sound...');
    const beepClip = RandomAudioGenerator.generateBeep({
        frequency: 800 + Math.random() * 400,  // 800-1200 Hz
        duration: 0.2 + Math.random() * 0.3,   // 0.2-0.5 seconds
        volume: 0.5
    });
    playClip(beepClip, 'beep');
};

window.generateNoise = function() {
    console.log('🎵 Generating noise...');
    const noiseClip = RandomAudioGenerator.generateNoise({
        duration: 0.5 + Math.random() * 0.5,   // 0.5-1.0 seconds
        volume: 0.3,
        type: Math.random() > 0.5 ? 'white' : 'pink'
    });
    playClip(noiseClip, 'noise');
};

window.generateTone = function() {
    console.log('🎵 Generating tone...');
    const toneClip = RandomAudioGenerator.generateTone({
        frequency: 200 + Math.random() * 600,  // 200-800 Hz
        duration: 1.0 + Math.random() * 1.0,   // 1-2 seconds
        volume: 0.4,
        waveType: ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(Math.random() * 4)]
    });
    playClip(toneClip, 'tone');
};

window.generateChirp = function() {
    console.log('🎵 Generating chirp...');
    const chirpClip = RandomAudioGenerator.generateChirp({
        startFreq: 200 + Math.random() * 200,   // 200-400 Hz start
        endFreq: 800 + Math.random() * 400,     // 800-1200 Hz end
        duration: 0.5 + Math.random() * 1.0,    // 0.5-1.5 seconds
        volume: 0.6
    });
    playClip(chirpClip, 'chirp');
};

window.downloadLast = function() {
    if (lastGeneratedClip) {
        console.log('💾 Downloading last generated audio...');
        lastGeneratedClip.downloadAsWAV(`procedural_audio_${Date.now()}.wav`);
    } else {
        console.log('❌ No audio to download. Generate some audio first!');
    }
};

window.generateAndDownload = function() {
    console.log('🎵 Generating random audio for download...');
    const randomClip = RandomAudioGenerator.generateRandom({
        duration: 2.0,
        volume: 0.5
    });
    
    // Play it
    playClip(randomClip, 'random');
    
    // Download it after a short delay
    setTimeout(() => {
        randomClip.downloadAsWAV(`random_audio_${Date.now()}.wav`);
        console.log('💾 Audio downloaded!');
    }, 500);
};

function playClip(clip, type) {
    lastGeneratedClip = clip;
    
    // Get the audio player from the scene
    const scene = Game.instance.scene;
    if (scene && scene.audioPlayer) {
        const audioSource = scene.audioPlayer.getComponent(AudioSourceComponent);
        audioSource.setClip(clip);
        audioSource.play();
        console.log(`▶️ Playing generated ${type} audio`);
    }
}

// Initialize game
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const game = new Game();
game.configure({ canvas });

const scene = new ProceduralAudioScene();
game.launch(scene);
