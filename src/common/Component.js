import { Game } from '../core/Game.js';

/**
 * Base class for all components in the NityJS engine with comprehensive metadata system.
 * 
 * Component serves as the foundation for all game logic and functionality in the NityJS
 * engine, following Unity's Component-based architecture. Components are attached to
 * GameObjects to provide specific behaviors, rendering capabilities, physics interactions,
 * and other game features through composition rather than inheritance.
 * 
 * **Core Features:**
 * - Unity-compatible lifecycle methods (start, update, lateUpdate, destroy)
 * - Comprehensive metadata system for serialization and configuration
 * - Static factory methods for metadata-driven component creation
 * - Visual debugging support with gizmos system integration
 * - Automatic GameObject reference management
 * - Enable/disable functionality for component control
 * 
 * **Metadata System:**
 * - `.meta(metadata)` - Static factory method for declarative creation
 * - `getDefaultMeta()` - Define component-specific default configuration
 * - `applyMeta(metadata)` - Runtime metadata application and updates
 * - `toMeta()` - Export current state for serialization (implemented in subclasses)
 * - Full validation and type safety for all component properties
 * 
 * **Lifecycle Methods (Unity-compatible):**
 * 1. `constructor()` - Component creation and metadata initialization
 * 2. `preload()` - Async asset loading phase
 * 3. `start()` - Initialization after all components are ready
 * 4. `update()` - Per-frame game logic updates
 * 5. `lateUpdate()` - Post-update logic (cameras, UI, cleanup)
 * 6. `draw()` - Custom rendering logic
 * 7. `destroy()` - Cleanup when component is removed
 * 
 * **Unity Equivalent:** Similar to Unity's MonoBehaviour for component-based architecture
 * 
 * @class Component
 * @abstract Base class - extend to create specific component types
 * 
 * @example
 * // Basic component extension
 * class HealthComponent extends Component {
 *     constructor(maxHealth = 100) {
 *         super();
 *         this.maxHealth = maxHealth;
 *         this.currentHealth = maxHealth;
 *     }
 *     
 *     takeDamage(amount) {
 *         this.currentHealth -= amount;
 *         if (this.currentHealth <= 0) {
 *             Destroy(this.gameObject);
 *         }
 *     }
 * }
 * 
 * @example
 * // Component with metadata support
 * class PlayerController extends Component {
 *     static getDefaultMeta() {
 *         return { speed: 5, jumpHeight: 10 };
 *     }
 *     
 *     update() {
 *         if (Input.getKey("ArrowRight")) {
 *             this.gameObject.position.x += this.speed;
 *         }
 *     }
 * }
 * 
 * @example
 * // Using metadata factory method
 * const fastPlayer = PlayerController.meta({
 *     speed: 10,
 *     jumpHeight: 15
 * });
 * gameObject.addComponent(fastPlayer);
 * 
 * @see {@link GameObject} For component attachment and management
 * @see {@link MonoBehaviour} For Unity-familiar alias class
 */
export class Component {
    /**
     * Creates a new Component with metadata system initialization.
     * 
     * Initializes the component with essential properties and integrates with the
     * comprehensive metadata system. Sets up default values, GameObject reference
     * placeholder, gizmos integration, and processes any constructor arguments
     * through the metadata pipeline for consistent configuration handling.
     * 
     * **Initialization Process:**
     * 1. Sets up core component properties (gameObject, enabled, started state)
     * 2. Configures gizmos integration based on Game instance settings
     * 3. Initializes metadata system with component-specific defaults
     * 4. Processes constructor arguments through metadata pipeline
     * 5. Validates final configuration for type safety
     * 
     * **Properties Initialized:**
     * - `gameObject` - Reference to parent GameObject (set when attached)
     * - `enabled` - Component active state (true by default)
     * - `_started` - Internal lifecycle tracking
     * - `_internalGizmos` - Debug visualization integration
     * - `__meta` - Metadata configuration object
     * 
     * @example
     * // Direct component creation
     * const component = new MyComponent();
     * gameObject.addComponent(component);
     * 
     * @example
     * // Component with constructor arguments
     * class PlayerController extends Component {
     *     constructor(speed = 5) {
     *         super(); // Calls metadata initialization
     *         this.speed = speed;
     *     }
     * }
     * 
     * @example
     * // Metadata-aware component
     * class SpriteComponent extends Component {
     *     constructor(spriteName, options = {}) {
     *         super(); // Metadata system handles args automatically
     *     }
     *     
     *     _applyConstructorArgs(spriteName, options) {
     *         // Called automatically during super()
     *         this.applyMeta({ spriteName, ...options });
     *     }
     * }
     */
    constructor() {
        this.gameObject = null;
        this.enabled = true;
        this._started = false;
        this._internalGizmos = this._internalGizmos || (Game.instance?._internalGizmos ?? false);
        
        // Initialize metadata system - call static method
        this.__meta = this.constructor.getDefaultMeta();
        
        // Apply constructor args if provided
        if (arguments.length > 0) {
            this._applyConstructorArgs(...arguments);
        }
    }

    /**
     * Static method to create component instance from metadata
     * @param {Object} metadata - Component configuration object
     * @returns {Component} - Configured component instance
     */
    static meta(metadata) {
        const instance = new this();
        instance.applyMeta(metadata);
        return instance;
    }

    /**
     * Apply metadata to this component instance
     * @param {Object} metadata - Component configuration object
     */
    applyMeta(metadata) {
        // Merge: defaults < metadata < constructor values (constructor has priority)
        const merged = { ...this.__meta, ...metadata };
        this.__meta = merged;
        this._updatePropertiesFromMeta();
        this._validateMeta();
    }

    /**
     * Get default metadata for this component type
     * Override in subclasses to define component-specific defaults
     * @returns {Object} Default metadata object
     */
    static getDefaultMeta() {
        return {};
    }

    /**
     * Apply constructor arguments to metadata format
     * Override in subclasses to map constructor args to metadata
     * @private
     */
    _applyConstructorArgs(...args) {
        // Base implementation - no args to map
    }

    /**
     * Update component properties from current metadata
     * Override in subclasses to apply metadata to component properties
     * @private
     */
    _updatePropertiesFromMeta() {
        // Base implementation - no properties to update
    }

    /**
     * Validate current metadata
     * Override in subclasses to add component-specific validation
     * @private
     */
    _validateMeta() {
        // Base implementation - no validation
    }

    __lateStart(){}
    __update(){}
    __draw(ctx) {
        if (this.enabled && typeof this.draw === 'function') {
            this.draw(ctx);
        }
        if(this._internalGizmos) {
            this.__internalGizmos(ctx);
        }
        if(this.OnDrawGizmos && typeof this.OnDrawGizmos === 'function') {
            this.OnDrawGizmos(ctx);
        }
    }
    __preload() {}
    __internalGizmos(ctx){}

    start() {}
    update() {}
    draw(ctx) {}
    async preload() {}
    destroy() {}
    lateUpdate() {}
}

/** 
 * Base class for MonoBehaviour components
 * You can use {@link Component} instead, both are the same
 * Provides a common base for components that need to implement Unity
 * behaviour-like functionality
 */
export class MonoBehaviour extends Component {
    constructor() {
        super();
    }
}