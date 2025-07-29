/**
 * Keyboard key mappings for consistent input handling
 * Maps logical key names to their possible physical representations
 */
export class Keyboard {
    // Common keys with their possible representations
    static Space = ["Space", " "];
    static Enter = ["Enter"];
    static Escape = ["Escape"];
    static Tab = ["Tab"];
    static Backspace = ["Backspace"];
    static Delete = ["Delete"];
    static Insert = ["Insert"];
    static Home = ["Home"];
    static End = ["End"];
    static PageUp = ["PageUp"];
    static PageDown = ["PageDown"];
    
    // Arrow keys
    static ArrowUp = ["ArrowUp"];
    static ArrowDown = ["ArrowDown"];
    static ArrowLeft = ["ArrowLeft"];
    static ArrowRight = ["ArrowRight"];
    
    // Number keys (top row)
    static Digit0 = ["Digit0", "0"];
    static Digit1 = ["Digit1", "1"];
    static Digit2 = ["Digit2", "2"];
    static Digit3 = ["Digit3", "3"];
    static Digit4 = ["Digit4", "4"];
    static Digit5 = ["Digit5", "5"];
    static Digit6 = ["Digit6", "6"];
    static Digit7 = ["Digit7", "7"];
    static Digit8 = ["Digit8", "8"];
    static Digit9 = ["Digit9", "9"];
    
    // Letter keys
    static KeyA = ["KeyA", "a", "A"];
    static KeyB = ["KeyB", "b", "B"];
    static KeyC = ["KeyC", "c", "C"];
    static KeyD = ["KeyD", "d", "D"];
    static KeyE = ["KeyE", "e", "E"];
    static KeyF = ["KeyF", "f", "F"];
    static KeyG = ["KeyG", "g", "G"];
    static KeyH = ["KeyH", "h", "H"];
    static KeyI = ["KeyI", "i", "I"];
    static KeyJ = ["KeyJ", "j", "J"];
    static KeyK = ["KeyK", "k", "K"];
    static KeyL = ["KeyL", "l", "L"];
    static KeyM = ["KeyM", "m", "M"];
    static KeyN = ["KeyN", "n", "N"];
    static KeyO = ["KeyO", "o", "O"];
    static KeyP = ["KeyP", "p", "P"];
    static KeyQ = ["KeyQ", "q", "Q"];
    static KeyR = ["KeyR", "r", "R"];
    static KeyS = ["KeyS", "s", "S"];
    static KeyT = ["KeyT", "t", "T"];
    static KeyU = ["KeyU", "u", "U"];
    static KeyV = ["KeyV", "v", "V"];
    static KeyW = ["KeyW", "w", "W"];
    static KeyX = ["KeyX", "x", "X"];
    static KeyY = ["KeyY", "y", "Y"];
    static KeyZ = ["KeyZ", "z", "Z"];
    
    // Function keys
    static F1 = ["F1"];
    static F2 = ["F2"];
    static F3 = ["F3"];
    static F4 = ["F4"];
    static F5 = ["F5"];
    static F6 = ["F6"];
    static F7 = ["F7"];
    static F8 = ["F8"];
    static F9 = ["F9"];
    static F10 = ["F10"];
    static F11 = ["F11"];
    static F12 = ["F12"];
    
    // Modifier keys
    static ShiftLeft = ["ShiftLeft", "Shift"];
    static ShiftRight = ["ShiftRight", "Shift"];
    static ControlLeft = ["ControlLeft", "Control"];
    static ControlRight = ["ControlRight", "Control"];
    static AltLeft = ["AltLeft", "Alt"];
    static AltRight = ["AltRight", "Alt"];
    static MetaLeft = ["MetaLeft", "Meta"];
    static MetaRight = ["MetaRight", "Meta"];
    
    // Special characters
    static Minus = ["Minus", "-"];
    static Equal = ["Equal", "="];
    static BracketLeft = ["BracketLeft", "["];
    static BracketRight = ["BracketRight", "]"];
    static Backslash = ["Backslash", "\\"];
    static Semicolon = ["Semicolon", ";"];
    static Quote = ["Quote", "'"];
    static Comma = ["Comma", ","];
    static Period = ["Period", "."];
    static Slash = ["Slash", "/"];
    
    // Numpad keys
    static Numpad0 = ["Numpad0"];
    static Numpad1 = ["Numpad1"];
    static Numpad2 = ["Numpad2"];
    static Numpad3 = ["Numpad3"];
    static Numpad4 = ["Numpad4"];
    static Numpad5 = ["Numpad5"];
    static Numpad6 = ["Numpad6"];
    static Numpad7 = ["Numpad7"];
    static Numpad8 = ["Numpad8"];
    static Numpad9 = ["Numpad9"];
    static NumpadAdd = ["NumpadAdd", "+"];
    static NumpadSubtract = ["NumpadSubtract", "-"];
    static NumpadMultiply = ["NumpadMultiply", "*"];
    static NumpadDivide = ["NumpadDivide", "/"];
    static NumpadDecimal = ["NumpadDecimal", "."];
    static NumpadEnter = ["NumpadEnter"];
    
    /**
     * Map from physical key values to logical key names
     * This is built automatically from the above mappings
     */
    static _keyMapping = null;
    
    /**
     * Initialize the key mapping system
     */
    static initialize() {
        if (Keyboard._keyMapping) return; // Already initialized
        
        Keyboard._keyMapping = new Map();
        
        // Build reverse mapping from physical keys to logical names
        for (const [logicalKey, physicalKeys] of Object.entries(Keyboard)) {
            if (Array.isArray(physicalKeys)) {
                for (const physicalKey of physicalKeys) {
                    Keyboard._keyMapping.set(physicalKey.toLowerCase(), logicalKey);
                }
            }
        }
    }
    
    /**
     * Get the logical key name from a physical key
     * @param {string} physicalKey - The physical key from the event
     * @returns {string} The logical key name, or the original key if not mapped
     */
    static getLogicalKey(physicalKey) {
        if (!Keyboard._keyMapping) Keyboard.initialize();
        
        const logical = Keyboard._keyMapping.get(physicalKey.toLowerCase());
        return logical || physicalKey;
    }
    
    /**
     * Check if a logical key matches any of its physical representations
     * @param {string} logicalKey - The logical key name (e.g., "Space", "KeyA")
     * @param {string} physicalKey - The physical key from the event
     * @returns {boolean} True if they match
     */
    static matches(logicalKey, physicalKey) {
        const physicalKeys = Keyboard[logicalKey];
        if (!physicalKeys || !Array.isArray(physicalKeys)) return false;
        
        return physicalKeys.some(key => key.toLowerCase() === physicalKey.toLowerCase());
    }
    
    /**
     * Get all physical representations of a logical key
     * @param {string} logicalKey - The logical key name
     * @returns {Array<string>} Array of physical key representations
     */
    static getPhysicalKeys(logicalKey) {
        return Keyboard[logicalKey] || [];
    }
    
    /**
     * Get all available logical key names
     * @returns {Array<string>} Array of logical key names
     */
    static getAllLogicalKeys() {
        return Object.keys(Keyboard).filter(key => 
            Array.isArray(Keyboard[key]) && !key.startsWith('_')
        );
    }
}
