// Simple Layer System Example for NityJS
// Just 3 shapes stacked on different layers

import { Instantiate, Game, Scene, GameObject, Component, Vector2, ShapeComponent } from '../../../dist/nity.module.js';

// Demo Scene
const newScene = new Scene({
  create(scene) {
        // Create 3 shapes at the same position (400, 300) on different layers
        
        // UI layer - Green circle (smallest, on top)
        const uiShape = new GameObject(new Vector2(400, 300));
        uiShape.layer = 'ui';
        uiShape.addComponent(new ShapeComponent('circle', {color:'#4CAF50', radius: 40}));
        Instantiate.create(uiShape);
        
        // Background layer - Blue circle (largest, behind everything)
        const backgroundShape = new GameObject(new Vector2(400, 300));
        backgroundShape.layer = 'background';
        backgroundShape.addComponent(new ShapeComponent('circle', {color:'#0066CC', radius: 80}));
        Instantiate.create(backgroundShape);
        
        // Default layer - Red circle (medium, middle)
        const defaultShape = new GameObject(new Vector2(400, 300));
        // layer is automatically 'default'
        defaultShape.addComponent(new ShapeComponent('circle', {color:'#FF6B6B', radius: 60}));
        Instantiate.create(defaultShape);

        
        console.log('3 shapes created on different layers at same position');
    }
});

// Initialize the game
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Configure game with layer system
    game.configure({
        useLayerSystem: true
    });

    // Load and start the scene
    game.launch(newScene);
