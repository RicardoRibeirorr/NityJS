/**
 * LayerManager - Internal OffscreenCanvas layer system with single visible canvas
 * 
 * This system provides professional-grade layer management using only OffscreenCanvas
 * layers that exist in memory, with a single HTML canvas for final output. All layer
 * management is handled internally with intelligent dirty tracking and selective updates.
 * 
 * Features:
 * - Pure OffscreenCanvas layers (no DOM elements except main canvas)
 * - Static layers for rarely-changing content (tilemaps, backgrounds)
 * - Dynamic layers for frequently-changing content (GameObjects, effects)
 * - Intelligent dirty tracking to minimize expensive redraws
 * - Memory-efficient layer compositing
 * - Professional game engine layer system
 * 
 * Benefits:
 * - Single HTML canvas - clean DOM structure
 * - Lower memory overhead than multi-canvas
 * - Selective layer updates for optimal performance
 * - Full control over rendering pipeline
 * - Works great with GameObject layer sorting
 * 
 * @example
 * // Setup internal layer system with single canvas
 * const layerManager = new LayerManager(gameCanvas, {
 *     layers: ['background', 'environment', 'gameplay', 'effects', 'ui']
 * });
 * 
 * // Add static content to layers
 * layerManager.addToLayer('background', tilemapComponent);
 * layerManager.addToLayer('environment', decorationObjects);
 * 
 * // GameObjects use layer property for sorting
 * gameObject.layer = 'gameplay';
 * layerManager.addToLayer('gameplay', gameObject);
 * 
 * // Render all layers to single canvas
 * layerManager.render();
 * 
 * @class LayerManager
 * @author NityJS Team
 * @since 1.0.0
 */
export class LayerManager {
    /**
     * Create a new internal layer manager with single canvas output
     * @param {HTMLCanvasElement} mainCanvas - Single visible canvas for output
     * @param {Object} config - Layer configuration
     * @param {string[]} [config.layers=['background', 'default', 'ui']] - Array of layer names in rendering order (back to front)
     * @param {string} [config.defaultLayer='default'] - Default layer name for GameObjects without specified layer
     * @param {number} [config.width=800] - Layer canvas width
     * @param {number} [config.height=600] - Layer canvas height
     */
    constructor(mainCanvas, config = {}) {
        this.mainCanvas = mainCanvas;
        this.mainCtx = mainCanvas.getContext('2d');
        
        // Configuration with better defaults
        this.config = {
            layers: config.layers || ['background', 'default', 'ui'],
            defaultLayer: config.defaultLayer || 'default',
            width: config.width || mainCanvas.width || 800,
            height: config.height || mainCanvas.height || 600,
            ...config
        };
        
        // OffscreenCanvas layers (all internal, no DOM)
        this.layers = new Map();
        this.layerContexts = new Map();
        this.layerContents = new Map(); // Store what's on each layer
        this.dirtyLayers = new Set();   // Track layers needing redraw
        
        // Layer ordering and z-index
        this.layerOrder = [...this.config.layers];
        this.layerZIndex = new Map();
        
        this.initializeLayers();
    }
    
    /**
     * Initialize all internal OffscreenCanvas layers
     * @private
     */
    initializeLayers() {
        this.config.layers.forEach((layerName, index) => {
            // Create OffscreenCanvas for each layer
            const canvas = new OffscreenCanvas(this.config.width, this.config.height);
            const ctx = canvas.getContext('2d');
            
            this.layers.set(layerName, canvas);
            this.layerContexts.set(layerName, ctx);
            this.layerContents.set(layerName, []); // Store objects on this layer
            this.layerZIndex.set(layerName, index * 100);
            
            // Mark all layers as initially dirty
            this.dirtyLayers.add(layerName);
        });
    }
    
    /**
     * Add content to a specific layer
     * @param {string} layerName - Name of the layer
     * @param {Object} object - Object to add (GameObject, Component, or renderable object)
     */
    addToLayer(layerName, object) {
        if (!this.layers.has(layerName)) {
            console.warn(`LayerManager: Layer "${layerName}" does not exist`);
            return;
        }
        
        const layerContents = this.layerContents.get(layerName);
        if (!layerContents.includes(object)) {
            layerContents.push(object);
            
            // Set object's layer property if it's a GameObject
            if (object.layer !== undefined) {
                object.layer = layerName;
            }
            
            // Mark layer as dirty
            this.markLayerDirty(layerName);
        }
    }
    
    /**
     * Remove content from a layer
     * @param {string} layerName - Name of the layer
     * @param {Object} object - Object to remove
     */
    removeFromLayer(layerName, object) {
        if (!this.layers.has(layerName)) return;
        
        const layerContents = this.layerContents.get(layerName);
        const index = layerContents.indexOf(object);
        
        if (index !== -1) {
            layerContents.splice(index, 1);
            this.markLayerDirty(layerName);
        }
    }
    
    /**
     * Mark a layer as needing redraw
     * @param {string} layerName - Layer to mark dirty
     */
    markLayerDirty(layerName) {
        this.dirtyLayers.add(layerName);
    }
    
    /**
     * Mark all layers as dirty (force full redraw)
     */
    markAllLayersDirty() {
        this.config.layers.forEach(layerName => {
            this.dirtyLayers.add(layerName);
        });
    }
    
    /**
     * Render a specific layer to its OffscreenCanvas
     * @param {string} layerName - Layer to render
     * @private
     */
    renderLayer(layerName) {
        if (!this.dirtyLayers.has(layerName)) return; // Skip if not dirty
        
        const ctx = this.layerContexts.get(layerName);
        const contents = this.layerContents.get(layerName);
        
        if (!ctx || !contents) return;
        
        // Clear layer
        ctx.clearRect(0, 0, this.config.width, this.config.height);
        
        // Sort contents by zIndex if they have it
        const sortedContents = contents.slice().sort((a, b) => {
            const aZ = a.zIndex || 0;
            const bZ = b.zIndex || 0;
            return aZ - bZ;
        });
        
        // Render each object on this layer
        sortedContents.forEach(object => {
            if (object.active === false) return; // Skip inactive objects
            
            ctx.save();
            
            // Handle different object types - NityJS uses __draw for internal rendering
            if (typeof object.__draw === 'function') {
                // GameObject or Component with __draw method (standard NityJS pattern)
                object.__draw(ctx);
            } else if (typeof object.draw === 'function') {
                // Fallback for objects with draw method
                object.draw(ctx);
            }
            
            ctx.restore();
        });
        
        // Mark as clean
        this.dirtyLayers.delete(layerName);
    }
    
    /**
     * Main render method - composites all layers to the single main canvas
     */
    render() {
        // Render dirty layers first
        this.layerOrder.forEach(layerName => {
            if (this.dirtyLayers.has(layerName)) {
                this.renderLayer(layerName);
            }
        });
        
        // Clear main canvas
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        
        // Composite all layers to main canvas in order
        this.layerOrder.forEach(layerName => {
            const layerCanvas = this.layers.get(layerName);
            if (layerCanvas) {
                this.mainCtx.drawImage(layerCanvas, 0, 0);
            }
        });
    }
    
    /**
     * Get layer z-index for sorting
     * @param {string} layerName - Layer name
     * @returns {number} Z-index value
     */
    getLayerZIndex(layerName) {
        return this.layerZIndex.get(layerName) || 0;
    }
    
    /**
     * Set layer z-index and reorder layers
     * @param {string} layerName - Layer name
     * @param {number} zIndex - New z-index
     */
    setLayerZIndex(layerName, zIndex) {
        this.layerZIndex.set(layerName, zIndex);
        
        // Re-sort layer order by z-index
        this.layerOrder.sort((a, b) => this.getLayerZIndex(a) - this.getLayerZIndex(b));
    }
    
    /**
     * Get the default layer name
     * @returns {string} Default layer name
     */
    getDefaultLayer() {
        return this.config.defaultLayer;
    }
    
    /**
     * Clear a specific layer
     * @param {string} layerName - Layer to clear
     */
    clearLayer(layerName) {
        if (!this.layerContents.has(layerName)) return;
        
        this.layerContents.set(layerName, []);
        this.markLayerDirty(layerName);
    }
    
    /**
     * Clear all layers
     */
    clearAllLayers() {
        this.layerOrder.forEach(layerName => {
            this.clearLayer(layerName);
        });
    }
    
    /**
     * Resize all layers and main canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.config.width = width;
        this.config.height = height;
        
        // Resize main canvas
        this.mainCanvas.width = width;
        this.mainCanvas.height = height;
        
        // Recreate all OffscreenCanvas layers with new size
        this.layers.forEach((canvas, layerName) => {
            const newCanvas = new OffscreenCanvas(width, height);
            const newCtx = newCanvas.getContext('2d');
            
            this.layers.set(layerName, newCanvas);
            this.layerContexts.set(layerName, newCtx);
            this.markLayerDirty(layerName); // Force redraw
        });
    }
    
    /**
     * Get objects on a specific layer
     * @param {string} layerName - Layer name
     * @returns {Array} Array of objects on the layer
     */
    getLayerContents(layerName) {
        return this.layerContents.get(layerName) || [];
    }
    
    /**
     * Check if a layer exists
     * @param {string} layerName - Layer name to check
     * @returns {boolean} True if layer exists
     */
    hasLayer(layerName) {
        return this.layers.has(layerName);
    }
    
    /**
     * Add a new layer at runtime
     * @param {string} layerName - Name of new layer
     * @param {number} [zIndex] - Z-index for layer ordering
     */
    addLayer(layerName, zIndex) {
        if (this.hasLayer(layerName)) {
            console.warn(`LayerManager: Layer "${layerName}" already exists`);
            return;
        }
        
        // Create new OffscreenCanvas
        const canvas = new OffscreenCanvas(this.config.width, this.config.height);
        const ctx = canvas.getContext('2d');
        
        this.layers.set(layerName, canvas);
        this.layerContexts.set(layerName, ctx);
        this.layerContents.set(layerName, []);
        
        // Set z-index and update order
        const finalZIndex = zIndex !== undefined ? zIndex : this.layerOrder.length * 100;
        this.layerZIndex.set(layerName, finalZIndex);
        
        this.layerOrder.push(layerName);
        this.layerOrder.sort((a, b) => this.getLayerZIndex(a) - this.getLayerZIndex(b));
        
        this.markLayerDirty(layerName);
    }
    
    /**
     * Remove a layer
     * @param {string} layerName - Layer to remove
     */
    removeLayer(layerName) {
        if (!this.hasLayer(layerName)) return;
        
        this.layers.delete(layerName);
        this.layerContexts.delete(layerName);
        this.layerContents.delete(layerName);
        this.layerZIndex.delete(layerName);
        this.dirtyLayers.delete(layerName);
        
        const index = this.layerOrder.indexOf(layerName);
        if (index !== -1) {
            this.layerOrder.splice(index, 1);
        }
    }
    
    /**
     * Get memory usage statistics
     * @returns {Object} Memory usage info
     */
    getMemoryStats() {
        const layerCount = this.layers.size;
        const totalObjects = Array.from(this.layerContents.values())
            .reduce((total, contents) => total + contents.length, 0);
        
        const memoryPerLayer = this.config.width * this.config.height * 4; // RGBA bytes
        const totalMemory = layerCount * memoryPerLayer;
        
        return {
            layers: layerCount,
            objects: totalObjects,
            memoryMB: (totalMemory / (1024 * 1024)).toFixed(2),
            dirtyLayers: this.dirtyLayers.size,
            canvasElements: 1 // Only main canvas in DOM
        };
    }
    
    /**
     * Debug info for development
     * @returns {string} Debug information
     */
    getDebugInfo() {
        const stats = this.getMemoryStats();
        return `LayerManager: ${stats.layers} internal layers, ${stats.objects} objects, ${stats.memoryMB}MB memory, ${stats.dirtyLayers} dirty layers, 1 DOM canvas`;
    }
}
