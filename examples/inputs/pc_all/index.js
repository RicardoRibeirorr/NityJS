import {
            Game,
            Scene,
            GameObject,
            Component,
            BoxColliderComponent,
            ShapeComponent,
            RigidbodyComponent,
            Input,
            Instantiate
        } from '../../../dist/nity.module.min.js';

        function log(message) {
            const logElement = document.getElementById('log');
            const timestamp = new Date().toLocaleTimeString();
            logElement.innerHTML += `[${timestamp}] ${message}<br>`;
            logElement.scrollTop = logElement.scrollHeight;
        }

        function clearLog() {
            document.getElementById('log').innerHTML = '';
        }

        function updateStatus() {
            const currentKeysElement = document.getElementById('currentKeys');
            const mousePosElement = document.getElementById('mousePos');
            const mouseButtonsElement = document.getElementById('mouseButtons');
            
            const keysArray = Array.from(Input.keys || []);
            currentKeysElement.textContent = keysArray.length > 0 ? keysArray.join(', ') : 'None';
            
            const mousePos = Input.getMousePosition();
            mousePosElement.textContent = `${Math.round(mousePos.x)}, ${Math.round(mousePos.y)}`;
            
            const mouseButtonsArray = Array.from(Input.mouseButtons || []);
            const buttonNames = mouseButtonsArray.map(b => b === 0 ? 'Left' : b === 1 ? 'Middle' : 'Right');
            mouseButtonsElement.textContent = buttonNames.length > 0 ? buttonNames.join(', ') : 'None';
        }

        function testMouseCallbacks() {
            log('🖱️ Setting up mouse event callbacks...');
            
            // Register mouse event callbacks
            Input.onLeftClickEvent((button, pos) => {
                log(`🔴 CALLBACK: Left mouse button clicked at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            });
            
            Input.onRightClickEvent((button, pos) => {
                log(`🟠 CALLBACK: Right mouse button clicked at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            });
            
            Input.onMouseStayEvent(0, (button, pos) => {
                if (Math.random() < 0.05) { // 5% chance per frame to avoid spam
                    log(`🟡 CALLBACK: Left mouse button being held at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
                }
            });
            
            Input.onMouseUpEvent(0, (button, pos) => {
                log(`🔵 CALLBACK: Left mouse button released at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
            });
            
            Input.onMouseMoveEvent((pos, lastPos) => {
                const delta = Input.getMouseDelta();
                if (Math.abs(delta.x) > 5 || Math.abs(delta.y) > 5) { // Only log significant movement
                    log(`🏃 CALLBACK: Mouse moved to (${Math.round(pos.x)}, ${Math.round(pos.y)}) - delta: (${Math.round(delta.x)}, ${Math.round(delta.y)})`);
                }
            });
            
            log('✅ Mouse event callbacks registered');
        }

        function testCallbacks() {
            log('🔧 Setting up event callbacks...');
            
            // Register event callbacks
            Input.onKeyDownEvent('enter', (key) => {
                log(`🟢 CALLBACK: Enter key pressed (down event)`);
            });
            
            Input.onKeyStayEvent('shift', (key) => {
                log(`🟡 CALLBACK: Shift key being held (stay event)`);
            });
            
            Input.onKeyUpEvent('enter', (key) => {
                log(`🔴 CALLBACK: Enter key released (up event)`);
            });
            
            log('✅ Event callbacks registered for Enter (down/up) and Shift (stay)');
        }

        const canvas = document.getElementById('gameCanvas');
        const game = new Game(canvas);

        // Enhanced movement component that demonstrates all input types
        class PlayerMovement extends Component {
            speed = 200;
            lastSpaceState = false;

            update() {
                const rb = this.gameObject.getComponent(RigidbodyComponent);
                if (!rb) return;

                // Continuous movement (isKeyDown)
                const moveX = (Input.isKeyDown('d') || Input.isKeyDown('ArrowRight') ? 1 : 0) - 
                             (Input.isKeyDown('a') || Input.isKeyDown('ArrowLeft') ? 1 : 0);
                const moveY = (Input.isKeyDown('s') || Input.isKeyDown('ArrowDown') ? 1 : 0) - 
                             (Input.isKeyDown('w') || Input.isKeyDown('ArrowUp') ? 1 : 0);

                rb.velocity.x = moveX * this.speed;
                rb.velocity.y = moveY * this.speed;

                // Test click-like press (isKeyPressed)
                if (Input.isKeyPressed(' ')) {
                    log(`⚡ Space PRESSED (click-like) - fires only once per press`);
                    // Change color briefly
                    const shape = this.gameObject.getComponent(ShapeComponent);
                    if (shape) {
                        shape.color = '#00ff00';
                        setTimeout(() => shape.color = '#ff4444', 200);
                    }
                }

                // Test key release detection (isKeyReleased)
                if (Input.isKeyReleased(' ')) {
                    log(`🔵 Space RELEASED`);
                }

                // Test continuous hold detection
                if (Input.isKeyDown('shift')) {
                    // This fires every frame while held
                    // But we'll only log it occasionally to avoid spam
                    if (Math.random() < 0.02) { // ~2% chance per frame
                        log(`🟡 Shift is being HELD (continuous detection)`);
                    }
                }

                // === MOUSE TESTS ===

                // Test mouse click detection (isMousePressed)
                if (Input.isLeftMousePressed()) {
                    const pos = Input.getMousePosition();
                    log(`🖱️ Left mouse CLICKED at (${Math.round(pos.x)}, ${Math.round(pos.y)}) - fires only once per click`);
                    
                    // Move player towards click position
                    this.gameObject.x = pos.x - 20; // Center on click
                    this.gameObject.y = pos.y - 20;
                }

                // Test right mouse click
                if (Input.isRightMousePressed()) {
                    const pos = Input.getMousePosition();
                    log(`🖱️ Right mouse CLICKED at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
                    
                    // Change color on right click
                    const shape = this.gameObject.getComponent(ShapeComponent);
                    if (shape) {
                        shape.color = '#4444ff';
                        setTimeout(() => shape.color = '#ff4444', 500);
                    }
                }

                // Test mouse release detection
                if (Input.isMouseReleased(0)) {
                    const pos = Input.getMousePosition();
                    log(`🔵 Left mouse RELEASED at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
                }

                // Test continuous mouse hold detection
                if (Input.isLeftMouseDown()) {
                    // This fires every frame while held
                    if (Math.random() < 0.03) { // ~3% chance per frame to avoid spam
                        const pos = Input.getMousePosition();
                        log(`🟡 Left mouse is being HELD at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
                    }
                }

                // Update status display
                updateStatus();
            }
        }

        // Import Component class
        const scene = new Scene({
            create(scene) {
                log('🎮 Enhanced Input System Test Scene Created');
                log('📝 Testing different input detection methods...');

                // Player (red square)
                const player = Instantiate.create(GameObject, { x: 100, y: 100 });
                player.name = "Player";
                
                player.addComponent(new BoxColliderComponent(40, 40, false));
                player.addComponent(new ShapeComponent("square",{
                    width:40,
                    height:40,
                    color: "red"
                }));
                player.addComponent(new RigidbodyComponent({ gravity: false }));
                player.addComponent(new PlayerMovement());

                scene.add(player);

                // Setup initial event callbacks
                testCallbacks();
                testMouseCallbacks();

                log('✅ Scene ready! Try the different input methods described above.');
                log('🖱️ Click anywhere on the canvas to teleport the red square!');
                log('🖱️ Right-click to change color!');
            }
        });

        game.launch(scene);

        // Make functions globally available
        window.clearLog = clearLog;
        window.testCallbacks = testCallbacks;
        window.testMouseCallbacks = testMouseCallbacks;