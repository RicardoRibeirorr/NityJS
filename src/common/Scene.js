import { CollisionSystem } from "../bin/CollisionSystem.js";
import { Instantiate } from "../core/Instantiate.js";
import { GameObject } from "./GameObject.js";


/**
 * Core Scene class for managing GameObjects and scene lifecycle in the NityJS engine.
 * 
 * The Scene class serves as the primary container for GameObjects and manages their
 * lifecycle including creation, updates, rendering, and destruction. It provides
 * Unity-inspired scene management with proper GameObject hierarchy, component
 * systems, and collision detection integration.
 * 
 * **Key Features:**
 * - GameObject lifecycle management (preload, start, update, lateUpdate, draw)
 * - Integration with CollisionSystem for physics and collision detection
 * - Scene creation function support for delayed object instantiation
 * - GameObject finding utilities by name and tag
 * - Proper cleanup and destruction handling
 * - Async preloading for assets and resources
 * 
 * **Unity Equivalent:** Similar to Unity's Scene class for managing scene state
 * 
 * **Lifecycle Order:**
 * 1. constructor() - Scene creation with optional create function
 * 2. preload() - Asset loading and scene setup
 * 3. start() - GameObject initialization after all objects are loaded
 * 4. update() - Per-frame game logic updates
 * 5. lateUpdate() - Post-update logic (camera, UI, etc.)
 * 6. draw() - Rendering phase
 * 
 * @class Scene
 * 
 * @example
 * // Basic scene creation
 * const scene = new Scene({
 *     create: function(scene) {
 *         const player = new GameObject(100, 100);
 *         player.addComponent(new SpriteRendererComponent("player"));
 *         scene.add(player);
 *     }
 * });
 * 
 * @example
 * // Manual scene management
 * const scene = new Scene();
 * const enemy = new GameObject(200, 150);
 * enemy.name = "Enemy1";
 * enemy.addTag("enemy");
 * scene.add(enemy);
 * 
 * @example
 * // Finding objects in scene
 * const player = scene.findByName("Player");
 * const enemies = scene.findByTag("enemy");
 */
// === Scene.js ===
export class Scene {
    /**
     * Creates a new Scene with optional creation function.
     * 
     * Initializes the scene with an empty objects array and stores the creation
     * function for delayed execution during the preload phase. The create function
     * allows for deferred object instantiation, ensuring proper game initialization
     * order and preventing premature object creation.
     * 
     * @param {Object} [options={}] - Scene configuration options
     * @param {Function} [options.create] - Function called during preload to create scene objects
     *   - Receives the scene instance as parameter
     *   - Should contain all initial GameObject creation and setup logic
     *   - Called only once during scene preload phase
     * 
     * @example
     * // Scene with creation function
     * const gameScene = new Scene({
     *     create: function(scene) {
     *         // Create player
     *         const player = new GameObject(400, 300);
     *         player.name = "Player";
     *         player.addComponents([
     *             new SpriteRendererComponent("player_idle"),
     *             new RigidbodyComponent(),
     *             new BoxColliderComponent(32, 48)
     *         ]);
     *         scene.add(player);
     *         
     *         // Create enemies
     *         for (let i = 0; i < 5; i++) {
     *             const enemy = new GameObject(Math.random() * 800, Math.random() * 600);
     *             enemy.addTag("enemy");
     *             scene.add(enemy);
     *         }
     *     }
     * });
     * 
     * @example
     * // Empty scene for manual management
     * const emptyScene = new Scene();
     */
    constructor({ create } = {}) {
        this.objects = [];
        this._createFn = create;
    }

    
    /**
     * Adds a GameObject to the scene before the game starts.
     * 
     * This method is designed for adding objects during scene creation or before
     * the game loop begins. It delegates to Instantiate.create() to ensure proper
     * object registration and lifecycle management. For adding objects during
     * gameplay, use Instantiate.create() directly for better performance and
     * immediate integration with running systems.
     * 
     * The added GameObject will go through the complete lifecycle:
     * 1. Added to scene objects array
     * 2. Preload phase (asset loading)
     * 3. Start phase (initialization)
     * 4. Update/render phases (ongoing)
     * 
     * @param {GameObject} obj - The GameObject to add to the scene
     *   Must be a valid GameObject instance with components
     * 
     * @example
     * // Adding objects during scene creation
     * const scene = new Scene({
     *     create: function(scene) {
     *         const player = new GameObject(400, 300);
     *         player.addComponent(new SpriteRendererComponent("player"));
     *         scene.add(player); // Proper scene addition
     *     }
     * });
     * 
     * @example
     * // Manual scene building
     * const scene = new Scene();
     * const background = new GameObject(0, 0);
     * background.addComponent(new ImageComponent("./assets/bg.png"));
     * scene.add(background);
     * 
     * @see {@link Instantiate.create} For adding objects during gameplay
     * @see {@link GameObject} For GameObject creation and component management
     */
    add(obj){
        Instantiate.create(obj);
    }

    /**
     * Removes a GameObject from the scene with proper cleanup.
     * 
     * This method provides comprehensive GameObject removal including cleanup of
     * all components, lifecycle method calls, and parent-child relationship management.
     * It ensures no memory leaks or orphaned references remain after object removal.
     * For gameplay object destruction, prefer using the global Destroy() function
     * which provides Unity-compatible destruction patterns.
     * 
     * **Cleanup Process:**
     * 1. Calls GameObject.destroy() if method exists
     * 2. Iterates through all components and calls their destroy() methods
     * 3. Removes from scene objects array
     * 4. Clears parent reference to prevent orphaned objects
     * 
     * @param {GameObject} obj - The GameObject to remove from the scene
     *   Must be a GameObject instance currently in this scene
     * 
     * @example
     * // Manual object removal
     * const enemy = scene.findByName("Enemy1");
     * if (enemy) {
     *     scene.remove(enemy); // Complete cleanup
     * }
     * 
     * @example
     * // Removing all enemies
     * const enemies = scene.findByTag("enemy");
     * enemies.forEach(enemy => scene.remove(enemy));
     * 
     * @see {@link Destroy} For Unity-compatible destruction during gameplay
     * @see {@link GameObject#destroy} For GameObject-specific cleanup logic
     */
    remove(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            // Call destroy lifecycle method if it exists
            if (typeof obj.destroy === 'function') {
                obj.destroy();
            }
            
            // Remove all components and call their destroy methods
            if (obj.components) {
                obj.components.forEach(component => {
                    if (typeof component.destroy === 'function') {
                        component.destroy();
                    }
                });
            }
            
            // Remove from scene objects array
            this.objects.splice(index, 1);
            
            // Clear parent reference
            obj.scene = null;
        }
    }


    /**
     * Internal method for adding GameObjects directly to the scene array.
     * 
     * This is a low-level method used by the Instantiate system for direct object
     * registration. It performs type validation to ensure only GameObject instances
     * are added to the scene, maintaining scene integrity and preventing runtime
     * errors from invalid object types.
     * 
     * **Important:** This method should only be called by internal engine systems
     * like Instantiate.create(). Use scene.add() or Instantiate.create() for
     * regular GameObject addition.
     * 
     * @private
     * @param {GameObject} obj - The GameObject to add to the scene's objects array
     * @throws {Error} If obj is not a GameObject instance
     * 
     * @internal Used by Instantiate system for direct object registration
     */
    __addObjectToScene(obj) {
        if(!(obj instanceof GameObject)) throw new Error(`[Nity] Forbidden object '${obj ? obj.constructor.name : null}' added to the scene. Accepts only 'GameObject'.`);
        this.objects.push(obj);
    }

    /**
     * Finds the first GameObject in the scene with the specified name.
     * 
     * Searches through all GameObjects in the scene and returns the first one
     * whose name property matches the provided string. Useful for accessing
     * specific objects when you know their name. Returns null if no GameObject
     * with the specified name is found.
     * 
     * **Performance Note:** This method performs a linear search through all
     * objects. For frequently accessed objects, consider caching the reference.
     * 
     * @param {string} name - The name to search for
     * @returns {GameObject|null} The first GameObject with matching name, or null if not found
     * 
     * @example
     * // Find player object
     * const player = scene.findByName("Player");
     * if (player) {
     *     player.position.x += 10;
     * }
     * 
     * @example
     * // Find specific enemy
     * const boss = scene.findByName("BossEnemy");
     * if (boss) {
     *     boss.getComponent(SpriteRendererComponent).setColor("#FF0000");
     * }
     * 
     * @see {@link GameObject#name} For setting GameObject names
     * @see {@link findByTag} For finding objects by tag
     */
    findByName(name) {
        return this.objects.find(obj => obj.name === name);
    }

    /**
     * Finds all GameObjects in the scene with the specified tag.
     * 
     * Searches through all GameObjects in the scene and returns an array of all
     * objects that have the specified tag. Useful for working with groups of
     * objects that share common functionality or behavior. Returns an empty
     * array if no GameObjects with the specified tag are found.
     * 
     * **Common Use Cases:**
     * - Finding all enemies: `scene.findByTag("enemy")`
     * - Finding all pickups: `scene.findByTag("pickup")`
     * - Finding all UI elements: `scene.findByTag("ui")`
     * 
     * @param {string} tag - The tag to search for
     * @returns {GameObject[]} Array of GameObjects with the specified tag (empty if none found)
     * 
     * @example
     * // Find and damage all enemies
     * const enemies = scene.findByTag("enemy");
     * enemies.forEach(enemy => {
     *     const health = enemy.getComponent(HealthComponent);
     *     if (health) health.takeDamage(10);
     * });
     * 
     * @example
     * // Collect all pickups
     * const pickups = scene.findByTag("pickup");
     * pickups.forEach(pickup => {
     *     // Apply pickup effect
     *     pickup.getComponent(PickupComponent).collect();
     * });
     * 
     * @example
     * // Hide all UI elements
     * const uiElements = scene.findByTag("ui");
     * uiElements.forEach(ui => {
     *     ui.getComponent(SpriteRendererComponent).setOpacity(0);
     * });
     * 
     * @see {@link GameObject#addTag} For adding tags to GameObjects
     * @see {@link GameObject#hasTag} For checking if GameObject has a tag
     * @see {@link findByName} For finding objects by name
     */
    findByTag(tag) {
        return this.objects.filter(obj => obj.hasTag(tag));
    }

    /**
     * Asynchronously preloads all scene assets and executes the creation function.
     * 
     * This is the first phase of scene initialization that handles:
     * 1. Executing the optional creation function to instantiate GameObjects
     * 2. Preloading all assets for every GameObject and their components
     * 3. Ensuring all required resources are loaded before game starts
     * 
     * The creation function is called only once and then cleared to prevent
     * memory leaks. All GameObjects are preloaded in parallel for optimal
     * performance using Promise.all().
     * 
     * @async
     * @returns {Promise<void>} Resolves when all assets are loaded and scene is ready
     * 
     * @example
     * // Preload is called automatically by the Game engine
     * await scene.preload();
     * console.log("All scene assets loaded");
     */
    async preload() {
        if (typeof this._createFn === 'function') {
            await this._createFn(this); // Now run creation logic only when game launches
            this._createFn = null; // clear reference after use
        }

        const preloadPromises = this.objects.map(obj => obj?.preload?.());
        await Promise.all(preloadPromises);
    }

    /**
     * Initializes all GameObjects in the scene after preloading is complete.
     * 
     * Calls the start() method on every GameObject that has one, providing
     * a Unity-compatible initialization phase. This occurs after all assets
     * are loaded but before the game loop begins, ensuring all objects can
     * safely access their dependencies and perform initial setup.
     * 
     * @async
     * @returns {Promise<void>} Resolves when all GameObjects have been initialized
     * 
     * @example
     * // Start is called automatically by the Game engine after preload
     * await scene.start();
     * console.log("All GameObjects initialized");
     */
    async start() {
        for (let obj of this.objects) {
            if (typeof obj?.start === 'function') {
                obj?.start();
            }
        }

        setTimeout(()=>{},500)
    }

    /**
     * Scene-specific update logic called every frame.
     * 
     * Override this method in scene subclasses to implement custom scene-level
     * logic that should run every frame. This is called after all GameObject
     * updates but before collision detection, making it ideal for scene-wide
     * systems, camera management, or global game state updates.
     * 
     * @example
     * // Custom scene with update logic
     * class GameScene extends Scene {
     *     update() {
     *         // Update camera following player
     *         this.updateCamera();
     *         
     *         // Check win conditions
     *         this.checkWinCondition();
     *     }
     * }
     */
    update() {}
    
    /**
     * Scene-specific late update logic called every frame.
     * 
     * Override this method in scene subclasses to implement custom scene-level
     * logic that should run after all GameObject updates and collision detection.
     * Ideal for UI updates, camera finalization, or cleanup operations that
     * need to happen after all game logic has processed.
     * 
     * @example
     * // Custom scene with late update logic
     * class GameScene extends Scene {
     *     lateUpdate() {
     *         // Update UI elements
     *         this.updateUI();
     *         
     *         // Finalize camera position
     *         this.finalizeCamera();
     *     }
     * }
     */
    lateUpdate() {}

    __update(){
        // Update all game objects first (movement, etc.)
        for (let obj of this.objects) {
            if (typeof obj?.update === 'function') {
                obj?.update();
            }
        }

        // Then run collision detection and fire events
        if (CollisionSystem.instance) {
            CollisionSystem.instance?.update();
        } else {
            console.warn('Scene: CollisionSystem.instance is null!');
        }

        this?.update();
    }

    __lateUpdate(){
        for (let obj of this.objects) {
            if (typeof obj.lateUpdate === 'function') {
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
}