import { Game } from '../core/Game.js';

/** 
 * Base class for all components in the Nity.js engine.
 * You can use {@link MonoBehaviour} instead, both are the same
 * Provides common functionality for game objects and components.
 * Components can be attached to game objects to add behavior and functionality.
 * @class Component~
 */
export class Component {
    constructor() {
        this.gameObject = null;
        this.enabled = true;
        this._started = false;
        this._internalGizmos = this._internalGizmos || (Game.instance?._internalGizmos ?? false);
        
        // Initialize metadata system
        this.__meta = this.getDefaultMeta();
        
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
    getDefaultMeta() {
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