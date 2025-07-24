import { Component } from '../../common/Component.js';
import { SpriteRegistry } from '../../asset/SpriteRegistry.js';
import { Vector2 } from '../../math/Vector2.js';

/**
 * SpriteRendererComponent - Unity-inspired sprite rendering component for 2D graphics
 * 
 * This component handles the rendering of sprites from both single sprite assets and spritesheets
 * on GameObjects. It integrates with the unified SpriteRegistry system to display sprites using
 * colon-separated keys ("sheet:sprite" notation). The component supports advanced rendering features
 * including custom scaling, opacity control, color tinting, and sprite flipping.
 * 
 * Key Features:
 * - Single sprite and spritesheet support via unified SpriteRegistry
 * - Custom scaling with width/height options (preserves aspect ratio if only one is set)
 * - Opacity/alpha blending support (0.0 to 1.0)
 * - Color tinting with hex or rgba color formats
 * - Horizontal and vertical sprite flipping
 * - Automatic sprite preloading and validation
 * - Debug gizmos for visual debugging in development
 * - Full metadata system support for declarative creation
 * 
 * Unity Equivalent: SpriteRenderer component
 * 
 * @example
 * // Basic sprite rendering
 * const renderer = new SpriteRendererComponent("player");
 * gameObject.addComponent(renderer);
 * 
 * @example 
 * // Advanced sprite rendering with options
 * const renderer = new SpriteRendererComponent("enemies:boss", {
 *     width: 128,
 *     height: 128,
 *     opacity: 0.8,
 *     color: "#FF6B6B",
 *     flipX: true
 * });
 * gameObject.addComponent(renderer);
 * 
 * @example
 * // Metadata-driven creation (recommended for editors)
 * const renderer = SpriteRendererComponent.meta({
 *     spriteName: "player_idle",
 *     width: 64,
 *     height: 64,
 *     opacity: 0.9,
 *     color: "#FFFFFF",
 *     flipX: false,
 *     flipY: false
 * });
 * gameObject.addComponent(renderer);
 * 
 * @extends Component
 * @author NityJS Team
 * @since 1.0.0
 */
export class SpriteRendererComponent extends Component {
    /**
     * Creates a new SpriteRendererComponent instance.
     * 
     * Initializes the component with a sprite reference and rendering options. The sprite
     * is referenced by key from the SpriteRegistry, supporting both single sprites and
     * spritesheet notation ("sheet:sprite"). All rendering options are optional and will
     * fall back to sensible defaults.
     * 
     * @param {string} spriteName - Unified sprite key for SpriteRegistry lookup
     *                             Format: "spriteName" for single sprites or "sheet:sprite" for spritesheets
     * @param {Object} [options={}] - Rendering configuration options
     * @param {number} [options.width] - Custom width override in pixels (null = use sprite's natural width)
     * @param {number} [options.height] - Custom height override in pixels (null = use sprite's natural height)  
     * @param {number} [options.opacity=1.0] - Sprite transparency/alpha value (0.0 = fully transparent, 1.0 = fully opaque)
     * @param {string} [options.color="#FFFFFF"] - Color tint to apply to sprite (hex "#FF0000" or rgba "rgba(255,0,0,0.5)")
     * @param {boolean} [options.flipX=false] - Horizontally flip the sprite (mirror effect)
     * @param {boolean} [options.flipY=false] - Vertically flip the sprite (upside-down effect)
     * 
     * @throws {Error} Will throw during preload() if the specified sprite is not found in SpriteRegistry
     * 
     * @example
     * // Basic sprite with natural dimensions
     * const basic = new SpriteRendererComponent("player");
     * 
     * @example
     * // Scaled sprite with transparency
     * const scaled = new SpriteRendererComponent("enemy", {
     *     width: 64,
     *     height: 64, 
     *     opacity: 0.7
     * });
     * 
     * @example
     * // Tinted and flipped sprite from spritesheet
     * const advanced = new SpriteRendererComponent("characters:warrior", {
     *     color: "#FF6B6B",
     *     flipX: true,
     *     opacity: 0.9
     * });
     */
    constructor(spriteName, options = {}) {
        super();
        
        /** @type {string} - The sprite key used for SpriteRegistry lookup */
        this.spriteKey = spriteName;
        
        /** @type {Sprite|null} - The loaded sprite object from SpriteRegistry (null until preload()) */
        this.sprite = null;
        
        /** 
         * @type {Object} - Rendering options that control how the sprite is displayed
         * @property {number|null} width - Custom width override (null = natural width)
         * @property {number|null} height - Custom height override (null = natural height)
         * @property {number} opacity - Alpha/transparency value (0.0 to 1.0)
         * @property {string} color - Color tint in hex or rgba format
         * @property {boolean} flipX - Horizontal flip state
         * @property {boolean} flipY - Vertical flip state
         */
        this.options = {
            width: options.width || null,
            height: options.height || null,
            opacity: options.opacity !== undefined ? options.opacity : 1.0,
            color: options.color || "#FFFFFF",
            flipX: options.flipX || false,
            flipY: options.flipY || false
        };
    }

    /**
     * Returns the default metadata configuration for SpriteRendererComponent.
     * 
     * This static method provides the baseline configuration used by the metadata system
     * for creating components declaratively. These defaults ensure consistent behavior
     * across all SpriteRendererComponent instances when properties are not explicitly specified.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.spriteName - Empty string (must be set during creation)
     * @returns {number|null} returns.width - null (use sprite's natural width)
     * @returns {number|null} returns.height - null (use sprite's natural height)  
     * @returns {number} returns.opacity - 1.0 (fully opaque)
     * @returns {string} returns.color - "#FFFFFF" (white, no tinting)
     * @returns {boolean} returns.flipX - false (no horizontal flip)
     * @returns {boolean} returns.flipY - false (no vertical flip)
     * 
     * @example
     * // Get defaults for property panel generation
     * const defaults = SpriteRendererComponent.getDefaultMeta();
     * console.log(defaults.opacity); // 1.0
     * 
     * @example
     * // Use in metadata creation with partial overrides
     * const sprite = SpriteRendererComponent.meta({
     *     ...SpriteRendererComponent.getDefaultMeta(),
     *     spriteName: "player",
     *     opacity: 0.8
     * });
     */
    static getDefaultMeta() {
        return {
            spriteName: "",
            width: null,
            height: null,
            opacity: 1.0,
            color: "#FFFFFF",
            flipX: false,
            flipY: false
        };
    }

    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor-based creation
     * and the metadata system. It takes constructor arguments and converts them to a
     * standardized metadata object that can be validated and applied consistently.
     * Used internally by the component's metadata system integration.
     * 
     * @private
     * @param {string} spriteName - The sprite key for SpriteRegistry lookup
     * @param {Object} [options={}] - Constructor options object
     * @param {number} [options.width] - Custom width override
     * @param {number} [options.height] - Custom height override
     * @param {number} [options.opacity] - Opacity value (0.0 to 1.0)
     * @param {string} [options.color] - Color tint
     * @param {boolean} [options.flipX] - Horizontal flip state
     * @param {boolean} [options.flipY] - Vertical flip state
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(spriteName, options = {}) {
        const metadata = {
            spriteName: spriteName || "",
            width: options.width || null,
            height: options.height || null,
            opacity: options.opacity !== undefined ? options.opacity : 1.0,
            color: options.color || "#FFFFFF",
            flipX: options.flipX || false,
            flipY: options.flipY || false
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
        if (this.__meta.spriteName) {
            this.spriteKey = this.__meta.spriteName;
        }
        
        this.options = {
            width: this.__meta.width,
            height: this.__meta.height,
            opacity: this.__meta.opacity,
            color: this.__meta.color,
            flipX: this.__meta.flipX,
            flipY: this.__meta.flipY
        };
    }

    /**
     * Validates current metadata configuration.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and value ranges. Called automatically when metadata is applied or updated.
     * Provides clear error messages for invalid configurations to aid debugging.
     * Part of the metadata system's type safety and validation infrastructure.
     * 
     * @private
     * @throws {Error} If spriteName is not a string
     * @throws {Error} If width is not null or a positive number
     * @throws {Error} If height is not null or a positive number
     * @throws {Error} If opacity is not between 0 and 1
     * @throws {Error} If color is not a string
     * @throws {Error} If flipX is not a boolean
     * @throws {Error} If flipY is not a boolean
     * 
     * @internal Part of metadata validation system
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (typeof meta.spriteName !== 'string') {
            throw new Error('spriteName must be a string');
        }
        
        if (meta.width !== null && (typeof meta.width !== 'number' || meta.width <= 0)) {
            throw new Error('width must be null or a positive number');
        }
        
        if (meta.height !== null && (typeof meta.height !== 'number' || meta.height <= 0)) {
            throw new Error('height must be null or a positive number');
        }
        
        if (typeof meta.opacity !== 'number' || meta.opacity < 0 || meta.opacity > 1) {
            throw new Error('opacity must be a number between 0 and 1');
        }
        
        if (typeof meta.color !== 'string') {
            throw new Error('color must be a string');
        }
        
        if (typeof meta.flipX !== 'boolean') {
            throw new Error('flipX must be a boolean');
        }
        
        if (typeof meta.flipY !== 'boolean') {
            throw new Error('flipY must be a boolean');
        }
    }

    /**
     * Preloads the sprite from the unified registry.
     * 
     * This method retrieves the sprite resource from SpriteRegistry using the configured
     * sprite key. Called automatically during GameObject preload phase to ensure all
     * required assets are available before rendering begins. Supports both individual
     * sprites and spritesheet sprites using the unified colon notation system.
     * 
     * @throws {Error} If the sprite is not found in SpriteRegistry
     * 
     * @example
     * // Preload is called automatically, but the process loads:
     * // - Individual sprites: "player_idle"
     * // - Spritesheet sprites: "characters:player_idle"
     * 
     * @see {@link SpriteRegistry} For sprite registration and management
     */
    preload() {
        this.sprite = SpriteRegistry.getSprite(this.spriteKey);
        
        if (!this.sprite) {
            throw new Error(`Sprite '${this.spriteKey}' not found in SpriteRegistry. Make sure the sprite or spritesheet is loaded.`);
        }
    }

    /**
     * Renders the sprite to the canvas with full feature support.
     * 
     * This is the core rendering method that draws the sprite at the GameObject's
     * global position with support for:
     * - Custom dimensions (width/height overrides)
     * - Opacity/transparency rendering
     * - Color tinting with multiple format support
     * - Horizontal and vertical flipping
     * - Rotation following GameObject transform
     * - Automatic sprite center-point alignment
     * 
     * Called automatically during the engine's render phase. Handles missing or
     * unloaded sprites gracefully with debug logging. Uses canvas transform
     * operations for efficient rendering with proper state management.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     * 
     * @example
     * // Rendering happens automatically, but this method provides:
     * // - Sprite positioning at GameObject.position
     * // - Rotation from GameObject.rotation
     * // - Custom scaling from width/height options
     * // - Opacity blending from opacity option
     * // - Color tinting from color option
     * // - Sprite flipping from flipX/flipY options
     * 
     * @see {@link GameObject#getGlobalPosition} For position calculation
     * @see {@link GameObject#getGlobalRotation} For rotation handling
     */
    __draw(ctx) {
        if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) {
            console.log(`Sprite '${this.spriteKey}' is not loaded or does not exist.`);
            return;
        }
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        // Get dimensions (custom or natural)
        const width = this.options.width || this.sprite.width;
        const height = this.options.height || this.sprite.height;
        
        // Check if we need any special rendering
        const needsOpacity = this.options.opacity !== 1.0;
        const needsTinting = this.options.color !== "#FFFFFF";
        
        // Apply opacity if needed
        if (needsOpacity) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, this.options.opacity));
        }
        
        // Draw the sprite with flipping support
        let scaleX = 1, scaleY = 1;
        if (this.options.flipX) scaleX = -1;
        if (this.options.flipY) scaleY = -1;
        // Simple case - use existing sprite draw method (handles rotation properly)
        this.sprite.draw(ctx, position.x, position.y, width, height, rotation, scaleX, scaleY);
        
        // Apply color tinting if needed using source-atop blend mode
        if (needsTinting) {
            ctx.save();
            
            // Use source-atop to only tint existing pixels
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = this.options.color;
            
            // Sprites are drawn from center, so we need to adjust the tint rectangle position
            if (rotation !== 0) {
                ctx.translate(position.x, position.y);
                ctx.rotate(rotation);
                ctx.fillRect(-width / 2, -height / 2, width, height);
            } else {
                // Draw tint rectangle from center position (same as sprite)
                ctx.fillRect(position.x - width / 2, position.y - height / 2, width, height);
            }
            
            ctx.restore();
        }
        
        // Restore opacity context if it was applied
        if (needsOpacity) {
            ctx.restore();
        }
    }

    /**
     * Changes the sprite being rendered using unified sprite key.
     * 
     * Dynamically updates the sprite resource while preserving all other rendering
     * options like scale, opacity, color tinting, and flipping. Supports both
     * individual sprites and spritesheet sprites using the unified colon notation.
     * Useful for sprite swapping, animation frame changes, or state-based visuals.
     * 
     * @param {string} newSpriteKey - New sprite key for SpriteRegistry lookup
     *   - Individual sprite: "player_idle"
     *   - Spritesheet sprite: "characters:player_idle"
     * 
     * @example
     * // Change to different sprite
     * spriteRenderer.setSprite("player_running");
     * 
     * @example
     * // Change to spritesheet sprite
     * spriteRenderer.setSprite("characters:enemy_walk");
     * 
     * @example
     * // Dynamic sprite switching based on game state
     * if (player.isMoving) {
     *     spriteRenderer.setSprite("player_walk");
     * } else {
     *     spriteRenderer.setSprite("player_idle");
     * }
     */
    setSprite(newSpriteKey) {
        this.spriteKey = newSpriteKey;
        this.sprite = SpriteRegistry.getSprite(newSpriteKey);
        
        if (!this.sprite) {
            console.warn(`Sprite '${newSpriteKey}' not found in SpriteRegistry.`);
        }
    }

    /**
     * Sets custom scale dimensions for the sprite.
     * 
     * Overrides the sprite's natural dimensions with custom width and height values.
     * Useful for consistent sizing across different sprite assets or dynamic scaling
     * effects. Does not affect the sprite's aspect ratio unless both dimensions
     * are provided. Set to null to revert to natural sprite dimensions.
     * 
     * @param {number} width - Custom width in pixels (or null for natural width)
     * @param {number} height - Custom height in pixels (or null for natural height)
     * 
     * @example
     * // Set custom dimensions
     * spriteRenderer.setScale(64, 64);
     * 
     * @example
     * // Scale sprite to 2x size while maintaining aspect ratio
     * const sprite = spriteRenderer.sprite;
     * spriteRenderer.setScale(sprite.width * 2, sprite.height * 2);
     * 
     * @example
     * // Dynamic scaling based on game state
     * const scale = player.powerLevel * 1.2;
     * spriteRenderer.setScale(32 * scale, 32 * scale);
     */
    setScale(width, height) {
        this.options.width = width;
        this.options.height = height;
    }

    /**
     * Updates sprite rendering options with new values.
     * 
     * Merges new options with existing configuration, allowing partial updates
     * of rendering properties. Useful for batch updates or when you want to
     * change multiple properties at once while preserving others. Accepts the
     * same options object structure as the constructor.
     * 
     * @param {Object} newOptions - New options to merge with existing configuration
     * @param {number} [newOptions.width] - Custom width override
     * @param {number} [newOptions.height] - Custom height override
     * @param {number} [newOptions.opacity] - Opacity value (0.0 to 1.0)
     * @param {string} [newOptions.color] - Color tint
     * @param {boolean} [newOptions.flipX] - Horizontal flip state
     * @param {boolean} [newOptions.flipY] - Vertical flip state
     * 
     * @example
     * // Update multiple properties at once
     * spriteRenderer.setOptions({
     *     opacity: 0.8,
     *     color: "#FF6B6B",
     *     flipX: true
     * });
     * 
     * @example
     * // Conditional property updates
     * const damageEffect = { color: "#FF0000", opacity: 0.6 };
     * if (player.isHurt) {
     *     spriteRenderer.setOptions(damageEffect);
     * }
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }

    /**
     * Gets the actual rendered width of the sprite.
     * 
     * Returns the effective width that will be used for rendering, which is either
     * the custom width override (if set) or the sprite's natural width. Useful for
     * collision detection, UI layout calculations, or positioning other elements
     * relative to the sprite's visual bounds.
     * 
     * @returns {number} The rendered width in pixels, or 0 if no sprite is loaded
     * 
     * @example
     * // Get current rendered size for positioning
     * const width = spriteRenderer.getRenderedWidth();
     * const height = spriteRenderer.getRenderedHeight();
     * 
     * @example
     * // Center another object relative to this sprite
     * const spriteWidth = spriteRenderer.getRenderedWidth();
     * otherObject.position.x = this.gameObject.position.x + spriteWidth / 2;
     * 
     * @see {@link getRenderedHeight} For height equivalent
     */
    getRenderedWidth() {
        if (!this.sprite) return 0;
        return this.options.width || this.sprite.width;
    }

    /**
     * Gets the actual rendered height of the sprite.
     * 
     * Returns the effective height that will be used for rendering, which is either
     * the custom height override (if set) or the sprite's natural height. Useful for
     * collision detection, UI layout calculations, or positioning other elements
     * relative to the sprite's visual bounds.
     * 
     * @returns {number} The rendered height in pixels, or 0 if no sprite is loaded
     * 
     * @example
     * // Get current rendered size for collision bounds
     * const width = spriteRenderer.getRenderedWidth();
     * const height = spriteRenderer.getRenderedHeight();
     * const bounds = { width, height };
     * 
     * @example
     * // Stack objects vertically with proper spacing
     * const spriteHeight = spriteRenderer.getRenderedHeight();
     * nextObject.position.y = this.gameObject.position.y + spriteHeight + padding;
     * 
     * @see {@link getRenderedWidth} For width equivalent
     */
    getRenderedHeight() {
        if (!this.sprite) return 0;
        return this.options.height || this.sprite.height;
    }

    /**
     * Gets the current opacity of the sprite.
     * 
     * Returns the transparency level being applied to the sprite during rendering.
     * Opacity affects how transparent or opaque the sprite appears, with 1.0 being
     * fully opaque and 0.0 being fully transparent. Useful for fade effects,
     * UI state indication, or visual feedback systems.
     * 
     * @returns {number} The opacity value between 0.0 (transparent) and 1.0 (opaque)
     * 
     * @example
     * // Check current visibility level
     * const currentOpacity = spriteRenderer.getOpacity();
     * if (currentOpacity < 0.5) {
     *     console.log("Sprite is fading out");
     * }
     * 
     * @example
     * // Fade effect implementation
     * const fadeSpeed = 2.0 * Time.deltaTime;
     * const newOpacity = Math.max(0, spriteRenderer.getOpacity() - fadeSpeed);
     * spriteRenderer.setOpacity(newOpacity);
     * 
     * @see {@link setOpacity} For updating opacity
     */
    getOpacity() {
        return this.options.opacity;
    }

    /**
     * Sets the opacity of the sprite.
     * 
     * Controls the transparency level for sprite rendering. Values are automatically
     * clamped to the valid range of 0.0 to 1.0. Opacity affects the entire sprite
     * uniformly and can be combined with color tinting. Commonly used for fade
     * effects, UI state changes, damage indication, or object highlighting.
     * 
     * @param {number} opacity - Opacity value between 0.0 (transparent) and 1.0 (opaque)
     *   Values outside this range are automatically clamped
     * 
     * @example
     * // Fade out effect
     * spriteRenderer.setOpacity(0.3);
     * 
     * @example
     * // Dynamic opacity based on health
     * const healthPercent = player.health / player.maxHealth;
     * spriteRenderer.setOpacity(0.3 + (healthPercent * 0.7)); // 30% to 100% opacity
     * 
     * @example
     * // Blinking effect for invincibility
     * const blinkSpeed = 5.0;
     * const opacity = Math.abs(Math.sin(Time.time * blinkSpeed));
     * spriteRenderer.setOpacity(opacity);
     * 
     * @see {@link getOpacity} For reading current opacity
     */
    setOpacity(opacity) {
        this.options.opacity = Math.max(0, Math.min(1, opacity));
    }

    /**
     * Gets the current tint color of the sprite.
     * 
     * Returns the color being applied as a tint overlay to the sprite during
     * rendering. The tint color modifies the sprite's appearance while preserving
     * its original transparency and details. White (#FFFFFF) means no tinting
     * is applied, while other colors will blend with the sprite's pixels.
     * 
     * @returns {string} The tint color in the format it was set (hex, rgb, rgba, or color name)
     * 
     * @example
     * // Check current tint state
     * const currentColor = spriteRenderer.getColor();
     * if (currentColor !== "#FFFFFF") {
     *     console.log("Sprite is currently tinted");
     * }
     * 
     * @example
     * // Save and restore color state
     * const originalColor = spriteRenderer.getColor();
     * spriteRenderer.setColor("#FF0000"); // Apply damage effect
     * setTimeout(() => {
     *     spriteRenderer.setColor(originalColor); // Restore
     * }, 500);
     * 
     * @see {@link setColor} For updating the tint color
     */
    getColor() {
        return this.options.color;
    }

    /**
     * Sets the tint color of the sprite.
     * 
     * Applies a color overlay to the sprite during rendering, allowing for visual
     * effects like damage indication, power-ups, team colors, or environmental
     * lighting. Supports multiple color formats including hex, rgb, rgba, and
     * named colors. The tinting preserves the sprite's original alpha channel
     * and detail while blending the color multiplicatively.
     * 
     * @param {string} color - Tint color in various formats:
     *   - Hex: "#FF0000", "#F00"
     *   - RGB: "rgb(255, 0, 0)"
     *   - RGBA: "rgba(255, 0, 0, 0.8)"
     *   - Named: "red", "blue", "green"
     *   - No tint: "#FFFFFF" or "white"
     * 
     * @example
     * // Apply red damage tint
     * spriteRenderer.setColor("#FF0000");
     * 
     * @example
     * // Team-based coloring
     * const teamColors = { red: "#FF6B6B", blue: "#4ECDC4", green: "#45B7D1" };
     * spriteRenderer.setColor(teamColors[player.team]);
     * 
     * @example
     * // Dynamic environmental tinting
     * const timeOfDay = Game.getTimeOfDay();
     * if (timeOfDay === "night") {
     *     spriteRenderer.setColor("rgba(100, 100, 200, 0.7)"); // Blue night tint
     * } else {
     *     spriteRenderer.setColor("#FFFFFF"); // No tint during day
     * }
     * 
     * @example
     * // Power-up glow effect
     * spriteRenderer.setColor("#FFD700"); // Golden tint for power-up
     * 
     * @see {@link getColor} For reading current tint color
     */
    setColor(color) {
        this.options.color = color;
    }

    /**
     * Gets the current horizontal flip state of the sprite.
     * 
     * Returns whether the sprite is currently being rendered flipped horizontally
     * (mirrored along the Y-axis). Horizontal flipping is commonly used for
     * character facing direction, creating sprite variations, or mirror effects
     * without requiring separate sprite assets.
     * 
     * @returns {boolean} True if the sprite is flipped horizontally, false otherwise
     * 
     * @example
     * // Check current facing direction
     * const facingLeft = spriteRenderer.getFlipX();
     * if (facingLeft) {
     *     console.log("Character is facing left");
     * }
     * 
     * @example
     * // Conditional movement logic based on flip state
     * const isFlipped = spriteRenderer.getFlipX();
     * const moveDirection = isFlipped ? -1 : 1;
     * this.gameObject.position.x += moveSpeed * moveDirection;
     * 
     * @see {@link setFlipX} For updating horizontal flip state
     * @see {@link getFlipY} For vertical flip state
     */
    getFlipX() {
        return this.options.flipX;
    }

    /**
     * Sets the horizontal flip state of the sprite.
     * 
     * Controls whether the sprite is rendered flipped horizontally (mirrored along
     * the Y-axis). This is an efficient way to create directional sprites without
     * needing separate left/right facing assets. Commonly used for character
     * movement, projectile direction, or creating mirror effects.
     * 
     * @param {boolean} flipX - True to flip horizontally, false for normal orientation
     * 
     * @example
     * // Character facing direction
     * const movingRight = velocity.x > 0;
     * spriteRenderer.setFlipX(!movingRight); // Flip when moving left
     * 
     * @example
     * // Projectile direction based on shooter's facing
     * const bullet = new GameObject();
     * const bulletSprite = bullet.addComponent(SpriteRendererComponent, "bullet");
     * bulletSprite.setFlipX(shooter.facingLeft);
     * 
     * @example
     * // Mirror effect for reflections
     * const reflection = player.clone();
     * const reflectionSprite = reflection.getComponent(SpriteRendererComponent);
     * reflectionSprite.setFlipX(true);
     * reflectionSprite.setOpacity(0.5);
     * 
     * @see {@link getFlipX} For reading current horizontal flip state
     * @see {@link setFlipY} For vertical flip control
     */
    setFlipX(flipX) {
        this.options.flipX = flipX;
    }

    /**
     * Gets the current vertical flip state of the sprite.
     * 
     * Returns whether the sprite is currently being rendered flipped vertically
     * (mirrored along the X-axis). Vertical flipping is useful for effects like
     * upside-down states, gravity inversion, reflection effects, or creating
     * sprite variations without additional assets.
     * 
     * @returns {boolean} True if the sprite is flipped vertically, false otherwise
     * 
     * @example
     * // Check if sprite is upside down
     * const upsideDown = spriteRenderer.getFlipY();
     * if (upsideDown) {
     *     console.log("Sprite is inverted");
     * }
     * 
     * @example
     * // Gravity-based flipping logic
     * const gravityReversed = spriteRenderer.getFlipY();
     * const gravityDirection = gravityReversed ? -1 : 1;
     * 
     * @see {@link setFlipY} For updating vertical flip state
     * @see {@link getFlipX} For horizontal flip state
     */
    getFlipY() {
        return this.options.flipY;
    }

    /**
     * Sets the vertical flip state of the sprite.
     * 
     * Controls whether the sprite is rendered flipped vertically (mirrored along
     * the X-axis). This creates an upside-down effect and is useful for gravity
     * inversion mechanics, ceiling walking, reflection effects, or special game
     * states. Can be combined with horizontal flipping for complete orientation.
     * 
     * @param {boolean} flipY - True to flip vertically, false for normal orientation
     * 
     * @example
     * // Gravity inversion effect
     * if (player.gravityReversed) {
     *     spriteRenderer.setFlipY(true);
     * } else {
     *     spriteRenderer.setFlipY(false);
     * }
     * 
     * @example
     * // Ceiling walking mechanic
     * const onCeiling = player.position.y < ceilingThreshold;
     * spriteRenderer.setFlipY(onCeiling);
     * 
     * @example
     * // Water reflection effect
     * const waterReflection = player.clone();
     * const reflectionSprite = waterReflection.getComponent(SpriteRendererComponent);
     * reflectionSprite.setFlipY(true);
     * reflectionSprite.setOpacity(0.3);
     * waterReflection.position.y = waterSurface + (waterSurface - player.position.y);
     * 
     * @see {@link getFlipY} For reading current vertical flip state
     * @see {@link setFlipX} For horizontal flip control
     */
    setFlipY(flipY) {
        this.options.flipY = flipY;
    }

    /**
     * Draws visual debugging gizmos for the sprite renderer.
     * 
     * This internal method renders debugging information to help developers visualize
     * sprite bounds, positioning, and configuration. Shows a magenta dashed rectangle
     * around the sprite's rendered area, a center point indicator, the sprite key
     * label, and actual dimensions. Only visible when internal gizmos are enabled
     * in the Game instance settings.
     * 
     * Gizmo elements displayed:
     * - Dashed magenta rectangle showing rendered sprite bounds
     * - Solid center point circle for position reference
     * - Sprite key text label above the sprite
     * - Dimensions text below the sprite
     * - Proper rotation handling to match sprite orientation
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context for drawing gizmos
     * 
     * @private
     * @internal This method is part of the debugging visualization system
     * 
     * @example
     * // Gizmos are automatically drawn when enabled:
     * // Game.instance._internalGizmos = true;
     * // - Magenta dashed border shows sprite bounds
     * // - Center dot shows exact position
     * // - Labels show sprite key and dimensions
     * 
     * @see {@link Game#_internalGizmos} For enabling gizmo rendering
     */
    __internalGizmos(ctx) {
        if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation to gizmos as well
        ctx.translate(position.x, position.y);
        if (rotation !== 0) ctx.rotate(rotation);
        
        // Set gizmo styling - magenta for sprite renderers (matching ImageComponent)
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]); // Same dash pattern as ImageComponent
        
        // Get actual rendered dimensions (custom scale or natural size)
        const width = this.getRenderedWidth();
        const height = this.getRenderedHeight();
        
        // Draw the sprite bounds rectangle (centered)
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        
        // Draw center point
        ctx.setLineDash([]); // Solid line for center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw sprite key label
        ctx.fillStyle = '#FF00FF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.spriteKey, 0, -height / 2 - 8);
        
        // Draw dimensions
        ctx.fillText(`${width}x${height}`, 0, height / 2 + 15);
        
        ctx.restore();
    }
}