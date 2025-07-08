import { Game } from '../../index.js';
import { Component } from '../../common/Component.js';
import { SpriteRendererComponent } from '../../renderer/components/SpriteRendererComponent.js';
import { Time } from '../../core/Time.js';

// === SpriteAnimationComponent.js ===
export class SpriteAnimationComponent extends Component {
    constructor(sheetName, defaultClipName = null) {
        super();
        this.sheetName = sheetName;
        this.clips = new Map();
        this.currentClip = null;
        this.currentFrame = 0;
        this.autoPlay = true; // Automatically play the default clip on start
        this.time = 0;
        this.defaultClipName = defaultClipName;
    }

    start() {
        if (this.autoPlay && this.defaultClipName) {
            this.play(this.defaultClipName);
        }
    }

    addClip(clip) {
        this.clips.set(clip.name, clip);
        // if (!this.currentClip && this.defaultClipName === clip.name) {
        //     this.play(clip.name);
        // }
    }

    play(name) {
        const clip = this.clips.get(name);
        if (!clip) throw new Error(`Animation clip '${name}' not found.`);
        this.currentClip = clip;
        this.currentFrame = 0;
        this.time = 0;
        this._applyFrame();
    }

    update() {
        if (!this.currentClip) return;

        this.time += Time.deltaTime();
        const frameDuration = 1 / this.currentClip.fps;

        if (this.time >= frameDuration) {
            this.time -= frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= this.currentClip.spriteNames.length) {
                if (this.currentClip.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.currentClip.spriteNames.length - 1;
                    return;
                }
            }

            this._applyFrame();
        }
    }

    _applyFrame() {
        const spriteName = this.currentClip.spriteNames[this.currentFrame];
        const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
        if (spriteRenderer) {
            spriteRenderer.sprite = Game.instance.spriteRegistry.getSheet(this.sheetName).getSprite(spriteName);
        }
    }
}