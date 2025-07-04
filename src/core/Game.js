import { SpriteRegistry } from '../asset/SpriteRegistry.js';
import { CameraComponent } from '../common/components/CameraComponent.js';
import { Input } from '../input/Input.js';
import { CollisionSystem } from '../bin/CollisionSystem.js';

// === Game.js ===
export class Game {
    #_forcedpaused = false;

    constructor(canvas) {
        Game.instance = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = null;
        this.lastTime = 0;
        this.mainCamera = null; // GameObject with CameraComponent
        this.spriteRegistry = new SpriteRegistry();
        //privates
        this.#_forcedpaused = false;
        //internal systems
        new CollisionSystem();
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
        this.start();
    }

    start() {
        Input.initialize();
        this.#_initEventListeners();
        requestAnimationFrame(this.loop.bind(this));
    }

     loop(timestamp) {
        let deltaTime = (timestamp - this.lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.1;
        this.lastTime = timestamp;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.#_forcedpaused) {
            this.scene.update(deltaTime);
            if (this.mainCamera) {
                const cam = this.mainCamera.getComponent(CameraComponent);
                if (cam) cam.applyTransform(this.ctx);
            }
            this.scene.draw(this.ctx);
        }

        requestAnimationFrame(this.loop.bind(this));
    }


    #_forcedPause() {
        if( this.#_forcedpaused === true) return; // Avoid unnecessary pause
        this.#_forcedpaused = true;
        console.log("Game fullscale pause");
    }

    #_forcedResume() {
        if( this.#_forcedpaused === false) return; // Avoid unnecessary resume
        this.#_forcedpaused = false;
        this.lastTime = performance.now(); // reset time to avoid jump
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