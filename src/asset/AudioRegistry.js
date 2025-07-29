/**
 * AudioRegistry manages the loading and storage of audio assets for the game.
 * All audio files are stored in a unified registry for easy access.
 * Unity equivalent: Similar to Unity's Resources system or AssetDatabase for AudioClips
 * 
 * @example
 * // Create and automatically register audio assets
 * const backgroundMusic = new AudioAsset("background", "assets/background.mp3");
 * const jumpSound = new AudioAsset("jump", "assets/jump.wav");
 * const coinSound = new AudioAsset("coin", "assets/coin.ogg");
 * 
 * // Retrieve audio using unified system
 * const bgMusic = AudioRegistry.getAudio("background");
 * const jumpSfx = AudioRegistry.getAudio("jump");
 * 
 * // Use with AudioSourceComponent
 * audioSource.clip = AudioRegistry.getAudio("jump").toAudioClip();
 */
export class AudioRegistry {
    static audioAssets = new Map(); // Storage for all audio assets

    /**
     * Internal method to add an audio asset (used by AudioAsset constructor)
     * @param {string} name - Name to register the audio under
     * @param {AudioAsset} audioAsset - The audio asset to register
     * @private
     */
    static _addAudio(name, audioAsset) {
        this.audioAssets.set(name, audioAsset);
        console.log(`AudioRegistry: Registered audio "${name}"`);
    }

    /**
     * Internal method to remove an audio asset
     * @param {string} name - Name of the audio to remove
     * @private
     */
    static _removeAudio(name) {
        const removed = this.audioAssets.delete(name);
        if (removed) {
            console.log(`AudioRegistry: Removed audio "${name}"`);
        }
    }

    /**
     * Get a registered audio asset
     * @param {string} name - Name of the audio asset
     * @returns {AudioAsset|null} The audio asset or null if not found
     */
    static getAudio(name) {
        const audio = this.audioAssets.get(name);
        if (!audio) {
            console.warn(`AudioRegistry: Audio "${name}" not found. Available audio:`, [...this.audioAssets.keys()]);
            return null;
        }
        return audio;
    }

    /**
     * Get an audio asset as an AudioClip (for compatibility with AudioSourceComponent)
     * @param {string} name - Name of the audio asset
     * @returns {Object|null} AudioClip-compatible object or null if not found
     */
    static getAudioClip(name) {
        const audio = this.getAudio(name);
        return audio ? audio.toAudioClip() : null;
    }

    /**
     * Check if an audio asset exists in the registry
     * @param {string} name - Name of the audio asset
     * @returns {boolean} True if the audio exists, false otherwise
     */
    static hasAudio(name) {
        return this.audioAssets.has(name);
    }

    /**
     * Get all registered audio asset names
     * @returns {Array<string>} Array of all registered audio names
     */
    static getAllAudioNames() {
        return [...this.audioAssets.keys()];
    }

    /**
     * Get all registered audio assets
     * @returns {Array<AudioAsset>} Array of all registered audio assets
     */
    static getAllAudio() {
        return [...this.audioAssets.values()];
    }

    /**
     * Get information about all registered audio assets
     * @returns {Array<Object>} Array of audio information objects
     */
    static getAllAudioInfo() {
        return this.getAllAudio().map(audio => audio.getInfo());
    }

    /**
     * Check loading status of all audio assets
     * @returns {Object} Loading status summary
     */
    static getLoadingStatus() {
        const allAudio = this.getAllAudio();
        const loaded = allAudio.filter(audio => audio.isReady());
        const loading = allAudio.filter(audio => !audio.isReady());
        
        return {
            total: allAudio.length,
            loaded: loaded.length,
            loading: loading.length,
            progress: allAudio.length > 0 ? loaded.length / allAudio.length : 1,
            loadedAssets: loaded.map(audio => audio.name),
            loadingAssets: loading.map(audio => audio.name)
        };
    }

    /**
     * Preload all registered audio assets
     * This method is called internally by the Game class during initialization
     * @returns {Promise<void>} Promise that resolves when all audio assets are loaded
     * @private
     */
    static async preloadAll() {
        const allAudio = this.getAllAudio();
        const promises = allAudio.map(audio => audio.load());
        
        try {
            await Promise.all(promises);
            console.log('AudioRegistry: All audio assets loaded successfully');
        } catch (error) {
            console.error('AudioRegistry: Some audio assets failed to load:', error);
            throw error;
        }
    }

    /**
     * Wait for all audio assets to finish loading (legacy method)
     * @returns {Promise} Promise that resolves when all audio is loaded
     * @deprecated Use preloadAll() instead
     */
    static async waitForAllToLoad() {
        return this.preloadAll();
    }

    /**
     * Load all registered audio assets (legacy method)
     * @returns {Promise} Promise that resolves when all audio is loaded
     * @deprecated Use preloadAll() instead
     */
    static async loadAll() {
        return this.preloadAll();
    }

    /**
     * Preload a list of audio files
     * @param {Array<Object>} audioList - Array of {name, path, config} objects
     * @returns {Promise<Array<AudioAsset>>} Promise that resolves to loaded assets
     */
    static async preloadAudio(audioList) {
        const { AudioAsset } = await import('./AudioAsset.js');
        return AudioAsset.preloadMultiple(audioList);
    }

    /**
     * Clear all registered audio assets and free memory
     */
    static clear() {
        const allAudio = this.getAllAudio();
        allAudio.forEach(audio => audio.dispose());
        this.audioAssets.clear();
        console.log('AudioRegistry: Cleared all audio assets');
    }

    /**
     * Remove a specific audio asset from the registry
     * @param {string} name - Name of the audio asset to remove
     * @returns {boolean} True if removed, false if not found
     */
    static removeAudio(name) {
        const audio = this.getAudio(name);
        if (audio) {
            audio.dispose();
            return true;
        }
        return false;
    }

    /**
     * Get memory usage information for all audio assets
     * @returns {Object} Memory usage information
     */
    static getMemoryUsage() {
        const allAudio = this.getAllAudio();
        let totalDuration = 0;
        let totalChannels = 0;
        let estimatedMemoryMB = 0;

        allAudio.forEach(audio => {
            if (audio.isReady()) {
                const duration = audio.getDuration();
                const sampleRate = audio.getSampleRate();
                const channels = audio.getChannelCount();
                
                totalDuration += duration;
                totalChannels += channels;
                
                // Rough estimate: sampleRate * channels * duration * 4 bytes (32-bit float)
                estimatedMemoryMB += (sampleRate * channels * duration * 4) / (1024 * 1024);
            }
        });

        return {
            totalAssets: allAudio.length,
            loadedAssets: allAudio.filter(audio => audio.isReady()).length,
            totalDurationSeconds: Math.round(totalDuration),
            averageChannels: allAudio.length > 0 ? totalChannels / allAudio.length : 0,
            estimatedMemoryMB: Math.round(estimatedMemoryMB * 100) / 100
        };
    }

    /**
     * Create a batch operation for loading multiple audio files
     * @param {Array<Object>} audioList - Array of {name, path, config} objects
     * @param {Function} onProgress - Optional progress callback (loaded, total)
     * @returns {Promise<Array<AudioAsset>>} Promise that resolves to loaded assets
     */
    static async loadBatch(audioList, onProgress = null) {
        const results = [];
        let loaded = 0;

        for (const audioInfo of audioList) {
            try {
                const { AudioAsset } = await import('./AudioAsset.js');
                const asset = await AudioAsset.create(audioInfo.name, audioInfo.path, audioInfo.config || {});
                results.push(asset);
                loaded++;
                
                if (onProgress) {
                    onProgress(loaded, audioList.length);
                }
            } catch (error) {
                console.error(`Failed to load audio "${audioInfo.name}":`, error);
                results.push(null);
            }
        }

        console.log(`AudioRegistry: Batch loaded ${results.filter(r => r).length}/${audioList.length} audio assets`);
        return results;
    }

    /**
     * Debug method to log all registered audio information
     */
    static debug() {
        console.group('AudioRegistry Debug Information');
        console.log('Registered Audio Assets:', this.getAllAudioNames());
        console.log('Loading Status:', this.getLoadingStatus());
        console.log('Memory Usage:', this.getMemoryUsage());
        console.log('Detailed Info:', this.getAllAudioInfo());
        console.groupEnd();
    }
}
