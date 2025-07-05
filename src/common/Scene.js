import { CollisionSystem } from "../bin/CollisionSystem";


// === Scene.js ===
export class Scene {
    constructor({ create } = {}) {
        this.objects = [];
        this._create = create;
    }

    add(obj) {
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

        const preloadPromises = this.objects.map(obj => obj.preload?.());
        await Promise.all(preloadPromises);
    }

    async start() {
        for (let obj of this.objects) {
            if (typeof obj.start === 'function') {
                obj.start();
            }
        }
    }

    update(deltaTime) {
        for (let obj of this.objects) {
            if (typeof obj.update === 'function') {
                obj.update(deltaTime);
            }
        }

        CollisionSystem.instance?.update();

        for (let obj of this.objects) {
            if (typeof obj.lateUpdate === 'function') {
                obj.lateUpdate(deltaTime);
            }
        }
    }

    draw(ctx) {
        for (let obj of this.objects) {
            obj.draw(ctx);
        }
    }
}