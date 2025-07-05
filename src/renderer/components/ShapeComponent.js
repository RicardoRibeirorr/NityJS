import { Component } from '../../common/Component.js';

// === ShapeComponent.js ===
export class ShapeComponent extends Component {
    constructor(shape, options = { width:10, height:10, color:'white' }) {
        super();
        this.shape = shape;
        this.options = options;
    }
    
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
    get x2() { return this.options.x2 || this.gameObject.getGlobalX() + 10; }
    set x2(x2) { this.options.x2 = x2; }
    get y2() { return this.options.y2 || this.gameObject.getGlobalY(); }
    set y2(y2) { this.options.y2 = y2; }
    get size() { return this.options.size || 20; }
    set size(size) { this.options.size = size; }

    draw(ctx) {
        const x = this.gameObject.getGlobalX();
        const y = this.gameObject.getGlobalY();
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

    drawRect(ctx, x, y) {
        const { width = 10, height = 10, color = 'black' } = this.options;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    drawCircle(ctx, x, y) {
        const { radius = 10, color = 'black' } = this.options;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawEllipse(ctx, x, y) {
        const { radiusX = 10, radiusY = 5, color = 'black' } = this.options;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    drawLine(ctx, x, y) {
        const { x2 = x + 10, y2 = y, color = 'black', width = 2 } = this.options;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

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
}