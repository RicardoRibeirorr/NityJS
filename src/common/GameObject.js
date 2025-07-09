import { Instantiate } from '../core/Instantiate.js';
import {
    Component
} from './Component.js';

/**
 * Represents a game object in the scene.
 * A GameObject can have multiple components, children, and tags.
 * It can be positioned in the scene and can have a parent-child relationship with other GameObjects.
 * @class GameObject
 * @property {number} x - The x-coordinate of the GameObject.
 * @property {number} y - The y-coordinate of the GameObject.
 * @property {Array<Component>} components - The list of components attached to the GameObject.
 * @property {Array<GameObject>} children - The list of child GameObjects.
 * @property {GameObject|null} parent - The parent GameObject, if any.
 * @property {string} name - The name of the GameObject.
 * @property {Set<string>} tags - A set of tags associated with the GameObject.
 * @property {boolean} paused - Indicates whether the GameObject is paused.
 * @constructor
 * @param {number} [x=0] - The initial x-coordinate of the Game
 * Object.
 * @param {number} [y=0] - The initial y-coordinate of the GameObject.
 * */
export class GameObject {

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
        this.name = '';
        this.tags = new Set();
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
        // component.start?.();
        return component;
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
            x: this.x,
            y: this.y,
            parent: this,
            addToScene: true // Don't add to scene automatically
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