import { Game } from './Game.js';

/**
 * Destroy utility for managing GameObject destruction in NityJS.
 * Unity equivalent: Unity's Destroy() function for object lifecycle management.
 * 
 * This provides a static function to safely remove GameObjects from scenes,
 * handling proper cleanup of components and references.
 * 
 * @example
 * // Destroy a GameObject immediately
 * Destroy(gameObject);
 * 
 * // Destroy a GameObject after a delay (in seconds)
 * Destroy(gameObject, 2.0);
 * 
 * // Destroy a specific component
 * DestroyComponent(gameObject, SpriteRendererComponent);
 */

// Static data for pending destructions
let _pendingDestructions = [];

/**
 * Destroys a GameObject or Component after an optional delay.
 * Unity equivalent: Destroy(object, delay)
 * 
 * @param {GameObject|Component} target - The GameObject or Component to destroy
 * @param {number} [delay=0] - Delay in seconds before destruction (0 = immediate)
 */
export function Destroy(target, delay = 0) {
    if (delay <= 0) {
        _destroyImmediate(target);
    } else {
        // Schedule destruction for later
        const destructionTime = performance.now() + (delay * 1000);
        _pendingDestructions.push({
            target: target,
            time: destructionTime
        });
    }
}

/**
 * Destroys a specific component from a GameObject.
 * Unity equivalent: DestroyComponent pattern
 * 
 * @param {GameObject} gameObject - The GameObject to remove the component from
 * @param {Function} componentType - The component class/type to remove
 */
export function DestroyComponent(gameObject, componentType) {
    if (!gameObject || !gameObject.components) {
        console.warn('DestroyComponent: Invalid GameObject provided');
        return;
    }

    const component = gameObject.getComponent(componentType);
    if (component) {
        // Call component's destroy method if it exists
        if (typeof component.destroy === 'function') {
            component.destroy();
        }

        // Remove from GameObject's components array
        gameObject.removeComponent(componentType);
        
        console.log(`DestroyComponent: Removed ${componentType.name} from ${gameObject.name || 'GameObject'}`);
    } else {
        console.warn(`DestroyComponent: Component ${componentType.name} not found on GameObject`);
    }
}

/**
 * Destroys all GameObjects in the current scene.
 * Use with caution - this will remove everything!
 */
export function DestroyAll() {
    const game = Game.instance;
    if (!game || !game.currentScene) {
        console.warn('DestroyAll: No active scene found');
        return;
    }

    const objectsToDestroy = [...game.currentScene.objects]; // Create copy to avoid modification during iteration
    objectsToDestroy.forEach(obj => _destroyImmediate(obj));
    
    console.log(`DestroyAll: Destroyed ${objectsToDestroy.length} GameObjects`);
}

/**
 * Internal function to immediately destroy a target.
 * @private
 */
function _destroyImmediate(target) {
    if (!target) {
        console.warn('Destroy: Cannot destroy null or undefined target');
        return;
    }

    // Check if target is a GameObject (has components array and position property)
    if (target.components && Array.isArray(target.components) && target.position) {
        _destroyGameObject(target);
    }
    // Check if target is a Component (has gameObject reference)
    else if (target.gameObject) {
        _destroyComponent(target);
    }
    else {
        console.warn('Destroy: Unknown target type, cannot destroy', target);
        console.warn('Target properties:', Object.keys(target));
    }
}

/**
 * Internal function to destroy a GameObject.
 * @private
 */
function _destroyGameObject(gameObject) {
    const game = Game.instance;
    if (!game || !game.currentScene) {
        console.warn('Destroy: No active scene found for GameObject destruction');
        return;
    }

    // Remove from scene (which handles component cleanup)
    game.currentScene.remove(gameObject);
    
    console.log(`Destroy: Destroyed GameObject "${gameObject.name || 'Unnamed'}"`);
}

/**
 * Internal function to destroy a Component.
 * @private
 */
function _destroyComponent(component) {
    if (!component.gameObject) {
        console.warn('Destroy: Component has no associated GameObject');
        return;
    }

    // Call component's destroy method if it exists
    if (typeof component.destroy === 'function') {
        component.destroy();
    }

    // Remove from GameObject
    const componentType = component.constructor;
    component.gameObject.removeComponent(componentType);
    
    console.log(`Destroy: Destroyed Component ${componentType.name}`);
}

/**
 * Internal function to process pending delayed destructions.
 * Called automatically by the game loop.
 * @private
 */
export function _processPendingDestructions() {
    const currentTime = performance.now();
    const toDestroy = [];
    
    // Find destructions that are ready
    for (let i = _pendingDestructions.length - 1; i >= 0; i--) {
        const pending = _pendingDestructions[i];
        if (currentTime >= pending.time) {
            toDestroy.push(pending.target);
            _pendingDestructions.splice(i, 1);
        }
    }
    
    // Execute destructions
    toDestroy.forEach(target => _destroyImmediate(target));
}

/**
 * Get the count of pending delayed destructions.
 * Useful for debugging and testing.
 */
export function getPendingDestructionCount() {
    return _pendingDestructions.length;
}

/**
 * Clear all pending destructions without executing them.
 * Useful for scene transitions.
 */
export function clearPendingDestructions() {
    _pendingDestructions = [];
}
