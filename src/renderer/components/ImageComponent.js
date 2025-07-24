import { Component } from '../../common/Component.js';
/**
 * A component for rendering images on GameObjects with advanced features and metadata support.
 * 
 * ImageComponent provides flexible image rendering capabilities including custom dimensions,
 * automatic loading, center-based positioning, rotation support, and visual debugging. Unlike
 * SpriteRendererComponent which works with the SpriteRegistry system, ImageComponent loads
 * images directly from URLs, making it ideal for dynamic content, user-generated images,
 * or external assets.
 * 
 * **Key Features:**
 * - Direct URL-based image loading with async preloading
 * - Custom width/height override with automatic fallback to natural dimensions  
 * - Center-based positioning compatible with Unity-style transforms
 * - Full rotation support following GameObject transform
 * - Comprehensive metadata system for configuration and serialization
 * - Visual debugging with bounds and dimension display
 * - Promise-based loading for proper async handling
 * 
 * **Unity Equivalent:** Similar to Unity's SpriteRenderer but with direct URL loading
 * 
 * **Metadata Support:** Fully integrated with the metadata system for:
 * - Scene serialization and deserialization
 * - Runtime configuration updates
 * - Factory-style creation with `.meta()` static method
 * - Constructor argument validation and mapping
 * 
 * @class ImageComponent
 * @extends Component
 * 
 * @example
 * // Basic usage with constructor
 * const imageComp = obj.addComponent(ImageComponent, "./assets/logo.png");
 * 
 * @example
 * // With custom dimensions
 * const imageComp = obj.addComponent(ImageComponent, "./assets/banner.jpg", 200, 100);
 * 
 * @example
 * // Using metadata factory method
 * const imageComp = ImageComponent.meta({
 *     src: "./assets/profile.png",
 *     width: 64,
 *     height: 64
 * });
 * obj.addComponent(imageComp);
 * 
 * @example
 * // Dynamic image loading with proper async handling
 * const obj = new GameObject();
 * const imageComp = obj.addComponent(ImageComponent, userAvatarUrl);
 * await imageComp.preload(); // Ensure loaded before rendering
 */
export class ImageComponent extends Component {
    /**
     * Creates a new ImageComponent with specified source URL and optional dimensions.
     * 
     * Initializes the component with a source URL for image loading and optional custom
     * dimensions. If width/height are not provided, the component will use the image's
     * natural dimensions after loading. The component integrates with the metadata system
     * for configuration management and validation.
     * 
     * The image is not loaded immediately - call preload() or let the GameObject's
     * preload phase handle it automatically. This allows for proper async loading
     * management and prevents blocking the main thread.
     * 
     * @param {string} src - The source URL of the image to be loaded
     *   - Relative paths: "./assets/image.png"
     *   - Absolute URLs: "https://example.com/image.jpg"  
     *   - Data URLs: "data:image/png;base64,..."
     * @param {number} [width=null] - Custom width for rendering (pixels)
     *   - If null, uses image's natural width after loading
     *   - If specified, scales the image to this width
     * @param {number} [height=null] - Custom height for rendering (pixels)
     *   - If null, uses image's natural height after loading
     *   - If specified, scales the image to this height
     * 
     * @example
     * // Basic image with natural dimensions
     * const logo = obj.addComponent(ImageComponent, "./assets/logo.png");
     * 
     * @example
     * // Scaled image with custom dimensions
     * const banner = obj.addComponent(ImageComponent, "./assets/banner.jpg", 400, 100);
     * 
     * @example
     * // External image with aspect ratio preservation
     * const avatar = obj.addComponent(ImageComponent, avatarUrl, 64, 64);
     * 
     * @throws {Error} Via metadata validation if parameters are invalid types
     * 
     * @see {@link preload} For async image loading
     * @see {@link ImageComponent.meta} For metadata-based creation
     */
    constructor(src, width = null, height = null) {
        super();
        this.src = src;
        this.image = null;
        this.width = width;
        this.height = height;
    }

    /**
     * Provides default metadata configuration for ImageComponent instances.
     * 
     * This static method returns the baseline configuration that defines the structure
     * and default values for all ImageComponent metadata. Used by the metadata system
     * for initialization, validation, and ensuring consistent component configuration.
     * Forms the foundation for both constructor-based and factory-based component creation.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.src - Default empty source URL ("")
     * @returns {number|null} returns.width - Default width (null = use natural width)
     * @returns {number|null} returns.height - Default height (null = use natural height)
     * 
     * @example
     * // Get default configuration structure
     * const defaults = ImageComponent.getDefaultMeta();
     * console.log(defaults); // { src: "", width: null, height: null }
     * 
     * @example
     * // Use as template for custom configuration
     * const config = { ...ImageComponent.getDefaultMeta(), src: "./my-image.png" };
     * const imageComp = ImageComponent.meta(config);
     */
    static getDefaultMeta() {
        return {
            src: "",
            width: null,
            height: null
        };
    }

    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor calls and
     * the metadata system. It takes the constructor parameters and converts them to
     * a standardized metadata object that can be validated and applied consistently.
     * Essential for ensuring constructor-based creation works seamlessly with the
     * metadata infrastructure.
     * 
     * @private
     * @param {string} src - The source URL of the image to be loaded
     * @param {number} [width=null] - Optional custom width for rendering
     * @param {number} [height=null] - Optional custom height for rendering
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(src, width = null, height = null) {
        const metadata = {
            src: src || "",
            width: width,
            height: height
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Updates component properties from current metadata configuration.
     * 
     * This private method synchronizes the component's internal properties with the
     * current metadata state. Called automatically when metadata is applied or updated,
     * ensuring the component reflects the latest configuration. Handles image resource
     * management by resetting the loaded image when the source URL changes.
     * 
     * @private
     * 
     * @internal Handles automatic image reset when src changes to prevent stale resources
     */
    _updatePropertiesFromMeta() {
        this.src = this.__meta.src;
        this.width = this.__meta.width;
        this.height = this.__meta.height;
        
        // Reset image when src changes
        if (this.image && this.image.src !== this.src) {
            this.image = null;
        }
    }

    /**
     * Validates current metadata configuration for type safety and value ranges.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and valid value ranges. Called automatically when metadata is applied or updated
     * to provide immediate feedback on configuration errors. Essential for maintaining
     * component integrity and preventing runtime errors during rendering.
     * 
     * @private
     * @throws {Error} If src is not a string
     * @throws {Error} If width is not null or a positive number  
     * @throws {Error} If height is not null or a positive number
     * 
     * @internal Part of metadata validation system for type safety
     */
    _validateMeta() {
        const meta = this.__meta;
        
        if (typeof meta.src !== 'string') {
            throw new Error('src must be a string');
        }
        
        if (meta.width !== null && (typeof meta.width !== 'number' || meta.width <= 0)) {
            throw new Error('width must be null or a positive number');
        }
        
        if (meta.height !== null && (typeof meta.height !== 'number' || meta.height <= 0)) {
            throw new Error('height must be null or a positive number');
        }
    }

    /**
     * Asynchronously preloads the image from the source URL.
     * 
     * This method handles the async loading of the image resource, creating a new Image
     * object and waiting for it to fully load before resolving. Called automatically
     * during the GameObject's preload phase, but can also be called manually for
     * explicit loading control. Sets up automatic fallback to natural dimensions
     * if custom width/height were not specified.
     * 
     * The loading is promise-based to ensure proper async handling and prevent
     * rendering attempts on unloaded images. Essential for smooth gameplay and
     * preventing visual glitches from missing assets.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the image is fully loaded
     *   and ready for rendering
     * 
     * @example
     * // Manual preloading with error handling
     * try {
     *     await imageComponent.preload();
     *     console.log("Image loaded successfully");
     * } catch (error) {
     *     console.error("Failed to load image:", error);
     * }
     * 
     * @example
     * // Preload before adding to scene
     * const imageComp = new ImageComponent("./assets/player.png");
     * await imageComp.preload();
     * gameObject.addComponent(imageComp);
     * 
     * @throws {Error} Implicitly if the image fails to load (network error, invalid URL, etc.)
     * 
     * @see {@link GameObject#preload} For automatic preloading during scene setup
     */
    async preload() {
        return new Promise(resolve => {
            const img = new Image();
            img.src = this.src;
            img.onload = () => {
                this.image = img;
                // Fallback to natural size if width/height not provided
                if (this.width === null) this.width = img.width;
                if (this.height === null) this.height = img.height;
                resolve();
            };
        });
    }

    /**
     * Renders the image to the canvas with full transform support.
     * 
     * This is the core rendering method that draws the loaded image at the GameObject's
     * global position with complete transform support including rotation. The image is
     * drawn centered on the position (Unity-style) rather than from the top-left corner,
     * providing intuitive positioning behavior for game objects.
     * 
     * Features:
     * - Center-based positioning for intuitive object placement
     * - Full rotation support following GameObject transform
     * - Custom or natural dimension rendering
     * - Proper canvas state management with save/restore
     * - Graceful handling of unloaded images
     * 
     * Called automatically during the engine's render phase. Only renders if the
     * image has been successfully loaded via preload().
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     * 
     * @example
     * // Drawing happens automatically, but this method provides:
     * // - Image positioning at GameObject.position (center-based)
     * // - Rotation from GameObject.rotation  
     * // - Scaling from width/height properties
     * // - Proper layering with canvas state management
     * 
     * @see {@link GameObject#getGlobalPosition} For position calculation
     * @see {@link GameObject#getGlobalRotation} For rotation handling
     * @see {@link preload} For ensuring image is loaded before rendering
     */
    draw(ctx) {
        if (this.image) {
            const position = this.gameObject.getGlobalPosition();
            const rotation = this.gameObject.getGlobalRotation();

            ctx.save();
            
            // Translate to the GameObject's position
            ctx.translate(position.x, position.y);
            
            // Apply rotation if any
            if (rotation !== 0) {
                ctx.rotate(rotation);
            }
            
            // Draw image centered on the position (like Unity)
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            
            ctx.restore();
        }
    }

    /**
     * Draws visual debugging gizmos for the image component.
     * 
     * This internal method renders debugging information to help developers visualize
     * image bounds, positioning, and configuration. Shows a magenta dashed rectangle
     * around the image's rendered area, a center point indicator, the filename label,
     * and actual dimensions. Only visible when internal gizmos are enabled in the
     * Game instance settings.
     * 
     * Gizmo elements displayed:
     * - Dashed magenta rectangle showing rendered image bounds
     * - Solid center point circle for position reference  
     * - Filename text label above the image (extracted from src URL)
     * - Dimensions text below the image showing current width x height
     * - Proper rotation handling to match image orientation
     * 
     * Uses a distinctive dash pattern (4,2) to differentiate from other component gizmos
     * while maintaining the standard magenta color scheme for visual consistency.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context for drawing gizmos
     * 
     * @private
     * @internal This method is part of the debugging visualization system
     * 
     * @example
     * // Gizmos are automatically drawn when enabled:
     * // Game.instance._internalGizmos = true;
     * // - Magenta dashed border shows image bounds
     * // - Center dot shows exact position
     * // - Filename and dimensions provide asset information
     * 
     * @see {@link Game#_internalGizmos} For enabling gizmo rendering
     */
    __internalGizmos(ctx) {
        if (!this.image) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation to gizmos as well
        ctx.translate(position.x, position.y);
        if (rotation !== 0) ctx.rotate(rotation);
        
        // Set gizmo styling - magenta for image components
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]); // Different dash pattern for images
        
        // Draw the image bounds rectangle (centered)
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw center point
        ctx.setLineDash([]); // Solid line for center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw image source label
        ctx.fillStyle = '#FF00FF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const filename = this.src.split('/').pop(); // Get just the filename
        ctx.fillText(filename, 0, -this.height / 2 - 8);
        
        // Draw dimensions
        ctx.fillText(`${this.width}x${this.height}`, 0, this.height / 2 + 15);
        
        ctx.restore();
    }
}
3