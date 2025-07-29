/**
 * Base class for all input devices in the NityJS input system.
 * Provides a common interface that all input devices must implement.
 * 
 * This allows the input system to be extensible - developers can create
 * custom input devices (joystick, touch, voice, etc.) by extending this class.
 */
export class InputDevice {
    /**
     * Create a new input device
     * @param {string} name - The name of this input device (e.g., 'keyboard', 'mouse', 'gamepad')
     */
    constructor(name) {
        this.name = name;
        this.initialized = false;
    }

    /**
     * Initialize the input device - override in subclasses
     * @param {HTMLCanvasElement} canvas - Optional canvas for coordinate calculations
     */
    initialize(canvas = null) {
        throw new Error(`InputDevice '${this.name}' must implement initialize() method`);
    }

    /**
     * Update the input device state - called each frame
     * Override in subclasses to handle device-specific updates
     */
    update() {
        throw new Error(`InputDevice '${this.name}' must implement update() method`);
    }

    /**
     * Check if a key/button is currently being held down
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isDown(key) {
        throw new Error(`InputDevice '${this.name}' must implement isDown() method`);
    }

    /**
     * Check if a key/button was pressed this frame (click-like, only fires once)
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isPressed(key) {
        throw new Error(`InputDevice '${this.name}' must implement isPressed() method`);
    }

    /**
     * Check if a key/button was released this frame
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isReleased(key) {
        throw new Error(`InputDevice '${this.name}' must implement isReleased() method`);
    }

    /**
     * Register an event callback for this device
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {any} key - The key/button to listen for
     * @param {function} callback - Callback function
     */
    onEvent(event, key, callback) {
        // Default implementation - override if needed
        console.warn(`InputDevice '${this.name}' does not support event callbacks`);
    }

    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {any} key - The key/button to remove callback for
     */
    removeEvent(event, key) {
        // Default implementation - override if needed
        console.warn(`InputDevice '${this.name}' does not support event callbacks`);
    }

    /**
     * Resolve a key value to its canonical form
     * Handles multi-value keys (e.g., Space = [" ", "Space", " "])
     * @param {any} key - The key to resolve
     * @returns {string|number} Canonical key value
     */
    resolveKey(key) {
        // If key is an array, use the first value as canonical
        if (Array.isArray(key)) {
            return key[0];
        }
        return key;
    }

    /**
     * Check if a physical input matches a logical key definition
     * Supports multi-value keys
     * @param {any} physicalInput - The actual input received
     * @param {any} logicalKey - The logical key definition (may be array)
     * @returns {boolean}
     */
    matchesKey(physicalInput, logicalKey) {
        if (Array.isArray(logicalKey)) {
            return logicalKey.includes(physicalInput);
        }
        return physicalInput === logicalKey;
    }

    /**
     * Get device-specific information
     * @returns {Object}
     */
    getInfo() {
        return {
            name: this.name,
            initialized: this.initialized,
            type: this.constructor.name
        };
    }
}
