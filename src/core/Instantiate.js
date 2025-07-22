import { GameObject } from '../common/GameObject.js';
import { Component } from '../common/Component.js';
import { AbstractColliderComponent } from '../physics/AbstractColliderComponent.js';
import { CollisionSystem } from '../bin/CollisionSystem.js';
import { Game } from './Game.js';

/**
 * Unity-like Instantiate utility for creating and registering GameObjects and their components.
 * Automatically handles collider registration and parent-child relationships.
 */
export class Instantiate {
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

        // Handle both GameObject instances and constructor functions
        if (typeof prefab === 'function') {
            // If it's a constructor, create new instance
            gameObject = new prefab(x ?? 0, y ?? 0, ...args);
        } else if (prefab instanceof GameObject) {
            // If it's already an instance, use it directly
            gameObject = prefab;
            // Only override coordinates if they were explicitly provided
            if (x !== undefined) gameObject.x = x;
            if (y !== undefined) gameObject.y = y;
        } else {
            throw new Error('Instantiate.create: prefab must be a GameObject instance or constructor function');
        }

        // Set up parent-child relationship
        if (parent) {
            if (!(parent instanceof GameObject)) {
                throw new Error('Instantiate.create: parent must be a GameObject instance');
            }
            parent.__addChild(gameObject);
        }

        // Add to current scene if requested and no parent
        if (addToScene && !parent && Game.instance?.scene) {
            Game.instance.scene.__addObjectToScene(gameObject);
        }

        // Register the GameObject and its components
        Instantiate._registerGameObject(gameObject);

        return gameObject;
    }

    /**
     * Recursively registers a GameObject and all its components and children.
     * @param {GameObject} gameObject - The GameObject to register
     * @private
     */
    static _registerGameObject(gameObject) {
        // Register all components
        for (const component of gameObject.components) {
            Instantiate._registerComponent(component);
        }

        // Recursively register children
        for (const child of gameObject.children) {
            Instantiate._registerGameObject(child);
        }
    }

    /**
     * Registers a component with appropriate systems.
     * @param {Component} component - The component to register
     * @private
     */
    static _registerComponent(component) {
        
        // Register colliders with the collision system
        if (component instanceof AbstractColliderComponent) {
            if (CollisionSystem.instance) {
                CollisionSystem.instance.register(component);
            } else {
                console.warn('CollisionSystem not initialized. Collider will be registered when system is available:', component);
                // Queue for later registration
                if (!Instantiate._pendingColliders) {
                    Instantiate._pendingColliders = [];
                }
                Instantiate._pendingColliders.push(component);
            }
        }

        // Call component start method if it exists
        if (typeof component.start === 'function') {
            component.start();
        }
    }

    /**
     * Registers any pending colliders that were waiting for CollisionSystem initialization.
     * This should be called after CollisionSystem is created.
     */
    static registerPendingColliders() {
        if (Instantiate._pendingColliders && CollisionSystem.instance) {
            for (const collider of Instantiate._pendingColliders) {
                CollisionSystem.instance.register(collider);
            }
            Instantiate._pendingColliders = [];
        }
    }

    /**
     * Destroys a GameObject and unregisters all its components.
     * @param {GameObject} gameObject - The GameObject to destroy
     */
    static destroy(gameObject) {
        if (!(gameObject instanceof GameObject)) {
            throw new Error('Instantiate.destroy: gameObject must be a GameObject instance');
        }

        // Destroy children first
        for (const child of [...gameObject.children]) {
            Instantiate.destroy(child);
        }

        // Unregister components
        for (const component of gameObject.components) {
            Instantiate._unregisterComponent(component);
        }

        // Remove from parent
        if (gameObject.parent) {
            gameObject.parent.removeChild(gameObject);
        }

        // Remove from scene
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
        // Unregister colliders from the collision system
        if (component instanceof AbstractColliderComponent) {
            if (CollisionSystem.instance) {
                CollisionSystem.instance.unregister(component);
            }
        }

        // Call component destroy method if it exists
        if (typeof component.destroy === 'function') {
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
            throw new Error('Instantiate.clone: original must be a GameObject instance');
        }

        // Create new GameObject with same position
        const clone = new GameObject(original.x, original.y);
        clone.name = original.name;
        clone.tags = new Set(original.tags);

        // Clone components
        for (const component of original.components) {
            // Create new instance of the same component type
            const ComponentClass = component.constructor;
            const newComponent = new ComponentClass();
            
            // Copy properties (this is a simple copy, might need deep copy for complex objects)
            for (const key in component) {
                if (component.hasOwnProperty(key) && key !== 'gameObject') {
                    newComponent[key] = component[key];
                }
            }
            
            clone.addComponent(newComponent);
        }

        // Clone children recursively
        for (const child of original.children) {
            const childClone = Instantiate.clone(child, { addToScene: false });
            clone.__addChild(childClone);
        }

        // Apply options and register
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

        Instantiate._registerGameObject(clone);

        return clone;
    }
}
