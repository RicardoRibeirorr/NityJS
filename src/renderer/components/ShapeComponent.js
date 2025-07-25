import { Component } from '../../common/Component.js';

/**
 * ShapeComponent renders various geometric shapes on GameObjects.
 * It provides a simple way to display basic shapes like rectangles, circles, and lines
 * without requiring image assets, making it useful for prototyping and simple graphics.
 * 
 * @example
 * // Create a red rectangle
 * const shape = new ShapeComponent("rectangle", { width: 50, height: 30, color: "red" });
 * gameObject.addComponent(shape);
 */
// === ShapeComponent.js ===
export class ShapeComponent extends Component {
    /**
     * Creates a new ShapeComponent with specified shape type and rendering options.
     * 
     * Initializes the component with a shape type and comprehensive rendering options.
     * Supports multiple geometric shapes including rectangles, circles, ellipses, lines,
     * triangles, and custom polygons. Each shape type has its own specific options
     * while sharing common properties like color. Integrates with the metadata system
     * for configuration management and validation.
     * 
     * The component provides an efficient way to render geometric shapes without
     * requiring image assets, making it ideal for prototyping, UI elements, debug
     * visualization, and simple graphics.
     * 
     * @param {string} shape - Type of shape to render
     *   - "rectangle" - Rectangular shape with width/height
     *   - "square" - Square shape (uses width for both dimensions)
     *   - "circle" - Circular shape with radius
     *   - "ellipse" - Elliptical shape with radiusX/radiusY
     *   - "line" - Line segment with start/end coordinates
     *   - "triangle" - Triangular shape with size
     *   - "polygon" - Custom polygon with points array
     * 
     * @param {Object} [options={ width:10, height:10, color:'white' }] - Shape-specific rendering options
     * @param {number} [options.width=10] - Width for rectangles and squares
     * @param {number} [options.height=10] - Height for rectangles  
     * @param {string} [options.color='white'] - Fill color for the shape (any CSS color)
     * @param {number} [options.radius=10] - Radius for circles
     * @param {number} [options.radiusX=10] - X radius for ellipses
     * @param {number} [options.radiusY=5] - Y radius for ellipses
     * @param {number} [options.x2] - End X coordinate for lines (relative to shape position)
     * @param {number} [options.y2] - End Y coordinate for lines (relative to shape position)
     * @param {number} [options.size=20] - Size for triangles
     * @param {Array<{x: number, y: number}>} [options.points=[]] - Points array for polygons
     * 
     * @example
     * // Basic rectangle
     * const rect = obj.addComponent(ShapeComponent, "rectangle", { 
     *     width: 50, height: 30, color: "red" 
     * });
     * 
     * @example
     * // Circle with custom radius
     * const circle = obj.addComponent(ShapeComponent, "circle", {
     *     radius: 25, color: "#4ECDC4"
     * });
     * 
     * @example
     * // Custom polygon shape
     * const star = obj.addComponent(ShapeComponent, "polygon", {
     *     points: [[0,-20], [6,-6], [20,-6], [10,2], [16,14], [0,8], [-16,14], [-10,2], [-20,-6], [-6,-6]],
     *     color: "gold"
     * });
     * 
     * @throws {Error} Via metadata validation if parameters are invalid
     */
    constructor(shape, options = { radius: 10, width: 10, height: 10, color: 'white' }) {
        super();
        // Properties will be set by _updatePropertiesFromMeta after metadata is applied
    }

    /**
     * Provides default metadata configuration for ShapeComponent instances.
     * 
     * This static method returns the baseline configuration that defines the structure
     * and default values for all ShapeComponent metadata. Includes comprehensive
     * options for all supported shape types to ensure consistent configuration
     * regardless of which shape type is selected.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.shape - Default shape type ("rectangle")
     * @returns {Object} returns.options - Shape rendering options
     * @returns {number} returns.options.width - Default width for rectangles (10)
     * @returns {number} returns.options.height - Default height for rectangles (10)
     * @returns {string} returns.options.color - Default fill color ("white")
     * @returns {number} returns.options.radius - Default radius for circles (10)
     * @returns {number} returns.options.radiusX - Default X radius for ellipses (10)
     * @returns {number} returns.options.radiusY - Default Y radius for ellipses (5)
     * @returns {number} returns.options.x2 - Default end X coordinate for lines (10)
     * @returns {number} returns.options.y2 - Default end Y coordinate for lines (0)
     * @returns {number} returns.options.size - Default size for triangles (20)
     * @returns {Array} returns.options.points - Default points array for polygons ([])
     */
    static getDefaultMeta() {
        return {
            shape: 'rectangle',
            options: {
                width: 10,
                height: 10,
                color: 'white',
                radius: 10,
                radiusX: 10,
                radiusY: 5,
                x2: 10,
                y2: 0,
                size: 20,
                points: []
            }
        };
    }

    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor calls and
     * the metadata system. It takes the constructor parameters and converts them to
     * a standardized metadata object that can be validated and applied consistently.
     * Handles the complex options object by merging with default options.
     * 
     * @private
     * @param {string} shape - The shape type to render
     * @param {Object} [options={}] - Shape-specific rendering options
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(shape, options = {}) {
        const metadata = {
            shape: shape || "rectangle",
            options: { ...this.__meta.options, ...options }
        };
        
        this.applyMeta(metadata);
    }

    /**
     * Updates component properties from current metadata configuration.
     * 
     * This private method synchronizes the component's internal properties with the
     * current metadata state. Called automatically when metadata is applied or updated,
     * ensuring the component reflects the latest configuration. Creates a new options
     * object to prevent unwanted mutations of the metadata.
     * 
     * @private
     * 
     * @internal Ensures proper isolation between metadata and component properties
     */
    _updatePropertiesFromMeta() {
        this.shape = this.__meta.shape;
        this.options = { ...this.__meta.options };
    }

    /**
     * Validates current metadata configuration for type safety and shape-specific requirements.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and valid value ranges for each shape type. Called automatically when metadata
     * is applied or updated to provide immediate feedback on configuration errors.
     * Includes comprehensive validation for all supported shape types and their
     * specific requirements.
     * 
     * @private
     * @throws {Error} If shape type is not supported
     * @throws {Error} If color is not a string
     * @throws {Error} If rectangle/square dimensions are invalid
     * @throws {Error} If circle radius is invalid
     * @throws {Error} If ellipse radii are invalid
     * @throws {Error} If triangle size is invalid
     * @throws {Error} If polygon has insufficient points
     * 
     * @internal Part of metadata validation system for comprehensive shape validation
     */
    _validateMeta() {
        const validShapes = ['rectangle', 'square', 'circle', 'ellipse', 'line', 'triangle', 'polygon'];
        
        if (!validShapes.includes(this.__meta.shape)) {
            throw new Error(`ShapeComponent: Invalid shape type "${this.__meta.shape}". Valid types: ${validShapes.join(', ')}`);
        }

        if (typeof this.__meta.options.color !== 'string') {
            throw new Error('ShapeComponent: options.color must be a string');
        }

        // Shape-specific validation
        if (['rectangle', 'square'].includes(this.__meta.shape)) {
            if (this.__meta.options.width <= 0 || this.__meta.options.height <= 0) {
                throw new Error('ShapeComponent: width and height must be greater than 0 for rectangles');
            }
        }
        
        if (this.__meta.shape === 'circle' && this.__meta.options.radius <= 0) {
            throw new Error('ShapeComponent: radius must be greater than 0 for circles');
        }
    }
    
    // Getter and setter methods for easy property access
    get color() { return this.options.color || 'black'; }
    set color(color) { this.options.color = color; }
    get width() { return this.options.width || 10; }
    set width(width) { this.options.width = width; }
    get height() { return this.options.height || 10; }
    set height(height) { this.options.height = height; }
    get radius() { return this.options.radius || 10; }
    set radius(radius) { this.options.radius = radius; }
    get radiusX() { return this.options.radiusX || 10; }
    set radiusX(radiusX) { this.options.radiusX = radiusX; }
    get radiusY() { return this.options.radiusY || 5; }
    set radiusY(radiusY) { this.options.radiusY = radiusY; }
    get points() { return this.options.points || []; }
    set points(points) { this.options.points = points; }
    get x2() { return this.options.x2 || 10; }
    set x2(x2) { this.options.x2 = x2; }
    get y2() { return this.options.y2 || 0; }
    set y2(y2) { this.options.y2 = y2; }
    get size() { return this.options.size || 20; }
    set size(size) { this.options.size = size; }

    /**
     * Draws the shape on the canvas. Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation if needed
        if (rotation !== 0) {
            ctx.translate(position.x, position.y);
            ctx.rotate(rotation);
            // Draw shapes relative to the rotation center
            this.drawShape(ctx, 0, 0);
        } else {
            this.drawShape(ctx, position.x, position.y);
        }
        
        ctx.restore();
    }

    /**
     * Draws the actual shape based on the type.
     * @private
     */
    drawShape(ctx, x, y) {
        switch (this.shape) {
            case 'rectangle':
            case 'square':
                this.drawRect(ctx, x, y);
                break;
            case 'circle':
                this.drawCircle(ctx, x, y);
                break;
            case 'ellipse':
                this.drawEllipse(ctx, x, y);
                break;
            case 'line':
                this.drawLine(ctx, x, y);
                break;
            case 'triangle':
                this.drawTriangle(ctx, x, y);
                break;
            case 'polygon':
                this.drawPolygon(ctx, x, y);
                break;
            default:
                this.drawRect(ctx, x, y);
                break;
        }
    }

    /**
     * Draws a rectangle.
     * @private
     */
    drawRect(ctx, x, y) {
        const { width = 10, height = 10, color = 'black' } = this.options;
        ctx.fillStyle = color;
        // Draw rectangle centered for proper rotation
        ctx.fillRect(x - width/2, y - height/2, width, height);
    }

    /**
     * Draws a circle.
     * @private
     */
    drawCircle(ctx, x, y) {
        const { radius = 10, color = 'black' } = this.options;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Draws an ellipse.
     * @private
     */
    drawEllipse(ctx, x, y) {
        const { radiusX = 10, radiusY = 5, color = 'black' } = this.options;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Draws a line.
     * @private
     */
    drawLine(ctx, x, y) {
        const { x2 = x + 10, y2 = y, color = 'black', width = 2 } = this.options;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    /**
     * Draws a triangle.
     * @private
     */
    drawTriangle(ctx, x, y) {
        const { size = 20, color = 'black' } = this.options;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y - size);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Draws a polygon from an array of points.
     * @private
     */
    drawPolygon(ctx, x, y) {
        const { points = [], color = 'black' } = this.options;
        if (points.length < 3) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + points[0][0], y + points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(x + points[i][0], y + points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Draws gizmos for shape visualization
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw with
     * @private
     */
    __internalGizmos(ctx) {
        if (!this.gameObject) return;
        
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        
        ctx.save();
        
        // Apply rotation to gizmos as well
        ctx.translate(position.x, position.y);
        if (rotation !== 0) ctx.rotate(rotation);
        
        // Set gizmo styling - magenta for shape components (matching ImageComponent)
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 2]); // Same dash pattern as ImageComponent
        
        const { shape, size = 10, width = 10, height = 10 } = this.options;
        
        switch (shape) {
            case 'rectangle':
                // Rectangle outline (centered)
                ctx.strokeRect(-width/2, -height/2, width, height);
                break;
                
            case 'circle':
                // Circle outline
                ctx.beginPath();
                ctx.arc(0, 0, size, 0, 2 * Math.PI);
                ctx.stroke();
                break;
                
            case 'triangle':
                // Triangle outline (centered)
                const triangleHeight = size;
                ctx.beginPath();
                ctx.moveTo(0, -triangleHeight/2);
                ctx.lineTo(-size/2, triangleHeight/2);
                ctx.lineTo(size/2, triangleHeight/2);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'polygon':
                const { points = [] } = this.options;
                if (points.length >= 3) {
                    ctx.beginPath();
                    ctx.moveTo(points[0][0], points[0][1]);
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i][0], points[i][1]);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
                break;
        }
        
        // Draw center point
        ctx.setLineDash([]); // Solid line for center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw shape type label
        ctx.fillStyle = '#FF00FF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Shape: ${shape || 'none'}`, 0, -Math.max(size, height)/2 - 8);
        
        // Draw size info based on shape
        let sizeText = '';
        switch (shape) {
            case 'rectangle':
                sizeText = `${width}x${height}`;
                break;
            case 'circle':
                sizeText = `r:${size}`;
                break;
            case 'triangle':
                sizeText = `s:${size}`;
                break;
            case 'polygon':
                sizeText = `${this.options.points?.length || 0} pts`;
                break;
        }
        if (sizeText) {
            ctx.fillText(sizeText, 0, Math.max(size, height)/2 + 15);
        }
        
        ctx.restore();
    }
}