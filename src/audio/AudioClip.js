/**
 * AudioClip - Unity-style audio data container for the NityJS engine.
 * 
 * Represents audio data that can be played by AudioSource components. Similar to
 * Unity's AudioClip, this class handles loading, decoding, and providing access
 * to audio data through the Web Audio API. Supports various audio formats and
 * provides essential audio properties like length, channels, and sample rate.
 * 
 * **Unity Equivalent:** AudioClip class for audio data management
 * 
 * **Key Features:**
 * - Automatic audio loading and decoding via Web Audio API
 * - Support for common web audio formats (MP3, WAV, OGG, AAC)
 * - Audio buffer management and reuse
 * - Length and metadata extraction
 * - Error handling for unsupported formats or loading failures
 * 
 * @class AudioClip
 * 
 * @example
 * // Basic audio clip loading
 * const jumpSound = new AudioClip("jump", "assets/sounds/jump.wav");
 * await jumpSound.load();
 * 
 * @example
 * // Using in AudioSource
 * const audioSource = new AudioSourceComponent();
 * audioSource.clip = jumpSound;
 * audioSource.play();
 * 
 * @example
 * // Checking clip properties
 * console.log(`Duration: ${jumpSound.length}s`);
 * console.log(`Channels: ${jumpSound.channels}`);
 * console.log(`Sample Rate: ${jumpSound.frequency}Hz`);
 */
export class AudioClip {
    /**
     * Creates a new AudioClip with the specified name and URL.
     * 
     * Initializes the audio clip with basic properties and prepares it for loading.
     * The audio data is not loaded immediately - call load() to begin the loading
     * and decoding process. This allows for better control over when audio resources
     * are loaded and reduces initial page load time.
     * 
     * @param {string} name - Unique identifier for this audio clip
     * @param {string} url - Path to the audio file (relative or absolute)
     * 
     * @example
     * // Create clips for different audio types
     * const music = new AudioClip("background_music", "assets/music/theme.mp3");
     * const sfx = new AudioClip("explosion", "assets/sounds/explosion.wav");
     * const voice = new AudioClip("dialog_01", "assets/voice/intro.ogg");
     */
    constructor(name, url) {
        this.name = name;
        this.url = url;
        
        // Audio properties (populated after loading)
        this.audioBuffer = null;
        this.length = 0;         // Duration in seconds
        this.channels = 0;       // Number of audio channels
        this.frequency = 0;      // Sample rate in Hz
        
        // Loading state
        this.isLoaded = false;
        this.isLoading = false;
        this.loadError = null;
        
        // Get or create global audio context
        this.audioContext = AudioClip.getAudioContext();
    }
    
    /**
     * Gets or creates the global Web Audio API context.
     * 
     * Creates a singleton AudioContext that all audio clips share. This ensures
     * optimal resource usage and prevents the creation of multiple audio contexts
     * which can cause performance issues. Handles browser compatibility for
     * AudioContext creation.
     * 
     * @static
     * @returns {AudioContext} The global audio context instance
     * 
     * @example
     * // Access global audio context
     * const context = AudioClip.getAudioContext();
     * console.log('Sample Rate:', context.sampleRate);
     */
    static getAudioContext() {
        if (!AudioClip._audioContext) {
            // Handle browser compatibility
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            
            if (!AudioContextClass) {
                throw new Error('Web Audio API not supported in this browser');
            }
            
            AudioClip._audioContext = new AudioContextClass();
            
            // Resume context if it starts suspended (browser autoplay policies)
            if (AudioClip._audioContext.state === 'suspended') {
                // Will be resumed when user interacts with the page
                document.addEventListener('click', () => {
                    if (AudioClip._audioContext.state === 'suspended') {
                        AudioClip._audioContext.resume();
                    }
                }, { once: true });
            }
        }
        
        return AudioClip._audioContext;
    }
    
    /**
     * Loads and decodes the audio file.
     * 
     * Fetches the audio file from the specified URL and decodes it using the Web
     * Audio API. This is an asynchronous operation that should be awaited. Once
     * loaded, the audio clip can be used by AudioSource components for playback.
     * 
     * @async
     * @returns {Promise<boolean>} True if loading succeeded, false if failed
     * 
     * @example
     * // Load audio with error handling
     * const clip = new AudioClip("jump", "assets/jump.wav");
     * const success = await clip.load();
     * if (success) {
     *     console.log("Audio loaded successfully");
     * } else {
     *     console.error("Failed to load audio:", clip.loadError);
     * }
     */
    async load() {
        if (this.isLoaded) return true;
        if (this.isLoading) {
            // Wait for existing load operation
            return new Promise((resolve) => {
                const checkLoaded = () => {
                    if (!this.isLoading) {
                        resolve(this.isLoaded);
                    } else {
                        setTimeout(checkLoaded, 10);
                    }
                };
                checkLoaded();
            });
        }
        
        this.isLoading = true;
        this.loadError = null;
        
        try {
            // Fetch audio file
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
            }
            
            // Get array buffer
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode audio data
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Extract audio properties
            this.length = this.audioBuffer.length / this.audioBuffer.sampleRate;
            this.channels = this.audioBuffer.numberOfChannels;
            this.frequency = this.audioBuffer.sampleRate;
            
            this.isLoaded = true;
            this.isLoading = false;
            
            console.log(`✅ Audio clip loaded: ${this.name} (${this.length.toFixed(2)}s, ${this.channels}ch, ${this.frequency}Hz)`);
            return true;
            
        } catch (error) {
            this.loadError = error.message;
            this.isLoading = false;
            this.isLoaded = false;
            
            console.error(`❌ Failed to load audio clip '${this.name}':`, error);
            return false;
        }
    }
    
    /**
     * Creates an audio buffer source node for playback.
     * 
     * Generates a new AudioBufferSourceNode connected to the audio context. This
     * node can be configured and connected to other audio nodes (like gain nodes
     * or panners) before starting playback. Each playback requires a new source
     * node as they are single-use.
     * 
     * @returns {AudioBufferSourceNode|null} Audio source node or null if not loaded
     * 
     * @internal Used by AudioSource components for audio playback
     */
    createSourceNode() {
        if (!this.isLoaded || !this.audioBuffer) {
            console.warn(`Cannot create source node: Audio clip '${this.name}' not loaded`);
            return null;
        }
        
        const sourceNode = this.audioContext.createBufferSource();
        sourceNode.buffer = this.audioBuffer;
        return sourceNode;
    }
    
    /**
     * Checks if the audio clip is ready for playback.
     * 
     * @returns {boolean} True if the clip is loaded and ready to play
     */
    get isReady() {
        return this.isLoaded && this.audioBuffer !== null;
    }
    
    /**
     * Gets the current state of the audio clip.
     * 
     * @returns {string} Current state: 'unloaded', 'loading', 'loaded', or 'error'
     */
    get state() {
        if (this.loadError) return 'error';
        if (this.isLoading) return 'loading';
        if (this.isLoaded) return 'loaded';
        return 'unloaded';
    }
    
    /**
     * Preloads all audio clips in the provided array.
     * 
     * @static
     * @param {AudioClip[]} clips - Array of audio clips to preload
     * @returns {Promise<boolean[]>} Array of success states for each clip
     * 
     * @example
     * // Preload multiple clips
     * const clips = [jumpSound, shootSound, musicClip];
     * const results = await AudioClip.preloadAll(clips);
     * console.log(`${results.filter(r => r).length}/${clips.length} clips loaded`);
     */
    static async preloadAll(clips) {
        const loadPromises = clips.map(clip => clip.load());
        return Promise.all(loadPromises);
    }
}

// Static audio context reference
AudioClip._audioContext = null;
