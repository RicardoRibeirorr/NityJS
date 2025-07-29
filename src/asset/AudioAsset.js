/**
 * AudioAsset - Manages a single audio file
 * Unity equivalent: Unity's AudioClip class for individual audio assets
 * Extends AudioClip to provide registry integration and additional asset management
 */
import { AudioRegistry } from './AudioRegistry.js';
import { AudioClip } from '../audio/AudioClip.js';

export class AudioAsset extends AudioClip {
    /**
     * Create a new audio asset and automatically register it
     * @param {string} name - Name to register the audio under
     * @param {string} audioPath - Path to the audio file
     * @param {Object} [config] - Optional configuration
     * @param {number} [config.volume=1.0] - Default volume (0.0 to 1.0)
     * @param {boolean} [config.loop=false] - Default loop setting
     * @param {string} [config.format] - Audio format hint (mp3, wav, ogg, etc.)
     */
    constructor(name, audioPath, config = {}) {
        // Call parent AudioClip constructor
        super(name, audioPath);
        
        // AudioAsset-specific properties
        this.audioPath = audioPath; // Keep reference for compatibility
        this.volume = config.volume !== undefined ? config.volume : 1.0;
        this.loop = config.loop || false;
        this.format = config.format || this.#detectFormat(audioPath);
        
        // Automatically register this audio
        this.#_registerSelf();
        
        // Start loading immediately
        this.load();
    }

    /**
     * Automatically register this audio asset
     * @private
     */
    #_registerSelf() {
        AudioRegistry._addAudio(this.name, this);
    }

    /**
     * Detect audio format from file extension
     * @param {string} path - Audio file path
     * @returns {string} Detected format
     * @private
     */
    #detectFormat(path) {
        const extension = path.split('.').pop().toLowerCase();
        return extension;
    }

    /**
     * Create a copy of this audio asset with different settings
     * @param {Object} config - Configuration overrides
     * @returns {AudioAsset} New audio asset instance
     */
    clone(config = {}) {
        return new AudioAsset(this.name + '_copy', this.audioPath, {
            volume: config.volume !== undefined ? config.volume : this.volume,
            loop: config.loop !== undefined ? config.loop : this.loop,
            format: config.format || this.format,
            ...config
        });
    }

    /**
     * Get audio information as an object
     * @returns {Object} Audio information
     */
    getInfo() {
        return {
            name: this.name,
            path: this.audioPath,
            format: this.format,
            isLoaded: this.isLoaded,
            duration: this.length,        // Use inherited property
            sampleRate: this.frequency,   // Use inherited property  
            channels: this.channels,      // Use inherited property
            volume: this.volume,
            loop: this.loop
        };
    }

    /**
     * Dispose of the audio asset and free memory
     */
    dispose() {
        this.audioBuffer = null;
        this.audioContext = null;
        this.isLoaded = false;
        
        // Remove from registry
        AudioRegistry._removeAudio(this.name);
        
        console.log(`AudioAsset "${this.name}" disposed`);
    }

    /** 
     * Static method to create and load an audio asset
     * @param {string} name - Name to register the audio under
     * @param {string} audioPath - Path to the audio file
     * @param {Object} config - Optional configuration
     * @returns {Promise<AudioAsset>} Promise that resolves to the loaded audio asset
     */
    static async create(name, audioPath, config = {}) {
        const asset = new AudioAsset(name, audioPath, config);
        await asset.load();
        return asset;
    }

    /**
     * Static method to preload multiple audio assets
     * @param {Array<Object>} audioList - Array of {name, path, config} objects
     * @returns {Promise<Array<AudioAsset>>} Promise that resolves to array of loaded assets
     */
    static async preloadMultiple(audioList) {
        const promises = audioList.map(audio => 
            AudioAsset.create(audio.name, audio.path, audio.config || {})
        );
        
        try {
            const assets = await Promise.all(promises);
            console.log(`Preloaded ${assets.length} audio assets`);
            return assets;
        } catch (error) {
            console.error('Failed to preload some audio assets:', error);
            throw error;
        }
    }
}
