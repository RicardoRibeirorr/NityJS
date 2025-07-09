import { SpriteRegistry } from '../asset/SpriteRegistry.js';
import { CameraComponent } from '../common/components/CameraComponent.js';
import { Input } from '../input/Input.js';
import { CollisionSystem } from '../bin/CollisionSystem.js';
import { Instantiate } from './Instantiate.js';

// === Game.js ===
export class Game {
    #_forcedpaused = false;

    constructor(canvas) {
        Game.instance = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = null;
        this._lastTime = 0;
        this.mainCamera = null; // GameObject with CameraComponent
        this.spriteRegistry = new SpriteRegistry();
        this.paused = false;
        //privates
        this.#_forcedpaused = false;
        //protected
        this._deltaTime = 0;
        //internal systems
        new CollisionSystem();
        // Register any pending colliders that were created before CollisionSystem
        Instantiate.registerPendingColliders();
    }

    launch(scene) {
        if (!scene) throw new Error('No scene assigned to game.');
        this.#_initCanvas();
        this.#_launch(scene);
    }

    async #_launch(scene) {
        await this.loadScene(scene);
        this.start();
    }

    async loadScene(scene){
        if (!scene) throw new Error("No scene provided.");
        this.scene = scene;
        if (typeof scene._create === 'function') {
            scene._create(scene);  // Build the objects
            scene._create = null;
        }
        await this.spriteRegistry.preload();
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
        this._deltaTime = (timestamp - this._lastTime) / 1000;
        if (this._deltaTime > 0.1) this._deltaTime = 0.1;
        this._lastTime = timestamp;

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
            this.scene.__draw(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    pause(){
        this.paused = true;
    }

    resume(){
        this.paused = false;
    }


    #_forcedPause() {
        if( this.#_forcedpaused === true) return; // Avoid unnecessary pause
        this.#_forcedpaused = true;
        console.log("Game fullscale pause");
    }

    #_forcedResume() {
        if( this.#_forcedpaused === false) return; // Avoid unnecessary resume
        this.#_forcedpaused = false;
        this._lastTime = performance.now(); // reset time to avoid jump
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

}
Game.instance = null; // Static property to hold the singleton instance