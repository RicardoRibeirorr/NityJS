// Browser Compatibility Detection Example for NityJS
// Demonstrates how to detect browser capabilities and handle fallbacks

import { Game, Scene, GameObject, Component, Vector2, ShapeComponent } from '../../../src/index.js';

// Compatibility detection utility
class BrowserCompatibility {
    static detectCapabilities() {
        const capabilities = {
            offscreenCanvas: this.hasOffscreenCanvas(),
            performanceAPI: this.hasPerformanceAPI(),
            modernCanvas: this.hasModernCanvas(),
            es6Classes: this.hasES6Classes(),
            recommendedBrowser: false
        };

        // Determine if this is a recommended browser setup
        capabilities.recommendedBrowser = capabilities.offscreenCanvas && 
                                        capabilities.performanceAPI && 
                                        capabilities.modernCanvas;

        return capabilities;
    }

    static hasOffscreenCanvas() {
        return typeof OffscreenCanvas !== 'undefined';
    }

    static hasPerformanceAPI() {
        return !!(window.performance && window.performance.now);
    }

    static hasModernCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        return !!(ctx && ctx.fillText && ctx.measureText);
    }

    static hasES6Classes() {
        try {
            // Test if ES6 classes are supported
            eval('class TestClass {}');
            return true;
        } catch (e) {
            return false;
        }
    }

    static getRecommendations(capabilities) {
        const recommendations = [];

        if (!capabilities.offscreenCanvas) {
            recommendations.push({
                issue: 'OffscreenCanvas not supported',
                impact: 'Layer system will use fallback mode',
                solution: 'Upgrade to Chrome 69+, Firefox 105+, or Safari 16.4+'
            });
        }

        if (!capabilities.performanceAPI) {
            recommendations.push({
                issue: 'Performance API not available',
                impact: 'Timing may be less accurate',
                solution: 'Upgrade browser for better timing precision'
            });
        }

        if (!capabilities.es6Classes) {
            recommendations.push({
                issue: 'ES6 Classes not supported',
                impact: 'Engine may not work properly',
                solution: 'Use modern browser or wait for ES5 build (v1.1)'
            });
        }

        return recommendations;
    }

    static logCompatibilityReport() {
        const capabilities = this.detectCapabilities();
        const recommendations = this.getRecommendations(capabilities);

        console.group('🔍 NityJS Browser Compatibility Report');
        
        // Capabilities
        console.group('✅ Detected Capabilities');
        console.log('OffscreenCanvas:', capabilities.offscreenCanvas ? '✅' : '❌');
        console.log('Performance API:', capabilities.performanceAPI ? '✅' : '❌');
        console.log('Modern Canvas:', capabilities.modernCanvas ? '✅' : '❌');
        console.log('ES6 Classes:', capabilities.es6Classes ? '✅' : '❌');
        console.log('Recommended Browser:', capabilities.recommendedBrowser ? '✅' : '⚠️');
        console.groupEnd();

        // Recommendations
        if (recommendations.length > 0) {
            console.group('⚠️ Recommendations');
            recommendations.forEach(rec => {
                console.group(`Issue: ${rec.issue}`);
                console.log('Impact:', rec.impact);
                console.log('Solution:', rec.solution);
                console.groupEnd();
            });
            console.groupEnd();
        } else {
            console.log('🎉 Your browser fully supports all NityJS features!');
        }

        console.groupEnd();
        return capabilities;
    }
}

// Demo scene with compatibility awareness
const compatibilityDemoScene = new Scene({
    create(scene) {
        // Run compatibility check
        const capabilities = BrowserCompatibility.logCompatibilityReport();

        // Create visual indicators based on capabilities
        createCompatibilityIndicators(scene, capabilities);
        
        // Test layer system if available
        if (Game.instance.hasLayerSystem()) {
            createLayerTest(scene);
        }
    }
});

function createCompatibilityIndicators(scene, capabilities) {
    let yPos = 50;
    const indicators = [
        { name: 'OffscreenCanvas', supported: capabilities.offscreenCanvas },
        { name: 'Performance API', supported: capabilities.performanceAPI },
        { name: 'Modern Canvas', supported: capabilities.modernCanvas },
        { name: 'ES6 Classes', supported: capabilities.es6Classes }
    ];

    indicators.forEach(indicator => {
        const shape = new GameObject(new Vector2(200, yPos));
        const color = indicator.supported ? '#4CAF50' : '#F44336';
        const label = `${indicator.name}: ${indicator.supported ? 'YES' : 'NO'}`;
        
        shape.addComponent(new ShapeComponent('rectangle', {
            width: 300,
            height: 30,
            color: color
        }));

        // Add text indicator (would need TextComponent in real implementation)
        shape.name = label;
        
        scene.add(shape);
        yPos += 50;
    });

    // Overall status
    const statusShape = new GameObject(new Vector2(200, yPos + 30));
    const overallColor = capabilities.recommendedBrowser ? '#2196F3' : '#FF9800';
    const statusText = capabilities.recommendedBrowser ? 'FULLY COMPATIBLE' : 'COMPATIBILITY MODE';
    
    statusShape.addComponent(new ShapeComponent('rectangle', {
        width: 300,
        height: 40,
        color: overallColor
    }));
    statusShape.name = `Status: ${statusText}`;
    scene.add(statusShape);
}

function createLayerTest(scene) {
    // Test layer system functionality
    const layerManager = Game.instance.getLayerManager();
    
    if (layerManager) {
        console.log('🎨 Layer System Status:');
        console.log('- Layers:', layerManager.layers);
        console.log('- Default Layer:', layerManager.getDefaultLayer());
        console.log('- OffscreenCanvas:', layerManager.hasOffscreenCanvas ? 'Yes' : 'Fallback mode');

        // Create shapes on different layers to test
        const bgShape = new GameObject(new Vector2(600, 150));
        bgShape.layer = 'background';
        bgShape.addComponent(new ShapeComponent('circle', {radius: 60, color: '#E3F2FD'}));
        scene.add(bgShape);

        const midShape = new GameObject(new Vector2(600, 150));
        midShape.addComponent(new ShapeComponent('circle', {radius: 40, color: '#1976D2'}));
        scene.add(midShape);

        const topShape = new GameObject(new Vector2(600, 150));
        topShape.layer = 'ui';
        topShape.addComponent(new ShapeComponent('circle', {radius: 20, color: '#0D47A1'}));
        scene.add(topShape);
    }
}

// Add custom render function to the scene
compatibilityDemoScene.render = function(ctx) {
    // Clear background
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NityJS Browser Compatibility Test', ctx.canvas.width / 2, 30);

    // Draw instructions
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'left';
    ctx.fillText('Check console for detailed compatibility report', 20, ctx.canvas.height - 40);
    ctx.fillText('Green = Supported, Red = Not Supported, Orange = Partial Support', 20, ctx.canvas.height - 20);
};

// Initialize compatibility test
async function initCompatibilityTest() {
    console.log('🔍 Starting NityJS Browser Compatibility Test...');
    
    const canvas = document.getElementById('gameCanvas');
    const game = new Game();
    
    // Try to configure with layer system
    try {
        game.configure({
            canvas: canvas,
            useLayerSystem: true
        });
        console.log('✅ Layer system configuration successful');
    } catch (error) {
        console.warn('⚠️ Layer system configuration failed:', error.message);
    }

    // Load and start the compatibility test scene
    game.launch(compatibilityDemoScene);
    
    console.log('🎮 Compatibility test ready! Check the visual indicators above.');
}

// Auto-run when page loads
initCompatibilityTest().catch(console.error);
