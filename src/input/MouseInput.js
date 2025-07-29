/**
 * Mouse input device for the NityJS input system.
 * Handles mouse button clicks, position tracking, and movement.
 */
import { AbstractInputDevice } from './AbstractInputDevice.js';

export class MouseInput extends AbstractInputDevice {
    constructor() {
        super('mouse');
        
        // Mouse button state
        this.buttons = new Set(); // Currently held buttons
        this.pressedButtons = new Set(); // Buttons pressed this frame
        this.releasedButtons = new Set(); // Buttons released this frame
        this.previousButtons = new Set(); // Buttons from previous frame
        
        // Mouse position
        this.position = { x: 0, y: 0 }; // Current position
        this.lastPosition = { x: 0, y: 0 }; // Previous position
        
        // Event callbacks
        this.onButtonDown = new Map(); // button -> callback
        this.onButtonStay = new Map(); // button -> callback
        this.onButtonUp = new Map(); // button -> callback
        this.onMove = new Set(); // Set of movement callbacks
        
        // Canvas reference for coordinate calculation
        this.canvas = null;
    }

    /**
     * Initialize mouse input
     * @param {HTMLCanvasElement} canvas - Canvas for coordinate calculations
     */
    initialize(canvas = null) {
        if (this.initialized) return;

        this.canvas = canvas;
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('🖱️ Mouse input initialized');
    }

    /**
     * Set up mouse event listeners
     */
    setupEventListeners() {
        const target = this.canvas || window;
        
        target.addEventListener('mousedown', (e) => {
            const button = e.button;
            
            if (!this.buttons.has(button)) {
                this.pressedButtons.add(button);
                
                // Fire onButtonDown callback if registered
                const callback = this.onButtonDown.get(button);
                if (callback) callback(button, this.position);
            }
            
            this.buttons.add(button);
            this.updatePosition(e);
        });
        
        target.addEventListener('mouseup', (e) => {
            const button = e.button;
            
            this.buttons.delete(button);
            this.releasedButtons.add(button);
            
            // Fire onButtonUp callback if registered
            const callback = this.onButtonUp.get(button);
            if (callback) callback(button, this.position);
            
            this.updatePosition(e);
        });
        
        target.addEventListener('mousemove', (e) => {
            this.updatePosition(e);
            
            // Fire mouse move callbacks
            for (const callback of this.onMove) {
                callback(this.position, this.lastPosition);
            }
        });

        // Context menu prevention for right-click
        if (this.canvas) {
            this.canvas.addEventListener('contextmenu', e => e.preventDefault());
        }
    }

    /**
     * Update mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     */
    updatePosition(e) {
        this.lastPosition = { ...this.position };
        
        if (this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            this.position.x = e.clientX - rect.left;
            this.position.y = e.clientY - rect.top;
        } else {
            this.position.x = e.clientX;
            this.position.y = e.clientY;
        }
    }

    /**
     * Update mouse state - called each frame
     */
    update() {
        if (!this.initialized) return;

        // Fire onButtonStay callbacks for buttons that are held
        for (const button of this.buttons) {
            if (this.previousButtons.has(button)) {
                const callback = this.onButtonStay.get(button);
                if (callback) callback(button, this.position);
            }
        }

        // Clear frame-specific sets
        this.pressedButtons.clear();
        this.releasedButtons.clear();
        
        // Update previous state for next frame
        this.previousButtons = new Set(this.buttons);
    }

    /**
     * Check if a mouse button is currently being held down
     * @param {number|Array} button - Button index (0=left, 1=middle, 2=right) or array of buttons
     * @returns {boolean}
     */
    isDown(button) {
        const canonicalButton = this.resolveKey(button);
        return this.buttons.has(canonicalButton);
    }

    /**
     * Check if a mouse button was pressed this frame
     * @param {number|Array} button - Button index or array of buttons
     * @returns {boolean}
     */
    isPressed(button) {
        const canonicalButton = this.resolveKey(button);
        return this.pressedButtons.has(canonicalButton);
    }

    /**
     * Check if a mouse button was released this frame
     * @param {number|Array} button - Button index or array of buttons
     * @returns {boolean}
     */
    isReleased(button) {
        const canonicalButton = this.resolveKey(button);
        return this.releasedButtons.has(canonicalButton);
    }

    /**
     * Get current mouse position
     * @returns {Object} {x, y} coordinates
     */
    getPosition() {
        return { ...this.position };
    }

    /**
     * Get mouse movement delta from last frame
     * @returns {Object} {x, y} movement delta
     */
    getDelta() {
        return {
            x: this.position.x - this.lastPosition.x,
            y: this.position.y - this.lastPosition.y
        };
    }

    /**
     * Register an event callback for mouse input
     * @param {string} event - Event type ('down', 'up', 'stay', 'move')
     * @param {number|function} buttonOrCallback - Button index for button events, or callback for move events
     * @param {function} callback - Callback function (for button events)
     */
    onEvent(event, buttonOrCallback, callback = null) {
        if (event === 'move') {
            // Movement events don't have button parameter
            this.onMove.add(buttonOrCallback);
            return;
        }

        const button = buttonOrCallback;
        const canonicalButton = this.resolveKey(button);
        
        switch(event) {
            case 'down':
                this.onButtonDown.set(canonicalButton, callback);
                break;
            case 'stay':
                this.onButtonStay.set(canonicalButton, callback);
                break;
            case 'up':
                this.onButtonUp.set(canonicalButton, callback);
                break;
            default:
                console.warn(`Unknown mouse event: ${event}`);
        }
    }

    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay', 'move')
     * @param {number|function} buttonOrCallback - Button index for button events, or callback for move events
     */
    removeEvent(event, buttonOrCallback) {
        if (event === 'move') {
            this.onMove.delete(buttonOrCallback);
            return;
        }

        const button = buttonOrCallback;
        const canonicalButton = this.resolveKey(button);
        
        switch(event) {
            case 'down':
                this.onButtonDown.delete(canonicalButton);
                break;
            case 'stay':
                this.onButtonStay.delete(canonicalButton);
                break;
            case 'up':
                this.onButtonUp.delete(canonicalButton);
                break;
        }
    }

    /**
     * Clear all event callbacks
     */
    clearAllEvents() {
        this.onButtonDown.clear();
        this.onButtonStay.clear();
        this.onButtonUp.clear();
        this.onMove.clear();
    }

    /**
     * Get mouse device information
     * @returns {Object}
     */
    getInfo() {
        return {
            ...super.getInfo(),
            position: this.position,
            buttonsHeld: this.buttons.size,
            canvas: this.canvas ? 'Connected' : 'Global',
            events: {
                down: this.onButtonDown.size,
                stay: this.onButtonStay.size,
                up: this.onButtonUp.size,
                move: this.onMove.size
            }
        };
    }
}

// Mouse button constants for easy reference
export const Mouse = {
    Left: [0, 'left', 'primary'],
    Middle: [1, 'middle', 'auxiliary'], 
    Right: [2, 'right', 'secondary'],
    Back: [3, 'back'],
    Forward: [4, 'forward']
};
