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

    /**
     * Creates a SpriteAnimationClip from metadata configuration.
     * 
     * @param {Object} metadata - Configuration object for the animation clip
     * @param {string} metadata.name - Unique identifier for the animation clip
     * @param {string[]} [metadata.spriteNames=[]] - Array of sprite names that make up the animation sequence
     * @param {number} [metadata.fps=10] - Frames per second for the animation playback
     * @param {boolean} [metadata.loop=true] - Whether the animation should loop when it reaches the end
     * @returns {SpriteAnimationClip} New SpriteAnimationClip instance
     * 
     * @example
     * const walkClip = SpriteAnimationClip.meta({
     *     name: "walk",
     *     spriteNames: ["walk_0", "walk_1", "walk_2", "walk_3"],
     *     fps: 8,
     *     loop: true
     * });
     */
    static meta(metadata = {}) {
        const defaults = this.getDefaultMeta();
        const config = { ...defaults, ...metadata };
        
        // Validate metadata
        this.validateMeta(config);
        
        return new this(
            config.name,
            config.spriteNames,
            config.fps,
            config.loop
        );
    }

    /**
     * Returns the default metadata configuration for SpriteAnimationClip.
     * 
     * @returns {Object} Default metadata object
     */
    static getDefaultMeta() {
        return {
            name: "",
            spriteNames: [],
            fps: 10,
            loop: true
        };
    }

    /**
     * Validates metadata configuration for SpriteAnimationClip.
     * 
     * @param {Object} metadata - Metadata to validate
     * @throws {Error} If metadata is invalid
     */
    static validateMeta(metadata) {
        if (typeof metadata.name !== 'string') {
            throw new Error('SpriteAnimationClip metadata: name must be a string');
        }
        
        if (metadata.name.trim() === '') {
            throw new Error('SpriteAnimationClip metadata: name cannot be empty');
        }
        
        if (!Array.isArray(metadata.spriteNames)) {
            throw new Error('SpriteAnimationClip metadata: spriteNames must be an array');
        }
        
        if (metadata.spriteNames.some(name => typeof name !== 'string')) {
            throw new Error('SpriteAnimationClip metadata: all spriteNames must be strings');
        }
        
        if (typeof metadata.fps !== 'number' || metadata.fps <= 0) {
            throw new Error('SpriteAnimationClip metadata: fps must be a positive number');
        }
        
        if (typeof metadata.loop !== 'boolean') {
            throw new Error('SpriteAnimationClip metadata: loop must be a boolean');
        }
    }

    /**
     * Applies metadata to this SpriteAnimationClip instance.
     * 
     * @param {Object} metadata - Metadata to apply
     */
    applyMeta(metadata) {
        const defaults = this.constructor.getDefaultMeta();
        const config = { ...defaults, ...metadata };
        
        this.constructor.validateMeta(config);
        
        this.name = config.name;
        this.spriteNames = config.spriteNames;
        this.fps = config.fps;
        this.loop = config.loop;
    }

    /**
     * Converts this SpriteAnimationClip to a metadata object.
     * 
     * @returns {Object} Metadata representation of this clip
     */
    toMeta() {
        return {
            name: this.name,
            spriteNames: [...this.spriteNames], // Create a copy
            fps: this.fps,
            loop: this.loop
        };
    }

    /**
     * Creates a copy of this SpriteAnimationClip.
     * 
     * @returns {SpriteAnimationClip} New SpriteAnimationClip instance with the same properties
     */
    clone() {
        return new SpriteAnimationClip(
            this.name,
            [...this.spriteNames], // Create a copy of the array
            this.fps,
            this.loop
        );
    }
}