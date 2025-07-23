import { SpriteRegistry } from '../asset/SpriteRegistry.js';
import { CameraComponent } from '../common/components/CameraComponent.js';
import { Input } from '../input/Input.js';
import { CollisionSystem } from '../bin/CollisionSystem.js';
import { Instantiate } from './Instantiate.js';
import { Time } from './Time.js';
import { _processPendingDestructions } from './Destroy.js';

// === Game.js ===
export class Game {
    #_forcedpaused = false;
    #_initialized = false;
    #_launching = false; // Flag to prevent multiple launches
    #_lastTime = 0; // For tracking the last frame time

    constructor(canvas) {
        Game.instance = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = null;
        this.mainCamera = null; // GameObject with CameraComponent
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

    configure(options = {canvas:null, mainCamera:null, debug:false}) {
        if (options.canvas) {
            this.canvas = options.canvas;
            this.ctx = this.canvas.getContext('2d');
        }
        if (options.mainCamera) this.mainCamera = options.mainCamera;
        if(options.debug) this.#_debugMode();
    }

    launch(scene) {
        if (!scene) throw new Error("No scene provided.");

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
            
            this.scene.__draw(this.ctx);
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
        await SpriteRegistry.preloadAll();
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
    }
    #_debugMode(){
        this._debugMode = true;
        this._internalGizmos = true;
    }

}
Game.instance = null; // Static property to hold the singleton instance