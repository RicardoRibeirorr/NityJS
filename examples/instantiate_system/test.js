// Simple test for Instantiate system
import {
  Game,
  Scene,
  GameObject,
  Component,
  BoxColliderComponent,
  ShapeComponent,
  Instantiate
} from '../../dist/nity.min.js';

console.log('Starting Instantiate system test...');

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    console.log('Creating test objects...');
    
    // Create a simple object with collider using Instantiate
    const testObj = Instantiate.create(GameObject, {
      x: 100,
      y: 100
    });
    
    testObj.addComponent(new ShapeComponent("square", {
      width: 50,
      height: 50,
      color: 'blue'
    }));
    
    const collider = new BoxColliderComponent(50, 50);
    testObj.addComponent(collider);
    
    // Add collision detection
    testObj.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('✅ Collision detected! Instantiate system working correctly.');
        this.gameObject.getComponent(ShapeComponent).color = 'green';
      }
      
      onCollisionExit(other) {
        this.gameObject.getComponent(ShapeComponent).color = 'blue';
      }
    });
    
    // Create another object to collide with
    const testObj2 = Instantiate.create(GameObject, {
      x: 120,
      y: 120
    });
    
    testObj2.addComponent(new ShapeComponent("square", {
      width: 30,
      height: 30,
      color: 'red'
    }));
    
    testObj2.addComponent(new BoxColliderComponent(30, 30));
    
    console.log('Test objects created. If collision system is working, you should see a collision message.');
    console.log('CollisionSystem instance:', window.game?.scene?.constructor);
  }
});

game.launch(scene);

window.game = game;
window.scene = scene;
