/**
 * Gamepad input device for the NityJS input system.
 * Handles gamepad button presses, analog sticks, and triggers.
 */
import { AbstractInputDevice } from './AbstractInputDevice.js';

export class GamepadInput extends AbstractInputDevice {
    constructor() {
        super('gamepad');
        
        // Gamepad state
        this.gamepad = null; // Current gamepad object
        this.gamepadIndex = 0; // Which gamepad to use
        this.buttons = new Set(); // Currently held buttons
        this.pressedButtons = new Set(); // Buttons pressed this frame
        this.releasedButtons = new Set(); // Buttons released this frame
        this.previousButtons = new Set(); // Buttons from previous frame
        
        // Analog stick state
        this.leftStick = { x: 0, y: 0 };
        this.rightStick = { x: 0, y: 0 };
        this.deadzone = 0.1; // Analog stick deadzone
        
        // Trigger state
        this.triggers = { left: 0, right: 0 };
        
        // Event callbacks
        this.onButtonDown = new Map(); // button -> callback
        this.onButtonStay = new Map(); // button -> callback
        this.onButtonUp = new Map(); // button -> callback
        this.onStickMove = new Map(); // stick -> callback
        this.onTriggerMove = new Map(); // trigger -> callback
        
        // Connection callbacks
        this.onConnected = new Set();
        this.onDisconnected = new Set();
    }

    /**
     * Initialize gamepad input
     * @param {number} gamepadIndex - Which gamepad to use (default: 0)
     */
    initialize(gamepadIndex = 0) {
        if (this.initialized) return;

        this.gamepadIndex = gamepadIndex;
        this.setupEventListeners();
        this.updateGamepadState(); // Check if already connected
        
        this.initialized = true;
        console.log(`🎮 Gamepad input initialized (index: ${gamepadIndex})`);
    }

    /**
     * Set up gamepad event listeners
     */
    setupEventListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.gamepad = e.gamepad;
                console.log(`🎮 Gamepad connected: ${e.gamepad.id}`);
                
                // Fire connected callbacks
                for (const callback of this.onConnected) {
                    callback(e.gamepad);
                }
            }
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            if (e.gamepad.index === this.gamepadIndex) {
                this.gamepad = null;
                console.log(`🎮 Gamepad disconnected: ${e.gamepad.id}`);
                
                // Fire disconnected callbacks
                for (const callback of this.onDisconnected) {
                    callback(e.gamepad);
                }
                
                // Clear state
                this.buttons.clear();
                this.pressedButtons.clear();
                this.releasedButtons.clear();
                this.previousButtons.clear();
            }
        });
    }

    /**
     * Update gamepad state - called each frame
     */
    update() {
        if (!this.initialized) return;

        this.updateGamepadState();
        
        if (!this.gamepad) return;

        // Update button states
        this.updateButtonStates();
        
        // Update analog sticks
        this.updateAnalogSticks();
        
        // Update triggers
        this.updateTriggers();

        // Fire onButtonStay callbacks for buttons that are held
        for (const button of this.buttons) {
            if (this.previousButtons.has(button)) {
                const callback = this.onButtonStay.get(button);
                if (callback) callback(button);
            }
        }

        // Clear frame-specific sets
        this.pressedButtons.clear();
        this.releasedButtons.clear();
        
        // Update previous state for next frame
        this.previousButtons = new Set(this.buttons);
    }

    /**
     * Update gamepad object from navigator.getGamepads()
     */
    updateGamepadState() {
        const gamepads = navigator.getGamepads();
        if (gamepads[this.gamepadIndex]) {
            this.gamepad = gamepads[this.gamepadIndex];
        }
    }

    /**
     * Update button states from gamepad
     */
    updateButtonStates() {
        if (!this.gamepad) return;

        for (let i = 0; i < this.gamepad.buttons.length; i++) {
            const isPressed = this.gamepad.buttons[i].pressed;
            
            if (isPressed && !this.buttons.has(i)) {
                // Button pressed this frame
                this.pressedButtons.add(i);
                this.buttons.add(i);
                
                // Fire onButtonDown callback
                const callback = this.onButtonDown.get(i);
                if (callback) callback(i);
                
            } else if (!isPressed && this.buttons.has(i)) {
                // Button released this frame
                this.releasedButtons.add(i);
                this.buttons.delete(i);
                
                // Fire onButtonUp callback
                const callback = this.onButtonUp.get(i);
                if (callback) callback(i);
            }
        }
    }

    /**
     * Update analog stick states
     */
    updateAnalogSticks() {
        if (!this.gamepad || this.gamepad.axes.length < 4) return;

        const newLeftStick = {
            x: this.applyDeadzone(this.gamepad.axes[0]),
            y: this.applyDeadzone(this.gamepad.axes[1])
        };
        
        const newRightStick = {
            x: this.applyDeadzone(this.gamepad.axes[2]),
            y: this.applyDeadzone(this.gamepad.axes[3])
        };

        // Check for stick movement
        if (this.stickMoved(this.leftStick, newLeftStick)) {
            this.leftStick = newLeftStick;
            const callback = this.onStickMove.get('left');
            if (callback) callback('left', this.leftStick);
        }

        if (this.stickMoved(this.rightStick, newRightStick)) {
            this.rightStick = newRightStick;
            const callback = this.onStickMove.get('right');
            if (callback) callback('right', this.rightStick);
        }
    }

    /**
     * Update trigger states
     */
    updateTriggers() {
        if (!this.gamepad) return;

        // Check for triggers in buttons array (some controllers)
        if (this.gamepad.buttons[6]) { // Left trigger
            const newLeftTrigger = this.gamepad.buttons[6].value;
            if (Math.abs(this.triggers.left - newLeftTrigger) > 0.01) {
                this.triggers.left = newLeftTrigger;
                const callback = this.onTriggerMove.get('left');
                if (callback) callback('left', newLeftTrigger);
            }
        }

        if (this.gamepad.buttons[7]) { // Right trigger
            const newRightTrigger = this.gamepad.buttons[7].value;
            if (Math.abs(this.triggers.right - newRightTrigger) > 0.01) {
                this.triggers.right = newRightTrigger;
                const callback = this.onTriggerMove.get('right');
                if (callback) callback('right', newRightTrigger);
            }
        }
    }

    /**
     * Apply deadzone to analog input
     * @param {number} value - Raw analog value
     * @returns {number} - Deadzone-adjusted value
     */
    applyDeadzone(value) {
        return Math.abs(value) < this.deadzone ? 0 : value;
    }

    /**
     * Check if analog stick has moved significantly
     * @param {Object} oldStick - Previous stick position
     * @param {Object} newStick - New stick position
     * @returns {boolean}
     */
    stickMoved(oldStick, newStick) {
        const threshold = 0.01;
        return Math.abs(oldStick.x - newStick.x) > threshold || 
               Math.abs(oldStick.y - newStick.y) > threshold;
    }

    /**
     * Check if a gamepad button is currently being held down
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isDown(button) {
        const canonicalButton = this.resolveKey(button);
        return this.buttons.has(canonicalButton);
    }

    /**
     * Check if a gamepad button was pressed this frame
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isPressed(button) {
        const canonicalButton = this.resolveKey(button);
        return this.pressedButtons.has(canonicalButton);
    }

    /**
     * Check if a gamepad button was released this frame
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isReleased(button) {
        const canonicalButton = this.resolveKey(button);
        return this.releasedButtons.has(canonicalButton);
    }

    /**
     * Get analog stick position
     * @param {string} stick - 'left' or 'right'
     * @returns {Object} {x, y} stick position (-1 to 1)
     */
    getStick(stick) {
        return stick === 'left' ? { ...this.leftStick } : { ...this.rightStick };
    }

    /**
     * Get trigger value
     * @param {string} trigger - 'left' or 'right'
     * @returns {number} Trigger value (0 to 1)
     */
    getTrigger(trigger) {
        return this.triggers[trigger] || 0;
    }

    /**
     * Check if gamepad is connected
     * @returns {boolean}
     */
    isConnected() {
        return this.gamepad !== null;
    }

    /**
     * Set analog stick deadzone
     * @param {number} deadzone - Deadzone value (0 to 1)
     */
    setDeadzone(deadzone) {
        this.deadzone = Math.max(0, Math.min(1, deadzone));
    }

    /**
     * Register an event callback for gamepad input
     * @param {string} event - Event type ('down', 'up', 'stay', 'stick', 'trigger', 'connected', 'disconnected')
     * @param {number|string|function} buttonOrCallback - Button/stick/trigger identifier or callback
     * @param {function} callback - Callback function
     */
    onEvent(event, buttonOrCallback, callback = null) {
        if (event === 'connected' || event === 'disconnected') {
            // Connection events don't have button parameter
            const callbackSet = event === 'connected' ? this.onConnected : this.onDisconnected;
            callbackSet.add(buttonOrCallback);
            return;
        }

        const identifier = buttonOrCallback;
        const canonicalIdentifier = this.resolveKey(identifier);
        
        switch(event) {
            case 'down':
                this.onButtonDown.set(canonicalIdentifier, callback);
                break;
            case 'stay':
                this.onButtonStay.set(canonicalIdentifier, callback);
                break;
            case 'up':
                this.onButtonUp.set(canonicalIdentifier, callback);
                break;
            case 'stick':
                this.onStickMove.set(canonicalIdentifier, callback);
                break;
            case 'trigger':
                this.onTriggerMove.set(canonicalIdentifier, callback);
                break;
            default:
                console.warn(`Unknown gamepad event: ${event}`);
        }
    }

    /**
     * Remove an event callback
     * @param {string} event - Event type
     * @param {number|string|function} buttonOrCallback - Button/stick/trigger identifier or callback
     */
    removeEvent(event, buttonOrCallback) {
        if (event === 'connected' || event === 'disconnected') {
            const callbackSet = event === 'connected' ? this.onConnected : this.onDisconnected;
            callbackSet.delete(buttonOrCallback);
            return;
        }

        const identifier = buttonOrCallback;
        const canonicalIdentifier = this.resolveKey(identifier);
        
        switch(event) {
            case 'down':
                this.onButtonDown.delete(canonicalIdentifier);
                break;
            case 'stay':
                this.onButtonStay.delete(canonicalIdentifier);
                break;
            case 'up':
                this.onButtonUp.delete(canonicalIdentifier);
                break;
            case 'stick':
                this.onStickMove.delete(canonicalIdentifier);
                break;
            case 'trigger':
                this.onTriggerMove.delete(canonicalIdentifier);
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
        this.onStickMove.clear();
        this.onTriggerMove.clear();
        this.onConnected.clear();
        this.onDisconnected.clear();
    }

    /**
     * Get gamepad device information
     * @returns {Object}
     */
    getInfo() {
        return {
            ...super.getInfo(),
            connected: this.isConnected(),
            gamepadId: this.gamepad ? this.gamepad.id : 'None',
            buttonsHeld: this.buttons.size,
            leftStick: this.leftStick,
            rightStick: this.rightStick,
            triggers: this.triggers,
            deadzone: this.deadzone,
            events: {
                down: this.onButtonDown.size,
                stay: this.onButtonStay.size,
                up: this.onButtonUp.size,
                stick: this.onStickMove.size,
                trigger: this.onTriggerMove.size,
                connected: this.onConnected.size,
                disconnected: this.onDisconnected.size
            }
        };
    }
}

// Gamepad button constants for easy reference (Standard Gamepad)
export const Gamepad = {
    // Face buttons
    A: [0, 'a', 'cross'],
    B: [1, 'b', 'circle'],
    X: [2, 'x', 'square'],
    Y: [3, 'y', 'triangle'],
    
    // Shoulder buttons
    LeftBumper: [4, 'leftBumper', 'l1'],
    RightBumper: [5, 'rightBumper', 'r1'],
    LeftTrigger: [6, 'leftTrigger', 'l2'],
    RightTrigger: [7, 'rightTrigger', 'r2'],
    
    // Menu buttons
    Back: [8, 'back', 'select'],
    Start: [9, 'start'],
    
    // Stick clicks
    LeftStick: [10, 'leftStick', 'l3'],
    RightStick: [11, 'rightStick', 'r3'],
    
    // D-pad
    DPadUp: [12, 'dpadUp', 'up'],
    DPadDown: [13, 'dpadDown', 'down'],
    DPadLeft: [14, 'dpadLeft', 'left'],
    DPadRight: [15, 'dpadRight', 'right'],
    
    // Special buttons (varies by controller)
    Home: [16, 'home', 'guide'],
    
    // Stick names for getStick()
    Sticks: {
        Left: ['left', 'leftStick'],
        Right: ['right', 'rightStick']
    },
    
    // Trigger names for getTrigger()
    Triggers: {
        Left: ['left', 'leftTrigger'],
        Right: ['right', 'rightTrigger']
    }
};
