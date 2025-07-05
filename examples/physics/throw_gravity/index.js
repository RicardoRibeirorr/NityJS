// === Setup Angry Birds-style Launch Example ===
import {
  Game,
  Scene,
  GameObject,
  Component,
  CameraComponent,
  ShapeComponent,
  RigidbodyComponent,
  ImageComponent,
  CircleColliderComponent,
  BoxColliderComponent,
} from '../../../dist/nity.module.min.js';

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    // === Background ===
    const background = new GameObject(-200, -300);
    background.addComponent(new ImageComponent('../../_assets/background_platform.png'))
    scene.add(background);

    // === Ground ===
    const ground = new GameObject(0, 300);
    ground.addComponent(new ShapeComponent("rect", {
      width: 2000,
      height: 50,
      color: '#8B4513'
    }));
    ground.addComponent(new BoxColliderComponent(2000, 50, false));
    scene.add(ground);

    // === Ball ===
    const ball = new GameObject(100, 100);
    ball.addComponent(new ShapeComponent("circle", {
      radius: 10,
      color: 'red'
    }));
    ball.addComponent(new CircleColliderComponent(10, false));
    const rb = ball.addComponent(new RigidbodyComponent({
      gravity: true,
      gravityScale: 300,
    })); // Makes it bounce!

    scene.add(ball);

    // === Camera ===
    const cameraObject = new GameObject(0, 0);
    cameraObject.addComponent(new CameraComponent(game.canvas, 1));
    ball.addChild(cameraObject);
    game.mainCamera = cameraObject;

    // === Launch Button ===
    const button = document.createElement('button');
    button.textContent = "Launch Ball";
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      // Apply launch force (simulate throw)
      rb.velocity.x = 300;
      rb.velocity.y = -400;
    });
  }
});

game.launch(scene);