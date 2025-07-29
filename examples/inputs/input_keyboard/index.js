import { 
    Game, 
    Scene, 
    GameObject, 
    Vector2,
    Time,
    Input,
    ShapeComponent,
    SpriteRendererComponent
} from '../../../dist/nity.module.js';

class KeyboardInputScene extends Scene {
    create() {
        // Create player
        this.player = new GameObject(new Vector2(400, 200));
        this.player.addComponent(ShapeComponent.meta({
            shapeType: 'rectangle',
            options: { 
                width: 40, 
                height: 40, 
                color: '#4a90e2', 
                filled: true 
            }
        }));
        this.add(this.player);

        // Player state
        this.baseSpeed = 200;
        this.currentSpeed = this.baseSpeed;
        this.isJumping = false;
        this.jumpTimer = 0;
        this.originalPosition = new Vector2(400, 200);

        // UI elements
        this.keyStatusElement = document.getElementById('keyStatus');
        this.currentKeysElement = document.getElementById('currentKeys');
        this.positionElement = document.getElementById('position');
        this.speedElement = document.getElementById('speed');
        this.stateElement = document.getElementById('state');

        // Track pressed keys for display
        this.pressedKeys = new Set();
        this.lastKeyPressed = '';
        this.lastKeyReleased = '';

        // Set up keyboard event callbacks to demonstrate the event system
        this.setupKeyboardEvents();

        console.log('⌨️ Keyboard Input Example loaded!');
        console.log('🎮 Input system info:', Input.getSystemInfo());
    }

    setupKeyboardEvents() {
        // Event-based input examples
        Input.keyboard.onEvent('down', 'Space', () => {
            console.log('🚀 Space pressed - JUMP!');
            this.startJump();
        });

        Input.keyboard.onEvent('up', 'Space', () => {
            console.log('🛬 Space released - Landing...');
        });

        Input.keyboard.onEvent('down', 'Enter', () => {
            console.log('🔄 Enter pressed - Resetting position');
            this.resetPosition();
        });

        // Track all key presses for display
        const trackKey = (key) => {
            Input.keyboard.onEvent('down', key, () => {
                this.pressedKeys.add(key);
                this.lastKeyPressed = key;
                this.updateKeyDisplay();
            });

            Input.keyboard.onEvent('up', key, () => {
                this.pressedKeys.delete(key);
                this.lastKeyReleased = key;
                this.updateKeyDisplay();
            });
        };

        // Track common keys
        const keysToTrack = [
            'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Space', 'Enter', 'Shift', 'Control',
            'Escape', 'Tab'
        ];

        keysToTrack.forEach(trackKey);
    }

    update() {
        // Handle continuous movement input using isDown()
        this.handleMovement();
        
        // Handle speed modifiers
        this.handleSpeedModifiers();
        
        // Update jump state
        this.updateJump();
        
        // Update UI
        this.updateUI();
    }

    handleMovement() {
        const movement = new Vector2(0, 0);

        // WASD and Arrow key movement (using multi-value key support)
        if (Input.keyboard.isDown(['w', 'W', 'ArrowUp'])) {
            movement.y -= this.currentSpeed * Time.deltaTime;
        }
        if (Input.keyboard.isDown(['s', 'S', 'ArrowDown'])) {
            movement.y += this.currentSpeed * Time.deltaTime;
        }
        if (Input.keyboard.isDown(['a', 'A', 'ArrowLeft'])) {
            movement.x -= this.currentSpeed * Time.deltaTime;
        }
        if (Input.keyboard.isDown(['d', 'D', 'ArrowRight'])) {
            movement.x += this.currentSpeed * Time.deltaTime;
        }

        // Apply movement
        if (movement.magnitude > 0) {
            this.player.position = this.player.position.add(movement);
            
            // Keep player within canvas bounds
            this.player.position.x = Math.max(20, Math.min(780, this.player.position.x));
            this.player.position.y = Math.max(20, Math.min(380, this.player.position.y));
        }
    }

    handleSpeedModifiers() {
        // Speed modifiers using isDown()
        if (Input.keyboard.isDown('Shift')) {
            this.currentSpeed = this.baseSpeed * 2; // Sprint mode
        } else if (Input.keyboard.isDown('Control')) {
            this.currentSpeed = this.baseSpeed * 0.3; // Slow mode
        } else {
            this.currentSpeed = this.baseSpeed; // Normal speed
        }
    }

    updateJump() {
        if (this.isJumping) {
            this.jumpTimer += Time.deltaTime;
            
            // Change color during jump
            const shapeComponent = this.player.getComponent(ShapeComponent);
            shapeComponent.options.color = '#ffd700'; // Gold color during jump
            
            if (this.jumpTimer >= 0.5) { // Jump lasts 0.5 seconds
                this.isJumping = false;
                this.jumpTimer = 0;
                shapeComponent.options.color = '#4a90e2'; // Back to blue
            }
        }
    }

    startJump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpTimer = 0;
        }
    }

    resetPosition() {
        this.player.position = this.originalPosition.clone();
    }

    updateKeyDisplay() {
        const keysArray = Array.from(this.pressedKeys);
        
        if (keysArray.length > 0) {
            this.keyStatusElement.textContent = `Keys Currently Pressed: ${keysArray.join(', ')}`;
            this.currentKeysElement.innerHTML = keysArray.map(key => 
                `<span class="key-indicator pressed">${key}</span>`
            ).join('');
        } else {
            this.keyStatusElement.textContent = 'No keys currently pressed';
            this.currentKeysElement.innerHTML = '';
        }

        if (this.lastKeyPressed) {
            this.keyStatusElement.textContent += ` | Last Pressed: ${this.lastKeyPressed}`;
        }
        if (this.lastKeyReleased) {
            this.keyStatusElement.textContent += ` | Last Released: ${this.lastKeyReleased}`;
        }
    }

    updateUI() {
        // Update position display
        this.positionElement.textContent = `${Math.round(this.player.position.x)}, ${Math.round(this.player.position.y)}`;
        
        // Update speed display
        let speedText = 'Normal';
        if (Input.keyboard.isDown('Shift')) {
            speedText = 'Sprint (2x)';
        } else if (Input.keyboard.isDown('Control')) {
            speedText = 'Slow (0.3x)';
        }
        this.speedElement.textContent = speedText;
        
        // Update state display
        let stateText = 'Idle';
        if (this.isJumping) {
            stateText = 'Jumping';
        } else if (this.pressedKeys.has('w') || this.pressedKeys.has('W') || this.pressedKeys.has('ArrowUp') ||
                   this.pressedKeys.has('s') || this.pressedKeys.has('S') || this.pressedKeys.has('ArrowDown') ||
                   this.pressedKeys.has('a') || this.pressedKeys.has('A') || this.pressedKeys.has('ArrowLeft') ||
                   this.pressedKeys.has('d') || this.pressedKeys.has('D') || this.pressedKeys.has('ArrowRight')) {
            stateText = 'Moving';
        }
        this.stateElement.textContent = stateText;
    }
}

// Initialize game
const canvas = document.getElementById('gameCanvas');
const game = new Game();
game.configure({ canvas });

// Create and launch scene
const scene = new KeyboardInputScene();
game.launch(scene);

// Add some debug info to console
console.log('🎮 Keyboard Input Example');
console.log('📋 Available Input Methods:');
console.log('- Input.keyboard.isDown(key) - Check if key is currently held');
console.log('- Input.keyboard.isPressed(key) - Check if key was just pressed this frame');
console.log('- Input.keyboard.isReleased(key) - Check if key was just released this frame');
console.log('- Input.keyboard.onEvent(event, key, callback) - Register event callbacks');
console.log('');
console.log('🔧 Input System Info:', Input.getSystemInfo());
console.log('⌨️ Keyboard Device Info:', Input.keyboard.getInfo());
