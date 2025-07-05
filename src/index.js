// Entry for Nity.js engine
// 'use strict';

export * from './common/Component.js';
export * from './animations/SpriteAnimationClip.js';
export * from './animations/components/SpriteAnimationComponent.js';
export * from './asset/SpriteRegistry.js';
export * from './common/GameObject.js';
export * from './common/Scene.js';
export * from './common/components/CameraComponent.js';
export * from './core/Game.js';
export * from './extensions/movement/MovementController.js';
export * from './input/Input.js';
export * from './renderer/Sprite.js';
export * from './renderer/Spritesheet.js';
export * from './renderer/components/ImageComponent.js';
export * from './renderer/components/ShapeComponent.js';
export * from './renderer/components/SpriteRendererComponent.js';
export * from './physics/components/BoxColliderComponent.js';
export * from './physics/components/CircleColliderComponent.js';
export * from './physics/components/RigidbodyComponent.js';

// Entry point for the Nity game engine
export function helloNity() {
  console.log('Hello from Nity Game Engine!');
}
