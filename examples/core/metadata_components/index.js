// === NityJS Metadata Components Example ===
import { Game, Scene, GameObject, ShapeComponent, Vector2, Destroy, getPendingDestructionCount 
        } from '../../../dist/nity.module.js';
// Get canvas and create game instance
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Store shapes for easy clearing
let createdShapes = [];

// Create main scene
const scene = new Scene({
    create() {
        console.log('🎯 Metadata Components Example Scene Created');
        
        // Create a background grid for reference
        createBackgroundGrid(this);
        
        // Demo all three methods immediately
        demonstrateAllMethods(this);
    }
});

/**
 * Create a background grid for visual reference
 */
function createBackgroundGrid(scene) {
    const gridSize = 50;
    const gridColor = '#444';
    
    // Create vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        const line = new GameObject(new Vector2(x, canvas.height / 2));
        const lineShape = new ShapeComponent('line', {
            x2: 0,
            y2: -canvas.height / 2,
            color: gridColor
        });
        line.addComponent(lineShape);
        scene.add(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        const line = new GameObject(new Vector2(canvas.width / 2, y));
        const lineShape = new ShapeComponent('line', {
            x2: -canvas.width / 2,
            y2: 0,
            color: gridColor
        });
        line.addComponent(lineShape);
        scene.add(line);
    }
}

/**
 * Demonstrate all three component creation methods
 */
function demonstrateAllMethods(scene) {
    // Method 1: Traditional Constructor
    console.log('📦 Creating shape with traditional constructor...');
    const traditionalShape = createTraditionalShape(scene, new Vector2(200, 150));
    
    // Method 2: Metadata Object
    console.log('📊 Creating shape with metadata...');
    const metadataShape = createMetadataShape(scene, new Vector2(400, 150));
    
    // Method 3: JSON Configuration
    console.log('🌐 Creating shape from JSON...');
    const jsonShape = createFromJSON(scene, new Vector2(600, 150));
    
    // Add to tracking array
    createdShapes.push(traditionalShape, metadataShape, jsonShape);
}

/**
 * Method 1: Traditional Constructor Approach
 */
function createTraditionalShape(scene, position) {
    const gameObject = new GameObject(position);
    
    // Traditional way - constructor with parameters
    const shape = new ShapeComponent("rectangle", {
        width: 80,
        height: 50,
        color: "#FF6B6B" // Red
    });
    
    gameObject.addComponent(shape);
    scene.add(gameObject);
    
    console.log('✅ Traditional shape created:', shape);
    return gameObject;
}

/**
 * Method 2: Metadata-Driven Creation
 */
function createMetadataShape(scene, position) {
    const gameObject = new GameObject(position);
    
    // New way - using metadata objects
    const shape = ShapeComponent.meta({
        shape: "circle",
        options: {
            radius: 40,
            color: "#4ECDC4" // Teal
        }
    });
    
    gameObject.addComponent(shape);
    scene.add(gameObject);
    
    console.log('✅ Metadata shape created:', shape);
    console.log('   Shape metadata:', shape.__meta);
    return gameObject;
}

/**
 * Method 3: JSON Configuration (Future Editor Support)
 */
function createFromJSON(scene, position) {
    const gameObject = new GameObject(position);
    
    // Simulate JSON data from a visual editor
    const componentData = {
        type: "ShapeComponent",
        metadata: {
            shape: "triangle",
            options: {
                size: 60,
                color: "#95E1D3" // Light green
            }
        }
    };
    
    // Dynamic creation from JSON (how a visual editor would work)
    const ComponentClass = getComponentClass(componentData.type);
    const shape = ComponentClass.meta(componentData.metadata);
    
    gameObject.addComponent(shape);
    scene.add(gameObject);
    
    console.log('✅ JSON shape created:', shape);
    console.log('   Component data:', componentData);
    return gameObject;
}

/**
 * Helper function to get component class by name (simulates dynamic loading)
 */
function getComponentClass(typeName) {
    const componentMap = {
        'ShapeComponent': ShapeComponent
        // Future components would be added here
    };
    
    return componentMap[typeName];
}

/**
 * Button functions for interactive demo
 */
window.addTraditionalShape = function() {
    const randomPos = new Vector2(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50
    );
    
    const shape = createTraditionalShape(scene, randomPos);
    createdShapes.push(shape);
    
    console.log('🎲 Added random traditional shape at:', randomPos);
};

window.addMetadataShape = function() {
    const randomPos = new Vector2(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50
    );
    
    // Random metadata configuration
    const shapes = ['rectangle', 'circle', 'triangle'];
    const colors = ['#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'];
    
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const gameObject = new GameObject(randomPos);
    const shape = ShapeComponent.meta({
        shape: randomShape,
        options: {
            width: 60 + Math.random() * 40,
            height: 40 + Math.random() * 30,
            radius: 20 + Math.random() * 30,
            size: 30 + Math.random() * 40,
            color: randomColor
        }
    });
    
    gameObject.addComponent(shape);
    scene.add(gameObject);
    createdShapes.push(gameObject);
    
    console.log('🎲 Added random metadata shape:', randomShape, 'at:', randomPos);
};

window.addFromJSON = function() {
    const randomPos = new Vector2(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50
    );
    
    // Simulate complex JSON configuration
    const jsonConfigs = [
        {
            type: "ShapeComponent",
            metadata: {
                shape: "rectangle",
                options: { width: 70, height: 45, color: "#E17055" }
            }
        },
        {
            type: "ShapeComponent", 
            metadata: {
                shape: "circle",
                options: { radius: 35, color: "#6C5CE7" }
            }
        },
        {
            type: "ShapeComponent",
            metadata: {
                shape: "triangle", 
                options: { size: 55, color: "#00B894" }
            }
        }
    ];
    
    const randomConfig = jsonConfigs[Math.floor(Math.random() * jsonConfigs.length)];
    const shape = createFromJSON(scene, randomPos);
    createdShapes.push(shape);
    
    console.log('🎲 Added shape from JSON config:', randomConfig);
};

window.clearShapes = function() {
    // Use Destroy function to properly remove all created shapes (except grid)
    createdShapes.forEach(gameObject => {
        Destroy(gameObject);
    });
    createdShapes = [];
    
    console.log('🧹 Cleared all shapes using Destroy(gameObject)');
};

window.addDelayedDestroy = function() {
    const randomPos = new Vector2(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50
    );
    
    // Create a shape with metadata
    const gameObject = new GameObject(randomPos);
    const shape = ShapeComponent.meta({
        shape: "circle",
        options: {
            radius: 30,
            color: "#FF6B6B" // Red to indicate it will be destroyed
        }
    });
    
    gameObject.addComponent(shape);
    scene.add(gameObject);
    createdShapes.push(gameObject);
    
    // Schedule destruction after 3 seconds
    Destroy(gameObject, 3.0);
    
    console.log('⏰ Added shape that will be destroyed in 3 seconds using Destroy(obj, 3.0)');
    console.log(`📊 Pending destructions: ${getPendingDestructionCount()}`);
};

// Demonstrate validation
function demonstrateValidation() {
    console.log('🔍 Testing validation system...');
    
    try {
        // This should fail - invalid shape type
        const invalidShape = ShapeComponent.meta({
            shape: "invalidShape",
            options: { color: "red" }
        });
    } catch (error) {
        console.log('✅ Validation caught invalid shape:', error.message);
    }
    
    try {
        // This should fail - invalid color type
        const invalidColor = ShapeComponent.meta({
            shape: "rectangle",
            options: { color: 123, width: 50, height: 50 }
        });
    } catch (error) {
        console.log('✅ Validation caught invalid color:', error.message);
    }
    
    try {
        // This should fail - invalid dimensions
        const invalidDimensions = ShapeComponent.meta({
            shape: "rectangle",
            options: { color: "blue", width: -10, height: 50 }
        });
    } catch (error) {
        console.log('✅ Validation caught invalid dimensions:', error.message);
    }
}

// Start the game
game.launch(scene);

// Run validation demo after a short delay
setTimeout(demonstrateValidation, 1000);

console.log('🚀 Metadata Components Example Started!');
console.log('💡 Open browser console to see detailed logs');
console.log('🎮 Use the buttons above the canvas to interact with the demo');
