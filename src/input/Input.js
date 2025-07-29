/**
 * Main Input system for NityJS - Extensible device-based input management
 * Provides device-specific access: Input.keyboard.isPressed(), Input.mouse.isDown(), etc.
 */
import { KeyboardInput } from './KeyboardInput.js';
import { MouseInput } from './MouseInput.js';
import { GamepadInput } from './GamepadInput.js';

export class Input {
    // Device instances - accessible as Input.keyboard, Input.mouse, Input.gamepad
    static keyboard = new KeyboardInput();
    static mouse = new MouseInput();
    static gamepad = new GamepadInput();
    
    // Device registry for extensibility
    static devices = new Map();
    static deviceMappings = new Map(); // Custom device key mappings
    
    static initialized = false;

    /**
     * Initialize the input system with all devices
     * @param {HTMLCanvasElement} canvas - Canvas for mouse coordinate calculations
     * @param {Object} options - Configuration options
     */
    static initialize(canvas = null, options = {}) {
        if (Input.initialized) return;
        
        // Register core devices
        Input.registerDevice('keyboard', Input.keyboard);
        Input.registerDevice('mouse', Input.mouse);
        Input.registerDevice('gamepad', Input.gamepad);
        
        // Initialize core devices
        Input.keyboard.initialize();
        Input.mouse.initialize(canvas);
        Input.gamepad.initialize(options.gamepadIndex || 0);
        
        Input.initialized = true;
        console.log('🎮 Input system initialized with devices:', [...Input.devices.keys()]);
    }

    /**
     * Update all registered input devices - called each frame
     */
    static update() {
        if (!Input.initialized) return;
        
        for (const device of Input.devices.values()) {
            device.update();
        }
    }

    /**
     * Register a new input device
     * @param {string} name - Device name (e.g., 'keyboard', 'mouse', 'customController')
     * @param {InputDevice} device - Device instance
     */
    static registerDevice(name, device) {
        Input.devices.set(name, device);
        
        // Make device accessible as Input.deviceName
        if (!Input.hasOwnProperty(name)) {
            Input[name] = device;
        }
        
        console.log(`📥 Registered input device: ${name}`);
    }

    /**
     * Unregister an input device
     * @param {string} name - Device name to remove
     */
    static unregisterDevice(name) {
        if (Input.devices.has(name)) {
            const device = Input.devices.get(name);
            if (device.initialized) {
                device.clearAllEvents();
            }
            
            Input.devices.delete(name);
            
            // Remove from Input class if it was a direct property
            if (Input.hasOwnProperty(name)) {
                delete Input[name];
            }
            
            console.log(`📤 Unregistered input device: ${name}`);
        }
    }

    /**
     * Register custom key mappings for a device
     * Allows extending device mappings without modifying device classes
     * @param {string} deviceName - Name of the device
     * @param {Object} mappings - Key mappings object
     */
    static registerMapping(deviceName, mappings) {
        if (!Input.deviceMappings.has(deviceName)) {
            Input.deviceMappings.set(deviceName, new Map());
        }
        
        const deviceMap = Input.deviceMappings.get(deviceName);
        
        for (const [key, values] of Object.entries(mappings)) {
            deviceMap.set(key, Array.isArray(values) ? values : [values]);
        }
        
        console.log(`🗂️ Registered custom mappings for ${deviceName}:`, Object.keys(mappings));
    }

    /**
     * Get a specific input device
     * @param {string} name - Device name
     * @returns {InputDevice|null} - The device instance or null
     */
    static getDevice(name) {
        return Input.devices.get(name) || null;
    }

    /**
     * Get all registered device names
     * @returns {Array<string>} - Array of device names
     */
    static getDeviceNames() {
        return [...Input.devices.keys()];
    }

    /**
     * Check if a device is registered and initialized
     * @param {string} name - Device name
     * @returns {boolean}
     */
    static isDeviceReady(name) {
        const device = Input.devices.get(name);
        return device && device.initialized;
    }

    /**
     * Get input system status and information
     * @returns {Object} - System status information
     */
    static getSystemInfo() {
        const deviceInfo = {};
        
        for (const [name, device] of Input.devices.entries()) {
            deviceInfo[name] = device.getInfo();
        }
        
        return {
            initialized: Input.initialized,
            totalDevices: Input.devices.size,
            customMappings: Input.deviceMappings.size,
            devices: deviceInfo
        };
    }

    /**
     * Clear all input state and events for all devices
     */
    static clearAll() {
        for (const device of Input.devices.values()) {
            if (device.clearAllEvents) {
                device.clearAllEvents();
            }
        }
        console.log('🧹 Cleared all input events and state');
    }

    /**
     * Shutdown the input system
     */
    static shutdown() {
        Input.clearAll();
        Input.devices.clear();
        Input.deviceMappings.clear();
        
        // Remove device references
        delete Input.keyboard;
        delete Input.mouse;
        delete Input.gamepad;
        
        Input.initialized = false;
        console.log('🔌 Input system shutdown');
    }

    // ============================================
    // LEGACY COMPATIBILITY METHODS (DEPRECATED)
    // These methods maintain backward compatibility
    // but should be replaced with device-specific calls
    // ============================================

    /**
     * @deprecated Use Input.keyboard.isDown(key) instead
     */
    static isDown(key) {
        console.warn('⚠️ Input.isDown() is deprecated. Use Input.keyboard.isDown(key) instead.');
        return Input.keyboard.isDown(key);
    }

    /**
     * @deprecated Use Input.keyboard.isPressed(key) instead
     */
    static isPressed(key) {
        console.warn('⚠️ Input.isPressed() is deprecated. Use Input.keyboard.isPressed(key) instead.');
        return Input.keyboard.isPressed(key);
    }

    /**
     * @deprecated Use Input.keyboard.isReleased(key) instead
     */
    static isReleased(key) {
        console.warn('⚠️ Input.isReleased() is deprecated. Use Input.keyboard.isReleased(key) instead.');
        return Input.keyboard.isReleased(key);
    }

    /**
     * @deprecated Use Input.mouse.isDown(button) instead
     */
    static isMouseDown(button) {
        console.warn('⚠️ Input.isMouseDown() is deprecated. Use Input.mouse.isDown(button) instead.');
        return Input.mouse.isDown(button);
    }

    /**
     * @deprecated Use Input.mouse.getPosition() instead
     */
    static getMousePosition() {
        console.warn('⚠️ Input.getMousePosition() is deprecated. Use Input.mouse.getPosition() instead.');
        return Input.mouse.getPosition();
    }

    /**
     * @deprecated Use Input.keyboard.onEvent() instead
     */
    static onEvent(event, key, callback) {
        console.warn('⚠️ Input.onEvent() is deprecated. Use Input.keyboard.onEvent() or Input.mouse.onEvent() instead.');
        Input.keyboard.onEvent(event, key, callback);
    }

    // Additional legacy methods for compatibility
    static isKeyDown(key) {
        console.warn('⚠️ Input.isKeyDown() is deprecated. Use Input.keyboard.isDown(key) instead.');
        return Input.keyboard.isDown(key);
    }

    static isKeyPressed(key) {
        console.warn('⚠️ Input.isKeyPressed() is deprecated. Use Input.keyboard.isPressed(key) instead.');
        return Input.keyboard.isPressed(key);
    }

    static isMousePressed(button) {
        console.warn('⚠️ Input.isMousePressed() is deprecated. Use Input.mouse.isPressed(button) instead.');
        return Input.mouse.isPressed(button);
    }

    static isLeftMouseDown() {
        console.warn('⚠️ Input.isLeftMouseDown() is deprecated. Use Input.mouse.isDown(0) instead.');
        return Input.mouse.isDown(0);
    }

    static isRightMouseDown() {
        console.warn('⚠️ Input.isRightMouseDown() is deprecated. Use Input.mouse.isDown(2) instead.');
        return Input.mouse.isDown(2);
    }
}
