/**
 * Keyboard input device for the NityJS input system.
 * Handles keyboard input with multi-value key support and logical key mapping.
 */
import { AbstractInputDevice } from './AbstractInputDevice.js';

export class KeyboardInput extends AbstractInputDevice {
    constructor() {
        super('keyboard');
        
        // Input state tracking
        this.keys = new Set(); // Currently held keys
        this.pressedKeys = new Set(); // Keys pressed this frame
        this.releasedKeys = new Set(); // Keys released this frame
        this.previousKeys = new Set(); // Keys from previous frame
        
        // Event callbacks
        this.onKeyDown = new Map(); // key -> callback
        this.onKeyStay = new Map(); // key -> callback  
        this.onKeyUp = new Map(); // key -> callback
        
        // Key mapping system - import dynamically to avoid circular deps
        this.keyMapping = null;
    }

    /**
     * Initialize keyboard input
     * @param {HTMLCanvasElement} canvas - Optional canvas (not used for keyboard)
     */
    async initialize(canvas = null) {
        if (this.initialized) return;

        try {
            // Import keyboard mapping
            const { Keyboard } = await import('./mappings/Keyboard.js');
            this.keyMapping = Keyboard;
            
            // Initialize keyboard mapping
            if (Keyboard.initialize) {
                Keyboard.initialize();
            }

            // Set up keyboard event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('🎹 Keyboard input initialized');
            
        } catch (error) {
            console.error('Failed to initialize keyboard input:', error);
        }
    }

    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            const logicalKey = this.getLogicalKey(e.key);
            
            if (!this.keys.has(logicalKey)) {
                this.pressedKeys.add(logicalKey);
                
                // Fire onKeyDown callback if registered
                const callback = this.onKeyDown.get(logicalKey);
                if (callback) callback(logicalKey);
            }
            
            this.keys.add(logicalKey);
        });
        
        window.addEventListener('keyup', (e) => {
            const logicalKey = this.getLogicalKey(e.key);
            
            this.keys.delete(logicalKey);
            this.releasedKeys.add(logicalKey);
            
            // Fire onKeyUp callback if registered
            const callback = this.onKeyUp.get(logicalKey);
            if (callback) callback(logicalKey);
        });
    }

    /**
     * Update keyboard state - called each frame
     */
    update() {
        if (!this.initialized) return;

        // Fire onKeyStay callbacks for keys that are held
        for (const key of this.keys) {
            if (this.previousKeys.has(key)) {
                const callback = this.onKeyStay.get(key);
                if (callback) callback(key);
            }
        }

        // Clear frame-specific sets
        this.pressedKeys.clear();
        this.releasedKeys.clear();
        
        // Update previous state for next frame
        this.previousKeys = new Set(this.keys);
    }

    /**
     * Get logical key name from physical key input
     * @param {string} physicalKey - The physical key pressed
     * @returns {string} Logical key name
     */
    getLogicalKey(physicalKey) {
        if (this.keyMapping && this.keyMapping.getLogicalKey) {
            return this.keyMapping.getLogicalKey(physicalKey);
        }
        // Fallback to physical key if no mapping available
        return physicalKey;
    }

    /**
     * Check if a key is currently being held down
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isDown(key) {
        const canonicalKey = this.resolveKey(key);
        return this.keys.has(canonicalKey);
    }

    /**
     * Check if a key was pressed this frame
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isPressed(key) {
        const canonicalKey = this.resolveKey(key);
        return this.pressedKeys.has(canonicalKey);
    }

    /**
     * Check if a key was released this frame
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isReleased(key) {
        const canonicalKey = this.resolveKey(key);
        return this.releasedKeys.has(canonicalKey);
    }

    /**
     * Register an event callback for keyboard input
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {string|Array} key - The key to listen for
     * @param {function} callback - Callback function
     */
    onEvent(event, key, callback) {
        const canonicalKey = this.resolveKey(key);
        
        switch(event) {
            case 'down':
                this.onKeyDown.set(canonicalKey, callback);
                break;
            case 'stay':
                this.onKeyStay.set(canonicalKey, callback);
                break;
            case 'up':
                this.onKeyUp.set(canonicalKey, callback);
                break;
            default:
                console.warn(`Unknown keyboard event: ${event}`);
        }
    }

    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {string|Array} key - The key to remove callback for
     */
    removeEvent(event, key) {
        const canonicalKey = this.resolveKey(key);
        
        switch(event) {
            case 'down':
                this.onKeyDown.delete(canonicalKey);
                break;
            case 'stay':
                this.onKeyStay.delete(canonicalKey);
                break;
            case 'up':
                this.onKeyUp.delete(canonicalKey);
                break;
        }
    }

    /**
     * Clear all event callbacks
     */
    clearAllEvents() {
        this.onKeyDown.clear();
        this.onKeyStay.clear();
        this.onKeyUp.clear();
    }

    /**
     * Get keyboard device information
     * @returns {Object}
     */
    getInfo() {
        return {
            ...super.getInfo(),
            keysHeld: this.keys.size,
            mappingSystem: this.keyMapping ? 'Loaded' : 'Not available',
            events: {
                down: this.onKeyDown.size,
                stay: this.onKeyStay.size,
                up: this.onKeyUp.size
            }
        };
    }
}
