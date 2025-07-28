import { Component } from '../../common/Component.js';
import { AudioListenerComponent } from './AudioListenerComponent.js';

/**
 * AudioSourceComponent - Unity-style audio playback component with 3D spatial audio support.
 * 
 * Plays audio clips with full 3D spatial positioning or as 2D UI sounds. Similar to
 * Unity's AudioSource, this component handles audio playback, volume control, looping,
 * and spatial audio calculations. Integrates with AudioListenerComponent to provide
 * realistic distance-based volume attenuation and stereo panning.
 * 
 * **Unity Equivalent:** AudioSource component for audio playback and control
 * 
 * **Key Features:**
 * - 3D spatial audio with distance attenuation and stereo panning
 * - 2D audio mode for UI sounds and music (ignores spatial positioning)
 * - Play, pause, stop, and loop controls with Unity-compatible API
 * - Volume, pitch, and timing control for dynamic audio effects
 * - Multiple rolloff modes (linear, logarithmic, inverse) for different audio behaviors
 * - Integration with Web Audio API for high-quality audio processing
 * 
 * @class AudioSourceComponent
 * @extends Component
 * 
 * @example
 * // Basic 3D audio source
 * const audioSource = new AudioSourceComponent();
 * audioSource.clip = jumpSoundClip;
 * audioSource.spatial = true;
 * audioSource.maxDistance = 300;
 * audioSource.play();
 * 
 * @example
 * // UI sound (2D audio)
 * const uiAudio = new AudioSourceComponent();
 * uiAudio.clip = buttonClickClip;
 * uiAudio.spatial = false;
 * uiAudio.volume = 0.8;
 * uiAudio.play();
 * 
 * @example
 * // Background music with looping
 * const musicSource = new AudioSourceComponent();
 * musicSource.clip = backgroundMusicClip;
 * musicSource.spatial = false;
 * musicSource.loop = true;
 * musicSource.volume = 0.3;
 * musicSource.play();
 */
export class AudioSourceComponent extends Component {
    /**
     * Creates a new AudioSource component.
     * 
     * Initializes the audio source with default settings for 3D spatial audio.
     * The component is ready to play audio clips once a clip is assigned and
     * the necessary Web Audio API nodes are created.
     * 
     * @param {AudioClip} [clip=null] - Audio clip to play
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.spatial=true] - Whether to use 3D spatial audio
     * @param {boolean} [options.autoPlay=false] - Start playing immediately when clip is set
     * @param {boolean} [options.loop=false] - Loop the audio clip
     * @param {number} [options.volume=1.0] - Volume level (0.0 to 1.0)
     * @param {number} [options.pitch=1.0] - Playback pitch (0.5 to 2.0)
     * 
     * @example
     * // Create configured audio source
     * const audioSource = new AudioSourceComponent(jumpClip, {
     *     spatial: true,
     *     volume: 0.8,
     *     maxDistance: 200
     * });
     */
    constructor(clip = null, options = {}) {
        super();
        
        // Initialize metadata first
        this.__meta = this.constructor.getDefaultMeta();
        
        // Apply constructor arguments
        if (clip || Object.keys(options).length > 0) {
            this._applyConstructorArgs(clip, options);
        } else {
            this._updatePropertiesFromMeta();
        }
        
        // Playback state
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        
        // Web Audio API nodes
        this.sourceNode = null;
        this.gainNode = null;
        this.pannerNode = null;
        this.audioContext = null;
        
        // Playback tracking
        this.startTime = 0;
        this.pauseTime = 0;
        
        console.log(`🔊 AudioSource created (${this.spatial ? '3D' : '2D'} audio)`);
    }
    
    /**
     * Provides default metadata configuration for AudioSource instances.
     * 
     * @static
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            clip: null,
            spatial: true,
            autoPlay: false,
            loop: false,
            volume: 1.0,
            pitch: 1.0,
            maxDistance: 500,
            minDistance: 1,
            rolloffMode: 'linear'
        };
    }
    
    /**
     * Applies constructor arguments to metadata format.
     * 
     * @private
     */
    _applyConstructorArgs(clip, options = {}) {
        const metadata = {
            ...this.__meta,
            clip: clip,
            ...options
        };
        
        this.applyMeta(metadata);
    }
    
    /**
     * Updates component properties from metadata.
     * 
     * @private
     */
    _updatePropertiesFromMeta() {
        this.clip = this.__meta.clip;
        this.spatial = this.__meta.spatial;
        this.autoPlay = this.__meta.autoPlay;
        this.loop = this.__meta.loop;
        this.volume = this.__meta.volume;
        this.pitch = this.__meta.pitch;
        this.maxDistance = this.__meta.maxDistance;
        this.minDistance = this.__meta.minDistance;
        this.rolloffMode = this.__meta.rolloffMode;
        
        // Auto-play if enabled and clip is available
        if (this.autoPlay && this.clip && this.clip.isReady) {
            this.play();
        }
    }
    
    /**
     * Validates metadata configuration.
     * 
     * @private
     */
    _validateMeta() {
        if (this.__meta.volume < 0 || this.__meta.volume > 1) {
            throw new Error('AudioSource volume must be between 0 and 1');
        }
        
        if (this.__meta.pitch < 0.1 || this.__meta.pitch > 3) {
            throw new Error('AudioSource pitch must be between 0.1 and 3');
        }
        
        if (this.__meta.maxDistance <= 0) {
            throw new Error('AudioSource maxDistance must be positive');
        }
        
        const validRolloffModes = ['linear', 'logarithmic', 'inverse'];
        if (!validRolloffModes.includes(this.__meta.rolloffMode)) {
            throw new Error(`AudioSource rolloffMode must be one of: ${validRolloffModes.join(', ')}`);
        }
    }
    
    /**
     * Starts playback of the assigned audio clip.
     * 
     * Creates the necessary Web Audio API nodes and begins playback. For 3D audio,
     * calculates spatial positioning based on the current GameObject position and
     * the active AudioListener. Handles both immediate playback and resuming from
     * a paused state.
     * 
     * @param {number} [delay=0] - Delay before starting playback (in seconds)
     * @returns {boolean} True if playback started successfully
     * 
     * @example
     * // Play immediately
     * audioSource.play();
     * 
     * @example
     * // Play with delay
     * audioSource.play(0.5); // Start after 500ms
     * 
     * @example
     * // Check if playback started
     * if (audioSource.play()) {
     *     console.log("Audio started playing");
     * }
     */
    play(delay = 0) {
        if (!this.clip || !this.clip.isReady) {
            console.warn('Cannot play: AudioClip not loaded or not assigned');
            return false;
        }
        
        // Stop any existing playback
        this.stop();
        
        try {
            this.audioContext = this.clip.audioContext;
            
            // Create source node
            this.sourceNode = this.clip.createSourceNode();
            if (!this.sourceNode) {
                console.error('Failed to create audio source node');
                return false;
            }
            
            // Configure source node
            this.sourceNode.loop = this.loop;
            this.sourceNode.playbackRate.value = this.pitch;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume;
            
            // Connect audio nodes
            this.sourceNode.connect(this.gainNode);
            
            if (this.spatial && this.gameObject) {
                // Create 3D spatial audio
                this._setup3DAudio();
            } else {
                // Connect directly for 2D audio
                this.gainNode.connect(this.audioContext.destination);
            }
            
            // Handle playback end
            this.sourceNode.onended = () => {
                if (!this.loop) {
                    this.isPlaying = false;
                    this.currentTime = 0;
                    this._cleanup();
                }
            };
            
            // Start playback
            const startTime = this.audioContext.currentTime + delay;
            const offset = this.isPaused ? this.pauseTime : 0;
            
            this.sourceNode.start(startTime, offset);
            
            // Update state
            this.isPlaying = true;
            this.isPaused = false;
            this.startTime = startTime - offset;
            
            console.log(`🎵 Audio started: ${this.clip.name} (${this.spatial ? '3D' : '2D'})`);
            return true;
            
        } catch (error) {
            console.error('Failed to play audio:', error);
            this._cleanup();
            return false;
        }
    }
    
    /**
     * Pauses audio playback.
     * 
     * Stops the current audio source and records the current playback position
     * so that playback can be resumed from the same point using play().
     * 
     * @example
     * // Pause and resume audio
     * audioSource.pause();
     * setTimeout(() => audioSource.play(), 1000); // Resume after 1 second
     */
    pause() {
        if (!this.isPlaying) return;
        
        // Calculate current playback position
        this.pauseTime = this.audioContext.currentTime - this.startTime;
        
        // Stop source node
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
            } catch (error) {
                // Source may already be stopped
            }
        }
        
        this.isPlaying = false;
        this.isPaused = true;
        
        this._cleanup();
        console.log(`⏸️ Audio paused: ${this.clip ? this.clip.name : 'unknown'}`);
    }
    
    /**
     * Stops audio playback and resets to the beginning.
     * 
     * Completely stops audio playback and resets the playback position to the
     * start of the clip. Unlike pause(), this cannot be resumed from the same
     * position.
     * 
     * @example
     * // Stop audio completely
     * audioSource.stop();
     */
    stop() {
        if (!this.isPlaying && !this.isPaused) return;
        
        // Stop source node
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
            } catch (error) {
                // Source may already be stopped
            }
        }
        
        // Reset state
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.pauseTime = 0;
        
        this._cleanup();
        console.log(`⏹️ Audio stopped: ${this.clip ? this.clip.name : 'unknown'}`);
    }
    
    /**
     * Sets up 3D spatial audio using Web Audio API.
     * 
     * @private
     */
    _setup3DAudio() {
        if (!this.spatial || !this.gameObject || !AudioListenerComponent.main) {
            // Fall back to 2D audio
            this.gainNode.connect(this.audioContext.destination);
            return;
        }
        
        const listener = AudioListenerComponent.main;
        const audioParams = listener.calculate3DAudio(
            this.gameObject.position,
            this.maxDistance,
            this.rolloffMode
        );
        
        // Create stereo panner for left/right positioning
        this.pannerNode = this.audioContext.createStereoPanner();
        this.pannerNode.pan.value = audioParams.pan;
        
        // Apply 3D volume calculation
        this.gainNode.gain.value = this.volume * audioParams.volume;
        
        // Connect: source -> gain -> panner -> destination
        this.gainNode.connect(this.pannerNode);
        this.pannerNode.connect(this.audioContext.destination);
        
        console.log(`🎯 3D Audio: vol=${audioParams.volume.toFixed(2)}, pan=${audioParams.pan.toFixed(2)}, dist=${audioParams.distance.toFixed(1)}`);
    }
    
    /**
     * Updates 3D audio parameters during playback.
     * Called automatically if the GameObject or listener moves.
     */
    update() {
        if (this.isPlaying && this.spatial && this.pannerNode && this.gameObject && AudioListenerComponent.main) {
            const listener = AudioListenerComponent.main;
            const audioParams = listener.calculate3DAudio(
                this.gameObject.position,
                this.maxDistance,
                this.rolloffMode
            );
            
            // Update audio parameters
            this.gainNode.gain.value = this.volume * audioParams.volume;
            this.pannerNode.pan.value = audioParams.pan;
        }
        
        // Update current time
        if (this.isPlaying && this.audioContext) {
            this.currentTime = this.audioContext.currentTime - this.startTime;
        }
    }
    
    /**
     * Cleans up Web Audio API nodes.
     * 
     * @private
     */
    _cleanup() {
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }
        
        if (this.pannerNode) {
            this.pannerNode.disconnect();
            this.pannerNode = null;
        }
    }
    
    /**
     * Sets the volume of this audio source.
     * 
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            // For 3D audio, volume is modified by distance, so we need to recalculate
            if (this.spatial && this.gameObject && AudioListenerComponent.main) {
                const listener = AudioListenerComponent.main;
                const audioParams = listener.calculate3DAudio(
                    this.gameObject.position,
                    this.maxDistance,
                    this.rolloffMode
                );
                this.gainNode.gain.value = this.volume * audioParams.volume;
            } else {
                this.gainNode.gain.value = this.volume;
            }
        }
    }
    
    /**
     * Sets the pitch/playback rate of this audio source.
     * 
     * @param {number} pitch - Pitch multiplier (0.1 to 3.0)
     */
    setPitch(pitch) {
        this.pitch = Math.max(0.1, Math.min(3.0, pitch));
        if (this.sourceNode) {
            this.sourceNode.playbackRate.value = this.pitch;
        }
    }
    
    /**
     * Gets the current playback time in seconds.
     * 
     * @returns {number} Current playback time
     */
    get time() {
        return this.currentTime;
    }
    
    /**
     * Sets the current playback time (seeking).
     * Note: Requires stopping and restarting playback.
     * 
     * @param {number} time - Time to seek to in seconds
     */
    set time(time) {
        if (this.clip && time >= 0 && time <= this.clip.length) {
            const wasPlaying = this.isPlaying;
            this.stop();
            this.pauseTime = time;
            this.isPaused = true;
            
            if (wasPlaying) {
                this.play();
            }
        }
    }
    
    /**
     * Called when the component is destroyed.
     */
    destroy() {
        this.stop();
        super.destroy();
    }
}
