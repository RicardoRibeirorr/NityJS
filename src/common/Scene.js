import { CollisionSystem } from "../bin/CollisionSystem.js";
import { GameObject } from "./GameObject.js";


// === Scene.js ===
export class Scene {
    constructor({ create } = {}) {
        this.objects = [];
        this._create = create;
    }

    add(obj) {
        if(!(obj instanceof GameObject)) throw new Error(`[Nity] Forbidden object '${obj ? obj.constructor.name : null}' added to the scene. Accepts only 'GameObject'.`);
        this.objects.push(obj);
    }

    findByName(name) {
        return this.objects.find(obj => obj.name === name);
    }

    findByTag(tag) {
        return this.objects.filter(obj => obj.hasTag(tag));
    }

    async preload() {
        if (typeof this._create === 'function') {
            this._create(this); // Now run creation logic only when game launches
            this._create = null; // clear reference after use
        }else{
            console.log("Empty scene loaded");
        }

        const preloadPromises = this.objects.map(obj => obj?.preload?.());
        await Promise.all(preloadPromises);
    }

    async start() {
        for (let obj of this.objects) {
            if (typeof obj?.start === 'function') {
                obj?.start();
            }
        }

        setTimeout(()=>{},500)
    }

    update() {}
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