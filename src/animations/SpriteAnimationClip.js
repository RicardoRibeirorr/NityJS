// === SpriteAnimationClip.js ===
export class SpriteAnimationClip {
    constructor(name, spriteNames = [], fps = 10, loop = true) {
        this.name = name;
        this.spriteNames = spriteNames;
        this.fps = fps;
        this.loop = loop;
    }
}