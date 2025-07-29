import { SpriteRegistry } from '../asset/SpriteRegistry.js';
import { AudioRegistry } from '../asset/AudioRegistry.js';
import { CameraComponent } from '../common/components/CameraComponent.js';
import { Input } from '../input/Input.js';
import { CollisionSystem } from '../bin/CollisionSystem.js';
import { Instantiate } from './Instantiate.js';
import { Time } from './Time.js';
import { _processPendingDestructions } from './Destroy.js';
import { LayerManager } from './LayerManager.js';

// === Game.js ===
export class Game {
    #_forcedpaused = false;
    #_initialized = false;
    #_launching = false; // Flag to prevent multiple launches
    #_lastTime = 0; // For tracking the last frame time

    constructor(canvas) {
        Game.instance = this;
        if(canvas!= null) {
            if(!(canvas instanceof HTMLCanvasElement))throw new Error("Game constructor requires a valid HTMLCanvasElement.");
                    this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }

        this.scene = null;
        this.mainCamera = null; // GameObject with CameraComponent
        
        // Layer system initialization
        this.layerManager = null; // Will be initialized when canvas is ready
        this.useLayerSystem = false; // Can be enabled via configure()
        
        // this.spriteRegistry = new SpriteRegistry();
        this.paused = false;
        //privates
        this._internalGizmos = false; // Debug drawing for all components in view
        //protected
        this._debugMode = false;
        this._deltaTime = 0;
        //internal systems
        new CollisionSystem();
        // Register any pending colliders that were created before CollisionSystem
        Instantiate.registerPendingColliders();
    }

    configure(options = {canvas:null, mainCamera:null, debug:false, layers:null, defaultLayer:null, useLayerSystem:false}) {
        if(this.#_initialized || this.#_launching) {
            console.warn("Game is already initialized. Configuration changes will not take effect.");
            return;
        }

        if (options.canvas) {
            this.canvas = options.canvas;
            this.ctx = this.canvas.getContext('2d');
        }
        if (options.mainCamera) this.mainCamera = options.mainCamera;
        if(options.debug) this.#_debugMode();
        
        // Layer system configuration
        if (options.useLayerSystem && this.canvas) {
            this.useLayerSystem = true;
            const layerConfig = {
                layers: options.layers || ['background', 'default', 'ui'],
                defaultLayer: options.defaultLayer || 'default',
                width: this.canvas.width,
                height: this.canvas.height
            };
            this.layerManager = new LayerManager(this.canvas, layerConfig);
            console.log('LayerManager initialized with layers:', layerConfig.layers);
            console.log('Default layer:', layerConfig.defaultLayer);
        }
    }

    launch(scene) {
        if (!scene && !this.scene) throw new Error("No scene provided.");

        if( this.#_launching) {
            console.warn("Game is already launching or has been launched.");
            return;
        }else this.#_launching = true; // Prevent multiple launches
        
        if (!scene && !this.scene) throw new Error('No scene assigned to game.');
        this.#_initCanvas();
        this.#_launch(scene||this.scene);
    }

    async loadScene(scene){
        if (!scene) throw new Error("No scene provided.");

        if(!this.#_initialized && !this.#_launching) {
            await this.#_loadScene(scene);
            return;
        }
        this.#_launch(scene);
    }

    pause(){
        this.paused = true;
    }

    resume(){
        this.paused = false;
    }

    async #_launch(scene) {
        await this.#_loadScene(scene);
        this.#_start();
    }

    #_start() {
        Time._reset(); // Reset time system for new game session
        Input.initialize(this.canvas);
        this.#_initEventListeners();
        
        requestAnimationFrame(this.#_loop.bind(this));
    }

     #_loop(timestamp) {
        this._deltaTime = (timestamp - this.#_lastTime) / 1000;
        if (this._deltaTime > 0.1) this._deltaTime = 0.1;
        this.#_lastTime = timestamp;

        // Update time statistics
        Time._updateTimeStats();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.#_forcedpaused) {
            if(!this.paused){
                Input.update(); // Update input state each frame
                this.scene.__update();
                if (this.mainCamera) {
                    const cam = this.mainCamera.getComponent(CameraComponent);
                    if (cam) cam.applyTransform(this.ctx);
                }
            }
            
            this.scene.__lateUpdate();
            
            // Process pending destructions (should be after updates but before drawing)
            _processPendingDestructions();
            
            // Render using LayerManager if enabled, otherwise use traditional scene rendering
            if (this.useLayerSystem && this.layerManager) {
                this.layerManager.render();
            } else {
                this.scene.__draw(this.ctx);
            }
        }

        requestAnimationFrame(this.#_loop.bind(this));
    }

    async #_loadScene(scene) {
        if (!scene) throw new Error("No scene provided.");
        this.scene = scene;
        this.currentScene = scene; // Add reference for Destroy class
        // if (typeof scene._create === 'function') {
        //     scene._create(scene);  // Build the objects
        //     scene._create = null;
        // }
        
        // Preload all engine assets
        await Promise.all([
            SpriteRegistry.preloadAll(),
            AudioRegistry.preloadAll()
        ]);
        
        await this.scene.preload();
        await this.scene.start();
    }

    #_forcedPause() {
        if( this.#_forcedpaused === true) return; // Avoid unnecessary pause
        this.#_forcedpaused = true;
        console.log("Game fullscale pause");
    }

    #_forcedResume() {
        if( this.#_forcedpaused === false) return; // Avoid unnecessary resume
        this.#_forcedpaused = false;
        this.#_lastTime = performance.now(); // reset time to avoid jump
        console.log("Game fullscale resume");
    }

    #_initEventListeners (){
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.#_forcedPause();
            } else {
                this.#_forcedResume();
            }
        });
    }

    #_initCanvas(){
        if (!this.canvas) {
            console.warn("No canvas element provided.");
            return;
        }
        // this.canvas.width = 600; window.innerWidth;
        // this.canvas.height = 400; window.innerHeight;
        // this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error("Failed to get 2D context from canvas.");
        }

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        
        // Initialize LayerManager if not already done and useLayerSystem is enabled
        if (this.useLayerSystem && !this.layerManager) {
            const layerConfig = {
                layers: ['background', 'environment', 'gameplay', 'effects', 'ui'],
                width: this.canvas.width,
                height: this.canvas.height
            };
            this.layerManager = new LayerManager(this.canvas, layerConfig);
            console.log('LayerManager initialized in _initCanvas with default layers');
        }
    }
    #_debugMode(){
        this._debugMode = true;
        this._internalGizmos = true;
    }
    
    /**
     * Add a GameObject to a specific layer (only works when layer system is enabled)
     * @param {string} layerName - Name of the layer
     * @param {GameObject} gameObject - GameObject to add to the layer
     */
    addToLayer(layerName, gameObject) {
        if (!this.useLayerSystem || !this.layerManager) {
            console.warn('LayerManager not enabled. Use configure({ useLayerSystem: true }) to enable layers.');
            return;
        }
        this.layerManager.addToLayer(layerName, gameObject);
    }
    
    /**
     * Remove a GameObject from a layer
     * @param {string} layerName - Name of the layer
     * @param {GameObject} gameObject - GameObject to remove from the layer
     */
    removeFromLayer(layerName, gameObject) {
        if (!this.useLayerSystem || !this.layerManager) {
            console.warn('LayerManager not enabled.');
            return;
        }
        this.layerManager.removeFromLayer(layerName, gameObject);
    }
    
    /**
     * Get access to the LayerManager instance
     * @returns {LayerManager|null} The LayerManager instance or null if not enabled
     */
    getLayerManager() {
        return this.layerManager;
    }
    
    /**
     * Check if layer system is enabled
     * @returns {boolean} True if layer system is enabled
     */
    hasLayerSystem() {
        return this.useLayerSystem && this.layerManager !== null;
    }

    /**
     * Gets the default layer name.
     * @returns {string} The default layer name, or 'default' if no layer system is active.
     */
    getDefaultLayer() {
        return this.layerManager ? this.layerManager.getDefaultLayer() : 'default';
    }

}
Game.instance = null; // Static property to hold the singleton instance