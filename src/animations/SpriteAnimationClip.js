/**
 * SpriteAnimationClip defines an animation sequence using sprite names from a spritesheet.
 * It contains information about the frame sequence, playback speed, and loop behavior.
 * 
 * @example
 * // Create a walking animation with 4 frames
 * const walkAnimation = new SpriteAnimationClip("walk", [
 *     "sprite_0_0", "sprite_1_0", "sprite_2_0", "sprite_3_0"
 * ], 8, true);
 */
// === SpriteAnimationClip.js ===
export class SpriteAnimationClip {
    /**
     * Creates a new SpriteAnimationClip.
     * 
     * @param {string} name - Unique identifier for the animation clip
     * @param {string[]} [spriteNames=[]] - Array of sprite names that make up the animation sequence
     * @param {number} [fps=10] - Frames per second for the animation playback
     * @param {boolean} [loop=true] - Whether the animation should loop when it reaches the end
     */
    constructor(name, spriteNames = [], fps = 10, loop = true) {
        this.name = name;
        this.spriteNames = spriteNames;
        this.fps = fps;
        this.loop = loop;
    }
}