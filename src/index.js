// Entry for Nity.js engine
// 'use strict';

export * from './core/Game.js';
export * from './core/Time.js';
export * from './core/Instantiate.js';
export { Destroy, DestroyComponent, DestroyAll, getPendingDestructionCount, clearPendingDestructions } from './core/Destroy.js';

export * from './common/Component.js';
export * from './animations/SpriteAnimationClip.js';
export * from './animations/components/SpriteAnimationComponent.js';
export * from './asset/SpriteRegistry.js';
export * from './asset/Tile.js';
export * from './asset/TileAsset.js';
export * from './asset/TileRegistry.js';
export * from './common/GameObject.js';
export * from './common/Scene.js';
export * from './common/components/CameraComponent.js';
export * from './extensions/movement/MovementController.js';
export * from './input/Input.js';
// export * from './renderer/Sprite.js';
export * from './asset/SpriteAsset.js';
export * from './asset/SpritesheetAsset.js';
export * from './core/LayerManager.js';
export * from './renderer/components/ImageComponent.js';
export * from './renderer/components/ShapeComponent.js';
export * from './renderer/components/SpriteRendererComponent.js';
export * from './renderer/components/TilemapComponent.js';
export * from './physics/components/BoxColliderComponent.js';
export * from './physics/components/CircleColliderComponent.js';
export * from './physics/components/RigidbodyComponent.js';
export * from './math/Random.js';
export * from './math/Vector2.js';
export * from './math/Vector3.js';

export * from './extensions/movement/FollowTarget.js';
export * from './extensions/movement/MovementController.js';
