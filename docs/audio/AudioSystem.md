# Audio System Documentation

The NityJS Audio System provides Unity-style audio management with comprehensive 3D spatial audio support using the Web Audio API.

## Core Classes

### AudioClip
Web Audio API wrapper for efficient audio data management.

```javascript
import { AudioClip } from 'nityjs';

// Create and load an audio clip
const musicClip = new AudioClip('background_music', './assets/music.mp3');
await musicClip.load();

// Check if loaded
if (musicClip.isLoaded()) {
    console.log('Audio ready!');
}
```

### AudioListenerComponent
Unity-style audio listener component for receiving 3D spatial audio.

```javascript
import { AudioListenerComponent } from 'nityjs';

// Create main audio listener (typically on camera or player)
const listener = new GameObject(new Vector2(400, 300));
listener.addComponent(AudioListenerComponent.meta({
    isMainListener: true,    // Makes this the primary listener
    masterVolume: 0.8       // Global volume control (0.0 to 1.0)
}));
```

**Properties:**
- `isMainListener`: Sets this as the primary audio listener
- `masterVolume`: Global volume multiplier (0.0 to 1.0)

### AudioSourceComponent
Unity-style audio source for playing audio with 2D or 3D positioning.

```javascript
import { AudioSourceComponent } from 'nityjs';

// 2D Audio Source (background music)
const musicSource = new GameObject(new Vector2(0, 0));
musicSource.addComponent(AudioSourceComponent.meta({
    clip: musicClip,
    volume: 0.5,
    loop: true,
    playOnAwake: true,
    is3D: false
}));

// 3D Audio Source (positioned sound effect)
const coinSource = new GameObject(new Vector2(600, 200));
coinSource.addComponent(AudioSourceComponent.meta({
    clip: coinSfx,
    volume: 1.0,
    is3D: true,
    maxDistance: 300,
    minDistance: 50
}));
```

**Metadata Properties:**
- `clip`: AudioClip to play
- `volume`: Base volume (0.0 to 1.0)
- `loop`: Whether to loop the audio
- `playOnAwake`: Auto-play when component starts
- `is3D`: Enable 3D spatial audio positioning
- `maxDistance`: Maximum hearing distance for 3D audio
- `minDistance`: Minimum distance for full volume

**Methods:**
- `play()`: Start audio playback
- `pause()`: Pause audio playback
- `stop()`: Stop and reset audio playback
- `setVolume(volume)`: Set playback volume (0.0 to 1.0)

**Properties:**
- `isPlaying`: Whether audio is currently playing
- `isPaused`: Whether audio is paused

## 3D Spatial Audio

The Audio System automatically calculates 3D audio parameters based on GameObject positions:

### Distance-Based Volume
Volume decreases with distance from the AudioListener:
- At `minDistance`: Full volume
- Beyond `maxDistance`: Silence
- Between: Linear interpolation

### Stereo Panning
Left/right positioning based on relative X coordinates:
- Listener left of source: Right channel emphasis
- Listener right of source: Left channel emphasis

### Example: Complete Audio Setup

```javascript
import { 
    Game, Scene, GameObject, Vector2,
    AudioClip, AudioListenerComponent, AudioSourceComponent 
} from 'nityjs';

class AudioScene extends Scene {
    async create() {
        // Load audio clips
        this.musicClip = new AudioClip('bg_music', './music.mp3');
        this.jumpSfx = new AudioClip('jump', './jump.wav');
        await this.musicClip.load();
        await this.jumpSfx.load();

        // Audio Listener (player's ears)
        this.player = new GameObject(new Vector2(400, 300));
        this.player.addComponent(AudioListenerComponent.meta({
            isMainListener: true,
            masterVolume: 0.8
        }));
        this.add(this.player);

        // Background Music (2D)
        this.musicSource = new GameObject(new Vector2(0, 0));
        this.musicSource.addComponent(AudioSourceComponent.meta({
            clip: this.musicClip,
            volume: 0.3,
            loop: true,
            playOnAwake: true,
            is3D: false
        }));
        this.add(this.musicSource);

        // Jump Sound Effect (2D)
        this.player.addComponent(AudioSourceComponent.meta({
            clip: this.jumpSfx,
            volume: 0.7,
            is3D: false
        }));

        // Positioned Sound Effect (3D)
        this.coinSource = new GameObject(new Vector2(600, 200));
        this.coinSource.addComponent(AudioSourceComponent.meta({
            clip: this.jumpSfx, // Reusing clip
            volume: 1.0,
            is3D: true,
            maxDistance: 300,
            minDistance: 50
        }));
        this.add(this.coinSource);
    }

    update() {
        // Move player affects 3D audio calculations
        if (Input.isKeyPressed('ArrowLeft')) {
            this.player.position.x -= 200 * Time.deltaTime;
        }
        
        // Play positioned sound
        if (Input.isKeyDown('Space')) {
            const coinAudio = this.coinSource.getComponent(AudioSourceComponent);
            coinAudio.play();
        }
    }
}
```

## Browser Compatibility

The Audio System gracefully handles browser compatibility:

- **Web Audio API**: Primary audio backend
- **HTML5 Audio**: Fallback for older browsers
- **User Interaction**: Respects browser autoplay policies
- **Error Handling**: Comprehensive error handling with console warnings

## Best Practices

### Performance
- Load audio clips during scene initialization
- Reuse AudioClip instances for multiple sources
- Use 2D audio for UI sounds and background music
- Reserve 3D audio for positioned sound effects

### 3D Audio Design
- Set appropriate `minDistance` and `maxDistance` values
- Place AudioListener on the main camera or player character
- Use multiple AudioSources for layered audio effects
- Test audio positioning with different listener positions

### Error Handling
```javascript
try {
    await audioClip.load();
    audioSource.play();
} catch (error) {
    console.warn('Audio playback failed:', error);
    // Continue game without audio
}
```

The Audio System provides a complete Unity-compatible audio solution for web games with comprehensive 3D spatial audio support and robust browser compatibility.
