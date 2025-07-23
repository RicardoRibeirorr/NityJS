// === Debug Metadata Test ===
import { 
    SpriteRendererComponent,
    Component
} from '../../../dist/nity.module.js';

console.log('🔍 Debug Metadata Test for SpriteRendererComponent');

try {
    // Test 1: Check if getDefaultMeta is available
    console.log('Test 1: Check getDefaultMeta');
    const defaults = SpriteRendererComponent.getDefaultMeta();
    console.log('✅ getDefaultMeta works:', defaults);
    
    // Test 2: Check if static meta method is available
    console.log('\nTest 2: Check static meta method');
    console.log('meta method exists:', typeof SpriteRendererComponent.meta);
    
    // Test 3: Try creating with metadata
    console.log('\nTest 3: Create with metadata');
    const sprite = SpriteRendererComponent.meta({
        spriteName: "test_sprite",
        width: 64,
        height: 64,
        opacity: 0.8
    });
    console.log('✅ Created sprite:', sprite);
    console.log('   Internal metadata:', sprite.__meta);
    
    // Test 4: Try traditional creation
    console.log('\nTest 4: Traditional creation');
    const traditional = new SpriteRendererComponent("test_sprite", {
        width: 64,
        height: 64,
        opacity: 0.8
    });
    console.log('✅ Created traditional:', traditional);
    console.log('   Internal metadata:', traditional.__meta);
    
    // Test 5: Check if methods exist on instances
    console.log('\nTest 5: Check instance methods');
    console.log('applyMeta exists:', typeof sprite.applyMeta);
    console.log('getDefaultMeta exists:', typeof sprite.getDefaultMeta);
    console.log('_updatePropertiesFromMeta exists:', typeof sprite._updatePropertiesFromMeta);
    console.log('_validateMeta exists:', typeof sprite._validateMeta);
    
} catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
}
