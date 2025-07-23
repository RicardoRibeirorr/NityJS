// === NityJS All Components Metadata Example ===
import { 
    Game, Scene, GameObject, Vector2,
    SpriteRendererComponent, ImageComponent, ShapeComponent,
    RigidbodyComponent, BoxColliderComponent, CircleColliderComponent,
    SpriteAnimationComponent, CameraComponent,SpriteAsset,SpriteAnimationClip,
    Component
} from '../../../dist/nity.module.js';

// Get canvas and create game instance
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Store created objects for easy clearing
let createdObjects = [];

// Create main scene
const scene = new Scene({
    create() {
        console.log('🎯 All Components Metadata Test Scene Created');
        new SpriteAsset("test_sprite", "../../_assets/background_platform.png");
        // Demonstrate all components metadata
        demonstrateAllComponentsMetadata(this);
    }
});

/**
 * Demonstrate metadata for all components
 */
function demonstrateAllComponentsMetadata(scene) {
    console.log('\n=== 🧪 Testing All Components Metadata ===\n');
    
    // Test each component type
    testSpriteRendererMetadata(scene);
    testImageComponentMetadata(scene);
    testShapeComponentMetadata(scene);
    testRigidbodyComponentMetadata(scene);
    testBoxColliderComponentMetadata(scene);
    testCircleColliderComponentMetadata(scene);
    testSpriteAnimationComponentMetadata(scene);
    testCameraComponentMetadata(scene);
}

/**
 * Test SpriteRendererComponent metadata
 */
function testSpriteRendererMetadata(scene) {
    console.log('🎨 Testing SpriteRendererComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalSprite", new Vector2(100, 100));
        const traditional = new SpriteRendererComponent("test_sprite", {
            width: 64,
            height: 64,
            opacity: 0.8,
            color: "#FF0000",
            flipX: true
        });
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataSprite", new Vector2(200, 100));
        const metadata = SpriteRendererComponent.meta({
            spriteName: "test_sprite",
            width: 64,
            height: 64,
            opacity: 0.9,
            color: "#00FF00",
            flipY: true
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = SpriteRendererComponent.getDefaultMeta();
        console.log('   SpriteRenderer defaults:', defaults);
        
        console.log('   ✅ SpriteRendererComponent metadata working');
    } catch (error) {
        console.error('   ❌ SpriteRendererComponent error:', error.message);
    }
}

/**
 * Test ImageComponent metadata
 */
function testImageComponentMetadata(scene) {
    console.log('🖼️ Testing ImageComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalImage", new Vector2(300, 100));
        const traditional = new ImageComponent("../../_assets/arrow_top.png", 80, 60);
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataImage", new Vector2(400, 100));
        const metadata = ImageComponent.meta({
            src: "../../_assets/logo.png",
            width: 100,
            height: 80
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = ImageComponent.getDefaultMeta();
        console.log('   ImageComponent defaults:', defaults);
        
        console.log('   ✅ ImageComponent metadata working');
    } catch (error) {
        console.error('   ❌ ImageComponent error:', error.message);
    }
}

/**
 * Test ShapeComponent metadata
 */
function testShapeComponentMetadata(scene) {
    console.log('🔺 Testing ShapeComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalShape", new Vector2(500, 100));
        const traditional = new ShapeComponent("rectangle", { width: 60, height: 40, color: "#0000FF" });
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataShape", new Vector2(600, 100));
        const metadata = ShapeComponent.meta({
            shape: "circle",
            options: {
                radius: 30,
                color: "#FF00FF",
                filled: true
            }
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = ShapeComponent.getDefaultMeta();
        console.log('   ShapeComponent defaults:', defaults);
        
        console.log('   ✅ ShapeComponent metadata working');
    } catch (error) {
        console.error('   ❌ ShapeComponent error:', error.message);
    }
}

/**
 * Test RigidbodyComponent metadata
 */
function testRigidbodyComponentMetadata(scene) {
    console.log('⚽ Testing RigidbodyComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalRigidbody", new Vector2(100, 200));
        const traditional = new RigidbodyComponent({
            gravity: true,
            gravityScale: 400,
            bounciness: 0.5
        });
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataRigidbody", new Vector2(200, 200));
        const metadata = RigidbodyComponent.meta({
            gravity: false,
            gravityScale: 200,
            bounciness: 0.8
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = RigidbodyComponent.getDefaultMeta();
        console.log('   RigidbodyComponent defaults:', defaults);
        
        console.log('   ✅ RigidbodyComponent metadata working');
    } catch (error) {
        console.error('   ❌ RigidbodyComponent error:', error.message);
    }
}

/**
 * Test BoxColliderComponent metadata
 */
function testBoxColliderComponentMetadata(scene) {
    console.log('📦 Testing BoxColliderComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalBoxCollider", new Vector2(300, 200));
        const traditional = new BoxColliderComponent(50, 60, false);
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataBoxCollider", new Vector2(400, 200));
        const metadata = BoxColliderComponent.meta({
            width: 80,
            height: 40,
            trigger: true
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = BoxColliderComponent.getDefaultMeta();
        console.log('   BoxColliderComponent defaults:', defaults);
        
        console.log('   ✅ BoxColliderComponent metadata working');
    } catch (error) {
        console.error('   ❌ BoxColliderComponent error:', error.message);
    }
}

/**
 * Test CircleColliderComponent metadata
 */
function testCircleColliderComponentMetadata(scene) {
    console.log('⭕ Testing CircleColliderComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalCircleCollider", new Vector2(500, 200));
        const traditional = new CircleColliderComponent(25, false);
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataCircleCollider", new Vector2(600, 200));
        const metadata = CircleColliderComponent.meta({
            radius: 35,
            trigger: true
        });
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = CircleColliderComponent.getDefaultMeta();
        console.log('   CircleColliderComponent defaults:', defaults);
        
        console.log('   ✅ CircleColliderComponent metadata working');
    } catch (error) {
        console.error('   ❌ CircleColliderComponent error:', error.message);
    }
}

/**
 * Test SpriteAnimationComponent metadata
 */
function testSpriteAnimationComponentMetadata(scene) {
    console.log('🎬 Testing SpriteAnimationComponent metadata...');
    
    try {
        const walkClip = SpriteAnimationClip.meta({
                name: "walk",
                spriteNames: ["walk_0", "walk_1", "walk_2", "walk_3"],
                fps: 8,
                loop: true
            });

        // Traditional creation
        const obj1 = new GameObject("TraditionalAnimation", new Vector2(300, 300));
        const traditional = new SpriteAnimationComponent("walk");
        traditional.addClip(walkClip);
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataAnimation", new Vector2(400, 300));
        const metadata = SpriteAnimationComponent.meta({
            defaultClipName: "walk",
            autoPlay: false
        });
        metadata.addClip(walkClip); // Add the same clip
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = SpriteAnimationComponent.getDefaultMeta();
        console.log('   SpriteAnimationComponent defaults:', defaults);
        
        console.log('   ✅ SpriteAnimationComponent metadata working');
    } catch (error) {
        console.error('   ❌ SpriteAnimationComponent error:', error.message);
    }
}

/**
 * Test CameraComponent metadata
 */
function testCameraComponentMetadata(scene) {
    console.log('📷 Testing CameraComponent metadata...');
    
    try {
        // Traditional creation
        const obj1 = new GameObject("TraditionalCamera", new Vector2(500, 300));
        const traditional = new CameraComponent(canvas, 1.5);
        obj1.addComponent(traditional);
        scene.add(obj1);
        createdObjects.push(obj1);
        
        // Metadata creation
        const obj2 = new GameObject("MetadataCamera", new Vector2(600, 300));
        const metadata = CameraComponent.meta({
            zoom: 2.0
        });
        // Need to set canvas manually as it can't be in metadata
        metadata.canvas = canvas;
        obj2.addComponent(metadata);
        scene.add(obj2);
        createdObjects.push(obj2);
        
        // Get defaults test
        const defaults = CameraComponent.getDefaultMeta();
        console.log('   CameraComponent defaults:', defaults);
        
        console.log('   ✅ CameraComponent metadata working');
    } catch (error) {
        console.error('   ❌ CameraComponent error:', error.message);
    }
}

/**
 * Test validation system
 */
function testValidation() {
    console.log('\n🔍 Testing validation system...');
    
    try {
        // Test invalid metadata - should throw error
        const invalidSprite = SpriteRendererComponent.meta({
            spriteName: 123, // Should be string
            opacity: 2.0 // Should be 0-1
        });
    } catch (error) {
        console.log('   ✅ Validation caught invalid SpriteRenderer:', error.message);
    }
    
    try {
        // Test invalid box collider - should throw error
        const invalidBox = BoxColliderComponent.meta({
            width: -10 // Should be positive
        });
    } catch (error) {
        console.log('   ✅ Validation caught invalid BoxCollider:', error.message);
    }
    
    try {
        // Test invalid camera - should throw error
        const invalidCamera = CameraComponent.meta({
            zoom: 0 // Should be positive
        });
    } catch (error) {
        console.log('   ✅ Validation caught invalid Camera:', error.message);
    }
}

/**
 * Test JSON serialization/deserialization
 */
function testJSONSerialization() {
    console.log('\n📄 Testing JSON serialization...');
    
    try {
        // Create component with metadata
        const sprite = SpriteRendererComponent.meta({
            spriteName: "player",
            width: 64,
            height: 64,
            opacity: 0.8,
            color: "#FF0000"
        });
        
        // Simulate getting metadata (would be implemented on components)
        const metadata = sprite.__meta;
        const jsonString = JSON.stringify({
            type: "SpriteRendererComponent",
            metadata: metadata
        }, null, 2);
        
        console.log('   JSON representation:', jsonString);
        
        // Simulate recreation from JSON
        const parsed = JSON.parse(jsonString);
        const recreated = SpriteRendererComponent.meta(parsed.metadata);
        
        console.log('   ✅ JSON serialization working');
        console.log('   Original metadata:', sprite.__meta);
        console.log('   Recreated metadata:', recreated.__meta);
        
    } catch (error) {
        console.error('   ❌ JSON serialization error:', error.message);
    }
}

/**
 * Button functions for interactive testing
 */
window.testValidation = testValidation;
window.testJSONSerialization = testJSONSerialization;

window.clearAll = function() {
    createdObjects.forEach(obj => {
        scene.remove(obj);
    });
    createdObjects = [];
    console.log('🧹 Cleared all test objects');
};

// Start the game
game.launch(scene);

// Run additional tests
setTimeout(() => {
    testValidation();
    testJSONSerialization();
}, 1000);
