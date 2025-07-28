import { Component } from '../../common/Component.js';

/**
 * AudioListenerComponent - Unity-style audio listener for 3D spatial audio.
 * 
 * Acts as the "ears" of the game world, determining how 3D audio is perceived
 * by the player. Similar to Unity's AudioListener, this component should be
 * attached to the main camera or player object to provide positional audio
 * context. Only one AudioListener should be active in a scene at a time.
 * 
 * **Unity Equivalent:** AudioListener component for spatial audio reception
 * 
 * **Key Features:**
 * - 3D positional audio processing based on listener position and orientation
 * - Volume scaling for distance-based audio attenuation
 * - Stereo panning based on left/right positioning relative to listener
 * - Doppler effect calculation for moving audio sources (future enhancement)
 * - Global audio settings and master volume control
 * 
 * @class AudioListenerComponent
 * @extends Component
 * 
 * @example
 * // Add listener to main camera (recommended)
 * const camera = new GameObject(new Vector2(400, 300));
 * camera.addComponent(new CameraComponent());
 * camera.addComponent(new AudioListenerComponent());
 * 
 * @example
 * // Configure global audio settings
 * const listener = camera.getComponent(AudioListenerComponent);
 * listener.masterVolume = 0.8;
 * listener.dopplerFactor = 1.0;
 * 
 * @example
 * // Check if listener is active
 * if (AudioListenerComponent.main) {
 *     console.log("Audio listener is active");
 * }
 */
export class AudioListenerComponent extends Component {
    /**
     * Creates a new AudioListener component.
     * 
     * Initializes the audio listener with default settings and attempts to set
     * itself as the main listener. If another listener is already active, this
     * one will be inactive until the main listener is removed or this listener
     * is explicitly activated.
     * 
     * @example
     * // Basic listener setup
     * const listener = new AudioListenerComponent();
     * cameraObject.addComponent(listener);
     */
    constructor() {
        super();
        
        // Audio settings
        this.masterVolume = 1.0;        // Global volume multiplier (0.0 to 1.0)
        this.dopplerFactor = 1.0;       // Doppler effect intensity (future feature)
        this.rolloffFactor = 1.0;       // Distance attenuation multiplier
        
        // Listener state
        this.isActive = false;
        
        // Try to set as main listener if none exists
        if (!AudioListenerComponent.main) {
            this.setAsMainListener();
        }
        
        console.log(`🎧 AudioListener created ${this.isActive ? '(ACTIVE)' : '(inactive)'}`);
    }
    
    /**
     * Activates this listener as the main audio listener.
     * 
     * Sets this listener as the main audio receiver and deactivates any other
     * listeners in the scene. Only one listener should be active at a time to
     * avoid audio processing conflicts.
     * 
     * @example
     * // Switch to this listener
     * const newListener = camera2.getComponent(AudioListenerComponent);
     * newListener.setAsMainListener();
     */
    setAsMainListener() {
        // Deactivate previous main listener
        if (AudioListenerComponent.main && AudioListenerComponent.main !== this) {
            AudioListenerComponent.main.isActive = false;
            console.log('🎧 Previous AudioListener deactivated');
        }
        
        // Set this as main
        AudioListenerComponent.main = this;
        this.isActive = true;
        
        console.log('🎧 AudioListener activated as main listener');
    }
    
    /**
     * Calculates 3D audio parameters based on listener and source positions.
     * 
     * Determines volume attenuation and stereo panning for an audio source based
     * on its position relative to this listener. This creates realistic 3D audio
     * positioning where distant sounds are quieter and sounds to the left/right
     * are panned accordingly.
     * 
     * @param {Vector2} sourcePosition - World position of the audio source
     * @param {number} maxDistance - Maximum audible distance for the source
     * @param {number} rolloffMode - Distance rolloff mode ('linear', 'logarithmic', 'custom')
     * @returns {Object} Audio parameters for 3D positioning
     * @returns {number} returns.volume - Volume multiplier (0.0 to 1.0)
     * @returns {number} returns.pan - Stereo pan value (-1.0 to 1.0, left to right)
     * @returns {number} returns.distance - Distance between listener and source
     * 
     * @example
     * // Calculate audio parameters for a sound source
     * const audioParams = listener.calculate3DAudio(
     *     sourcePosition, 
     *     500,        // Max distance
     *     'linear'    // Rolloff mode
     * );
     * console.log(`Volume: ${audioParams.volume}, Pan: ${audioParams.pan}`);
     */
    calculate3DAudio(sourcePosition, maxDistance = 500, rolloffMode = 'linear') {
        if (!this.isActive || !this.gameObject) {
            return { volume: 0, pan: 0, distance: Infinity };
        }
        
        const listenerPosition = this.gameObject.position;
        
        // Calculate distance and direction
        const deltaX = sourcePosition.x - listenerPosition.x;
        const deltaY = sourcePosition.y - listenerPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate volume based on distance and rolloff
        let volume = 1.0;
        if (distance > 0 && maxDistance > 0) {
            switch (rolloffMode) {
                case 'linear':
                    volume = Math.max(0, 1.0 - (distance / maxDistance));
                    break;
                case 'logarithmic':
                    volume = Math.max(0, 1.0 / (1.0 + distance / maxDistance));
                    break;
                case 'inverse':
                    volume = Math.max(0, maxDistance / (maxDistance + distance));
                    break;
                default:
                    volume = Math.max(0, 1.0 - (distance / maxDistance));
            }
        }
        
        // Apply rolloff factor and master volume
        volume *= this.rolloffFactor * this.masterVolume;
        
        // Calculate stereo pan (-1.0 = left, 0.0 = center, 1.0 = right)
        let pan = 0;
        if (distance > 0) {
            // Normalize horizontal offset to pan range
            const maxPanDistance = maxDistance * 0.5; // Pan reaches maximum at half the audio range
            pan = Math.max(-1.0, Math.min(1.0, deltaX / maxPanDistance));
        }
        
        return {
            volume: Math.max(0, Math.min(1, volume)),
            pan: Math.max(-1, Math.min(1, pan)),
            distance: distance
        };
    }
    
    /**
     * Sets the global master volume for all audio.
     * 
     * @param {number} volume - Master volume (0.0 to 1.0)
     * 
     * @example
     * // Set master volume to 50%
     * listener.setMasterVolume(0.5);
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 Master volume set to ${(this.masterVolume * 100).toFixed(0)}%`);
    }
    
    /**
     * Gets the current world position of the listener.
     * 
     * @returns {Vector2|null} Listener position or null if no GameObject attached
     */
    get position() {
        return this.gameObject ? this.gameObject.position : null;
    }
    
    /**
     * Called when the component is destroyed.
     * Removes this listener as main if it was active.
     */
    destroy() {
        if (AudioListenerComponent.main === this) {
            AudioListenerComponent.main = null;
            console.log('🎧 Main AudioListener removed');
        }
        super.destroy();
    }
    
    /**
     * Component metadata support for visual editors.
     * 
     * @static
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
        return {
            masterVolume: 1.0,
            dopplerFactor: 1.0,
            rolloffFactor: 1.0
        };
    }
    
    /**
     * Updates component properties from metadata.
     * 
     * @private
     */
    _updatePropertiesFromMeta() {
        this.masterVolume = this.__meta.masterVolume;
        this.dopplerFactor = this.__meta.dopplerFactor;
        this.rolloffFactor = this.__meta.rolloffFactor;
    }
    
    /**
     * Validates metadata configuration.
     * 
     * @private
     */
    _validateMeta() {
        if (typeof this.__meta.masterVolume !== 'number' || this.__meta.masterVolume < 0 || this.__meta.masterVolume > 1) {
            throw new Error('AudioListener masterVolume must be a number between 0 and 1');
        }
        
        if (typeof this.__meta.dopplerFactor !== 'number' || this.__meta.dopplerFactor < 0) {
            throw new Error('AudioListener dopplerFactor must be a non-negative number');
        }
        
        if (typeof this.__meta.rolloffFactor !== 'number' || this.__meta.rolloffFactor < 0) {
            throw new Error('AudioListener rolloffFactor must be a non-negative number');
        }
    }
}

// Static reference to the main audio listener
AudioListenerComponent.main = null;
