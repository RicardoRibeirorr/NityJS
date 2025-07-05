import {
  GameObject,
  ShapeComponent,
  BoxColliderComponent
} from '../../../dist/nity.module.min.js';

// === Ceiling ===
export function createScrollingTile(x, y, width, height, color) {
  const block = new GameObject(x, y);
  block.width = width; // Needed by ScrollingBlock
  block.addComponent(new ShapeComponent("rect", {
    width,
    height,
    color
  }));
  block.addComponent(new BoxColliderComponent(width, height, false)); // optional if needed
  // block.addComponent(new plugins.FollowTarget)
  // block.addComponent(new ScrollingBlock(100, 400)); // scrolls at same speed as bird
  return block;
}