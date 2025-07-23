// === Simple Metadata Test ===
import { 
    Game, Scene, GameObject, Vector2,
    SpriteRendererComponent, ImageComponent, ShapeComponent,
    RigidbodyComponent, BoxColliderComponent, CircleColliderComponent,
    SpriteAnimationComponent, CameraComponent, SpriteAsset,
    SpriteAnimationClip, Component
} from '../../../dist/nity.module.js';

console.log('🧪 Starting Simple Metadata Test...');

// Test basic Component metadata methods
console.log('\n=== Testing Component Base Methods ===');

try {
    // Test base Component class
    console.log('✅ Component imported successfully');
    
    // Test ShapeComponent (known working)
    console.log('\n🔺 Testing ShapeComponent...');
    const shape = ShapeComponent.meta({
        shape: "circle",
        options: {
            radius: 25,
            color: "#FF0000"
        }
    });
    console.log('✅ ShapeComponent.meta() works');
    console.log('   Defaults:', ShapeComponent.getDefaultMeta());
    
    // Test SpriteRendererComponent
    console.log('\n🎨 Testing SpriteRendererComponent...');
    const sprite = SpriteRendererComponent.meta({
        spriteName: "test",
        width: 64,
        height: 64,
        opacity: 0.8
    });
    console.log('✅ SpriteRendererComponent.meta() works');
    console.log('   Defaults:', SpriteRendererComponent.getDefaultMeta());
    
    // Test ImageComponent
    console.log('\n🖼️ Testing ImageComponent...');
    const image = ImageComponent.meta({
        src: "test.png",
        width: 100,
        height: 80
    });
    console.log('✅ ImageComponent.meta() works');
    console.log('   Defaults:', ImageComponent.getDefaultMeta());
    
    // Test RigidbodyComponent
    console.log('\n⚽ Testing RigidbodyComponent...');
    const rigidbody = RigidbodyComponent.meta({
        gravity: true,
        gravityScale: 400,
        bounciness: 0.5
    });
    console.log('✅ RigidbodyComponent.meta() works');
    console.log('   Defaults:', RigidbodyComponent.getDefaultMeta());
    
    // Test BoxColliderComponent
    console.log('\n📦 Testing BoxColliderComponent...');
    const boxCollider = BoxColliderComponent.meta({
        width: 50,
        height: 60,
        trigger: false
    });
    console.log('✅ BoxColliderComponent.meta() works');
    console.log('   Defaults:', BoxColliderComponent.getDefaultMeta());
    
    // Test CircleColliderComponent
    console.log('\n⭕ Testing CircleColliderComponent...');
    const circleCollider = CircleColliderComponent.meta({
        radius: 25,
        trigger: true
    });
    console.log('✅ CircleColliderComponent.meta() works');
    console.log('   Defaults:', CircleColliderComponent.getDefaultMeta());
    
    // Test SpriteAnimationComponent
    console.log('\n🎬 Testing SpriteAnimationComponent...');
    const animation = SpriteAnimationComponent.meta({
        defaultClipName: "idle",
        autoPlay: true
    });
    console.log('✅ SpriteAnimationComponent.meta() works');
    console.log('   Defaults:', SpriteAnimationComponent.getDefaultMeta());
    
    // Test CameraComponent
    console.log('\n📷 Testing CameraComponent...');
    const camera = CameraComponent.meta({
        zoom: 1.5
    });
    console.log('✅ CameraComponent.meta() works');
    console.log('   Defaults:', CameraComponent.getDefaultMeta());
    
    // Test SpriteAnimationClip
    console.log('\n🎬 Testing SpriteAnimationClip...');
    const animClip = SpriteAnimationClip.meta({
        name: "walk",
        spriteNames: ["walk_0", "walk_1", "walk_2", "walk_3"],
        fps: 8,
        loop: true
    });
    console.log('✅ SpriteAnimationClip.meta() works');
    console.log('   Name:', animClip.name);
    console.log('   Sprites:', animClip.spriteNames);
    console.log('   FPS:', animClip.fps);
    console.log('   Loop:', animClip.loop);
    console.log('   Defaults:', SpriteAnimationClip.getDefaultMeta());
    
    console.log('\n🎉 All metadata tests passed!');
    
} catch (error) {
    console.error('❌ Error during metadata test:', error);
    console.error('Stack:', error.stack);
}
