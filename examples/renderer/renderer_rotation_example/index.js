
        import {
            Game,
            Scene,
            GameObject,
            Component,
            CameraComponent,
            ShapeComponent,
            Vector2,
            Time
        } from '../../../dist/nity.module.min.js';

        // Logging function
        function logRotation(message) {
            const logElement = document.getElementById('rotationInfo');
            const timestamp = new Date().toLocaleTimeString();
            logElement.innerHTML += `[${timestamp}] ${message}<br>`;
            logElement.scrollTop = logElement.scrollHeight;
        }

        logRotation("Starting GameObject Rotation Test...");

        // === Game Setup ===
        const canvas = document.getElementById('gameCanvas');
        const game = new Game(canvas);

        let parentObject, childObject1, childObject2, grandchildObject;
        let autoRotating = false;

        // Custom component that displays rotation info
        class RotationInfoComponent extends Component {
            constructor(label) {
                super();
                this.label = label;
                this.updateTimer = 0;
            }

            update() {
                // Update display every 1 second using deltaTime
                this.updateTimer += Time.deltaTime();
                if (this.updateTimer >= 1.0) {
                    this.updateTimer = 0;
                    
                    const localRot = this.gameObject.rotation;
                    const globalRot = this.gameObject.getGlobalRotation();
                    const localDegrees = this.gameObject.getRotationDegrees();
                    const globalDegrees = this.gameObject.getGlobalRotationDegrees();
                    
                    logRotation(`${this.label}: Local ${localDegrees.toFixed(1)}° (${localRot.toFixed(3)}rad), Global ${globalDegrees.toFixed(1)}° (${globalRot.toFixed(3)}rad)`);
                }
            }

            __draw(ctx) {
                const pos = this.gameObject.getGlobalPosition();
                ctx.fillStyle = 'black';
                ctx.font = '12px Arial';
                ctx.fillText(this.label, pos.x + 30, pos.y - 10);
                ctx.fillText(`${this.gameObject.getRotationDegrees().toFixed(1)}°`, pos.x + 30, pos.y + 5);
            }
        }

        // Auto rotation component
        class AutoRotateComponent extends Component {
            constructor(speed = 30) {
                super();
                this.speed = speed; // degrees per second
            }

            update() {
                if (autoRotating) {
                    this.gameObject.rotateDegrees(this.speed * Time.deltaTime());
                }
            }
        }

        const scene = new Scene({
            create(scene) {
                logRotation("Creating rotation test scene...");

                // Create parent object (center)
                parentObject = new GameObject(new Vector2(0, 0));
                parentObject.addComponent(new ShapeComponent("rectangle", {
                    width: 60,
                    height: 20,
                    color: 'red'
                }));
                parentObject.addComponent(new RotationInfoComponent("Parent"));
                parentObject.addComponent(new AutoRotateComponent(45)); // 45 degrees per second
                scene.add(parentObject);

                // Create child object 1 (offset from parent)
                childObject1 = new GameObject(new Vector2(80, 0)); // Relative to parent
                childObject1.addComponent(new ShapeComponent("rectangle", {
                    width: 40,
                    height: 15,
                    color: 'blue'
                }));
                childObject1.addComponent(new RotationInfoComponent("Child1"));
                childObject1.addComponent(new AutoRotateComponent(90)); // 90 degrees per second
                parentObject.addChild(childObject1);

                // Create child object 2 (different offset from parent)
                childObject2 = new GameObject(new Vector2(-80, 40)); // Relative to parent
                childObject2.addComponent(new ShapeComponent("circle", {
                    radius: 15,
                    color: 'green'
                }));
                childObject2.addComponent(new RotationInfoComponent("Child2"));
                childObject2.addComponent(new AutoRotateComponent(-60)); // -60 degrees per second (counter-clockwise)
                parentObject.addChild(childObject2);

                // Create grandchild object (child of child1)
                grandchildObject = new GameObject(new Vector2(40, 20)); // Relative to child1
                grandchildObject.addComponent(new ShapeComponent("triangle", {
                    size: 20,
                    color: 'purple'
                }));
                grandchildObject.addComponent(new RotationInfoComponent("Grandchild"));
                grandchildObject.addComponent(new AutoRotateComponent(120)); // 120 degrees per second
                childObject1.addChild(grandchildObject);

                // Create camera
                const cameraObject = new GameObject(new Vector2(0, 0));
                cameraObject.addComponent(new CameraComponent(game.canvas, 1));
                scene.add(cameraObject);
                game.mainCamera = cameraObject;

                // Create origin marker (non-rotating reference)
                const origin = new GameObject(new Vector2(400, 300));
                origin.addComponent(new ShapeComponent("circle", {
                    radius: 3,
                    color: 'black'
                }));
                scene.add(origin);

                logRotation("Scene created! Parent-child rotation hierarchy established.");
                logRotation("Parent -> Child1 -> Grandchild");
                logRotation("Parent -> Child2");
            }
        });

        // Event handlers
        document.getElementById('rotateParent').addEventListener('click', () => {
            parentObject.rotateDegrees(10);
            logRotation(`Parent rotated by 10°. New rotation: ${parentObject.getRotationDegrees().toFixed(1)}°`);
        });

        document.getElementById('rotateChild').addEventListener('click', () => {
            childObject1.rotateDegrees(15);
            logRotation(`Child1 rotated by 15°. New rotation: ${childObject1.getRotationDegrees().toFixed(1)}°`);
        });

        document.getElementById('resetRotations').addEventListener('click', () => {
            parentObject.setRotation(0);
            childObject1.setRotation(0);
            childObject2.setRotation(0);
            grandchildObject.setRotation(0);
            logRotation("All rotations reset to 0°");
        });

        document.getElementById('autoRotate').addEventListener('click', () => {
            autoRotating = !autoRotating;
            const button = document.getElementById('autoRotate');
            button.textContent = autoRotating ? 'Stop Auto Rotation' : 'Toggle Auto Rotation';
            logRotation(`Auto rotation ${autoRotating ? 'started' : 'stopped'}`);
        });

        // Launch the game
        game.launch(scene);

        // Make available for debugging
        window.game = game;
        window.parentObject = parentObject;
        
        logRotation("Game launched! Use controls to test rotation system.");
        logRotation("Notice how child objects inherit parent rotations (Unity-style).");