
        import {
            Game,
            Scene,
            GameObject,
            Component,
            CameraComponent,
            ShapeComponent,
            RigidbodyComponent,
            MovementComponent,
            CircleColliderComponent,
            BoxColliderComponent,
            Vector2,
            Random,
            Time
        } from '../../../dist/nity.module.js';

        // Logging function
        function log(message) {
            const logElement = document.getElementById('log');
            const timestamp = new Date().toLocaleTimeString();
            logElement.innerHTML += `[${timestamp}] ${message}<br>`;
            logElement.scrollTop = logElement.scrollHeight;
        }

        log("Starting Complete Vector2 Integration Test...");

        // === Test Rotation Operations ===
        function testRotation() {
            log("=== GameObject Rotation Test ===");
            
            // Create test objects
            const parent = new GameObject(new Vector2(400, 300));
            const child = new GameObject(new Vector2(50, 0));
            
            parent.addChild(child);
            
            // Test rotation setting
            parent.setRotationDegrees(45);
            child.setRotationDegrees(30);
            
            log(`Parent rotation: ${parent.getRotationDegrees().toFixed(1)}° (${parent.rotation.toFixed(3)} rad)`);
            log(`Child local rotation: ${child.getRotationDegrees().toFixed(1)}° (${child.rotation.toFixed(3)} rad)`);
            log(`Child global rotation: ${child.getGlobalRotationDegrees().toFixed(1)}° (${child.getGlobalRotation().toFixed(3)} rad)`);
            
            // Test rotation addition
            parent.rotateDegrees(15);
            log(`After parent.rotateDegrees(15): ${parent.getRotationDegrees().toFixed(1)}°`);
            log(`Child global rotation now: ${child.getGlobalRotationDegrees().toFixed(1)}°`);
            
            log("=== Rotation Test Complete ===");
        }
        // === Test Vector2 Math Operations ===
        function testVectorMath() {
            log("=== Vector2 Math Operations Test ===");
            
            // Test constructor variations
            const v1 = new Vector2(10, 20);
            const v2 = new Vector2(5, 15);
            log(`v1: ${v1.toString()}, v2: ${v2.toString()}`);
            
            // Test basic operations
            const sum = v1.add(v2);
            log(`v1.add(v2): ${sum.toString()}`);
            
            const diff = v1.subtract(v2);
            log(`v1.subtract(v2): ${diff.toString()}`);
            
            const scaled = v1.multiply(2);
            log(`v1.multiply(2): ${scaled.toString()}`);
            
            // Test static methods
            const distance = Vector2.distance(v1, v2);
            log(`Distance between v1 and v2: ${distance.toFixed(2)}`);
            
            const dot = Vector2.dot(v1, v2);
            log(`Dot product: ${dot.toFixed(2)}`);
            
            const angle = Vector2.angle(v1, v2);
            log(`Angle between vectors: ${(angle * 180 / Math.PI).toFixed(2)} degrees`);
            
            // Test normalization
            const normalized = v1.normalized;
            log(`v1 normalized: ${normalized.toString()}`);
            log(`Normalized magnitude: ${normalized.magnitude.toFixed(4)}`);
            
            log("=== Vector2 Math Test Complete ===");
        }

        // === Test Rotation System ===
        // function testRotation() {
        //     log("=== GameObject Rotation Test ===");
            
        //     // Create test objects for rotation
        //     const testParent = new GameObject(new Vector2(400, 300));
        //     testParent.addComponent(new ShapeComponent("rectangle", {
        //         width: 60,
        //         height: 20,
        //         color: 'orange'
        //     }));
        //     scene.add(testParent);
            
        //     const testChild = new GameObject(new Vector2(50, 0));
        //     testChild.addComponent(new ShapeComponent("circle", {
        //         radius: 15,
        //         color: 'cyan'
        //     }));
        //     testParent.addChild(testChild);
            
        //     // Test rotation methods
        //     testParent.setRotationDegrees(45);
        //     testChild.setRotationDegrees(30);
            
        //     log(`Parent rotation: ${testParent.getRotationDegrees().toFixed(1)}°`);
        //     log(`Child local rotation: ${testChild.getRotationDegrees().toFixed(1)}°`);
        //     log(`Child global rotation: ${testChild.getGlobalRotationDegrees().toFixed(1)}°`);
            
        //     // Test rotation by amount
        //     testParent.rotateDegrees(15);
        //     log(`Parent after +15°: ${testParent.getRotationDegrees().toFixed(1)}°`);
        //     log(`Child global after parent rotation: ${testChild.getGlobalRotationDegrees().toFixed(1)}°`);
            
        //     log("=== Rotation Test Complete ===");
        // }

        // === Game Setup ===
        const canvas = document.getElementById('gameCanvas');
        const game = new Game(canvas);

        // Custom component that demonstrates Vector2 usage
        class VectorDemoComponent extends Component {
            constructor() {
                super();
                this.targetPosition = new Vector2(400, 300);
                this.speed = 50;
                this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            }

            start() {
                // Set random target
                this.targetPosition = new Vector2(
                    Random.range(50, 750),
                    Random.range(50, 550)
                );
                
                // Update shape color
                const shape = this.gameObject.getComponent(ShapeComponent);
                if (shape) {
                    shape.color = this.color;
                }

                log(`Object spawned at ${this.gameObject.position.toString()}`);
                log(`Target position: ${this.targetPosition.toString()}`);
            }

            update() {
                const currentPos = this.gameObject.position;
                const direction = this.targetPosition.subtract(currentPos);
                const distance = direction.magnitude;

                if (distance > 5) {
                    // Move towards target using Vector2 operations
                    const normalizedDirection = direction.normalized;
                    const velocity = normalizedDirection.multiply(this.speed);
                    
                    // Use Vector2 translate
                    this.gameObject.translate(velocity.multiply(Time.deltaTime()));
                } else {
                    // Reached target, pick new one
                    this.targetPosition = new Vector2(
                        Random.range(50, 750),
                        Random.range(50, 550)
                    );
                    log(`Object reached target, new target: ${this.targetPosition.toString()}`);
                }
            }
        }

        const scene = new Scene({
            create(scene) {
                log("Scene created, testing GameObject with Vector2 constructor...");

                // Test GameObject with Vector2 constructor
                const testObject = new GameObject(new Vector2(100, 100));
                testObject.addComponent(new ShapeComponent("circle", {
                    radius: 15,
                    color: 'red'
                }));
                testObject.addComponent(new VectorDemoComponent());
                scene.add(testObject);
                
                log(`Test object position: ${testObject.position.toString()}`);
                
                // Create camera
                const cameraObject = new GameObject(new Vector2(200, 200));
                cameraObject.addComponent(new CameraComponent(game.canvas, 1));
                scene.add(cameraObject);
                game.mainCamera = cameraObject;

                // Test physics with Vector2
                const physicsObject = new GameObject(new Vector2(200, 200));
                physicsObject.addComponent(new ShapeComponent("square", {
                    width: 20,
                    height: 20,
                    color: 'blue',
                    trigger:false
                }));
                physicsObject.addComponent(new RigidbodyComponent({
                    velocity: new Vector2(50, -100),
                    gravity: true,
                    gravityScale: 200
                }));
                scene.add(physicsObject);
                
                log("Physics object created with Vector2 velocity");
                
                // Movement component test
                const movingObject = new GameObject(new Vector2(300, 300));
                movingObject.addComponent(new BoxColliderComponent(15, 15));
                movingObject.addComponent(new RigidbodyComponent({
                    velocity: new Vector2(0, 0),
                    gravity: false
                }));
                movingObject.addComponent(new ShapeComponent("square", {
                    width: 15,
                    height: 15,
                    color: 'green'
                }));
                movingObject.addComponent(new MovementComponent(100));
                scene.add(movingObject);
                
                log("Movement object created");
                log("All Vector2 integration tests initialized!");
            }
        });

        // Event handlers
        document.getElementById('spawnObject').addEventListener('click', () => {
            const randomPos = new Vector2(
                Random.range(50, 400),
                Random.range(50, 400)
            );
            
            const newObject = new GameObject(randomPos);
            const radius = Random.range(5, 20);
            newObject.addComponent(new ShapeComponent("circle", {
                radius: radius,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            }));
            newObject.addComponent(new CircleColliderComponent(radius));
            newObject.addComponent(new VectorDemoComponent());
            scene.add(newObject);
            
            log(`New object spawned at ${randomPos.toString()}`);
        });

        document.getElementById('testVector').addEventListener('click', testVectorMath);
        
        document.getElementById('testRotation').addEventListener('click', testRotation);
        
        document.getElementById('clearLog').addEventListener('click', () => {
            document.getElementById('log').innerHTML = '<strong>Vector Operations Log:</strong><br>';
        });

        // Launch the game
        game.configure({
            debug: true
        });
        game.launch(scene);
        
        // Initial vector math test
        setTimeout(testVectorMath, 1000);

        // Make available for debugging
        window.game = game;
        window.Vector2 = Vector2;
        
        log("Game launched! Vector2 integration is complete!");