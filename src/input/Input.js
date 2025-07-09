// === Input.js ===
export class Input {
    static keys = new Set(); // Currently held keys
    static pressedKeys = new Set(); // Keys pressed this frame (click-like)
    static releasedKeys = new Set(); // Keys released this frame
    static previousKeys = new Set(); // Keys from previous frame
    
    // Mouse/Pointer state
    static mouseButtons = new Set(); // Currently held mouse buttons
    static pressedMouseButtons = new Set(); // Mouse buttons pressed this frame
    static releasedMouseButtons = new Set(); // Mouse buttons released this frame
    static previousMouseButtons = new Set(); // Mouse buttons from previous frame
    static mousePosition = { x: 0, y: 0 }; // Current mouse position
    static lastMousePosition = { x: 0, y: 0 }; // Previous mouse position
    
    // Event callbacks
    static onKeyDown = new Map(); // key -> callback
    static onKeyStay = new Map(); // key -> callback  
    static onKeyUp = new Map(); // key -> callback
    
    // Mouse event callbacks
    static onMouseDown = new Map(); // button -> callback
    static onMouseStay = new Map(); // button -> callback
    static onMouseUp = new Map(); // button -> callback
    static onMouseMove = new Set(); // Set of callbacks for mouse movement
    
    static canvas = null; // Reference to canvas for mouse coordinate calculation

    static initialize(canvas = null) {
        Input.canvas = canvas;
        
        // Keyboard events
        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            if (!Input.keys.has(key)) {
                Input.pressedKeys.add(key);
                // Fire onKeyDown callback if registered
                const callback = Input.onKeyDown.get(key);
                if (callback) callback(key);
            }
            Input.keys.add(key);
        });
        
        window.addEventListener('keyup', e => {
            const key = e.key.toLowerCase();
            Input.keys.delete(key);
            Input.releasedKeys.add(key);
            // Fire onKeyUp callback if registered
            const callback = Input.onKeyUp.get(key);
            if (callback) callback(key);
        });

        // Mouse events
        const target = canvas || window;
        
        target.addEventListener('mousedown', e => {
            const button = e.button;
            if (!Input.mouseButtons.has(button)) {
                Input.pressedMouseButtons.add(button);
                // Fire onMouseDown callback if registered
                const callback = Input.onMouseDown.get(button);
                if (callback) callback(button, Input.mousePosition);
            }
            Input.mouseButtons.add(button);
            Input.updateMousePosition(e);
        });
        
        target.addEventListener('mouseup', e => {
            const button = e.button;
            Input.mouseButtons.delete(button);
            Input.releasedMouseButtons.add(button);
            // Fire onMouseUp callback if registered
            const callback = Input.onMouseUp.get(button);
            if (callback) callback(button, Input.mousePosition);
            Input.updateMousePosition(e);
        });
        
        target.addEventListener('mousemove', e => {
            Input.updateMousePosition(e);
            // Fire mouse move callbacks
            for (const callback of Input.onMouseMove) {
                callback(Input.mousePosition, Input.lastMousePosition);
            }
        });

        // Context menu prevention for right-click
        if (canvas) {
            canvas.addEventListener('contextmenu', e => e.preventDefault());
        }
    }

    /**
     * Update mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     */
    static updateMousePosition(e) {
        Input.lastMousePosition = { ...Input.mousePosition };
        
        if (Input.canvas) {
            const rect = Input.canvas.getBoundingClientRect();
            Input.mousePosition.x = e.clientX - rect.left;
            Input.mousePosition.y = e.clientY - rect.top;
        } else {
            Input.mousePosition.x = e.clientX;
            Input.mousePosition.y = e.clientY;
        }
    }

    /**
     * Updates the input state - should be called each frame
     */
    static update() {
        // Fire onKeyStay callbacks for keys that are held
        for (const key of Input.keys) {
            if (Input.previousKeys.has(key)) {
                const callback = Input.onKeyStay.get(key);
                if (callback) callback(key);
            }
        }

        // Fire onMouseStay callbacks for mouse buttons that are held
        for (const button of Input.mouseButtons) {
            if (Input.previousMouseButtons.has(button)) {
                const callback = Input.onMouseStay.get(button);
                if (callback) callback(button, Input.mousePosition);
            }
        }

        // Clear frame-specific sets
        Input.pressedKeys.clear();
        Input.releasedKeys.clear();
        Input.pressedMouseButtons.clear();
        Input.releasedMouseButtons.clear();
        
        // Update previous states for next frame
        Input.previousKeys = new Set(Input.keys);
        Input.previousMouseButtons = new Set(Input.mouseButtons);
    }

    /**
     * Check if key is currently being held down
     * @param {string} key - The key to check
     * @returns {boolean}
     */
    static isKeyDown(key) {
        return Input.keys.has(key.toLowerCase());
    }

    /**
     * Check if key was pressed this frame (click-like, only fires once)
     * @param {string} key - The key to check
     * @returns {boolean}
     */
    static isKeyPressed(key) {
        return Input.pressedKeys.has(key.toLowerCase());
    }

    /**
     * Check if key was released this frame
     * @param {string} key - The key to check
     * @returns {boolean}
     */
    static isKeyReleased(key) {
        return Input.releasedKeys.has(key.toLowerCase());
    }

    // === MOUSE/POINTER METHODS ===

    /**
     * Check if mouse button is currently being held down
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    static isMouseDown(button = 0) {
        return Input.mouseButtons.has(button);
    }

    /**
     * Check if mouse button was pressed this frame (click-like, only fires once)
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    static isMousePressed(button = 0) {
        return Input.pressedMouseButtons.has(button);
    }

    /**
     * Check if mouse button was released this frame
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @returns {boolean}
     */
    static isMouseReleased(button = 0) {
        return Input.releasedMouseButtons.has(button);
    }

    /**
     * Get current mouse position
     * @returns {Object} {x, y} coordinates
     */
    static getMousePosition() {
        return { ...Input.mousePosition };
    }

    /**
     * Get mouse movement delta from last frame
     * @returns {Object} {x, y} movement delta
     */
    static getMouseDelta() {
        return {
            x: Input.mousePosition.x - Input.lastMousePosition.x,
            y: Input.mousePosition.y - Input.lastMousePosition.y
        };
    }

    // === CONVENIENCE METHODS ===

    /**
     * Check if left mouse button is down
     * @returns {boolean}
     */
    static isLeftMouseDown() {
        return Input.isMouseDown(0);
    }

    /**
     * Check if left mouse button was clicked this frame
     * @returns {boolean}
     */
    static isLeftMousePressed() {
        return Input.isMousePressed(0);
    }

    /**
     * Check if right mouse button is down
     * @returns {boolean}
     */
    static isRightMouseDown() {
        return Input.isMouseDown(2);
    }

    /**
     * Check if right mouse button was clicked this frame
     * @returns {boolean}
     */
    static isRightMousePressed() {
        return Input.isMousePressed(2);
    }

    /**
     * Register a callback for when a key is first pressed (click-like)
     * @param {string} key - The key to listen for
     * @param {function} callback - Function to call when key is pressed
     */
    static onKeyDownEvent(key, callback) {
        Input.onKeyDown.set(key.toLowerCase(), callback);
    }

    /**
     * Register a callback for when a key is being held down
     * @param {string} key - The key to listen for
     * @param {function} callback - Function to call while key is held
     */
    static onKeyStayEvent(key, callback) {
        Input.onKeyStay.set(key.toLowerCase(), callback);
    }

    /**
     * Register a callback for when a key is released
     * @param {string} key - The key to listen for
     * @param {function} callback - Function to call when key is released
     */
    static onKeyUpEvent(key, callback) {
        Input.onKeyUp.set(key.toLowerCase(), callback);
    }

    // === MOUSE EVENT CALLBACKS ===

    /**
     * Register a callback for when a mouse button is first pressed (click-like)
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @param {function} callback - Function to call when button is pressed
     */
    static onMouseDownEvent(button = 0, callback) {
        Input.onMouseDown.set(button, callback);
    }

    /**
     * Register a callback for when a mouse button is being held down
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @param {function} callback - Function to call while button is held
     */
    static onMouseStayEvent(button = 0, callback) {
        Input.onMouseStay.set(button, callback);
    }

    /**
     * Register a callback for when a mouse button is released
     * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
     * @param {function} callback - Function to call when button is released
     */
    static onMouseUpEvent(button = 0, callback) {
        Input.onMouseUp.set(button, callback);
    }

    /**
     * Register a callback for mouse movement
     * @param {function} callback - Function to call when mouse moves
     */
    static onMouseMoveEvent(callback) {
        Input.onMouseMove.add(callback);
    }

    // === CONVENIENCE EVENT METHODS ===

    /**
     * Register a callback for left mouse button click
     * @param {function} callback - Function to call when left button is clicked
     */
    static onLeftClickEvent(callback) {
        Input.onMouseDownEvent(0, callback);
    }

    /**
     * Register a callback for right mouse button click
     * @param {function} callback - Function to call when right button is clicked
     */
    static onRightClickEvent(callback) {
        Input.onMouseDownEvent(2, callback);
    }

    /**
     * Remove a key event callback
     * @param {string} event - 'down', 'stay', or 'up'
     * @param {string} key - The key to remove callback for
     */
    static removeKeyEvent(event, key) {
        const keyLower = key.toLowerCase();
        switch(event) {
            case 'down':
                Input.onKeyDown.delete(keyLower);
                break;
            case 'stay':
                Input.onKeyStay.delete(keyLower);
                break;
            case 'up':
                Input.onKeyUp.delete(keyLower);
                break;
        }
    }

    /**
     * Remove a mouse event callback
     * @param {string} event - 'down', 'stay', 'up', or 'move'
     * @param {number|function} buttonOrCallback - Button number for click events, or callback function for move events
     */
    static removeMouseEvent(event, buttonOrCallback) {
        switch(event) {
            case 'down':
                Input.onMouseDown.delete(buttonOrCallback);
                break;
            case 'stay':
                Input.onMouseStay.delete(buttonOrCallback);
                break;
            case 'up':
                Input.onMouseUp.delete(buttonOrCallback);
                break;
            case 'move':
                Input.onMouseMove.delete(buttonOrCallback);
                break;
        }
    }

    /**
     * Clear all event callbacks
     */
    static clearAllEvents() {
        Input.onKeyDown.clear();
        Input.onKeyStay.clear();
        Input.onKeyUp.clear();
        Input.onMouseDown.clear();
        Input.onMouseStay.clear();
        Input.onMouseUp.clear();
        Input.onMouseMove.clear();
    }
}