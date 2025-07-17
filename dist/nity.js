var Nity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    BoxColliderComponent: () => BoxColliderComponent,
    CameraComponent: () => CameraComponent,
    CircleColliderComponent: () => CircleColliderComponent,
    Component: () => Component,
    FollowTarget: () => FollowTarget,
    Game: () => Game,
    GameObject: () => GameObject,
    ImageComponent: () => ImageComponent,
    Input: () => Input,
    Instantiate: () => Instantiate,
    MovementComponent: () => MovementComponent,
    Random: () => Random,
    RigidbodyComponent: () => RigidbodyComponent,
    Scene: () => Scene,
    ShapeComponent: () => ShapeComponent,
    Sprite: () => Sprite,
    SpriteAnimationClip: () => SpriteAnimationClip,
    SpriteAnimationComponent: () => SpriteAnimationComponent,
    SpriteAsset: () => SpriteAsset,
    SpriteRegistry: () => SpriteRegistry,
    SpriteRendererComponent: () => SpriteRendererComponent,
    SpritesheetAsset: () => SpritesheetAsset,
    Time: () => Time
  });

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
    }
    __lateStart() {
    }
    __update() {
    }
    __draw(ctx) {
      if (this.enabled && typeof this.draw === "function") {
        this.draw(ctx);
      }
    }
    __preload() {
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

  // src/common/components/CameraComponent.js
  var CameraComponent = class extends Component {
    constructor(canvas, zoom = 1) {
      super();
      this.canvas = canvas;
      this.zoom = zoom;
    }
    applyTransform(ctx) {
      const x = this.gameObject.getGlobalX();
      const y = this.gameObject.getGlobalY();
      ctx.setTransform(
        this.zoom,
        0,
        0,
        this.zoom,
        -x * this.zoom + this.canvas.width / 2,
        -y * this.zoom + this.canvas.height / 2
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
     * @param {number} [x=0] - The initial x-coordinate of the GameObject.
     * @param {number} [y=0] - The initial y-coordinate of the
     *  */
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
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
     * Gets the global x-coordinate of the GameObject.
     * If the GameObject has a parent, it will add the parent's global x-coordinate to its own x-coordinate.
     * @return {number} The global x-coordinate of the GameObject.
     */
    getGlobalX() {
      return this.parent ? this.x + this.parent.getGlobalX() : this.x;
    }
    /**
     * Gets the global y-coordinate of the GameObject.
     * If the GameObject has a parent, it will add the parent's global y-coordinate to its own y-coordinate.
     * @return {number} The global y-coordinate of the GameObject.
     */
    getGlobalY() {
      return this.parent ? this.y + this.parent.getGlobalY() : this.y;
    }
    /**
     * Sets the position of the GameObject.
     * @param {number} x - The new x-coordinate of the GameObject.
     * @param {number} y - The new y-coordinate of the GameObject.
     */
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
      console.log("Instantiate: Registering component:", component.constructor.name);
      if (component instanceof AbstractColliderComponent) {
        console.log("Instantiate: Found collider component, registering...");
        if (CollisionSystem.instance) {
          CollisionSystem.instance.register(component);
          console.log("Collider registered with CollisionSystem:", component, "Total colliders:", CollisionSystem.instance.colliders.size);
        } else {
          console.warn("CollisionSystem not initialized. Collider will be registered when system is available:", component);
          if (!_Instantiate._pendingColliders) {
            _Instantiate._pendingColliders = [];
          }
          _Instantiate._pendingColliders.push(component);
        }
      }
      if (typeof component.start === "function") {
        console.log("Instantiate: Calling start() on component:", component.constructor.name);
        component.start();
      }
    }
    /**
     * Registers any pending colliders that were waiting for CollisionSystem initialization.
     * This should be called after CollisionSystem is created.
     */
    static registerPendingColliders() {
      if (_Instantiate._pendingColliders && CollisionSystem.instance) {
        console.log("Registering pending colliders:", _Instantiate._pendingColliders.length);
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

  // src/core/Game.js
  var Game = class _Game {
    #_forcedpaused = false;
    constructor(canvas) {
      _Game.instance = this;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.scene = null;
      this._lastTime = 0;
      this.mainCamera = null;
      this.paused = false;
      this.#_forcedpaused = false;
      this._deltaTime = 0;
      new CollisionSystem();
      Instantiate.registerPendingColliders();
    }
    launch(scene) {
      if (!scene) throw new Error("No scene assigned to game.");
      this.#_initCanvas();
      this.#_launch(scene);
    }
    async #_launch(scene) {
      await this.loadScene(scene);
      this.start();
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
      this.start();
    }
    start() {
      Input.initialize(this.canvas);
      this.#_initEventListeners();
      requestAnimationFrame(this.loop.bind(this));
    }
    loop(timestamp) {
      this._deltaTime = (timestamp - this._lastTime) / 1e3;
      if (this._deltaTime > 0.1) this._deltaTime = 0.1;
      this._lastTime = timestamp;
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
      requestAnimationFrame(this.loop.bind(this));
    }
    pause() {
      this.paused = true;
    }
    resume() {
      this.paused = false;
    }
    #_forcedPause() {
      if (this.#_forcedpaused === true) return;
      this.#_forcedpaused = true;
      console.log("Game fullscale pause");
    }
    #_forcedResume() {
      if (this.#_forcedpaused === false) return;
      this.#_forcedpaused = false;
      this._lastTime = performance.now();
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
  };
  Game.instance = null;

  // src/core/Time.js
  var Time = class {
    /**
     * Returns the time elapsed since the last frame in seconds.
     * This is useful for creating frame-rate independent animations and movement.
     * 
     * @returns {number} The delta time in seconds
     * 
     * @example
     * // Move an object at 50 pixels per second regardless of frame rate
     * gameObject.x += 50 * Time.deltaTime();
     */
    static deltaTime() {
      return Game.instance._deltaTime;
    }
  };

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
     * @param {string} spriteKey - Unified sprite key ("name" or "sheet:sprite") or legacy assetName
     * @param {string} [spriteName] - Legacy: sprite name for spritesheets (deprecated, use colon notation)
     */
    constructor(spriteKey, spriteName = null) {
      super();
      if (spriteName !== null) {
        console.warn(`SpriteRendererComponent: Two-parameter constructor is deprecated. Use "${spriteKey}:${spriteName}" instead.`);
        this.spriteKey = `${spriteKey}:${spriteName}`;
      } else {
        this.spriteKey = spriteKey;
      }
      this.sprite = null;
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
     * Draws the sprite on the canvas at the GameObject's global position.
     * Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
      if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
      const x = this.gameObject.getGlobalX();
      const y = this.gameObject.getGlobalY();
      this.sprite.draw(ctx, x, y, null, null, this.gameObject.rotation || 0);
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
      this.time += Time.deltaTime();
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
     * @deprecated Use {@link Instantiate.create} instead.
     * Adds an object to the scene.
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
      } else {
        console.log("Empty scene loaded");
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
      this.velocity = { x: 0, y: 0 };
    }
    /**
     * Updates the gravity effect. Called automatically each frame.
     * Increases the Y velocity based on gravity scale and delta time.
     */
    update() {
      if (this.gravity) {
        this.velocity.y += this.gravityScale * Time.deltaTime();
      }
    }
    /**
     * Moves the GameObject by the specified offset.
     * @private
     * 
     * @param {number} dx - X offset
     * @param {number} dy - Y offset
     */
    _doMove(dx, dy) {
      this.gameObject.x += dx;
      this.gameObject.y += dy;
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
      this.move(this.velocity.x * Time.deltaTime(), this.velocity.y * Time.deltaTime());
    }
    /**
     * Moves the GameObject and handles collision resolution.
     * @param {number} dx - The change in x position.
     * @param {number} dy - The change in y position.
     * @returns {boolean} - Returns true if the movement was successful.
     */
    move(dx, dy) {
      if (!this.#_collider) return true;
      const maxSpeed = Math.max(Math.abs(dx), Math.abs(dy));
      const steps = Math.max(1, Math.ceil(maxSpeed / 0.25));
      const stepX = dx / steps;
      const stepY = dy / steps;
      let currentCollisions = /* @__PURE__ */ new Set();
      let resolved = false;
      let totalMoved = { x: 0, y: 0 };
      for (let i = 0; i < steps; i++) {
        const prevX = this.gameObject.x;
        const prevY = this.gameObject.y;
        this._doMove(stepX, stepY);
        totalMoved.x += stepX;
        totalMoved.y += stepY;
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
            this.gameObject.x = prevX;
            this.gameObject.y = prevY;
            if (Math.abs(stepY) > Math.abs(stepX)) {
              this.velocity.y *= -this.bounciness;
            } else {
              this.velocity.x *= -this.bounciness;
            }
            resolved = true;
            break;
          }
        }
        if (resolved) break;
      }
      this.#handleExitEvents(currentCollisions);
      this.#_lastCollisions = currentCollisions;
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
     * @param {number} dx - The change in x position.
     * @param {number} dy - The change in y position.
     */
    _doMove(dx, dy) {
      this.gameObject.x += dx;
      this.gameObject.y += dy;
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
      let dx = 0, dy = 0;
      if (Input.isKeyDown("ArrowRight") || Input.isKeyDown("d") || Input.isKeyDown("D")) dx += this.speed * Time.deltaTime();
      if (Input.isKeyDown("ArrowLeft") || Input.isKeyDown("a") || Input.isKeyDown("A")) dx -= this.speed * Time.deltaTime();
      if (Input.isKeyDown("ArrowDown") || Input.isKeyDown("s") || Input.isKeyDown("S")) dy += this.speed * Time.deltaTime();
      if (Input.isKeyDown("ArrowUp") || Input.isKeyDown("w") || Input.isKeyDown("W")) dy -= this.speed * Time.deltaTime();
      if (dx !== 0 || dy !== 0) {
        this.rigidbody.move(dx, dy);
      }
    }
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
     * @param {number} spriteData.spriteWidth - Width of each sprite
     * @param {number} spriteData.spriteHeight - Height of each sprite
     * @param {number} [spriteData.columns] - Number of columns in the sheet
     * @param {number} [spriteData.rows] - Number of rows in the sheet
     * @param {Object} [spriteData.sprites] - Named sprite definitions
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
     * @private
     */
    generateSprites() {
      const { spriteWidth, spriteHeight, columns, rows, sprites } = this.spriteData;
      if (columns && rows) {
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
      if (sprites) {
        Object.entries(sprites).forEach(([name, config]) => {
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
      console.log(`Registered ${this.sprites.size} sprites from sheet "${this.name}" with colon notation`);
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
     * Draws the image on the canvas at the GameObject's global position.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
      if (this.image) {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
        ctx.drawImage(this.image, x, y, this.width, this.height);
      }
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
      return this.options.x2 || this.gameObject.getGlobalX() + 10;
    }
    set x2(x2) {
      this.options.x2 = x2;
    }
    get y2() {
      return this.options.y2 || this.gameObject.getGlobalY();
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
      const x = this.gameObject.getGlobalX();
      const y = this.gameObject.getGlobalY();
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
      ctx.fillRect(x, y, width, height);
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
      const x = this.gameObject.getGlobalX();
      const y = this.gameObject.getGlobalY();
      let r = this.radius;
      const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
      if (r === null && sprite) {
        r = sprite.width / 2;
      }
      return { x, y, radius: r };
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
      const x = this.gameObject.getGlobalX();
      const y = this.gameObject.getGlobalY();
      let w = this.width;
      let h = this.height;
      const sprite = this.gameObject.getComponent(SpriteRendererComponent)?.sprite;
      if ((w === null || h === null) && sprite) {
        w = w ?? sprite.width;
        h = h ?? sprite.height;
      }
      return { x, y, width: w, height: h };
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

  // src/extensions/movement/FollowTarget.js
  var FollowTarget = class extends Component {
    constructor(target) {
      super();
      this.target = target;
    }
    update() {
      if (!this.target) return;
      this.gameObject.x = this.target.x;
    }
  };
  return __toCommonJS(index_exports);
})();
