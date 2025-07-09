import { Game } from '../../index.js';
import { Component } from '../../common/Component.js';
import { SpriteRendererComponent } from '../../renderer/components/SpriteRendererComponent.js';
import { Time } from '../../core/Time.js';

/**
 * SpriteAnimationComponent handles sprite-based animations for GameObjects.
 * It manages multiple animation clips and provides smooth playback with timing control.
 * This component works with SpriteRendererComponent to display animated sprites.
 * 
 * @example
 * // Create an animated character
 * const animator = new SpriteAnimationComponent("character", "idle");
 * animator.addClip(new SpriteAnimationClip("idle", ["sprite_0_0", "sprite_1_0"], 4, true));
 * animator.addClip(new SpriteAnimationClip("walk", ["sprite_0_1", "sprite_1_1", "sprite_2_1"], 8, true));
 */
// === SpriteAnimationComponent.js ===
export class SpriteAnimationComponent extends Component {
    /**
     * Creates a new SpriteAnimationComponent.
     * 
     * @param {string} sheetName - Name of the spritesheet to use for animations
     * @param {string} [defaultClipName=null] - Name of the default animation clip to play on start
     */
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

    /**
     * Called when the GameObject starts. Automatically plays the default clip if autoPlay is enabled.
     */
    start() {
        if (this.autoPlay && this.defaultClipName) {
            this.play(this.defaultClipName);
        }
    }

    /**
     * Adds an animation clip to this component.
     * 
     * @param {SpriteAnimationClip} clip - The animation clip to add
     */
    addClip(clip) {
        this.clips.set(clip.name, clip);
        // if (!this.currentClip && this.defaultClipName === clip.name) {
        //     this.play(clip.name);
        // }
    }

    /**
     * Plays the specified animation clip.
     * 
     * @param {string} name - Name of the animation clip to play
     * @throws {Error} If the animation clip is not found
     */
    play(name) {
        const clip = this.clips.get(name);
        if (!clip) throw new Error(`Animation clip '${name}' not found.`);
        this.currentClip = clip;
        this.currentFrame = 0;
        this.time = 0;
        this._applyFrame();
    }

    /**
     * Updates the animation playback. Called automatically each frame.
     */
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

    /**
     * Applies the current frame's sprite to the SpriteRendererComponent.
     * @private
     */
    _applyFrame() {
        const spriteName = this.currentClip.spriteNames[this.currentFrame];
        const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
        if (spriteRenderer) {
            spriteRenderer.sprite = Game.instance.spriteRegistry.getSheet(this.sheetName).getSprite(spriteName);
        }
    }
}