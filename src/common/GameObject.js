import { Instantiate } from '../core/Instantiate.js';
import {
    Component
} from './Component.js';
import { Vector2 } from '../math/Vector2.js';

/**
 * Represents a game object in the scene.
 * A GameObject can have multiple components, children, and tags.
 * It can be positioned in the scene and can have a parent-child relationship with other GameObjects.
 * @class GameObject
 * @property {Vector2} position - The position of the GameObject (Vector2).
 * @property {number} rotation - The rotation of the GameObject in radians.
 * @property {Array<Component>} components - The list of components attached to the GameObject.
 * @property {Array<GameObject>} children - The list of child GameObjects.
 * @property {GameObject|null} parent - The parent GameObject, if any.
 * @property {string} name - The name of the GameObject.
 * @property {Set<string>} tags - A set of tags associated with the GameObject.
 * @property {boolean} paused - Indicates whether the GameObject is paused.
 * @constructor
 * @param {number|Vector2} [x=0] - The initial x-coordinate or Vector2 position of the GameObject.
 * @param {number} [y=0] - The initial y-coordinate of the GameObject (ignored if x is Vector2).
 * */
export class GameObject {

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
        this.rotation = 0; // Rotation in radians
        this.components = [];
        this.children = [];
        this.parent = null;
        this.name = '';
        this.tags = new Set();
        this.paused = false;
        
        // Layer system for rendering order
        this.layer = 'default';  // Default layer name (lowercase to match new defaults)
        this.zIndex = 0;         // Z-index within layer
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
        // component.start?.();
        return component;
    }

    /**
     * Adds multiple components to the GameObject at once.
     * Each component must be an instance of Component.
     * If any component of the same type already exists, it will throw an error.
     * This is a convenience method for adding multiple components efficiently.
     * 
     * @param {Component[]} components - Array of components to add
     * @returns {Component[]} Array of added components for chaining
     * @throws {Error} If any component is not an instance of Component
     * @throws {Error} If any component of the same type already exists
     * 
     * @example
     * // Add multiple components at once
     * const obj = new GameObject();
     * obj.addComponents([
     *     new SpriteRendererComponent("player"),
     *     new RigidbodyComponent(),
     *     new BoxColliderComponent(32, 48)
     * ]);
     * 
     * @example
     * // With method chaining
     * const components = obj.addComponents([
     *     SpriteRendererComponent.meta({ spriteName: "enemy", width: 64 }),
     *     new CircleColliderComponent(20)
     * ]);
     */
    addComponents(components) {
        if (!Array.isArray(components)) {
            throw new Error('addComponents: property "components" must be an array of Component instances');
        }

        // Validate all components first before adding any
        for (const component of components) {
            if (!(component instanceof Component)) {
                throw new Error('addComponents: all items must be instances of Component');
            }
            
            const existing = this.getComponent(component.constructor);
            if (existing) {
                throw new Error(`Component of type ${component.constructor.name} already exists on this GameObject.`);
            }
        }

        // Add all components if validation passes
        const addedComponents = [];
        for (const component of components) {
            component.gameObject = this;
            this.components.push(component);
            addedComponents.push(component);
        }

        return addedComponents;
    }

    /**
     * Retrieves a component of the specified type from the GameObject.
     * @param {Function} type - The class of the component to retrieve.
     * @returns {Component|null} The component if found, otherwise null.
     * @throws {Error} If the type is not a class.
     */
    getComponent(type) {
        if (typeof type !== 'function' || !type.prototype) {
            throw new Error('getComponent: property "type" must be a class');
        }
        return this.components.find(c => c instanceof type);
    }

    /**
     * Checks if the GameObject has a component of the specified type.
     * @param {Function} type - The class of the component to check.
     * @return {boolean} True if the component exists, otherwise false.
     * @throws {Error} If the type is not a class.
     */
    hasComponent(type) {
        if (typeof type !== 'function' || !type.prototype) {
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
        const index = this.components.findIndex(c => c instanceof type);
        if (index !== -1) {
            this.components[index].destroy?.();
            this.components.splice(index, 1);
        }
    }

    // TODO: ADD ALL THE CHILD OPTIONS

    getComponentInChildren(type) {
        if (typeof type !== 'function' || !type.prototype) {
            throw new Error('hasComponent: property "type" must be a class');
        }

        return this.children.find(c => c.hasComponent(type)).getComponent(type);
        // return !!this.getComponent(type);
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
        if (!(child instanceof GameObject)) {
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
        if(!Array.isArray(children)) throw new Error(`Nity2D: method 'addChildren' only accepts array '${typeof children}' provided`)
        
            children.forEach(child => this.addChild(child));
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
        const promises = this.components.map(c => c.preload?.());
        for (const child of this.children) {
            promises.push(child.preload?.());
        }
        await Promise.all(promises);
    }

    start() {
        for (const c of this.components) {
            if (c.enabled && typeof c.start === 'function') c.start();
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
            if (c.enabled && typeof c.update === 'function') c.update();
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
            if (c.enabled && typeof c.lateUpdate === 'function') c.lateUpdate();
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
            if (typeof comp.onCollisionEnter === 'function') {
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
            if (typeof comp.onCollisionStay === 'function') {
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
            if (typeof comp.onCollisionExit === 'function') {
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
}