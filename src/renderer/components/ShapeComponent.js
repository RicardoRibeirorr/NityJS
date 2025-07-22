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
     * Creates a new ShapeComponent.
     * 
     * @param {string} shape - Type of shape to render ("rectangle", "circle", "ellipse", "line", "triangle", "polygon")
     * @param {Object} [options={ width:10, height:10, color:'white' }] - Shape-specific rendering options
     * @param {number} [options.width=10] - Width for rectangles
     * @param {number} [options.height=10] - Height for rectangles
     * @param {string} [options.color='white'] - Fill color for the shape
     * @param {number} [options.radius=10] - Radius for circles
     * @param {number} [options.radiusX=10] - X radius for ellipses
     * @param {number} [options.radiusY=5] - Y radius for ellipses
     * @param {number} [options.x2] - End X coordinate for lines
     * @param {number} [options.y2] - End Y coordinate for lines
     * @param {number} [options.size=20] - Size for triangles
     * @param {Array<{x: number, y: number}>} [options.points=[]] - Points for polygons
     */
    constructor(shape, options = { width:10, height:10, color:'white' }) {
        super();
        this.shape = shape;
        this.options = options;
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