// src/asset/SpriteRegistry.js
var SpriteRegistry = class {
  static sprites = /* @__PURE__ */ new Map();
  // Unified storage: "name" or "sheet:sprite"
  static spritesheets = /* @__PURE__ */ new Map();
  // Asset storage for spritesheet metadata
  /**
   * Internal method to add a sprite asset (used by SpriteAsset constructor)
   * @param {string} name - Name to register the sprite under
   * @param {SpriteAsset} spriteAsset - The sprite asset to register
   * @private
   */
  static _addSprite(name, spriteAsset) {
    this.sprites.set(name, spriteAsset);
  }
  /**
   * Internal method to add a spritesheet asset and register its individual sprites
   * @param {string} name - Name to register the spritesheet under
   * @param {SpritesheetAsset} spritesheetAsset - The spritesheet asset to register
   * @private
   */
  static _addSpritesheet(name, spritesheetAsset) {
    this.spritesheets.set(name, spritesheetAsset);
  }
  /**
   * Get a registered sprite asset (supports both single sprites and spritesheet sprites)
   * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
   * @returns {SpriteAsset|Object|null} The sprite asset or sprite wrapper, or null if not found
   */
  static getSprite(name) {
    return this.sprites.get(name) || null;
  }
  /**
   * Get a registered spritesheet asset
   * @param {string} name - Name of the spritesheet
   * @returns {SpritesheetAsset|null} The spritesheet asset or null if not found
   */
  static getSpritesheet(name) {
    return this.spritesheets.get(name) || null;
  }
  /**
   * Preload all registered sprites and spritesheets
   * This method should be called during the game's preload phase
   * @returns {Promise<void>} Promise that resolves when all assets are loaded
   */
  static async preloadAll() {
    const spritePromises = Array.from(this.sprites.values()).filter((sprite) => sprite.load && typeof sprite.load === "function").map((sprite) => sprite.isLoaded ? Promise.resolve() : sprite.load());
    const spritesheetPromises = Array.from(this.spritesheets.values()).map(
      (sheet) => sheet.isLoaded ? Promise.resolve() : sheet.load()
    );
    await Promise.all([...spritePromises, ...spritesheetPromises]);
  }
  /**
   * Check if a sprite is registered (supports both single sprites and spritesheet sprites)
   * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
   * @returns {boolean} True if sprite exists
   */
  static hasSprite(name) {
    return this.sprites.has(name);
  }
  /**
   * Check if a spritesheet is registered
   * @param {string} name - Name of the spritesheet
   * @returns {boolean} True if spritesheet exists
   */
  static hasSpritesheet(name) {
    return this.spritesheets.has(name);
  }
  /**
   * Get all registered sprite names
   * @returns {Array<string>} Array of sprite names
   */
  static getSpriteNames() {
    return Array.from(this.sprites.keys());
  }
  /**
   * Get all registered spritesheet names
   * @returns {Array<string>} Array of spritesheet names
   */
  static getSpritesheetNames() {
    return Array.from(this.spritesheets.keys());
  }
  /**
   * Get all sprite names from a specific spritesheet
   * @param {string} sheetName - Name of the spritesheet
   * @returns {Array<string>} Array of sprite keys with colon notation ("sheetName:spriteName")
   */
  static getSpritesFromSheet(sheetName) {
    const spriteKeys = [];
    for (const key of this.sprites.keys()) {
      if (key.startsWith(sheetName + ":")) {
        spriteKeys.push(key);
      }
    }
    return spriteKeys;
  }
  /**
   * Clear all registered sprites and spritesheets
   */
  static clear() {
    this.sprites.clear();
    this.spritesheets.clear();
  }
  /**
   * Remove a specific sprite from the registry (supports both single sprites and spritesheet sprites)
   * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
   * @returns {boolean} True if sprite was removed
   */
  static removeSprite(name) {
    return this.sprites.delete(name);
  }
  /**
   * Remove a specific spritesheet from the registry
   * @param {string} name - Name of the spritesheet to remove
   * @returns {boolean} True if spritesheet was removed
   */
  static removeSpritesheet(name) {
    return this.spritesheets.delete(name);
  }
  // Legacy instance-based methods for backward compatibility
  /**
   * Creates a new SpriteRegistry instance (legacy support)
   * @deprecated Use static methods instead
   */
  constructor() {
    this.sheets = /* @__PURE__ */ new Map();
    console.warn("SpriteRegistry instance methods are deprecated. Use static methods instead.");
  }
  /**
   * Adds a spritesheet to the registry (legacy support)
   * @deprecated Use new SpritesheetAsset() instead
   * @param {Object} sheet - The spritesheet to add
   */
  add(sheet) {
    console.warn("SpriteRegistry.add() is deprecated. Use new SpritesheetAsset() instead.");
    this.sheets.set(sheet.name, sheet);
  }
  /**
   * Preloads all registered spritesheets (legacy support)
   * @deprecated Use SpriteRegistry.preloadAll() instead
   * @returns {Promise<void>} Promise that resolves when all spritesheets are loaded
   */
  async preload() {
    console.warn("SpriteRegistry.preload() is deprecated. Use SpriteRegistry.preloadAll() instead.");
    for (const sheet of this.sheets.values()) {
      await sheet.load();
    }
  }
  /**
   * Retrieves a spritesheet by name (legacy support)
   * @deprecated Use SpriteRegistry.getSpritesheet() instead
   * @param {string} name - The name of the spritesheet
   * @returns {Object|undefined} The requested spritesheet or undefined if not found
   */
  getSheet(name) {
    console.warn("SpriteRegistry.getSheet() is deprecated. Use SpriteRegistry.getSpritesheet() instead.");
    return this.sheets.get(name);
  }
};

// src/common/Component.js
var Component = class {
  constructor() {
    this.gameObject = null;
    this.enabled = true;
    this._started = false;
    this._internalGizmos = this._internalGizmos || (Game.instance?._internalGizmos ?? false);
  }
  __lateStart() {
  }
  __update() {
  }
  __draw(ctx) {
    if (this.enabled && typeof this.draw === "function") {
      this.draw(ctx);
    }
    if (this._internalGizmos) {
      this.__internalGizmos(ctx);
    }
    if (this.OnDrawGizmos && typeof this.OnDrawGizmos === "function") {
      this.OnDrawGizmos(ctx);
    }
  }
  __preload() {
  }
  __internalGizmos(ctx) {
  }
  start() {
  }
  update() {
  }
  draw(ctx) {
  }
  async preload() {
  }
  destroy() {
  }
  lateUpdate() {
  }
};

// src/math/Vector2.js
var Vector2 = class _Vector2 {
  /**
   * Creates a new Vector2.
   * @param {number} x - The x component (default: 0)
   * @param {number} y - The y component (default: 0)
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  // Static constants
  static get zero() {
    return new _Vector2(0, 0);
  }
  static get one() {
    return new _Vector2(1, 1);
  }
  static get up() {
    return new _Vector2(0, 1);
  }
  static get down() {
    return new _Vector2(0, -1);
  }
  static get left() {
    return new _Vector2(-1, 0);
  }
  static get right() {
    return new _Vector2(1, 0);
  }
  static get positiveInfinity() {
    return new _Vector2(Infinity, Infinity);
  }
  static get negativeInfinity() {
    return new _Vector2(-Infinity, -Infinity);
  }
  /**
   * Gets the magnitude (length) of this vector.
   * @returns {number} The magnitude of the vector
   */
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Gets the squared magnitude of this vector (faster than magnitude).
   * @returns {number} The squared magnitude of the vector
   */
  get sqrMagnitude() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Gets the normalized version of this vector.
   * @returns {Vector2} A normalized copy of this vector
   */
  get normalized() {
    const mag = this.magnitude;
    if (mag === 0) return _Vector2.zero;
    return new _Vector2(this.x / mag, this.y / mag);
  }
  /**
   * Adds another vector to this vector.
   * @param {Vector2} other - The vector to add
   * @returns {Vector2} A new vector representing the sum
   */
  add(other) {
    return new _Vector2(this.x + other.x, this.y + other.y);
  }
  /**
   * Subtracts another vector from this vector.
   * @param {Vector2} other - The vector to subtract
   * @returns {Vector2} A new vector representing the difference
   */
  subtract(other) {
    return new _Vector2(this.x - other.x, this.y - other.y);
  }
  /**
   * Multiplies this vector by a scalar.
   * @param {number} scalar - The scalar to multiply by
   * @returns {Vector2} A new vector representing the product
   */
  multiply(scalar) {
    return new _Vector2(this.x * scalar, this.y * scalar);
  }
  /**
   * Divides this vector by a scalar.
   * @param {number} scalar - The scalar to divide by
   * @returns {Vector2} A new vector representing the quotient
   */
  divide(scalar) {
    if (scalar === 0) throw new Error("Cannot divide by zero");
    return new _Vector2(this.x / scalar, this.y / scalar);
  }
  /**
   * Normalizes this vector in place.
   * @returns {Vector2} This vector for chaining
   */
  normalize() {
    const mag = this.magnitude;
    if (mag === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x /= mag;
      this.y /= mag;
    }
    return this;
  }
  /**
   * Sets the components of this vector.
   * @param {number} x - The new x component
   * @param {number} y - The new y component
   * @returns {Vector2} This vector for chaining
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * Creates a copy of this vector.
   * @returns {Vector2} A new vector with the same components
   */
  clone() {
    return new _Vector2(this.x, this.y);
  }
  /**
   * Checks if this vector equals another vector.
   * @param {Vector2} other - The vector to compare to
   * @returns {boolean} True if vectors are equal
   */
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  /**
   * Returns a string representation of this vector.
   * @returns {string} String representation
   */
  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
  // Static methods
  /**
   * Calculates the dot product of two vectors.
   * @param {Vector2} a - First vector
   * @param {Vector2} b - Second vector
   * @returns {number} The dot product
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  /**
   * Calculates the distance between two vectors.
   * @param {Vector2} a - First vector
   * @param {Vector2} b - Second vector
   * @returns {number} The distance between the vectors
   */
  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param {Vector2} a - First vector
   * @param {Vector2} b - Second vector
   * @returns {number} The squared distance between the vectors
   */
  static sqrDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }
  /**
   * Linearly interpolates between two vectors.
   * @param {Vector2} a - Start vector
   * @param {Vector2} b - End vector
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Vector2} Interpolated vector
   */
  static lerp(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    return new _Vector2(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t
    );
  }
  /**
   * Linearly interpolates between two vectors without clamping t.
   * @param {Vector2} a - Start vector
   * @param {Vector2} b - End vector
   * @param {number} t - Interpolation factor
   * @returns {Vector2} Interpolated vector
   */
  static lerpUnclamped(a, b, t) {
    return new _Vector2(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t
    );
  }
  /**
   * Returns a vector with the minimum components of two vectors.
   * @param {Vector2} a - First vector
   * @param {Vector2} b - Second vector
   * @returns {Vector2} Vector with minimum components
   */
  static min(a, b) {
    return new _Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }
  /**
   * Returns a vector with the maximum components of two vectors.
   * @param {Vector2} a - First vector
   * @param {Vector2} b - Second vector
   * @returns {Vector2} Vector with maximum components
   */
  static max(a, b) {
    return new _Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }
  /**
   * Moves a point towards a target.
   * @param {Vector2} current - Current position
   * @param {Vector2} target - Target position
   * @param {number} maxDistanceDelta - Maximum distance to move
   * @returns {Vector2} New position
   */
  static moveTowards(current, target, maxDistanceDelta) {
    const diff = target.subtract(current);
    const distance = diff.magnitude;
    if (distance <= maxDistanceDelta || distance === 0) {
      return target.clone();
    }
    return current.add(diff.divide(distance).multiply(maxDistanceDelta));
  }
  /**
   * Reflects a vector off a plane defined by a normal.
   * @param {Vector2} inDirection - The direction vector to reflect
   * @param {Vector2} inNormal - The normal of the surface
   * @returns {Vector2} The reflected vector
   */
  static reflect(inDirection, inNormal) {
    const factor = -2 * _Vector2.dot(inNormal, inDirection);
    return new _Vector2(
      factor * inNormal.x + inDirection.x,
      factor * inNormal.y + inDirection.y
    );
  }
  /**
   * Returns the angle in radians between two vectors.
   * @param {Vector2} from - First vector
   * @param {Vector2} to - Second vector
   * @returns {number} Angle in radians
   */
  static angle(from, to) {
    const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
    if (denominator < 1e-15) return 0;
    const dot = Math.max(-1, Math.min(1, _Vector2.dot(from, to) / denominator));
    return Math.acos(dot);
  }
  /**
   * Returns the signed angle in radians between two vectors.
   * @param {Vector2} from - First vector
   * @param {Vector2} to - Second vector
   * @returns {number} Signed angle in radians
   */
  static signedAngle(from, to) {
    const unsignedAngle = _Vector2.angle(from, to);
    const sign = Math.sign(from.x * to.y - from.y * to.x);
    return unsignedAngle * sign;
  }
  /**
   * Clamps the magnitude of a vector to a maximum length.
   * @param {Vector2} vector - The vector to clamp
   * @param {number} maxLength - The maximum length
   * @returns {Vector2} The clamped vector
   */
  static clampMagnitude(vector, maxLength) {
    const sqrMagnitude = vector.sqrMagnitude;
    if (sqrMagnitude > maxLength * maxLength) {
      const mag = Math.sqrt(sqrMagnitude);
      const normalizedX = vector.x / mag;
      const normalizedY = vector.y / mag;
      return new _Vector2(normalizedX * maxLength, normalizedY * maxLength);
    }
    return vector.clone();
  }
  /**
   * Rotates a vector by an angle in radians.
   * @param {Vector2} vector - The vector to rotate
   * @param {number} angle - The angle in radians
   * @returns {Vector2} The rotated vector
   */
  static rotate(vector, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new _Vector2(
      vector.x * cos - vector.y * sin,
      vector.x * sin + vector.y * cos
    );
  }
  /**
   * Returns a perpendicular vector (rotated 90 degrees counterclockwise).
   * @param {Vector2} vector - The input vector
   * @returns {Vector2} The perpendicular vector
   */
  static perpendicular(vector) {
    return new _Vector2(-vector.y, vector.x);
  }
  /**
   * Smoothly damps between vectors.
   * @param {Vector2} current - Current position
   * @param {Vector2} target - Target position
   * @param {Object} currentVelocity - Object with x, y velocity components (modified by reference)
   * @param {number} smoothTime - Approximate time to reach target
   * @param {number} maxSpeed - Maximum speed (optional)
   * @param {number} deltaTime - Time since last call
   * @returns {Vector2} Smoothly damped position
   */
  static smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime) {
    smoothTime = Math.max(1e-4, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let changeX = current.x - target.x;
    let changeY = current.y - target.y;
    const originalTo = target.clone();
    const maxChange = maxSpeed * smoothTime;
    const maxChangeSq = maxChange * maxChange;
    const sqrMag = changeX * changeX + changeY * changeY;
    if (sqrMag > maxChangeSq) {
      const mag = Math.sqrt(sqrMag);
      changeX = changeX / mag * maxChange;
      changeY = changeY / mag * maxChange;
    }
    const targetX = current.x - changeX;
    const targetY = current.y - changeY;
    const tempX = (currentVelocity.x + omega * changeX) * deltaTime;
    const tempY = (currentVelocity.y + omega * changeY) * deltaTime;
    currentVelocity.x = (currentVelocity.x - omega * tempX) * exp;
    currentVelocity.y = (currentVelocity.y - omega * tempY) * exp;
    let outputX = targetX + (changeX + tempX) * exp;
    let outputY = targetY + (changeY + tempY) * exp;
    const origMinusCurrentX = originalTo.x - current.x;
    const origMinusCurrentY = originalTo.y - current.y;
    const outMinusOrigX = outputX - originalTo.x;
    const outMinusOrigY = outputY - originalTo.y;
    if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY > 0) {
      outputX = originalTo.x;
      outputY = originalTo.y;
      currentVelocity.x = (outputX - originalTo.x) / deltaTime;
      currentVelocity.y = (outputY - originalTo.y) / deltaTime;
    }
    return new _Vector2(outputX, outputY);
  }
};

// src/common/components/CameraComponent.js
var CameraComponent = class extends Component {
  constructor(canvas, zoom = 1) {
    super();
    this.canvas = canvas;
    this.zoom = zoom;
  }
  applyTransform(ctx) {
    const position = this.gameObject.getGlobalPosition();
    ctx.setTransform(
      this.zoom,
      0,
      0,
      this.zoom,
      -position.x * this.zoom + this.canvas.width / 2,
      -position.y * this.zoom + this.canvas.height / 2
    );
  }
};

// src/input/Input.js
var Input = class _Input {
  static keys = /* @__PURE__ */ new Set();
  // Currently held keys
  static pressedKeys = /* @__PURE__ */ new Set();
  // Keys pressed this frame (click-like)
  static releasedKeys = /* @__PURE__ */ new Set();
  // Keys released this frame
  static previousKeys = /* @__PURE__ */ new Set();
  // Keys from previous frame
  // Mouse/Pointer state
  static mouseButtons = /* @__PURE__ */ new Set();
  // Currently held mouse buttons
  static pressedMouseButtons = /* @__PURE__ */ new Set();
  // Mouse buttons pressed this frame
  static releasedMouseButtons = /* @__PURE__ */ new Set();
  // Mouse buttons released this frame
  static previousMouseButtons = /* @__PURE__ */ new Set();
  // Mouse buttons from previous frame
  static mousePosition = { x: 0, y: 0 };
  // Current mouse position
  static lastMousePosition = { x: 0, y: 0 };
  // Previous mouse position
  // Event callbacks
  static onKeyDown = /* @__PURE__ */ new Map();
  // key -> callback
  static onKeyStay = /* @__PURE__ */ new Map();
  // key -> callback  
  static onKeyUp = /* @__PURE__ */ new Map();
  // key -> callback
  // Mouse event callbacks
  static onMouseDown = /* @__PURE__ */ new Map();
  // button -> callback
  static onMouseStay = /* @__PURE__ */ new Map();
  // button -> callback
  static onMouseUp = /* @__PURE__ */ new Map();
  // button -> callback
  static onMouseMove = /* @__PURE__ */ new Set();
  // Set of callbacks for mouse movement
  static canvas = null;
  // Reference to canvas for mouse coordinate calculation
  static initialize(canvas = null) {
    _Input.canvas = canvas;
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (!_Input.keys.has(key)) {
        _Input.pressedKeys.add(key);
        const callback = _Input.onKeyDown.get(key);
        if (callback) callback(key);
      }
      _Input.keys.add(key);
    });
    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      _Input.keys.delete(key);
      _Input.releasedKeys.add(key);
      const callback = _Input.onKeyUp.get(key);
      if (callback) callback(key);
    });
    const target = canvas || window;
    target.addEventListener("mousedown", (e) => {
      const button = e.button;
      if (!_Input.mouseButtons.has(button)) {
        _Input.pressedMouseButtons.add(button);
        const callback = _Input.onMouseDown.get(button);
        if (callback) callback(button, _Input.mousePosition);
      }
      _Input.mouseButtons.add(button);
      _Input.updateMousePosition(e);
    });
    target.addEventListener("mouseup", (e) => {
      const button = e.button;
      _Input.mouseButtons.delete(button);
      _Input.releasedMouseButtons.add(button);
      const callback = _Input.onMouseUp.get(button);
      if (callback) callback(button, _Input.mousePosition);
      _Input.updateMousePosition(e);
    });
    target.addEventListener("mousemove", (e) => {
      _Input.updateMousePosition(e);
      for (const callback of _Input.onMouseMove) {
        callback(_Input.mousePosition, _Input.lastMousePosition);
      }
    });
    if (canvas) {
      canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }
  }
  /**
   * Update mouse position relative to canvas
   * @param {MouseEvent} e - Mouse event
   */
  static updateMousePosition(e) {
    _Input.lastMousePosition = { ..._Input.mousePosition };
    if (_Input.canvas) {
      const rect = _Input.canvas.getBoundingClientRect();
      _Input.mousePosition.x = e.clientX - rect.left;
      _Input.mousePosition.y = e.clientY - rect.top;
    } else {
      _Input.mousePosition.x = e.clientX;
      _Input.mousePosition.y = e.clientY;
    }
  }
  /**
   * Updates the input state - should be called each frame
   */
  static update() {
    for (const key of _Input.keys) {
      if (_Input.previousKeys.has(key)) {
        const callback = _Input.onKeyStay.get(key);
        if (callback) callback(key);
      }
    }
    for (const button of _Input.mouseButtons) {
      if (_Input.previousMouseButtons.has(button)) {
        const callback = _Input.onMouseStay.get(button);
        if (callback) callback(button, _Input.mousePosition);
      }
    }
    _Input.pressedKeys.clear();
    _Input.releasedKeys.clear();
    _Input.pressedMouseButtons.clear();
    _Input.releasedMouseButtons.clear();
    _Input.previousKeys = new Set(_Input.keys);
    _Input.previousMouseButtons = new Set(_Input.mouseButtons);
  }
  /**
   * Check if key is currently being held down
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  static isKeyDown(key) {
    return _Input.keys.has(key.toLowerCase());
  }
  /**
   * Check if key was pressed this frame (click-like, only fires once)
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  static isKeyPressed(key) {
    return _Input.pressedKeys.has(key.toLowerCase());
  }
  /**
   * Check if key was released this frame
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  static isKeyReleased(key) {
    return _Input.releasedKeys.has(key.toLowerCase());
  }
  // === MOUSE/POINTER METHODS ===
  /**
   * Check if mouse button is currently being held down
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @returns {boolean}
   */
  static isMouseDown(button = 0) {
    return _Input.mouseButtons.has(button);
  }
  /**
   * Check if mouse button was pressed this frame (click-like, only fires once)
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @returns {boolean}
   */
  static isMousePressed(button = 0) {
    return _Input.pressedMouseButtons.has(button);
  }
  /**
   * Check if mouse button was released this frame
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @returns {boolean}
   */
  static isMouseReleased(button = 0) {
    return _Input.releasedMouseButtons.has(button);
  }
  /**
   * Get current mouse position
   * @returns {Object} {x, y} coordinates
   */
  static getMousePosition() {
    return { ..._Input.mousePosition };
  }
  /**
   * Get mouse movement delta from last frame
   * @returns {Object} {x, y} movement delta
   */
  static getMouseDelta() {
    return {
      x: _Input.mousePosition.x - _Input.lastMousePosition.x,
      y: _Input.mousePosition.y - _Input.lastMousePosition.y
    };
  }
  // === CONVENIENCE METHODS ===
  /**
   * Check if left mouse button is down
   * @returns {boolean}
   */
  static isLeftMouseDown() {
    return _Input.isMouseDown(0);
  }
  /**
   * Check if left mouse button was clicked this frame
   * @returns {boolean}
   */
  static isLeftMousePressed() {
    return _Input.isMousePressed(0);
  }
  /**
   * Check if right mouse button is down
   * @returns {boolean}
   */
  static isRightMouseDown() {
    return _Input.isMouseDown(2);
  }
  /**
   * Check if right mouse button was clicked this frame
   * @returns {boolean}
   */
  static isRightMousePressed() {
    return _Input.isMousePressed(2);
  }
  /**
   * Register a callback for when a key is first pressed (click-like)
   * @param {string} key - The key to listen for
   * @param {function} callback - Function to call when key is pressed
   */
  static onKeyDownEvent(key, callback) {
    _Input.onKeyDown.set(key.toLowerCase(), callback);
  }
  /**
   * Register a callback for when a key is being held down
   * @param {string} key - The key to listen for
   * @param {function} callback - Function to call while key is held
   */
  static onKeyStayEvent(key, callback) {
    _Input.onKeyStay.set(key.toLowerCase(), callback);
  }
  /**
   * Register a callback for when a key is released
   * @param {string} key - The key to listen for
   * @param {function} callback - Function to call when key is released
   */
  static onKeyUpEvent(key, callback) {
    _Input.onKeyUp.set(key.toLowerCase(), callback);
  }
  // === MOUSE EVENT CALLBACKS ===
  /**
   * Register a callback for when a mouse button is first pressed (click-like)
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @param {function} callback - Function to call when button is pressed
   */
  static onMouseDownEvent(button = 0, callback) {
    _Input.onMouseDown.set(button, callback);
  }
  /**
   * Register a callback for when a mouse button is being held down
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @param {function} callback - Function to call while button is held
   */
  static onMouseStayEvent(button = 0, callback) {
    _Input.onMouseStay.set(button, callback);
  }
  /**
   * Register a callback for when a mouse button is released
   * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
   * @param {function} callback - Function to call when button is released
   */
  static onMouseUpEvent(button = 0, callback) {
    _Input.onMouseUp.set(button, callback);
  }
  /**
   * Register a callback for mouse movement
   * @param {function} callback - Function to call when mouse moves
   */
  static onMouseMoveEvent(callback) {
    _Input.onMouseMove.add(callback);
  }
  // === CONVENIENCE EVENT METHODS ===
  /**
   * Register a callback for left mouse button click
   * @param {function} callback - Function to call when left button is clicked
   */
  static onLeftClickEvent(callback) {
    _Input.onMouseDownEvent(0, callback);
  }
  /**
   * Register a callback for right mouse button click
   * @param {function} callback - Function to call when right button is clicked
   */
  static onRightClickEvent(callback) {
    _Input.onMouseDownEvent(2, callback);
  }
  /**
   * Remove a key event callback
   * @param {string} event - 'down', 'stay', or 'up'
   * @param {string} key - The key to remove callback for
   */
  static removeKeyEvent(event, key) {
    const keyLower = key.toLowerCase();
    switch (event) {
      case "down":
        _Input.onKeyDown.delete(keyLower);
        break;
      case "stay":
        _Input.onKeyStay.delete(keyLower);
        break;
      case "up":
        _Input.onKeyUp.delete(keyLower);
        break;
    }
  }
  /**
   * Remove a mouse event callback
   * @param {string} event - 'down', 'stay', 'up', or 'move'
   * @param {number|function} buttonOrCallback - Button number for click events, or callback function for move events
   */
  static removeMouseEvent(event, buttonOrCallback) {
    switch (event) {
      case "down":
        _Input.onMouseDown.delete(buttonOrCallback);
        break;
      case "stay":
        _Input.onMouseStay.delete(buttonOrCallback);
        break;
      case "up":
        _Input.onMouseUp.delete(buttonOrCallback);
        break;
      case "move":
        _Input.onMouseMove.delete(buttonOrCallback);
        break;
    }
  }
  /**
   * Clear all event callbacks
   */
  static clearAllEvents() {
    _Input.onKeyDown.clear();
    _Input.onKeyStay.clear();
    _Input.onKeyUp.clear();
    _Input.onMouseDown.clear();
    _Input.onMouseStay.clear();
    _Input.onMouseUp.clear();
    _Input.onMouseMove.clear();
  }
};

// src/physics/AbstractColliderComponent.js
var AbstractColliderComponent = class extends Component {
  constructor() {
    super();
    this.trigger = false;
    this._lastCollisions = /* @__PURE__ */ new Set();
  }
  isTrigger() {
    return this.trigger === true;
  }
  start() {
    CollisionSystem.instance.register(this);
  }
  destroy() {
    CollisionSystem.instance.unregister(this);
  }
  checkCollisionWith(other) {
    throw new Error("checkCollisionWith must be implemented");
  }
  getBounds() {
    throw new Error("getBounds must be implemented");
  }
};

// src/bin/CollisionSystem.js
var CollisionSystem = class _CollisionSystem {
  constructor() {
    this.colliders = /* @__PURE__ */ new Set();
    _CollisionSystem.instance = this;
  }
  register(collider) {
    this.colliders.add(collider);
  }
  unregister(collider) {
    this.colliders.delete(collider);
  }
  update() {
  }
  intersects(a, b) {
    if (a instanceof AbstractColliderComponent && b instanceof AbstractColliderComponent) {
      return a.checkCollisionWith(b);
    }
    console.warn("INTERNAL_ERROR:At least one object is not an collider component:", a, b);
    return false;
  }
};
CollisionSystem.instance = void 0;

// src/common/GameObject.js
var GameObject = class _GameObject {
  /**
   * Creates a new GameObject.
   * @param {number|Vector2} [x=0] - The initial x-coordinate or Vector2 position of the GameObject.
   * @param {number} [y=0] - The initial y-coordinate of the GameObject (ignored if x is Vector2).
   */
  constructor(x = 0, y = 0) {
    if (x instanceof Vector2) {
      this.position = x.clone();
    } else {
      this.position = new Vector2(x, y);
    }
    this.rotation = 0;
    this.components = [];
    this.children = [];
    this.parent = null;
    this.name = "";
    this.tags = /* @__PURE__ */ new Set();
    this.paused = false;
  }
  /**
   * Adds a component to the GameObject.
   * The component must be an instance of Component.
   * If a component of the same type already exists, it will throw an error.
   * @param {Component} component - The component to add.
   * @throws {Error} If the component is not an instance of Component or if a component of the same type already exists.
   */
  addComponent(component) {
    if (!(component instanceof Component)) {
      throw new Error('addComponent: property "component" must be an instance of Component');
    }
    const existing = this.getComponent(component.constructor);
    if (existing) throw new Error(`Component of type ${component.constructor.name} already exists on this GameObject.`);
    component.gameObject = this;
    this.components.push(component);
    return component;
  }
  /**
   * Retrieves a component of the specified type from the GameObject.
   * @param {Function} type - The class of the component to retrieve.
   * @returns {Component|null} The component if found, otherwise null.
   * @throws {Error} If the type is not a class.
   */
  getComponent(type) {
    if (typeof type !== "function" || !type.prototype) {
      throw new Error('getComponent: property "type" must be a class');
    }
    return this.components.find((c) => c instanceof type);
  }
  /**
   * Checks if the GameObject has a component of the specified type.
   * @param {Function} type - The class of the component to check.
   * @return {boolean} True if the component exists, otherwise false.
   * @throws {Error} If the type is not a class.
   */
  hasComponent(type) {
    if (typeof type !== "function" || !type.prototype) {
      throw new Error('hasComponent: property "type" must be a class');
    }
    return !!this.getComponent(type);
  }
  /**
   * Removes a component of the specified type from the GameObject.
   * If the component is found, it will be destroyed if it has a destroy method.
   * @param {Function} type - The class of the component to remove.
   * @throws {Error} If the type is not a class.
   */
  removeComponent(type) {
    const index = this.components.findIndex((c) => c instanceof type);
    if (index !== -1) {
      this.components[index].destroy?.();
      this.components.splice(index, 1);
    }
  }
  // TODO: ADD ALL THE CHILD OPTIONS
  getComponentInChildren(type) {
    if (typeof type !== "function" || !type.prototype) {
      throw new Error('hasComponent: property "type" must be a class');
    }
    return this.children.find((c) => c.hasComponent(type)).getComponent(type);
  }
  /**
   * Checks if the GameObject has a specific tag.
   * @param {string} tag - The tag to check.
   * @return {boolean} True if the tag exists, otherwise false.
   */
  hasTag(tag) {
    return this.tags.has(tag);
  }
  /**
   * Adds a tag to the GameObject.
   * If the tag already exists, it will not be added again.
   * @param {string} tag - The tag to add.
   */
  addTag(tag) {
    this.tags.add(tag);
  }
  __addChild(child) {
    if (!(child instanceof _GameObject)) {
      throw new Error(`Nity2D: method 'addChild' only accepts GameObject, '${typeof child}' provided`);
    }
    this.children.push(child);
    child.parent = this;
  }
  addChild(child) {
    Instantiate.create(child, {
      // Don't override the child's position - keep it relative to parent
      parent: this,
      addToScene: true
    });
  }
  addChildren(children) {
    if (!Array.isArray(children)) throw new Error(`Nity2D: method 'addChildren' only accepts array '${typeof children}' provided`);
    children.forEach((child) => this.addChild(child));
  }
  /**
   * Removes a child GameObject from this GameObject.
   * If the child is not found, it will not throw an error.
   * @param {GameObject} child - The child GameObject to remove.
   */
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  }
  /**
   * Gets the global position of the GameObject as a Vector2.
   * @returns {Vector2} The global position of the GameObject.
   */
  getGlobalPosition() {
    if (this.parent) {
      return this.position.add(this.parent.getGlobalPosition());
    }
    return this.position.clone();
  }
  /**
   * Gets the global rotation of the GameObject in radians.
   * If the GameObject has a parent, it will add the parent's global rotation to its own rotation.
   * @returns {number} The global rotation of the GameObject in radians.
   */
  getGlobalRotation() {
    if (this.parent) {
      return this.rotation + this.parent.getGlobalRotation();
    }
    return this.rotation;
  }
  /**
   * Sets the position of the GameObject.
   * @param {number|Vector2} x - The new x-coordinate of the GameObject or Vector2 position.
   * @param {number} [y] - The new y-coordinate of the GameObject (ignored if x is Vector2).
   */
  setPosition(x, y) {
    if (x instanceof Vector2) {
      this.position.set(x.x, x.y);
    } else {
      this.position.set(x, y);
    }
  }
  /**
   * Sets the rotation of the GameObject.
   * @param {number} radians - The new rotation in radians.
   */
  setRotation(radians) {
    this.rotation = radians;
  }
  /**
   * Sets the rotation of the GameObject in degrees.
   * @param {number} degrees - The new rotation in degrees.
   */
  setRotationDegrees(degrees) {
    this.rotation = degrees * (Math.PI / 180);
  }
  /**
   * Gets the rotation of the GameObject in degrees.
   * @returns {number} The rotation in degrees.
   */
  getRotationDegrees() {
    return this.rotation * (180 / Math.PI);
  }
  /**
   * Gets the global rotation of the GameObject in degrees.
   * @returns {number} The global rotation in degrees.
   */
  getGlobalRotationDegrees() {
    return this.getGlobalRotation() * (180 / Math.PI);
  }
  /**
   * Rotates the GameObject by the given amount.
   * @param {number} radians - The rotation amount in radians to add.
   */
  rotate(radians) {
    this.rotation += radians;
  }
  /**
   * Rotates the GameObject by the given amount in degrees.
   * @param {number} degrees - The rotation amount in degrees to add.
   */
  rotateDegrees(degrees) {
    this.rotation += degrees * (Math.PI / 180);
  }
  /**
   * Translates the GameObject by the given offset.
   * @param {number|Vector2} x - The x offset or Vector2 offset.
   * @param {number} [y] - The y offset (ignored if x is Vector2).
   */
  translate(x, y) {
    if (x instanceof Vector2) {
      this.position = this.position.add(x);
    } else {
      this.position = this.position.add(new Vector2(x, y));
    }
  }
  async preload() {
    const promises = this.components.map((c) => c.preload?.());
    for (const child of this.children) {
      promises.push(child.preload?.());
    }
    await Promise.all(promises);
  }
  start() {
    for (const c of this.components) {
      if (c.enabled && typeof c.start === "function") c.start();
    }
    for (const child of this.children) {
      child.start();
    }
  }
  /** * Updates the GameObject and its components.
   * This method will call the update method of each
   * component that is enabled.
   * It will also recursively call the update method of each child GameObject.
   */
  update() {
    if (this.paused) return;
    for (const c of this.components) {
      if (c.enabled && typeof c.update === "function") c.update();
    }
    for (const child of this.children) {
      child.update();
    }
  }
  /** * Updates the GameObject and its components in the late update phase.
   * This method will call the lateUpdate method of each
   * component that is enabled.
   * It will also recursively call the lateUpdate method of each child GameObject.
   */
  lateUpdate() {
    if (this.paused) return;
    for (const c of this.components) {
      if (c.enabled && typeof c.lateUpdate === "function") c.lateUpdate();
    }
    for (const child of this.children) {
      child.lateUpdate();
    }
  }
  /** * Handles collision events for the GameObject.
   * This method will call the onCollisionEnter, onCollisionStay, and onCollisionExit methods
   * of each component that is enabled.
   * It will also recursively call these methods for each child GameObject.
   * @param {Object} other - The other GameObject involved in the collision.
   */
  onCollisionEnter(other) {
    for (const comp of this.components) {
      if (typeof comp.onCollisionEnter === "function") {
        comp.onCollisionEnter(other);
      }
    }
  }
  /** * Handles collision stay events for the GameObject.
   * This method will call the onCollisionStay method of each
   * component that is enabled.
   * It will also recursively call this method for each child GameObject.
   * @param {Object} other - The other GameObject involved in the collision.
   */
  onCollisionStay(other) {
    for (const comp of this.components) {
      if (typeof comp.onCollisionStay === "function") {
        comp.onCollisionStay(other);
      }
    }
  }
  /** * Handles collision exit events for the GameObject.
   * This method will call the onCollisionExit method of each
   * component that is enabled.
   * It will also recursively call this method for each child GameObject.
   * @param {Object} other - The other GameObject involved in the collision.
   */
  onCollisionExit(other) {
    for (const comp of this.components) {
      if (typeof comp.onCollisionExit === "function") {
        comp.onCollisionExit(other);
      }
    }
  }
  /** * Draws the GameObject and its components on the canvas.
   * This method will call the draw method of each component that is enabled.
   * It will also recursively call the draw method of each child GameObject.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
  __draw(ctx) {
    if (this.paused) return;
    for (const c of this.components) {
      c.__draw(ctx);
    }
    for (const child of this.children) {
      child.__draw(ctx);
    }
  }
};

// src/core/Instantiate.js
var Instantiate = class _Instantiate {
  /**
   * Creates a new GameObject instance and automatically registers its components.
   * @param {GameObject|Function} prefab - GameObject instance or class constructor
   * @param {Object} options - Instantiation options
   * @param {number} [options.x=0] - X position
   * @param {number} [options.y=0] - Y position
   * @param {GameObject} [options.parent=null] - Parent GameObject
   * @param {boolean} [options.addToScene=true] - Whether to add to current scene
   * @param {...any} args - Additional arguments for constructor if prefab is a class
   * @returns {GameObject} The instantiated GameObject
   */
  static create(prefab, options = {}, ...args) {
    const {
      x,
      y,
      parent = null,
      addToScene = true
    } = options;
    let gameObject;
    if (typeof prefab === "function") {
      gameObject = new prefab(x ?? 0, y ?? 0, ...args);
    } else if (prefab instanceof GameObject) {
      gameObject = prefab;
      if (x !== void 0) gameObject.x = x;
      if (y !== void 0) gameObject.y = y;
    } else {
      throw new Error("Instantiate.create: prefab must be a GameObject instance or constructor function");
    }
    if (parent) {
      if (!(parent instanceof GameObject)) {
        throw new Error("Instantiate.create: parent must be a GameObject instance");
      }
      parent.__addChild(gameObject);
    }
    if (addToScene && !parent && Game.instance?.scene) {
      Game.instance.scene.__addObjectToScene(gameObject);
    }
    _Instantiate._registerGameObject(gameObject);
    return gameObject;
  }
  /**
   * Recursively registers a GameObject and all its components and children.
   * @param {GameObject} gameObject - The GameObject to register
   * @private
   */
  static _registerGameObject(gameObject) {
    for (const component of gameObject.components) {
      _Instantiate._registerComponent(component);
    }
    for (const child of gameObject.children) {
      _Instantiate._registerGameObject(child);
    }
  }
  /**
   * Registers a component with appropriate systems.
   * @param {Component} component - The component to register
   * @private
   */
  static _registerComponent(component) {
    if (component instanceof AbstractColliderComponent) {
      if (CollisionSystem.instance) {
        CollisionSystem.instance.register(component);
      } else {
        console.warn("CollisionSystem not initialized. Collider will be registered when system is available:", component);
        if (!_Instantiate._pendingColliders) {
          _Instantiate._pendingColliders = [];
        }
        _Instantiate._pendingColliders.push(component);
      }
    }
    if (typeof component.start === "function") {
      component.start();
    }
  }
  /**
   * Registers any pending colliders that were waiting for CollisionSystem initialization.
   * This should be called after CollisionSystem is created.
   */
  static registerPendingColliders() {
    if (_Instantiate._pendingColliders && CollisionSystem.instance) {
      for (const collider of _Instantiate._pendingColliders) {
        CollisionSystem.instance.register(collider);
      }
      _Instantiate._pendingColliders = [];
    }
  }
  /**
   * Destroys a GameObject and unregisters all its components.
   * @param {GameObject} gameObject - The GameObject to destroy
   */
  static destroy(gameObject) {
    if (!(gameObject instanceof GameObject)) {
      throw new Error("Instantiate.destroy: gameObject must be a GameObject instance");
    }
    for (const child of [...gameObject.children]) {
      _Instantiate.destroy(child);
    }
    for (const component of gameObject.components) {
      _Instantiate._unregisterComponent(component);
    }
    if (gameObject.parent) {
      gameObject.parent.removeChild(gameObject);
    }
    if (Game.instance?.scene) {
      const index = Game.instance.scene.objects.indexOf(gameObject);
      if (index !== -1) {
        Game.instance.scene.objects.splice(index, 1);
      }
    }
  }
  /**
   * Unregisters a component from appropriate systems.
   * @param {Component} component - The component to unregister
   * @private
   */
  static _unregisterComponent(component) {
    if (component instanceof AbstractColliderComponent) {
      if (CollisionSystem.instance) {
        CollisionSystem.instance.unregister(component);
      }
    }
    if (typeof component.destroy === "function") {
      component.destroy();
    }
  }
  /**
   * Clones a GameObject and all its components and children.
   * @param {GameObject} original - The GameObject to clone
   * @param {Object} options - Cloning options (same as create options)
   * @returns {GameObject} The cloned GameObject
   */
  static clone(original, options = {}) {
    if (!(original instanceof GameObject)) {
      throw new Error("Instantiate.clone: original must be a GameObject instance");
    }
    const clone = new GameObject(original.x, original.y);
    clone.name = original.name;
    clone.tags = new Set(original.tags);
    for (const component of original.components) {
      const ComponentClass = component.constructor;
      const newComponent = new ComponentClass();
      for (const key in component) {
        if (component.hasOwnProperty(key) && key !== "gameObject") {
          newComponent[key] = component[key];
        }
      }
      clone.addComponent(newComponent);
    }
    for (const child of original.children) {
      const childClone = _Instantiate.clone(child, { addToScene: false });
      clone.__addChild(childClone);
    }
    const {
      x = clone.x,
      y = clone.y,
      parent = null,
      addToScene = true
    } = options;
    clone.x = x;
    clone.y = y;
    if (parent) {
      parent.__addChild(clone);
    }
    if (addToScene && !parent && Game.instance?.scene) {
      Game.instance.scene.__addObjectToScene(clone);
    }
    _Instantiate._registerGameObject(clone);
    return clone;
  }
};

// src/core/Time.js
var Time = class {
  static #startTime = performance.now();
  static #lastFrameTime = performance.now();
  static #frameCount = 0;
  static #fpsUpdateInterval = 1e3;
  // Update FPS every second
  static #lastFpsUpdate = performance.now();
  static #currentFps = 60;
  static #timeScale = 1;
  /**
   * Returns the time elapsed since the last frame in seconds.
   * This is useful for creating frame-rate independent animations and movement.
   * 
   * @returns {number} The delta time in seconds
   * 
   * @example
   * // Move an object at 50 pixels per second regardless of frame rate
   * gameObject.x += 50 * Time.deltaTime;
   */
  static get deltaTime() {
    return Game.instance?._deltaTime || 0;
  }
  /**
   * The unscaled time elapsed since the last frame in seconds.
   * This is not affected by timeScale and is useful for UI animations.
   * 
   * @returns {number} The unscaled delta time in seconds
   */
  static get unscaleddeltaTime() {
    return (Game.instance?._deltaTime || 0) / this.#timeScale;
  }
  /**
   * The time at the beginning of this frame in seconds since the game started.
   * This is affected by timeScale.
   * 
   * @returns {number} The current game time in seconds
   */
  static get time() {
    return (performance.now() - this.#startTime) / 1e3 * this.#timeScale;
  }
  /**
   * The unscaled time at the beginning of this frame in seconds since the game started.
   * This is not affected by timeScale.
   * 
   * @returns {number} The current real time in seconds
   */
  static get unscaledTime() {
    return (performance.now() - this.#startTime) / 1e3;
  }
  /**
   * The current frames per second (updated once per second).
   * 
   * @returns {number} The current FPS
   */
  static get fps() {
    return this.#currentFps;
  }
  /**
   * The total number of frames that have passed since the game started.
   * 
   * @returns {number} The frame count
   */
  static get frameCount() {
    return this.#frameCount;
  }
  /**
   * The scale at which time passes. This affects deltaTime and time.
   * 1.0 = normal speed, 0.5 = half speed, 2.0 = double speed, 0.0 = paused.
   * 
   * @returns {number} The current time scale
   */
  static get timeScale() {
    return this.#timeScale;
  }
  /**
   * Sets the time scale. Useful for slow motion, fast forward, or pause effects.
   * 
   * @param {number} value - The new time scale (0 = paused, 1 = normal, 2 = double speed, etc.)
   */
  static set timeScale(value) {
    this.#timeScale = Math.max(0, value);
  }
  /**
   * Returns the current high-precision timestamp in milliseconds.
   * Uses performance.now() for sub-millisecond accuracy.
   * 
   * @returns {number} The current timestamp in milliseconds
   */
  static get timestamp() {
    return performance.now();
  }
  /**
   * Returns the time since the Unix epoch in milliseconds.
   * Equivalent to Date.now() but more explicit.
   * 
   * @returns {number} The current Unix timestamp in milliseconds
   */
  static get realtimeSinceStartup() {
    return Date.now();
  }
  /**
   * Internal method called by the Game class to update time statistics.
   * This should not be called directly by user code.
   * 
   * @private
   */
  static _updateTimeStats() {
    const currentTime = performance.now();
    this.#frameCount++;
    if (currentTime - this.#lastFpsUpdate >= this.#fpsUpdateInterval) {
      const deltaTime = currentTime - this.#lastFpsUpdate;
      const framesPassed = this.#frameCount - (this.#lastFpsUpdate === performance.now() ? 0 : Math.floor(deltaTime / 16.67));
      this.#currentFps = Math.round(1e3 / (deltaTime / framesPassed)) || 60;
      this.#lastFpsUpdate = currentTime;
    }
    this.#lastFrameTime = currentTime;
  }
  /**
   * Converts seconds to milliseconds.
   * 
   * @param {number} seconds - Time in seconds
   * @returns {number} Time in milliseconds
   */
  static secondsToMilliseconds(seconds) {
    return seconds * 1e3;
  }
  /**
   * Converts milliseconds to seconds.
   * 
   * @param {number} milliseconds - Time in milliseconds
   * @returns {number} Time in seconds
   */
  static millisecondsToSeconds(milliseconds) {
    return milliseconds / 1e3;
  }
  /**
   * Creates a simple timer that can be checked against.
   * 
   * @param {number} duration - Duration in seconds
   * @returns {function} A function that returns true when the timer expires
   * 
   * @example
   * const timer = Time.createTimer(2.0);
   * // Later in update loop:
   * if (timer()) {
   *     console.log('2 seconds have passed!');
   * }
   */
  static createTimer(duration) {
    const startTime = this.time;
    return () => this.time - startTime >= duration;
  }
  /**
   * Creates a repeating timer that triggers at regular intervals.
   * 
   * @param {number} interval - Interval in seconds
   * @returns {function} A function that returns true at each interval
   * 
   * @example
   * const intervalTimer = Time.createInterval(1.0);
   * // Later in update loop:
   * if (intervalTimer()) {
   *     console.log('Another second has passed!');
   * }
   */
  static createInterval(interval) {
    let lastTrigger = this.time;
    return () => {
      if (this.time - lastTrigger >= interval) {
        lastTrigger = this.time;
        return true;
      }
      return false;
    };
  }
  /**
   * Smoothly interpolates between two values over time.
   * 
   * @param {number} from - Starting value
   * @param {number} to - Target value  
   * @param {number} speed - Interpolation speed (higher = faster)
   * @returns {number} The interpolated value
   * 
   * @example
   * // Smooth camera follow
   * camera.x = Time.lerp(camera.x, player.x, 2.0);
   */
  static lerp(from, to, speed) {
    return from + (to - from) * (1 - Math.exp(-speed * this.deltaTime));
  }
  /**
   * Resets the time system. Called when starting a new game or scene.
   * This should not typically be called by user code.
   * 
   * @private
   */
  static _reset() {
    this.#startTime = performance.now();
    this.#lastFrameTime = performance.now();
    this.#frameCount = 0;
    this.#lastFpsUpdate = performance.now();
    this.#currentFps = 60;
    this.#timeScale = 1;
  }
};

// src/core/Game.js
var Game = class _Game {
  #_forcedpaused = false;
  #_lastTime = 0;
  // For tracking the last frame time
  constructor(canvas) {
    _Game.instance = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scene = null;
    this.mainCamera = null;
    this.paused = false;
    this._internalGizmos = false;
    this._debugMode = false;
    this._deltaTime = 0;
    new CollisionSystem();
    Instantiate.registerPendingColliders();
  }
  configure(options = { canvas: null, mainCamera: null, debug: false }) {
    if (options.canvas) {
      this.canvas = options.canvas;
      this.ctx = this.canvas.getContext("2d");
    }
    if (options.mainCamera) this.mainCamera = options.mainCamera;
    if (options.debug) this.#_debugMode();
  }
  launch(scene) {
    if (!scene && !this.scene) throw new Error("No scene assigned to game.");
    this.#_initCanvas();
    this.#_launch(scene || this.scene);
  }
  async loadScene(scene) {
    if (!scene) throw new Error("No scene provided.");
    this.scene = scene;
    if (typeof scene._create === "function") {
      scene._create(scene);
      scene._create = null;
    }
    await SpriteRegistry.preloadAll();
    await this.scene.preload();
    await this.scene.start();
    this.#_start();
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }
  async #_launch(scene) {
    await this.loadScene(scene);
    this.#_start();
  }
  #_start() {
    Time._reset();
    Input.initialize(this.canvas);
    this.#_initEventListeners();
    requestAnimationFrame(this.#_loop.bind(this));
  }
  #_loop(timestamp) {
    this._deltaTime = (timestamp - this.#_lastTime) / 1e3;
    if (this._deltaTime > 0.1) this._deltaTime = 0.1;
    this.#_lastTime = timestamp;
    Time._updateTimeStats();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.#_forcedpaused) {
      if (!this.paused) {
        Input.update();
        this.scene.__update();
        if (this.mainCamera) {
          const cam = this.mainCamera.getComponent(CameraComponent);
          if (cam) cam.applyTransform(this.ctx);
        }
      }
      this.scene.__lateUpdate();
      this.scene.__draw(this.ctx);
    }
    requestAnimationFrame(this.#_loop.bind(this));
  }
  #_forcedPause() {
    if (this.#_forcedpaused === true) return;
    this.#_forcedpaused = true;
    console.log("Game fullscale pause");
  }
  #_forcedResume() {
    if (this.#_forcedpaused === false) return;
    this.#_forcedpaused = false;
    this.#_lastTime = performance.now();
    console.log("Game fullscale resume");
  }
  #_initEventListeners() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.#_forcedPause();
      } else {
        this.#_forcedResume();
      }
    });
  }
  #_initCanvas() {
    if (!this.canvas) {
      console.warn("No canvas element provided.");
      return;
    }
    if (!this.ctx) {
      console.error("Failed to get 2D context from canvas.");
    }
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
  }
  #_debugMode() {
    this._debugMode = true;
    this._internalGizmos = true;
  }
};
Game.instance = null;

// src/animations/SpriteAnimationClip.js
var SpriteAnimationClip = class {
  /**
   * Creates a new SpriteAnimationClip.
   * 
   * @param {string} name - Unique identifier for the animation clip
   * @param {string[]} [spriteNames=[]] - Array of sprite names that make up the animation sequence
   * @param {number} [fps=10] - Frames per second for the animation playback
   * @param {boolean} [loop=true] - Whether the animation should loop when it reaches the end
   */
  constructor(name, spriteNames = [], fps = 10, loop = true) {
    this.name = name;
    this.spriteNames = spriteNames;
    this.fps = fps;
    this.loop = loop;
  }
};

// src/renderer/components/SpriteRendererComponent.js
var SpriteRendererComponent = class extends Component {
  /**
   * Creates a new SpriteRendererComponent.
   * 
   * @param {string} spriteName - Unified sprite key ("name" or "sheet:sprite") or legacy assetName
   * @param {Object} [options={}] - Rendering options
   * @param {number} [options.width] - Custom width for scaling. If not provided, uses sprite's natural width
   * @param {number} [options.height] - Custom height for scaling. If not provided, uses sprite's natural height
   * @param {boolean} [options.flipX=false] - Flip sprite horizontally
   * @param {boolean} [options.flipY=false] - Flip sprite vertically
   */
  constructor(spriteName, options = {}) {
    super();
    this.spriteKey = spriteName;
    this.sprite = null;
    this.options = {
      width: options.width || null,
      height: options.height || null,
      flipX: options.flipX || false,
      flipY: options.flipY || false
    };
  }
  /**
   * Preloads the sprite from the unified registry. Called automatically during GameObject preload.
   * 
   * @throws {Error} If the sprite is not found
   */
  preload() {
    this.sprite = SpriteRegistry.getSprite(this.spriteKey);
    if (!this.sprite) {
      throw new Error(`Sprite '${this.spriteKey}' not found in SpriteRegistry. Make sure the sprite or spritesheet is loaded.`);
    }
  }
  /**
   * Draws the sprite on the canvas at the GameObject's global position with optional custom scaling.
   * Called automatically during the render phase.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __draw(ctx) {
    if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
    const position = this.gameObject.getGlobalPosition();
    const rotation = this.gameObject.getGlobalRotation();
    const width = this.options.width || null;
    const height = this.options.height || null;
    this.sprite.draw(ctx, position.x, position.y, width, height, rotation);
  }
  /**
   * Change the sprite being rendered using unified sprite key
   * @param {string} newSpriteKey - New sprite key ("name" or "sheet:sprite")
   */
  setSprite(newSpriteKey) {
    this.spriteKey = newSpriteKey;
    this.sprite = SpriteRegistry.getSprite(newSpriteKey);
    if (!this.sprite) {
      console.warn(`Sprite '${newSpriteKey}' not found in SpriteRegistry.`);
    }
  }
  /**
   * Set custom scale dimensions for the sprite
   * @param {number} width - Custom width for scaling
   * @param {number} height - Custom height for scaling
   */
  setScale(width, height) {
    this.options.width = width;
    this.options.height = height;
  }
  /**
   * Update sprite rendering options
   * @param {Object} newOptions - New options to merge with existing ones
   */
  setOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
  /**
   * Get the actual rendered width of the sprite (custom or natural)
   * @returns {number} The rendered width
   */
  getRenderedWidth() {
    if (!this.sprite) return 0;
    return this.options.width || this.sprite.width;
  }
  /**
   * Get the actual rendered height of the sprite (custom or natural)
   * @returns {number} The rendered height
   */
  getRenderedHeight() {
    if (!this.sprite) return 0;
    return this.options.height || this.sprite.height;
  }
  /**
   * Draws gizmos for the sprite renderer bounds.
   * Shows the sprite's bounding box and center point for debugging.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __internalGizmos(ctx) {
    if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
    const position = this.gameObject.getGlobalPosition();
    const rotation = this.gameObject.getGlobalRotation();
    ctx.save();
    ctx.translate(position.x, position.y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.strokeStyle = "#FF00FF";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 2]);
    const width = this.getRenderedWidth();
    const height = this.getRenderedHeight();
    ctx.strokeRect(-width / 2, -height / 2, width, height);
    ctx.setLineDash([]);
    ctx.fillStyle = "#FF00FF";
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#FF00FF";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.spriteKey, 0, -height / 2 - 8);
    ctx.fillText(`${width}x${height}`, 0, height / 2 + 15);
    ctx.restore();
  }
};

// src/animations/components/SpriteAnimationComponent.js
var SpriteAnimationComponent = class extends Component {
  /**
   * Creates a new SpriteAnimationComponent.
   * 
   * @param {string} [defaultClipName=null] - Name of the default animation clip to play on start
   */
  constructor(defaultClipName = null) {
    super();
    this.clips = /* @__PURE__ */ new Map();
    this.currentClip = null;
    this.currentFrame = 0;
    this.autoPlay = true;
    this.time = 0;
    this.defaultClipName = defaultClipName;
  }
  /**
   * Called when the GameObject starts. Automatically plays the default clip if autoPlay is enabled.
   */
  start() {
    if (this.autoPlay && this.defaultClipName) {
      this.play(this.defaultClipName);
    }
  }
  /**
   * Adds an animation clip to this component.
   * 
   * @param {SpriteAnimationClip} clip - The animation clip to add
   */
  addClip(clip) {
    this.clips.set(clip.name, clip);
  }
  /**
   * Plays the specified animation clip.
   * 
   * @param {string} name - Name of the animation clip to play
   * @throws {Error} If the animation clip is not found
   */
  play(name) {
    const clip = this.clips.get(name);
    if (!clip) throw new Error(`Animation clip '${name}' not found.`);
    this.currentClip = clip;
    this.currentFrame = 0;
    this.time = 0;
    this._applyFrame();
  }
  /**
   * Updates the animation playback. Called automatically each frame.
   */
  update() {
    if (!this.currentClip) return;
    this.time += Time.deltaTime;
    const frameDuration = 1 / this.currentClip.fps;
    if (this.time >= frameDuration) {
      this.time -= frameDuration;
      this.currentFrame++;
      if (this.currentFrame >= this.currentClip.spriteNames.length) {
        if (this.currentClip.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.currentClip.spriteNames.length - 1;
          return;
        }
      }
      this._applyFrame();
    }
  }
  /**
   * Applies the current frame's sprite to the SpriteRendererComponent using unified sprite keys.
   * @private
   */
  _applyFrame() {
    if (!this.currentClip || !this.currentClip.spriteNames[this.currentFrame]) return;
    const spriteKey = this.currentClip.spriteNames[this.currentFrame];
    const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
    if (spriteRenderer) {
      spriteRenderer.setSprite(spriteKey);
    }
  }
};

// src/common/Scene.js
var Scene = class {
  constructor({ create } = {}) {
    this.objects = [];
    this._create = create;
  }
  /**
   * Adds an object to the scene before the game starts.
   * You should use {@link Instantiate.create} when adding new objects after launched the game.
   * 
   * @param {Object} obj - The object to add to the scene.
   */
  add(obj) {
    Instantiate.create(obj);
  }
  __addObjectToScene(obj) {
    if (!(obj instanceof GameObject)) throw new Error(`[Nity] Forbidden object '${obj ? obj.constructor.name : null}' added to the scene. Accepts only 'GameObject'.`);
    this.objects.push(obj);
  }
  findByName(name) {
    return this.objects.find((obj) => obj.name === name);
  }
  findByTag(tag) {
    return this.objects.filter((obj) => obj.hasTag(tag));
  }
  async preload() {
    if (typeof this._create === "function") {
      this._create(this);
      this._create = null;
    }
    const preloadPromises = this.objects.map((obj) => obj?.preload?.());
    await Promise.all(preloadPromises);
  }
  async start() {
    for (let obj of this.objects) {
      if (typeof obj?.start === "function") {
        obj?.start();
      }
    }
    setTimeout(() => {
    }, 500);
  }
  update() {
  }
  lateUpdate() {
  }
  __update() {
    for (let obj of this.objects) {
      if (typeof obj?.update === "function") {
        obj?.update();
      }
    }
    if (CollisionSystem.instance) {
      CollisionSystem.instance?.update();
    } else {
      console.warn("Scene: CollisionSystem.instance is null!");
    }
    this?.update();
  }
  __lateUpdate() {
    for (let obj of this.objects) {
      if (typeof obj.lateUpdate === "function") {
        obj?.lateUpdate();
      }
    }
    this?.lateUpdate();
  }
  __draw(ctx) {
    for (let obj of this.objects) {
      obj.__draw(ctx);
    }
  }
};

// src/physics/components/GravityComponent.js
var GravityComponent = class extends Component {
  /**
   * Creates a new GravityComponent.
   * 
   * @param {Object} [options={ gravityScale: 300 }] - Configuration options
   * @param {number} [options.gravityScale=300] - The scale of the gravity effect (pixels per second squared)
   */
  constructor(options = { gravityScale: 300 }) {
    super();
    this.gravity = true;
    this.gravityScale = options.gravityScale || 300;
    this.velocity = new Vector2(0, 0);
  }
  /**
   * Updates the gravity effect. Called automatically each frame.
   * Increases the Y velocity based on gravity scale and delta time.
   */
  update() {
    if (this.gravity) {
      this.velocity.y += this.gravityScale * Time.deltaTime;
    }
  }
  /**
   * Moves the GameObject by the specified offset.
   * @private
   * 
   * @param {number|Vector2} dx - X offset or Vector2 offset
   * @param {number} [dy] - Y offset (ignored if dx is Vector2)
   */
  _doMove(dx, dy) {
    if (dx instanceof Vector2) {
      this.gameObject.translate(dx);
    } else {
      this.gameObject.translate(dx, dy);
    }
  }
};

// src/physics/components/RigidbodyComponent.js
var RigidbodyComponent = class _RigidbodyComponent extends GravityComponent {
  #_collider;
  #_lastCollisions = /* @__PURE__ */ new Set();
  bounciness = 0;
  // 0 = no bounce, 1 = full bounce
  gravity = false;
  gravityScale = 300;
  constructor(options = {
    gravity: false,
    gravityScale: 300,
    bounciness: 0
  }) {
    super(options);
    this.gravity = options.gravity != null ? options.gravity : false;
    this.bounciness = options.bounciness || 0;
  }
  /**
   * Initializes the RigidbodyComponent, ensuring it has a collider.
   * @returns {void}
   */
  start() {
    this.#_collider = this.gameObject.getComponent(AbstractColliderComponent);
    if (!this.#_collider) {
      console.warn("RigidbodyComponent requires a collider.");
    }
  }
  /**
   * Updates the RigidbodyComponent, applying gravity and moving the GameObject.
   */
  update() {
    super.update();
    const movement = this.velocity.multiply(Time.deltaTime);
    this.move(movement.x, movement.y);
  }
  /**
   * Moves the GameObject and handles collision resolution.
   * @param {number|Vector2} dx - The change in x position or Vector2 movement.
   * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
   * @returns {boolean} - Returns true if the movement was successful.
   */
  move(dx, dy) {
    let moveX, moveY;
    if (dx instanceof Vector2) {
      moveX = dx.x;
      moveY = dx.y;
    } else {
      moveX = dx;
      moveY = dy;
    }
    const maxSpeed = Math.max(Math.abs(moveX), Math.abs(moveY));
    const steps = Math.max(1, Math.ceil(maxSpeed / 0.25));
    const stepX = moveX / steps;
    const stepY = moveY / steps;
    let currentCollisions = /* @__PURE__ */ new Set();
    let resolved = false;
    let totalMoved = new Vector2(0, 0);
    for (let i = 0; i < steps; i++) {
      const prevPos = this.gameObject.position.clone();
      this._doMove(stepX, stepY);
      totalMoved = totalMoved.add(new Vector2(stepX, stepY));
      if (this.#_collider) {
        for (const other of CollisionSystem.instance.colliders) {
          if (other === this.#_collider) continue;
          if (!this.#_collider.checkCollisionWith(other)) continue;
          const otherObj = other.gameObject;
          currentCollisions.add(otherObj);
          const wasColliding = this.#_lastCollisions.has(otherObj);
          const isTrigger = this.#_collider.isTrigger() || other.isTrigger();
          if (!wasColliding) {
            this.#eventEnter(this.gameObject, otherObj);
            if (!otherObj.hasComponent?.(_RigidbodyComponent))
              this.#eventEnter(otherObj, this.gameObject);
          } else {
            this.#eventStay(this.gameObject, otherObj);
            if (!otherObj.hasComponent?.(_RigidbodyComponent))
              this.#eventStay(otherObj, this.gameObject);
          }
          if (!isTrigger && !resolved) {
            this.gameObject.setPosition(prevPos);
            if (Math.abs(stepY) > Math.abs(stepX)) {
              this.velocity.y *= -this.bounciness;
            } else {
              this.velocity.x *= -this.bounciness;
            }
            resolved = true;
            break;
          }
        }
      }
      if (resolved) break;
      this.#handleExitEvents(currentCollisions);
      this.#_lastCollisions = currentCollisions;
    }
    return true;
  }
  /**
   * Handle exit events with improved stability for edge cases
   * @param {Set} currentCollisions - Set of currently colliding objects
   */
  #handleExitEvents(currentCollisions) {
    for (const obj of this.#_lastCollisions) {
      if (!currentCollisions.has(obj)) {
        const otherCollider = obj.getComponent(AbstractColliderComponent);
        if (otherCollider) {
          if (!this.#isNearCollision(otherCollider, 2.5)) {
            this.#eventExit(this.gameObject, obj);
            if (!obj?.hasComponent?.(_RigidbodyComponent))
              this.#eventExit(obj, this.gameObject);
          } else {
            currentCollisions.add(obj);
          }
        } else {
          this.#eventExit(this.gameObject, obj);
          if (!obj?.hasComponent?.(_RigidbodyComponent))
            this.#eventExit(obj, this.gameObject);
        }
      }
    }
  }
  /**
   * Check if two colliders are near each other within tolerance
   * @param {AbstractColliderComponent} other - The other collider
   * @param {number} tolerance - Distance tolerance
   * @returns {boolean} True if objects are within tolerance distance
   */
  #isNearCollision(other, tolerance = 2) {
    const myBounds = this.#_collider.getBounds();
    const otherBounds = other.getBounds();
    return myBounds.x < otherBounds.x + otherBounds.width + tolerance && myBounds.x + myBounds.width + tolerance > otherBounds.x && myBounds.y < otherBounds.y + otherBounds.height + tolerance && myBounds.y + myBounds.height + tolerance > otherBounds.y;
  }
  #eventEnter(gameObject, otherGameObject) {
    const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
    if (selfCol?.isTrigger()) {
      gameObject?.onTriggerEnter?.(otherGameObject);
    } else {
      gameObject?.onCollisionEnter?.(otherGameObject);
    }
  }
  #eventStay(gameObject, otherGameObject) {
    const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
    if (selfCol?.isTrigger()) {
      gameObject?.onTriggerStay?.(otherGameObject);
    } else {
      gameObject?.onCollisionStay?.(otherGameObject);
    }
  }
  #eventExit(gameObject, otherGameObject) {
    const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
    if (selfCol?.isTrigger()) {
      gameObject?.onTriggerExit?.(otherGameObject);
    } else {
      gameObject?.onCollisionExit?.(otherGameObject);
    }
  }
  /**
   * Directly moves the GameObject without collision checking.
   * @param {number|Vector2} dx - The change in x position or Vector2 movement.
   * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
   */
  _doMove(dx, dy) {
    if (dx instanceof Vector2) {
      this.gameObject.translate(dx);
    } else {
      this.gameObject.translate(dx, dy);
    }
  }
};

// src/extensions/movement/MovementController.js
var MovementComponent = class extends Component {
  rigidbody;
  constructor(speed = 100) {
    super();
    this.speed = speed;
  }
  start() {
    this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
    if (!this.rigidbody) {
      console.warn("MovementComponent requires RigidbodyComponent to function properly.");
    }
  }
  update() {
    const movement = new Vector2(0, 0);
    if (Input.isKeyDown("ArrowRight") || Input.isKeyDown("d") || Input.isKeyDown("D")) movement.x += this.speed * Time.deltaTime;
    if (Input.isKeyDown("ArrowLeft") || Input.isKeyDown("a") || Input.isKeyDown("A")) movement.x -= this.speed * Time.deltaTime;
    if (Input.isKeyDown("ArrowDown") || Input.isKeyDown("s") || Input.isKeyDown("S")) movement.y += this.speed * Time.deltaTime;
    if (Input.isKeyDown("ArrowUp") || Input.isKeyDown("w") || Input.isKeyDown("W")) movement.y -= this.speed * Time.deltaTime;
    if (movement.magnitude > 0) {
      this.rigidbody.move(movement);
    }
  }
};
var MovementController = class extends MovementComponent {
};

// src/renderer/Sprite.js
var Sprite = class {
  /**
   * Creates a new Sprite instance.
   * 
   * @param {HTMLImageElement} image - The source image element
   * @param {number} x - The x coordinate of the sprite region in the source image
   * @param {number} y - The y coordinate of the sprite region in the source image
   * @param {number} width - The width of the sprite region
   * @param {number} height - The height of the sprite region
   */
  constructor(image, x, y, width, height) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isLoaded = true;
  }
  /**
   * Draws the sprite on the canvas with optional rotation.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} drawX - The x coordinate to draw the sprite at
   * @param {number} drawY - The y coordinate to draw the sprite at
   * @param {number} [drawWidth] - Optional width to scale the sprite to
   * @param {number} [drawHeight] - Optional height to scale the sprite to
   * @param {number} [rotation=0] - Rotation in radians
   */
  draw(ctx, drawX, drawY, drawWidth, drawHeight, rotation = 0) {
    if (!this.image) return;
    const finalWidth = drawWidth || this.width;
    const finalHeight = drawHeight || this.height;
    ctx.save();
    if (rotation !== 0) {
      ctx.translate(drawX + finalWidth / 2, drawY + finalHeight / 2);
      ctx.rotate(rotation);
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.height,
        -finalWidth / 2,
        -finalHeight / 2,
        finalWidth,
        finalHeight
      );
    } else {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.height,
        drawX,
        drawY,
        finalWidth,
        finalHeight
      );
    }
    ctx.restore();
  }
};

// src/asset/SpriteAsset.js
var SpriteAsset = class _SpriteAsset {
  /**
   * Create a new sprite asset and automatically register it
   * @param {string} name - Name to register the sprite under (cannot contain colons)
   * @param {string} imagePath - Path to the sprite image
   * @param {Object} [config] - Optional configuration
   * @param {number} [config.width] - Override width
   * @param {number} [config.height] - Override height
   * @param {number} [config.pivotX=0.5] - Pivot point X (0-1)
   * @param {number} [config.pivotY=0.5] - Pivot point Y (0-1)
   */
  constructor(name, imagePath, config = {}) {
    if (name.includes(":")) {
      throw new Error(`SpriteAsset name "${name}" cannot contain colons. Colons are reserved for spritesheet sprite notation (e.g., "sheet:sprite").`);
    }
    this.name = name;
    this.imagePath = imagePath;
    this.image = null;
    this.isLoaded = false;
    this.width = config.width || null;
    this.height = config.height || null;
    this.pivotX = config.pivotX || 0.5;
    this.pivotY = config.pivotY || 0.5;
    this.#_registerSelf();
    this.load();
  }
  /**
   * Automatically register this sprite asset
   * @private
   */
  #_registerSelf() {
    SpriteRegistry._addSprite(this.name, this);
  }
  /**
   * Load the sprite image
   * @returns {Promise} Promise that resolves when image is loaded
   */
  load() {
    return new Promise((resolve, reject) => {
      this.image = new Image();
      this.image.onload = () => {
        this.isLoaded = true;
        if (!this.width) this.width = this.image.width;
        if (!this.height) this.height = this.image.height;
        resolve(this);
      };
      this.image.onerror = reject;
      this.image.src = this.imagePath;
    });
  }
  /**
   * Draw the sprite to a canvas context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position to draw at
   * @param {number} y - Y position to draw at
   * @param {number} [width] - Width to draw (defaults to sprite width)
   * @param {number} [height] - Height to draw (defaults to sprite height)
   * @param {number} [rotation=0] - Rotation in radians
   * @param {number} [scaleX=1] - X scale factor
   * @param {number} [scaleY=1] - Y scale factor
   */
  draw(ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) {
    if (!this.isLoaded) return;
    const drawWidth = width || this.width;
    const drawHeight = height || this.height;
    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);
    const offsetX = -drawWidth * this.pivotX;
    const offsetY = -drawHeight * this.pivotY;
    ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }
  /**
   * Get sprite bounds for collision detection
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} [width] - Width override
   * @param {number} [height] - Height override
   * @returns {Object} Bounds object with x, y, width, height
   */
  getBounds(x, y, width, height) {
    const w = width || this.width;
    const h = height || this.height;
    return {
      x: x - w * this.pivotX,
      y: y - h * this.pivotY,
      width: w,
      height: h
    };
  }
  /**
   * Clone this sprite asset with different configuration
   * @param {Object} [newConfig] - New configuration options
   * @returns {SpriteAsset} New sprite asset instance
   */
  clone(newConfig = {}) {
    const config = {
      width: this.width,
      height: this.height,
      pivotX: this.pivotX,
      pivotY: this.pivotY,
      ...newConfig
    };
    return new _SpriteAsset(this.imagePath, config);
  }
};

// src/asset/SpritesheetAsset.js
var SpritesheetAsset = class {
  /**
   * Create a new spritesheet asset and automatically register it
   * @param {string} name - Name to register the spritesheet under (cannot contain colons)
   * @param {string} imagePath - Path to the spritesheet image
   * @param {Object} spriteData - Configuration for individual sprites
   * @param {number} [spriteData.spriteWidth] - Width of each sprite (for grid-based)
   * @param {number} [spriteData.spriteHeight] - Height of each sprite (for grid-based)
   * @param {number} [spriteData.columns] - Number of columns in the sheet (for grid-based)
   * @param {number} [spriteData.rows] - Number of rows in the sheet (for grid-based)
   * @param {Array} [spriteData.sprites] - Array of pixel coordinate-based sprite definitions: 
   *                                        [{name, startX, startY, endX, endY}, ...]
   * @param {Object} [spriteData.namedSprites] - Object of named sprite definitions (legacy support)
   */
  constructor(name, imagePath, spriteData) {
    if (name.includes(":")) {
      throw new Error(`SpritesheetAsset name "${name}" cannot contain colons. Colons are reserved for sprite notation within sheets.`);
    }
    this.name = name;
    this.imagePath = imagePath;
    this.spriteData = spriteData;
    this.image = null;
    this.isLoaded = false;
    this.sprites = /* @__PURE__ */ new Map();
    this.generateSprites();
    this._registerSelf();
    this.load();
  }
  /**
   * Automatically register this spritesheet asset and its individual sprites
   * @private
   */
  _registerSelf() {
    SpriteRegistry._addSpritesheet(this.name, this);
    this._registerIndividualSprites();
  }
  /**
   * Load the spritesheet image
   * @returns {Promise} Promise that resolves when image is loaded
   */
  load() {
    return new Promise((resolve, reject) => {
      this.image = new Image();
      this.image.onload = () => {
        this.isLoaded = true;
        this._updateSpriteWrappers();
        resolve(this);
      };
      this.image.onerror = reject;
      this.image.src = this.imagePath;
    });
  }
  /**
   * Generate sprite definitions from the spritesheet and register them in the unified registry
   * Supports both grid-based and pixel coordinate-based sprite definitions
   * @private
   */
  generateSprites() {
    const { spriteWidth, spriteHeight, columns, rows, sprites, namedSprites } = this.spriteData;
    if (columns != null && rows != null && spriteWidth != null && spriteHeight != null) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          const spriteName = `sprite_${index}`;
          const spriteConfig = {
            x: col * spriteWidth,
            y: row * spriteHeight,
            width: spriteWidth,
            height: spriteHeight
          };
          this.sprites.set(spriteName, spriteConfig);
        }
      }
    }
    if (sprites != null && Array.isArray(sprites)) {
      sprites.forEach((sprite) => {
        if (sprite.name && sprite.startX != null && sprite.startY != null && sprite.endX != null && sprite.endY != null) {
          const spriteConfig = {
            x: sprite.startX,
            y: sprite.startY,
            width: sprite.endX - sprite.startX,
            height: sprite.endY - sprite.startY
          };
          this.sprites.set(sprite.name, spriteConfig);
        } else {
          console.warn(`Invalid sprite definition in "${this.name}":`, sprite);
        }
      });
    }
    if (namedSprites != null && typeof namedSprites === "object" && !Array.isArray(namedSprites)) {
      Object.entries(namedSprites).forEach(([name, config]) => {
        this.sprites.set(name, config);
      });
    }
  }
  /**
   * Update sprite wrappers after image loads
   * @private
   */
  _updateSpriteWrappers() {
    for (const spriteName of this.sprites.keys()) {
      const unifiedKey = `${this.name}:${spriteName}`;
      const spriteWrapper = SpriteRegistry.getSprite(unifiedKey);
      if (spriteWrapper) {
        spriteWrapper.image = this.image;
        spriteWrapper.isLoaded = this.isLoaded;
      }
    }
  }
  /**
   * Register individual sprites in the unified SpriteRegistry using colon notation
   * @private
   */
  _registerIndividualSprites() {
    for (const spriteName of this.sprites.keys()) {
      const unifiedKey = `${this.name}:${spriteName}`;
      SpriteRegistry._addSprite(unifiedKey, this._createSpriteWrapper(spriteName));
    }
  }
  /**
   * Create a sprite wrapper that acts like a SpriteAsset for individual spritesheet sprites
   * @param {string} spriteName - Name of the sprite within the sheet
   * @returns {Object} Sprite wrapper object
   * @private
   */
  _createSpriteWrapper(spriteName) {
    const spriteConfig = this.sprites.get(spriteName);
    if (!spriteConfig) return null;
    return {
      name: `${this.name}:${spriteName}`,
      image: this.image,
      // Will be null initially, updated when image loads
      isLoaded: this.isLoaded,
      // Will be false initially, updated when image loads
      width: spriteConfig.width,
      height: spriteConfig.height,
      pivotX: 0.5,
      // Default pivot for spritesheet sprites
      pivotY: 0.5,
      sourceX: spriteConfig.x,
      sourceY: spriteConfig.y,
      sourceWidth: spriteConfig.width,
      sourceHeight: spriteConfig.height,
      // Draw method for individual sprite from sheet
      draw: (ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) => {
        if (!this.isLoaded || !this.image) return;
        const drawWidth = width || spriteConfig.width;
        const drawHeight = height || spriteConfig.height;
        ctx.save();
        ctx.translate(x, y);
        if (rotation !== 0) ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        const offsetX = -drawWidth * 0.5;
        const offsetY = -drawHeight * 0.5;
        ctx.drawImage(
          this.image,
          spriteConfig.x,
          spriteConfig.y,
          spriteConfig.width,
          spriteConfig.height,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      },
      // Get bounds method for collision detection
      getBounds: (x, y, width, height) => {
        const w = width || spriteConfig.width;
        const h = height || spriteConfig.height;
        return {
          x: x - w * 0.5,
          y: y - h * 0.5,
          width: w,
          height: h
        };
      }
    };
  }
  /**
   * Get a specific sprite from the sheet
   * @param {string} spriteName - Name or index of the sprite
   * @returns {Object|null} Sprite configuration object
   */
  getSprite(spriteName) {
    return this.sprites.get(spriteName) || null;
  }
  /**
   * Get all available sprite names
   * @returns {Array<string>} Array of sprite names
   */
  getSpriteNames() {
    return Array.from(this.sprites.keys());
  }
  /**
   * Draw a specific sprite to a canvas context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} spriteName - Name of the sprite to draw
   * @param {number} x - X position to draw at
   * @param {number} y - Y position to draw at
   * @param {number} [width] - Width to draw (defaults to sprite width)
   * @param {number} [height] - Height to draw (defaults to sprite height)
   */
  drawSprite(ctx, spriteName, x, y, width, height) {
    if (!this.isLoaded) return;
    const sprite = this.getSprite(spriteName);
    if (!sprite) return;
    const drawWidth = width || sprite.width;
    const drawHeight = height || sprite.height;
    ctx.drawImage(
      this.image,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      x,
      y,
      drawWidth,
      drawHeight
    );
  }
};

// src/renderer/components/ImageComponent.js
var ImageComponent = class extends Component {
  /**
   * @param {string} src - The source URL of the image to be loaded.
   * @param {number} [width] - Optional width to draw the image.
   * @param {number} [height] - Optional height to draw the image.
   */
  constructor(src, width = null, height = null) {
    super();
    this.src = src;
    this.image = null;
    this.width = width;
    this.height = height;
  }
  /**
   * Preloads the image from the source URL.
   * 
   * @returns {Promise<void>} A promise that resolves when the image is loaded.
   */
  async preload() {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = this.src;
      img.onload = () => {
        this.image = img;
        if (this.width === null) this.width = img.width;
        if (this.height === null) this.height = img.height;
        resolve();
      };
    });
  }
  /**
   * Draws the image on the canvas at the GameObject's global position with rotation support.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
   */
  draw(ctx) {
    if (this.image) {
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      ctx.save();
      ctx.translate(position.x, position.y);
      if (rotation !== 0) {
        ctx.rotate(rotation);
      }
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }
  /**
   * Draws gizmos for the image component bounds.
   * Shows the image's bounding box and center point for debugging.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __internalGizmos(ctx) {
    if (!this.image) return;
    const position = this.gameObject.getGlobalPosition();
    const rotation = this.gameObject.getGlobalRotation();
    ctx.save();
    ctx.translate(position.x, position.y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.strokeStyle = "#FF00FF";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.setLineDash([]);
    ctx.fillStyle = "#FF00FF";
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#FF00FF";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    const filename = this.src.split("/").pop();
    ctx.fillText(filename, 0, -this.height / 2 - 8);
    ctx.fillText(`${this.width}x${this.height}`, 0, this.height / 2 + 15);
    ctx.restore();
  }
};

// src/renderer/components/ShapeComponent.js
var ShapeComponent = class extends Component {
  /**
   * Creates a new ShapeComponent.
   * 
   * @param {string} shape - Type of shape to render ("rectangle", "circle", "ellipse", "line", "triangle", "polygon")
   * @param {Object} [options={ width:10, height:10, color:'white' }] - Shape-specific rendering options
   * @param {number} [options.width=10] - Width for rectangles
   * @param {number} [options.height=10] - Height for rectangles
   * @param {string} [options.color='white'] - Fill color for the shape
   * @param {number} [options.radius=10] - Radius for circles
   * @param {number} [options.radiusX=10] - X radius for ellipses
   * @param {number} [options.radiusY=5] - Y radius for ellipses
   * @param {number} [options.x2] - End X coordinate for lines
   * @param {number} [options.y2] - End Y coordinate for lines
   * @param {number} [options.size=20] - Size for triangles
   * @param {Array<{x: number, y: number}>} [options.points=[]] - Points for polygons
   */
  constructor(shape, options = { width: 10, height: 10, color: "white" }) {
    super();
    this.shape = shape;
    this.options = options;
  }
  // Getter and setter methods for easy property access
  get color() {
    return this.options.color || "black";
  }
  set color(color) {
    this.options.color = color;
  }
  get width() {
    return this.options.width || 10;
  }
  set width(width) {
    this.options.width = width;
  }
  get height() {
    return this.options.height || 10;
  }
  set height(height) {
    this.options.height = height;
  }
  get radius() {
    return this.options.radius || 10;
  }
  set radius(radius) {
    this.options.radius = radius;
  }
  get radiusX() {
    return this.options.radiusX || 10;
  }
  set radiusX(radiusX) {
    this.options.radiusX = radiusX;
  }
  get radiusY() {
    return this.options.radiusY || 5;
  }
  set radiusY(radiusY) {
    this.options.radiusY = radiusY;
  }
  get points() {
    return this.options.points || [];
  }
  set points(points) {
    this.options.points = points;
  }
  get x2() {
    return this.options.x2 || 10;
  }
  set x2(x2) {
    this.options.x2 = x2;
  }
  get y2() {
    return this.options.y2 || 0;
  }
  set y2(y2) {
    this.options.y2 = y2;
  }
  get size() {
    return this.options.size || 20;
  }
  set size(size) {
    this.options.size = size;
  }
  /**
   * Draws the shape on the canvas. Called automatically during the render phase.
   * 
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __draw(ctx) {
    const position = this.gameObject.getGlobalPosition();
    const rotation = this.gameObject.getGlobalRotation();
    ctx.save();
    if (rotation !== 0) {
      ctx.translate(position.x, position.y);
      ctx.rotate(rotation);
      this.drawShape(ctx, 0, 0);
    } else {
      this.drawShape(ctx, position.x, position.y);
    }
    ctx.restore();
  }
  /**
   * Draws the actual shape based on the type.
   * @private
   */
  drawShape(ctx, x, y) {
    switch (this.shape) {
      case "rectangle":
      case "square":
        this.drawRect(ctx, x, y);
        break;
      case "circle":
        this.drawCircle(ctx, x, y);
        break;
      case "ellipse":
        this.drawEllipse(ctx, x, y);
        break;
      case "line":
        this.drawLine(ctx, x, y);
        break;
      case "triangle":
        this.drawTriangle(ctx, x, y);
        break;
      case "polygon":
        this.drawPolygon(ctx, x, y);
        break;
      default:
        this.drawRect(ctx, x, y);
        break;
    }
  }
  /**
   * Draws a rectangle.
   * @private
   */
  drawRect(ctx, x, y) {
    const { width = 10, height = 10, color = "black" } = this.options;
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
  }
  /**
   * Draws a circle.
   * @private
   */
  drawCircle(ctx, x, y) {
    const { radius = 10, color = "black" } = this.options;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  /**
   * Draws an ellipse.
   * @private
   */
  drawEllipse(ctx, x, y) {
    const { radiusX = 10, radiusY = 5, color = "black" } = this.options;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  /**
   * Draws a line.
   * @private
   */
  drawLine(ctx, x, y) {
    const { x2 = x + 10, y2 = y, color = "black", width = 2 } = this.options;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  /**
   * Draws a triangle.
   * @private
   */
  drawTriangle(ctx, x, y) {
    const { size = 20, color = "black" } = this.options;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size / 2, y - size);
    ctx.closePath();
    ctx.fill();
  }
  /**
   * Draws a polygon from an array of points.
   * @private
   */
  drawPolygon(ctx, x, y) {
    const { points = [], color = "black" } = this.options;
    if (points.length < 3) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + points[0][0], y + points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(x + points[i][0], y + points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }
  /**
   * Draws gizmos for shape visualization
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw with
   * @private
   */
  __internalGizmos(ctx) {
    if (!this.gameObject) return;
    const position = this.gameObject.getGlobalPosition();
    const rotation = this.gameObject.getGlobalRotation();
    ctx.save();
    ctx.translate(position.x, position.y);
    if (rotation !== 0) ctx.rotate(rotation);
    ctx.strokeStyle = "#FF00FF";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 2]);
    const { shape, size = 10, width = 10, height = 10 } = this.options;
    switch (shape) {
      case "rectangle":
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "triangle":
        const triangleHeight = size;
        ctx.beginPath();
        ctx.moveTo(0, -triangleHeight / 2);
        ctx.lineTo(-size / 2, triangleHeight / 2);
        ctx.lineTo(size / 2, triangleHeight / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case "polygon":
        const { points = [] } = this.options;
        if (points.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
          }
          ctx.closePath();
          ctx.stroke();
        }
        break;
    }
    ctx.setLineDash([]);
    ctx.fillStyle = "#FF00FF";
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#FF00FF";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Shape: ${shape || "none"}`, 0, -Math.max(size, height) / 2 - 8);
    let sizeText = "";
    switch (shape) {
      case "rectangle":
        sizeText = `${width}x${height}`;
        break;
      case "circle":
        sizeText = `r:${size}`;
        break;
      case "triangle":
        sizeText = `s:${size}`;
        break;
      case "polygon":
        sizeText = `${this.options.points?.length || 0} pts`;
        break;
    }
    if (sizeText) {
      ctx.fillText(sizeText, 0, Math.max(size, height) / 2 + 15);
    }
    ctx.restore();
  }
};

// src/physics/components/CircleColliderComponent.js
var CircleColliderComponent = class _CircleColliderComponent extends AbstractColliderComponent {
  /**
   * Creates a new CircleColliderComponent.
   * 
   * @param {number} [radius=null] - Radius of the collider in pixels. If null, uses sprite width/2
   * @param {boolean} [trigger=false] - Whether this collider acts as a trigger (no physics response)
   */
  constructor(radius = null, trigger = false) {
    super();
    this.radius = radius;
    this.trigger = trigger;
  }
  /**
   * Checks collision with another collider component.
   * 
   * @param {AbstractColliderComponent} other - The other collider to check against
   * @returns {boolean} True if colliding, false otherwise
   */
  checkCollisionWith(other) {
    if (other instanceof _CircleColliderComponent) {
      const a = this.getBounds();
      const b = other.getBounds();
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      return distance < a.radius + b.radius;
    } else {
      return this.circleBoxCollision(other);
    }
  }
  /**
   * Performs circle-box collision detection.
   * 
   * @param {BoxColliderComponent} box - The box collider to check against
   * @returns {boolean} True if colliding, false otherwise
   */
  circleBoxCollision(box) {
    const circle = this.getBounds();
    const b = box.getBounds();
    const closestX = Math.max(b.x, Math.min(circle.x, b.x + b.width));
    const closestY = Math.max(b.y, Math.min(circle.y, b.y + b.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
  }
  /**
   * Gets the bounds of this collider for collision detection.
   * 
   * @returns {Object} Bounds object with x, y, and radius properties
   */
  getBounds() {
    const position = this.gameObject.getGlobalPosition();
    let r = this.radius;
    return { x: position.x, y: position.y, radius: r };
  }
  /**
   * Draws gizmos for the circle collider bounds.
   * This method is called automatically by the engine for debugging visualization.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __internalGizmos(ctx) {
    const bounds = this.getBounds();
    ctx.save();
    ctx.strokeStyle = this.trigger ? "#00ffddff" : "#00FF00";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(bounds.x, bounds.y, bounds.radius, 0, Math.PI * 2);
    ctx.stroke();
    const crossSize = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(bounds.x - crossSize, bounds.y);
    ctx.lineTo(bounds.x + crossSize, bounds.y);
    ctx.moveTo(bounds.x, bounds.y - crossSize);
    ctx.lineTo(bounds.x, bounds.y + crossSize);
    ctx.stroke();
    ctx.restore();
  }
};

// src/physics/components/BoxColliderComponent.js
var BoxColliderComponent = class _BoxColliderComponent extends AbstractColliderComponent {
  constructor(width = null, height = null, trigger = false) {
    super();
    this.width = width;
    this.height = height;
    this.trigger = trigger;
  }
  checkCollisionWith(other) {
    if (other instanceof _BoxColliderComponent) {
      return this.checkBoxBoxCollision(other);
    } else if (other instanceof CircleColliderComponent) {
      return other.checkCollisionWith(this);
    }
    return false;
  }
  checkBoxBoxCollision(other) {
    const a = this.getBounds();
    const b = other.getBounds();
    const tolerance = 0.01;
    return a.x < b.x + b.width + tolerance && a.x + a.width + tolerance > b.x && a.y < b.y + b.height + tolerance && a.y + a.height + tolerance > b.y;
  }
  getBounds() {
    const position = this.gameObject.getGlobalPosition();
    let w = this.width;
    let h = this.height;
    return {
      x: position.x - w / 2,
      y: position.y - h / 2,
      width: w,
      height: h
    };
  }
  /**
   * Draws gizmos for the box collider bounds.
   * This method is called automatically by the engine for debugging visualization.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  __internalGizmos(ctx) {
    const bounds = this.getBounds();
    ctx.save();
    ctx.strokeStyle = this.trigger ? "#00ffddff" : "#00FF00";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const crossSize = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(centerX - crossSize, centerY);
    ctx.lineTo(centerX + crossSize, centerY);
    ctx.moveTo(centerX, centerY - crossSize);
    ctx.lineTo(centerX, centerY + crossSize);
    ctx.stroke();
    ctx.restore();
  }
};

// src/math/Random.js
var Random = class {
  /**
   * Generates a random number between min and max (inclusive).
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random number between min and max.
   */
  static range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

// src/math/Vector3.js
var Vector3 = class _Vector3 {
  /**
   * Creates a new Vector3.
   * @param {number} x - The x component (default: 0)
   * @param {number} y - The y component (default: 0)
   * @param {number} z - The z component (default: 0)
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // Static constants
  static get zero() {
    return new _Vector3(0, 0, 0);
  }
  static get one() {
    return new _Vector3(1, 1, 1);
  }
  static get up() {
    return new _Vector3(0, 1, 0);
  }
  static get down() {
    return new _Vector3(0, -1, 0);
  }
  static get left() {
    return new _Vector3(-1, 0, 0);
  }
  static get right() {
    return new _Vector3(1, 0, 0);
  }
  static get forward() {
    return new _Vector3(0, 0, 1);
  }
  static get back() {
    return new _Vector3(0, 0, -1);
  }
  static get positiveInfinity() {
    return new _Vector3(Infinity, Infinity, Infinity);
  }
  static get negativeInfinity() {
    return new _Vector3(-Infinity, -Infinity, -Infinity);
  }
  /**
   * Gets the magnitude (length) of this vector.
   * @returns {number} The magnitude of the vector
   */
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * Gets the squared magnitude of this vector (faster than magnitude).
   * @returns {number} The squared magnitude of the vector
   */
  get sqrMagnitude() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Gets the normalized version of this vector.
   * @returns {Vector3} A normalized copy of this vector
   */
  get normalized() {
    const mag = this.magnitude;
    if (mag === 0) return _Vector3.zero;
    return new _Vector3(this.x / mag, this.y / mag, this.z / mag);
  }
  /**
   * Adds another vector to this vector.
   * @param {Vector3} other - The vector to add
   * @returns {Vector3} A new vector representing the sum
   */
  add(other) {
    return new _Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  /**
   * Subtracts another vector from this vector.
   * @param {Vector3} other - The vector to subtract
   * @returns {Vector3} A new vector representing the difference
   */
  subtract(other) {
    return new _Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  /**
   * Multiplies this vector by a scalar.
   * @param {number} scalar - The scalar to multiply by
   * @returns {Vector3} A new vector representing the product
   */
  multiply(scalar) {
    return new _Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }
  /**
   * Divides this vector by a scalar.
   * @param {number} scalar - The scalar to divide by
   * @returns {Vector3} A new vector representing the quotient
   */
  divide(scalar) {
    if (scalar === 0) throw new Error("Cannot divide by zero");
    return new _Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }
  /**
   * Normalizes this vector in place.
   * @returns {Vector3} This vector for chaining
   */
  normalize() {
    const mag = this.magnitude;
    if (mag === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      this.x /= mag;
      this.y /= mag;
      this.z /= mag;
    }
    return this;
  }
  /**
   * Sets the components of this vector.
   * @param {number} x - The new x component
   * @param {number} y - The new y component
   * @param {number} z - The new z component
   * @returns {Vector3} This vector for chaining
   */
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  /**
   * Creates a copy of this vector.
   * @returns {Vector3} A new vector with the same components
   */
  clone() {
    return new _Vector3(this.x, this.y, this.z);
  }
  /**
   * Checks if this vector equals another vector.
   * @param {Vector3} other - The vector to compare to
   * @returns {boolean} True if vectors are equal
   */
  equals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
  /**
   * Returns a string representation of this vector.
   * @returns {string} String representation
   */
  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
  }
  // Static methods
  /**
   * Calculates the dot product of two vectors.
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {number} The dot product
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /**
   * Calculates the cross product of two vectors.
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {Vector3} The cross product
   */
  static cross(a, b) {
    return new _Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
  /**
   * Calculates the distance between two vectors.
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {number} The distance between the vectors
   */
  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  /**
   * Calculates the squared distance between two vectors (faster than distance).
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {number} The squared distance between the vectors
   */
  static sqrDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }
  /**
   * Linearly interpolates between two vectors.
   * @param {Vector3} a - Start vector
   * @param {Vector3} b - End vector
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Vector3} Interpolated vector
   */
  static lerp(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    return new _Vector3(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t
    );
  }
  /**
   * Linearly interpolates between two vectors without clamping t.
   * @param {Vector3} a - Start vector
   * @param {Vector3} b - End vector
   * @param {number} t - Interpolation factor
   * @returns {Vector3} Interpolated vector
   */
  static lerpUnclamped(a, b, t) {
    return new _Vector3(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t
    );
  }
  /**
   * Spherically interpolates between two vectors.
   * @param {Vector3} a - Start vector
   * @param {Vector3} b - End vector
   * @param {number} t - Interpolation factor (0-1)
   * @returns {Vector3} Spherically interpolated vector
   */
  static slerp(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    const dot = _Vector3.dot(a.normalized, b.normalized);
    const clampedDot = Math.max(-1, Math.min(1, dot));
    if (Math.abs(clampedDot) > 0.9995) {
      return _Vector3.lerp(a, b, t);
    }
    const theta = Math.acos(Math.abs(clampedDot));
    const sinTheta = Math.sin(theta);
    const factorA = Math.sin((1 - t) * theta) / sinTheta;
    const factorB = Math.sin(t * theta) / sinTheta;
    if (clampedDot < 0) {
      return new _Vector3(
        factorA * a.x - factorB * b.x,
        factorA * a.y - factorB * b.y,
        factorA * a.z - factorB * b.z
      );
    }
    return new _Vector3(
      factorA * a.x + factorB * b.x,
      factorA * a.y + factorB * b.y,
      factorA * a.z + factorB * b.z
    );
  }
  /**
   * Returns a vector with the minimum components of two vectors.
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {Vector3} Vector with minimum components
   */
  static min(a, b) {
    return new _Vector3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  }
  /**
   * Returns a vector with the maximum components of two vectors.
   * @param {Vector3} a - First vector
   * @param {Vector3} b - Second vector
   * @returns {Vector3} Vector with maximum components
   */
  static max(a, b) {
    return new _Vector3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
  }
  /**
   * Moves a point towards a target.
   * @param {Vector3} current - Current position
   * @param {Vector3} target - Target position
   * @param {number} maxDistanceDelta - Maximum distance to move
   * @returns {Vector3} New position
   */
  static moveTowards(current, target, maxDistanceDelta) {
    const diff = target.subtract(current);
    const distance = diff.magnitude;
    if (distance <= maxDistanceDelta || distance === 0) {
      return target.clone();
    }
    return current.add(diff.divide(distance).multiply(maxDistanceDelta));
  }
  /**
   * Reflects a vector off a plane defined by a normal.
   * @param {Vector3} inDirection - The direction vector to reflect
   * @param {Vector3} inNormal - The normal of the surface
   * @returns {Vector3} The reflected vector
   */
  static reflect(inDirection, inNormal) {
    const factor = -2 * _Vector3.dot(inNormal, inDirection);
    return new _Vector3(
      factor * inNormal.x + inDirection.x,
      factor * inNormal.y + inDirection.y,
      factor * inNormal.z + inDirection.z
    );
  }
  /**
   * Returns the angle in radians between two vectors.
   * @param {Vector3} from - First vector
   * @param {Vector3} to - Second vector
   * @returns {number} Angle in radians
   */
  static angle(from, to) {
    const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
    if (denominator < 1e-15) return 0;
    const dot = Math.max(-1, Math.min(1, _Vector3.dot(from, to) / denominator));
    return Math.acos(dot);
  }
  /**
   * Projects a vector onto another vector.
   * @param {Vector3} vector - The vector to project
   * @param {Vector3} onNormal - The vector to project onto
   * @returns {Vector3} The projected vector
   */
  static project(vector, onNormal) {
    const sqrMag = onNormal.sqrMagnitude;
    if (sqrMag < 1e-15) return _Vector3.zero;
    const dot = _Vector3.dot(vector, onNormal);
    return onNormal.multiply(dot / sqrMag);
  }
  /**
   * Projects a vector onto a plane defined by a normal.
   * @param {Vector3} vector - The vector to project
   * @param {Vector3} planeNormal - The normal of the plane
   * @returns {Vector3} The projected vector
   */
  static projectOnPlane(vector, planeNormal) {
    const sqrMag = planeNormal.sqrMagnitude;
    if (sqrMag < 1e-15) return vector.clone();
    const dot = _Vector3.dot(vector, planeNormal);
    return vector.subtract(planeNormal.multiply(dot / sqrMag));
  }
  /**
   * Clamps the magnitude of a vector to a maximum length.
   * @param {Vector3} vector - The vector to clamp
   * @param {number} maxLength - The maximum length
   * @returns {Vector3} The clamped vector
   */
  static clampMagnitude(vector, maxLength) {
    const sqrMagnitude = vector.sqrMagnitude;
    if (sqrMagnitude > maxLength * maxLength) {
      const mag = Math.sqrt(sqrMagnitude);
      const normalizedX = vector.x / mag;
      const normalizedY = vector.y / mag;
      const normalizedZ = vector.z / mag;
      return new _Vector3(normalizedX * maxLength, normalizedY * maxLength, normalizedZ * maxLength);
    }
    return vector.clone();
  }
  /**
   * Rotates a vector towards another vector.
   * @param {Vector3} current - Current direction
   * @param {Vector3} target - Target direction
   * @param {number} maxRadiansDelta - Maximum rotation in radians
   * @param {number} maxMagnitudeDelta - Maximum magnitude change
   * @returns {Vector3} The rotated vector
   */
  static rotateTowards(current, target, maxRadiansDelta, maxMagnitudeDelta) {
    const currentMag = current.magnitude;
    const targetMag = target.magnitude;
    if (currentMag > 1e-15 && targetMag > 1e-15) {
      const currentNorm = current.divide(currentMag);
      const targetNorm = target.divide(targetMag);
      const angle = _Vector3.angle(currentNorm, targetNorm);
      if (angle > 1e-15) {
        const t = Math.min(1, maxRadiansDelta / angle);
        const newDirection = _Vector3.slerp(currentNorm, targetNorm, t);
        const newMagnitude2 = currentMag + Math.max(-maxMagnitudeDelta, Math.min(maxMagnitudeDelta, targetMag - currentMag));
        return newDirection.multiply(newMagnitude2);
      }
    }
    const newMagnitude = currentMag + Math.max(-maxMagnitudeDelta, Math.min(maxMagnitudeDelta, targetMag - currentMag));
    return target.normalized.multiply(newMagnitude);
  }
  /**
   * Smoothly damps between vectors.
   * @param {Vector3} current - Current position
   * @param {Vector3} target - Target position
   * @param {Object} currentVelocity - Object with x, y, z velocity components (modified by reference)
   * @param {number} smoothTime - Approximate time to reach target
   * @param {number} maxSpeed - Maximum speed (optional)
   * @param {number} deltaTime - Time since last call
   * @returns {Vector3} Smoothly damped position
   */
  static smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime) {
    smoothTime = Math.max(1e-4, smoothTime);
    const omega = 2 / smoothTime;
    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let changeX = current.x - target.x;
    let changeY = current.y - target.y;
    let changeZ = current.z - target.z;
    const originalTo = target.clone();
    const maxChange = maxSpeed * smoothTime;
    const maxChangeSq = maxChange * maxChange;
    const sqrMag = changeX * changeX + changeY * changeY + changeZ * changeZ;
    if (sqrMag > maxChangeSq) {
      const mag = Math.sqrt(sqrMag);
      changeX = changeX / mag * maxChange;
      changeY = changeY / mag * maxChange;
      changeZ = changeZ / mag * maxChange;
    }
    const targetX = current.x - changeX;
    const targetY = current.y - changeY;
    const targetZ = current.z - changeZ;
    const tempX = (currentVelocity.x + omega * changeX) * deltaTime;
    const tempY = (currentVelocity.y + omega * changeY) * deltaTime;
    const tempZ = (currentVelocity.z + omega * changeZ) * deltaTime;
    currentVelocity.x = (currentVelocity.x - omega * tempX) * exp;
    currentVelocity.y = (currentVelocity.y - omega * tempY) * exp;
    currentVelocity.z = (currentVelocity.z - omega * tempZ) * exp;
    let outputX = targetX + (changeX + tempX) * exp;
    let outputY = targetY + (changeY + tempY) * exp;
    let outputZ = targetZ + (changeZ + tempZ) * exp;
    const origMinusCurrentX = originalTo.x - current.x;
    const origMinusCurrentY = originalTo.y - current.y;
    const origMinusCurrentZ = originalTo.z - current.z;
    const outMinusOrigX = outputX - originalTo.x;
    const outMinusOrigY = outputY - originalTo.y;
    const outMinusOrigZ = outputZ - originalTo.z;
    if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY + origMinusCurrentZ * outMinusOrigZ > 0) {
      outputX = originalTo.x;
      outputY = originalTo.y;
      outputZ = originalTo.z;
      currentVelocity.x = (outputX - originalTo.x) / deltaTime;
      currentVelocity.y = (outputY - originalTo.y) / deltaTime;
      currentVelocity.z = (outputZ - originalTo.z) / deltaTime;
    }
    return new _Vector3(outputX, outputY, outputZ);
  }
  /**
   * Returns an orthonormal basis from a single vector.
   * @param {Vector3} normal - The normal vector (will be normalized)
   * @returns {Object} Object containing {normal, tangent, binormal}
   */
  static orthonormalize(normal) {
    const norm = normal.normalized;
    let tangent;
    if (Math.abs(norm.x) < 0.9) {
      tangent = _Vector3.cross(norm, _Vector3.right).normalized;
    } else {
      tangent = _Vector3.cross(norm, _Vector3.up).normalized;
    }
    const binormal = _Vector3.cross(norm, tangent).normalized;
    return {
      normal: norm,
      tangent,
      binormal
    };
  }
};

// src/extensions/movement/FollowTarget.js
var FollowTarget = class extends Component {
  constructor(target) {
    super();
    this.target = target;
  }
  update() {
    if (!this.target) return;
    if (this.target instanceof Vector2) {
      this.gameObject.setPosition(this.target);
    } else if (this.target.position) {
      this.gameObject.setPosition(this.target.position);
    } else {
      this.gameObject.setPosition(this.target.x, this.target.y);
    }
  }
};
export {
  BoxColliderComponent,
  CameraComponent,
  CircleColliderComponent,
  Component,
  FollowTarget,
  Game,
  GameObject,
  ImageComponent,
  Input,
  Instantiate,
  MovementComponent,
  MovementController,
  Random,
  RigidbodyComponent,
  Scene,
  ShapeComponent,
  Sprite,
  SpriteAnimationClip,
  SpriteAnimationComponent,
  SpriteAsset,
  SpriteRegistry,
  SpriteRendererComponent,
  SpritesheetAsset,
  Time,
  Vector2,
  Vector3
};
