// === Updated Physics Example ===
import {
  Game,
  Scene,
  GameObject,
  Component,
  CameraComponent,
  BoxColliderComponent,
  ShapeComponent,
  RigidbodyComponent,
  MovementComponent,
  Instantiate
} from '../../dist/nity.module.min.js';

console.log('Starting updated physics test...');

const canvas = document.getElementById('game');
const game = new Game(canvas);

const scene = new Scene({
  create(scene) {
    console.log('Creating physics test scene...');
    
    // Create a moving player with rigidbody
    const player = Instantiate.create(GameObject, {
      x: 100,
      y: 100
    });
    player.name = "Player";
    
    player.addComponent(new ShapeComponent("square", {
      width: 20,
      height: 20,
      color: 'red'
    }));
    
    player.addComponent(new BoxColliderComponent(20, 20));
    player.addComponent(new RigidbodyComponent({ bounciness: 0.5 })); // 50% bounce
    player.addComponent(new MovementComponent(150));
    
    // Add collision event handling (handled by CollisionSystem)
    player.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('Player collision enter with:', other.name);
        this.gameObject.getComponent(ShapeComponent).color = 'yellow';
      }
      
      onCollisionStay(other) {
        // Visual feedback during collision
        const shape = this.gameObject.getComponent(ShapeComponent);
        shape.color = shape.color === 'yellow' ? 'orange' : 'yellow';
      }
      
      onCollisionExit(other) {
        console.log('Player collision exit with:', other.name);
        this.gameObject.getComponent(ShapeComponent).color = 'red';
      }
    });
    
    // Create static obstacles for bouncing
    const obstacle1 = Instantiate.create(GameObject, {
      x: 200,
      y: 150
    });
    obstacle1.name = "Bouncy Wall";
    
    obstacle1.addComponent(new ShapeComponent("square", {
      width: 40,
      height: 40,
      color: 'blue'
    }));
    obstacle1.addComponent(new BoxColliderComponent(40, 40));
    
    obstacle1.addComponent(new class extends Component {
      onCollisionEnter(other) {
        if (other.name === "Player") {
          console.log('Wall hit by player - physics bounce will occur!');
          this.gameObject.getComponent(ShapeComponent).color = 'lightblue';
        }
      }
      
      onCollisionExit(other) {
        if (other.name === "Player") {
          this.gameObject.getComponent(ShapeComponent).color = 'blue';
        }
      }
    });
    
    // Create a trigger zone (no physics, only events)
    const triggerZone = Instantiate.create(GameObject, {
      x: 300,
      y: 200
    });
    triggerZone.name = "Trigger Zone";
    
    triggerZone.addComponent(new ShapeComponent("square", {
      width: 60,
      height: 60,
      color: 'green'
    }));
    
    const triggerCollider = new BoxColliderComponent(60, 60);
    triggerCollider.trigger = true; // Make it a trigger
    triggerZone.addComponent(triggerCollider);
    
    triggerZone.addComponent(new class extends Component {
      onTriggerEnter(other) {
        if (other.name === "Player") {
          console.log('Player entered trigger zone!');
          this.gameObject.getComponent(ShapeComponent).color = 'lightgreen';
        }
      }
      
      onTriggerExit(other) {
        if (other.name === "Player") {
          console.log('Player exited trigger zone!');
          this.gameObject.getComponent(ShapeComponent).color = 'green';
        }
      }
    });
    
    // Create another rigidbody object that can also bounce
    const movingObstacle = Instantiate.create(GameObject, {
      x: 150,
      y: 250
    });
    movingObstacle.name = "Moving Obstacle";
    
    movingObstacle.addComponent(new ShapeComponent("square", {
      width: 25,
      height: 25,
      color: 'purple'
    }));
    movingObstacle.addComponent(new BoxColliderComponent(25, 25));
    movingObstacle.addComponent(new RigidbodyComponent({ 
      bounciness: 0.8,
      gravity: true,
      gravityScale: 100
    }));
    
    movingObstacle.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('Moving obstacle collided with:', other.name);
        this.gameObject.getComponent(ShapeComponent).color = 'magenta';
      }
      
      onCollisionExit(other) {
        this.gameObject.getComponent(ShapeComponent).color = 'purple';
      }
    });
    
    // Add camera
    const cameraObject = Instantiate.create(GameObject, {
      x: 0,
      y: 0,
      parent: player,
      addToScene: false
    });
    cameraObject.addComponent(new CameraComponent(game.canvas, 1.5));
    game.mainCamera = cameraObject;
    
    console.log('Physics test scene created!');
    console.log('- Red player: Bounces off blue wall (physics + events)');
    console.log('- Green zone: Trigger only (events, no physics)');
    console.log('- Purple object: Has gravity and bounces');
    console.log('- CollisionSystem handles all collision events');
    console.log('- RigidbodyComponent handles only physics resolution');
  }
});

game.launch(scene);

window.game = game;
console.log('Game launched! Use WASD to move the red player.');
