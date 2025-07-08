// === Instantiate System Example ===
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

const canvas = document.getElementById('game');
const game = new Game(canvas);

// Create a custom Player class that can be instantiated
class Player extends GameObject {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.name = "Player";
    
    // Add visual component
    this.addComponent(new ShapeComponent("square", {
      width: 20,
      height: 20,
      color: 'red'
    }));
    
    // Add collider
    this.addComponent(new BoxColliderComponent(20, 20));
    
    // Add physics
    this.addComponent(new RigidbodyComponent());
    
    // Add movement
    this.addComponent(new MovementComponent(100));
    
    // Add collision detection component
    this.addComponent(new class extends Component {
      onCollisionEnter(other) {
        console.log('Player collided with:', other.name || 'unnamed object');
        // Change player color to indicate collision
        this.gameObject.getComponent(ShapeComponent).color = 'yellow';
      }
      
      onCollisionExit(other) {
        console.log('Player stopped colliding with:', other.name || 'unnamed object');
        // Return to normal color
        this.gameObject.getComponent(ShapeComponent).color = 'red';
      }
    });
  }
}

// Create a custom Obstacle class
class Obstacle extends GameObject {
  constructor(x = 0, y = 0, width = 30, height = 30, color = 'blue') {
    super(x, y);
    this.name = "Obstacle";
    
    // Add visual component
    this.addComponent(new ShapeComponent("square", {
      width: width,
      height: height,
      color: color
    }));
    
    // Add collider
    this.addComponent(new BoxColliderComponent(width, height));
    
    // Add collision response
    this.addComponent(new class extends Component {
      onCollisionEnter(other) {
        if (other.name === "Player") {
          console.log('Obstacle hit by player!');
          // Change obstacle color
          this.gameObject.getComponent(ShapeComponent).color = 'orange';
        }
      }
      
      onCollisionExit(other) {
        if (other.name === "Player") {
          // Return to original color
          this.gameObject.getComponent(ShapeComponent).color = color;
        }
      }
    });
  }
}

const scene = new Scene({
  create(scene) {
    // Create player using Instantiate system
    const player = Instantiate.create(Player, {
      x: 100,
      y: 100
    });
    
    // Create camera and attach it to player
    const cameraObject = Instantiate.create(GameObject, {
      x: 0,
      y: 0,
      parent: player,  // This will automatically set up parent-child relationship
      addToScene: false  // Don't add camera to scene since it's a child
    });
    cameraObject.addComponent(new CameraComponent(game.canvas, 2));
    game.mainCamera = cameraObject;
    
    // Create obstacles using Instantiate system
    const obstacle1 = Instantiate.create(Obstacle, {
      x: 200,
      y: 150,
    }, 40, 40, 'blue');  // Additional constructor arguments
    
    const obstacle2 = Instantiate.create(Obstacle, {
      x: 300,
      y: 200,
    }, 50, 30, 'green');
    
    const obstacle3 = Instantiate.create(Obstacle, {
      x: 150,
      y: 250,
    }, 60, 20, 'purple');
    
    // Create a compound object with children
    const parentObject = Instantiate.create(GameObject, {
      x: 400,
      y: 300
    });
    parentObject.name = "ParentObject";
    
    // Add visual component to parent
    parentObject.addComponent(new ShapeComponent("square", {
      width: 80,
      height: 80,
      color: 'darkblue'
    }));
    parentObject.addComponent(new BoxColliderComponent(80, 80));
    
    // Create children using parent parameter
    const child1 = Instantiate.create(Obstacle, {
      x: -20,  // Relative to parent
      y: -20,
      parent: parentObject,
      addToScene: false
    }, 15, 15, 'cyan');
    
    const child2 = Instantiate.create(Obstacle, {
      x: 20,   // Relative to parent
      y: 20,
      parent: parentObject,
      addToScene: false
    }, 15, 15, 'magenta');
    
    // Add collision detection to parent
    parentObject.addComponent(new class extends Component {
      onCollisionEnter(other) {
        if (other.name === "Player") {
          console.log('Player hit the parent object!');
          this.gameObject.getComponent(ShapeComponent).color = 'lightblue';
        }
      }
      
      onCollisionExit(other) {
        if (other.name === "Player") {
          this.gameObject.getComponent(ShapeComponent).color = 'darkblue';
        }
      }
    });
    
    // Demonstrate cloning
    const clonedObstacle = Instantiate.clone(obstacle1, {
      x: 500,
      y: 100
    });
    clonedObstacle.name = "ClonedObstacle";
    clonedObstacle.getComponent(ShapeComponent).color = 'pink';
    
    console.log('Scene created with Instantiate system!');
    console.log('All colliders should be automatically registered.');
  }
});

game.launch(scene);

// Add some debugging
window.game = game;
window.Instantiate = Instantiate;
console.log('Game instance and Instantiate class available in window for debugging');
