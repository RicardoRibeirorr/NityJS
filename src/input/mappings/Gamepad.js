/**
 * Gamepad mapping system for consistent gamepad input handling
 * Provides Unity-style gamepad button and axis names
 * 
 * PlayStation Controller Mapping:
 * - Cross = Button 0
 * - Circle = Button 1  
 * - Square = Button 2
 * - Triangle = Button 3
 * - L1 = Button 4
 * - R1 = Button 5
 * - L2 = Button 6
 * - R2 = Button 7
 * - Share = Button 8
 * - Options = Button 9
 * - L3 = Button 10 (Left stick click)
 * - R3 = Button 11 (Right stick click)
 * - D-Pad Up = Button 12
 * - D-Pad Down = Button 13
 * - D-Pad Left = Button 14
 * - D-Pad Right = Button 15
 * - PS Button = Button 16
 * 
 * Axes:
 * - Left Stick X = Axis 0
 * - Left Stick Y = Axis 1
 * - Right Stick X = Axis 2
 * - Right Stick Y = Axis 3
 */

export class Gamepad {
    // === BUTTON CONSTANTS ===
    // PlayStation names (most common)
    static Cross = 0;
    static Circle = 1;
    static Square = 2;
    static Triangle = 3;
    static L1 = 4;
    static R1 = 5;
    static L2 = 6;
    static R2 = 7;
    static Share = 8;
    static Options = 9;
    static L3 = 10; // Left stick click
    static R3 = 11; // Right stick click
    static DPadUp = 12;
    static DPadDown = 13;
    static DPadLeft = 14;
    static DPadRight = 15;
    static PSButton = 16;
    
    // Xbox equivalents (aliases)
    static A = 0; // Cross
    static B = 1; // Circle
    static X = 2; // Square
    static Y = 3; // Triangle
    static LB = 4; // L1
    static RB = 5; // R1
    static LT = 6; // L2
    static RT = 7; // R2
    static Back = 8; // Share
    static Start = 9; // Options
    static LeftStick = 10; // L3
    static RightStick = 11; // R3
    static XboxButton = 16; // PS Button
    
    // === AXIS CONSTANTS ===
    static LeftStickX = 0;
    static LeftStickY = 1;
    static RightStickX = 2;
    static RightStickY = 3;
    
    // === GAMEPAD STATE ===
    static connectedGamepads = new Map(); // gamepadIndex -> gamepad info
    static deadZone = 0.1; // Stick dead zone threshold
    static initialized = false;
    
    // Button mappings for different controller types
    static controllerMappings = {
        // Standard mapping (PlayStation-style)
        'standard': {
            name: 'PlayStation Controller',
            buttons: {
                0: 'Cross', 1: 'Circle', 2: 'Square', 3: 'Triangle',
                4: 'L1', 5: 'R1', 6: 'L2', 7: 'R2',
                8: 'Share', 9: 'Options', 10: 'L3', 11: 'R3',
                12: 'DPadUp', 13: 'DPadDown', 14: 'DPadLeft', 15: 'DPadRight',
                16: 'PSButton'
            }
        },
        // Xbox controller mapping
        'xbox': {
            name: 'Xbox Controller',
            buttons: {
                0: 'A', 1: 'B', 2: 'X', 3: 'Y',
                4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT',
                8: 'Back', 9: 'Start', 10: 'LeftStick', 11: 'RightStick',
                12: 'DPadUp', 13: 'DPadDown', 14: 'DPadLeft', 15: 'DPadRight',
                16: 'XboxButton'
            }
        }
    };
    
    /**
     * Initialize gamepad system
     */
    static initialize() {
        if (Gamepad.initialized) return;
        
        // Check for gamepad API support
        if (!navigator.getGamepads) {
            console.warn('⚠️ Gamepad API not supported in this browser');
            return;
        }
        
        // Listen for gamepad connection events
        window.addEventListener('gamepadconnected', (e) => {
            Gamepad.onGamepadConnected(e.gamepad);
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            Gamepad.onGamepadDisconnected(e.gamepad);
        });
        
        // Check for already connected gamepads
        Gamepad.scanForGamepads();
        
        Gamepad.initialized = true;
        console.log('🎮 Gamepad system initialized');
    }
    
    /**
     * Scan for already connected gamepads
     */
    static scanForGamepads() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                Gamepad.onGamepadConnected(gamepads[i]);
            }
        }
    }
    
    /**
     * Handle gamepad connection
     * @param {Gamepad} gamepad - Connected gamepad
     */
    static onGamepadConnected(gamepad) {
        console.log(`🎮 Gamepad connected: ${gamepad.id} (Index: ${gamepad.index})`);
        
        // Determine controller type
        const controllerType = Gamepad.detectControllerType(gamepad.id);
        
        Gamepad.connectedGamepads.set(gamepad.index, {
            gamepad: gamepad,
            type: controllerType,
            mapping: Gamepad.controllerMappings[controllerType] || Gamepad.controllerMappings.standard,
            buttonStates: new Array(gamepad.buttons.length).fill(false),
            previousButtonStates: new Array(gamepad.buttons.length).fill(false)
        });
    }
    
    /**
     * Handle gamepad disconnection
     * @param {Gamepad} gamepad - Disconnected gamepad
     */
    static onGamepadDisconnected(gamepad) {
        console.log(`🎮 Gamepad disconnected: ${gamepad.id} (Index: ${gamepad.index})`);
        Gamepad.connectedGamepads.delete(gamepad.index);
    }
    
    /**
     * Detect controller type from gamepad ID
     * @param {string} gamepadId - Gamepad ID string
     * @returns {string} Controller type
     */
    static detectControllerType(gamepadId) {
        const id = gamepadId.toLowerCase();
        
        if (id.includes('xbox') || id.includes('microsoft')) {
            return 'xbox';
        } else if (id.includes('playstation') || id.includes('sony') || id.includes('dualshock') || id.includes('dualsense')) {
            return 'standard';
        }
        
        // Default to standard (PlayStation-style)
        return 'standard';
    }
    
    /**
     * Update gamepad states - call this each frame
     */
    static update() {
        if (!Gamepad.initialized) return;
        
        const gamepads = navigator.getGamepads();
        
        for (const [index, gamepadInfo] of Gamepad.connectedGamepads) {
            const gamepad = gamepads[index];
            if (!gamepad) continue;
            
            // Update button states
            gamepadInfo.previousButtonStates = [...gamepadInfo.buttonStates];
            for (let i = 0; i < gamepad.buttons.length; i++) {
                gamepadInfo.buttonStates[i] = gamepad.buttons[i].pressed;
            }
            
            // Update gamepad reference (it changes each frame)
            gamepadInfo.gamepad = gamepad;
        }
    }
    
    /**
     * Check if a button is currently pressed on any gamepad
     * @param {number} buttonIndex - Button index (use Gamepad constants)
     * @param {number} gamepadIndex - Specific gamepad index (optional, defaults to any)
     * @returns {boolean}
     */
    static isButtonDown(buttonIndex, gamepadIndex = null) {
        if (gamepadIndex !== null) {
            const gamepadInfo = Gamepad.connectedGamepads.get(gamepadIndex);
            return gamepadInfo ? gamepadInfo.buttonStates[buttonIndex] === true : false;
        }
        
        // Check all gamepads
        for (const gamepadInfo of Gamepad.connectedGamepads.values()) {
            if (gamepadInfo.buttonStates[buttonIndex] === true) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if a button was pressed this frame (click-like)
     * @param {number} buttonIndex - Button index (use Gamepad constants)
     * @param {number} gamepadIndex - Specific gamepad index (optional, defaults to any)
     * @returns {boolean}
     */
    static isButtonPressed(buttonIndex, gamepadIndex = null) {
        if (gamepadIndex !== null) {
            const gamepadInfo = Gamepad.connectedGamepads.get(gamepadIndex);
            if (!gamepadInfo) return false;
            return gamepadInfo.buttonStates[buttonIndex] === true && 
                   gamepadInfo.previousButtonStates[buttonIndex] === false;
        }
        
        // Check all gamepads
        for (const gamepadInfo of Gamepad.connectedGamepads.values()) {
            if (gamepadInfo.buttonStates[buttonIndex] === true && 
                gamepadInfo.previousButtonStates[buttonIndex] === false) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if a button was released this frame
     * @param {number} buttonIndex - Button index (use Gamepad constants)
     * @param {number} gamepadIndex - Specific gamepad index (optional, defaults to any)
     * @returns {boolean}
     */
    static isButtonReleased(buttonIndex, gamepadIndex = null) {
        if (gamepadIndex !== null) {
            const gamepadInfo = Gamepad.connectedGamepads.get(gamepadIndex);
            if (!gamepadInfo) return false;
            return gamepadInfo.buttonStates[buttonIndex] === false && 
                   gamepadInfo.previousButtonStates[buttonIndex] === true;
        }
        
        // Check all gamepads
        for (const gamepadInfo of Gamepad.connectedGamepads.values()) {
            if (gamepadInfo.buttonStates[buttonIndex] === false && 
                gamepadInfo.previousButtonStates[buttonIndex] === true) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get axis value from gamepad
     * @param {number} axisIndex - Axis index (use Gamepad constants)
     * @param {number} gamepadIndex - Specific gamepad index (optional, defaults to first connected)
     * @returns {number} Axis value (-1 to 1, with dead zone applied)
     */
    static getAxis(axisIndex, gamepadIndex = null) {
        let gamepadInfo;
        
        if (gamepadIndex !== null) {
            gamepadInfo = Gamepad.connectedGamepads.get(gamepadIndex);
        } else {
            // Get first connected gamepad
            gamepadInfo = Gamepad.connectedGamepads.values().next().value;
        }
        
        if (!gamepadInfo || !gamepadInfo.gamepad.axes[axisIndex]) {
            return 0;
        }
        
        let value = gamepadInfo.gamepad.axes[axisIndex];
        
        // Apply dead zone
        if (Math.abs(value) < Gamepad.deadZone) {
            value = 0;
        }
        
        return value;
    }
    
    /**
     * Get left stick input as Vector2-like object
     * @param {number} gamepadIndex - Specific gamepad index (optional)
     * @returns {Object} {x, y} stick input
     */
    static getLeftStick(gamepadIndex = null) {
        return {
            x: Gamepad.getAxis(Gamepad.LeftStickX, gamepadIndex),
            y: Gamepad.getAxis(Gamepad.LeftStickY, gamepadIndex)
        };
    }
    
    /**
     * Get right stick input as Vector2-like object
     * @param {number} gamepadIndex - Specific gamepad index (optional)
     * @returns {Object} {x, y} stick input
     */
    static getRightStick(gamepadIndex = null) {
        return {
            x: Gamepad.getAxis(Gamepad.RightStickX, gamepadIndex),
            y: Gamepad.getAxis(Gamepad.RightStickY, gamepadIndex)
        };
    }
    
    /**
     * Get all connected gamepads info
     * @returns {Array} Array of gamepad info objects
     */
    static getConnectedGamepads() {
        return Array.from(Gamepad.connectedGamepads.values());
    }
    
    /**
     * Get number of connected gamepads
     * @returns {number}
     */
    static getGamepadCount() {
        return Gamepad.connectedGamepads.size;
    }
    
    /**
     * Set dead zone for analog sticks
     * @param {number} deadZone - Dead zone value (0 to 1)
     */
    static setDeadZone(deadZone) {
        Gamepad.deadZone = Math.max(0, Math.min(1, deadZone));
    }
    
    // === CONVENIENCE METHODS ===
    
    /**
     * Check if Cross/A button is pressed
     * @param {number} gamepadIndex - Specific gamepad (optional)
     * @returns {boolean}
     */
    static isCrossPressed(gamepadIndex = null) {
        return Gamepad.isButtonPressed(Gamepad.Cross, gamepadIndex);
    }
    
    /**
     * Check if Circle/B button is pressed
     * @param {number} gamepadIndex - Specific gamepad (optional)
     * @returns {boolean}
     */
    static isCirclePressed(gamepadIndex = null) {
        return Gamepad.isButtonPressed(Gamepad.Circle, gamepadIndex);
    }
    
    /**
     * Check if Square/X button is pressed
     * @param {number} gamepadIndex - Specific gamepad (optional)
     * @returns {boolean}
     */
    static isSquarePressed(gamepadIndex = null) {
        return Gamepad.isButtonPressed(Gamepad.Square, gamepadIndex);
    }
    
    /**
     * Check if Triangle/Y button is pressed
     * @param {number} gamepadIndex - Specific gamepad (optional)
     * @returns {boolean}
     */
    static isTrianglePressed(gamepadIndex = null) {
        return Gamepad.isButtonPressed(Gamepad.Triangle, gamepadIndex);
    }
    
    /**
     * Vibrate gamepad (if supported)
     * @param {number} weakMagnitude - Weak motor magnitude (0-1)
     * @param {number} strongMagnitude - Strong motor magnitude (0-1)
     * @param {number} duration - Duration in milliseconds
     * @param {number} gamepadIndex - Specific gamepad (optional)
     */
    static vibrate(weakMagnitude = 0.5, strongMagnitude = 0.5, duration = 100, gamepadIndex = null) {
        let gamepadInfo;
        
        if (gamepadIndex !== null) {
            gamepadInfo = Gamepad.connectedGamepads.get(gamepadIndex);
        } else {
            gamepadInfo = Gamepad.connectedGamepads.values().next().value;
        }
        
        if (!gamepadInfo || !gamepadInfo.gamepad.vibrationActuator) {
            console.warn('⚠️ Gamepad vibration not supported');
            return;
        }
        
        gamepadInfo.gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: duration,
            weakMagnitude: Math.max(0, Math.min(1, weakMagnitude)),
            strongMagnitude: Math.max(0, Math.min(1, strongMagnitude))
        });
    }
}
