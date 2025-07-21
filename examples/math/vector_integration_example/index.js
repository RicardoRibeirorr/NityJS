
        import { 
            Game, 
            Scene, 
            GameObject, 
            Vector2, 
            Vector3,
            ShapeComponent, 
            CircleColliderComponent,
            BoxColliderComponent,
            MovementComponent,
            RigidbodyComponent,
            CameraComponent
        } from '../../../dist/nity.module.js';

        class VectorDemoScene extends Scene {
            constructor() {
                super();
            }

            async start() {
                // Create player at center using Vector2
                const playerPos = new Vector2(400, 300);
                const player = new GameObject(playerPos);
                player.name = 'Player';
                
                // Add visual representation
                player.addComponent(new ShapeComponent('circle', {
                    radius: 20,
                    color: '#4CAF50'
                }));
                player.addComponent(new CircleColliderComponent(20));
                // Add physics
                player.addComponent(new RigidbodyComponent({
                    gravity: false,
                    bounciness: 0
                }));
                
                // Add movement controller
                const movement = new MovementComponent(200);
                player.addComponent(movement);
                
                this.__addObjectToScene(player);
                
                // Create some obstacles using Vector2 positions
                const obstacles = [
                    new Vector2(200, 200),
                    new Vector2(600, 200),
                    new Vector2(200, 500),
                    new Vector2(600, 500),
                ];
                
                obstacles.forEach((pos, index) => {
                    const obstacle = new GameObject(pos);
                    obstacle.name = `Obstacle${index}`;
                    
                    obstacle.addComponent(new ShapeComponent('rectangle', {
                        width: 60,
                        height: 60,
                        color: '#F44336'
                    }));
                    obstacle.addComponent(new BoxColliderComponent(60,60));
                    
                    this.__addObjectToScene(obstacle);
                });
                
                // Create moving target using Vector math
                const target = new GameObject(new Vector2(400, 100));
                target.name = 'Target';
                
                target.addComponent(new ShapeComponent('circle', {
                    radius: 15,
                    color: '#FF9800'
                }));
                target.addComponent(new CircleColliderComponent(15));
                
                // Add custom movement using Vector2 operations
                target.customUpdate = () => {
                    const time = performance.now() * 0.001;
                    const center = new Vector2(400, 300);
                    const radius = 100;
                    const newPos = center.add(new Vector2(
                        Math.cos(time) * radius,
                        Math.sin(time) * radius
                    ));
                    target.setPosition(newPos);
                };
                
                this.__addObjectToScene(target);
                
                // Store references for UI updates
                this.player = player;
                this.target = target;
                
                super.start();
            }
            
            update() {
                super.update();
                
                // Update target movement
                if (this.target && this.target.customUpdate) {
                    this.target.customUpdate();
                }
                
                // Update UI
                if (this.player) {
                    const pos = this.player.position;
                    const rigidbody = this.player.getComponent(RigidbodyComponent);
                    const vel = rigidbody ? rigidbody.velocity : new Vector2(0, 0);
                    
                    document.getElementById('position').textContent = 
                        `Vector2(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;
                    document.getElementById('velocity').textContent = 
                        `Vector2(${vel.x.toFixed(1)}, ${vel.y.toFixed(1)})`;
                }
            }
        }

        // Initialize game
        const canvas = document.getElementById('gameCanvas');
        const game = new Game(canvas);
        const scene = new VectorDemoScene();

        game._internalGizmos = true;

        game.configure({
            debug: true
        }); // Enable debug gizmos
        game.launch(scene);
        
        console.log('Vector integration demo started!');
        console.log('- GameObject positions are now Vector2 objects');
        console.log('- Movement uses Vector2 math operations');
        console.log('- All position calculations use Vector methods');