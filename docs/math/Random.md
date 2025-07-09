# Random Class

The `Random` class provides utility methods for generating random numbers and values. This class contains static methods for common randomization needs in game development.

## Overview

Random number generation is essential for creating varied and interesting gameplay experiences. The Random class provides convenient methods for generating random values within specified ranges.

## Methods

### static range(min, max)

Generates a random integer between min and max (inclusive).

**Parameters:**
- `min` (number) - The minimum value (inclusive)
- `max` (number) - The maximum value (inclusive)

**Returns:** `number` - A random integer between min and max

## Usage Examples

### Basic Random Numbers

```javascript
import { Random } from './src/math/Random.js';

// Generate a dice roll (1-6)
const diceRoll = Random.range(1, 6);

// Generate a random damage value (10-25)
const damage = Random.range(10, 25);

// Generate a random spawn position
const spawnX = Random.range(0, 800);
const spawnY = Random.range(0, 600);
```

### Game Mechanics

```javascript
class EnemySpawner extends Component {
    constructor() {
        super();
        this.spawnTimer = 0;
        this.spawnInterval = 2; // seconds
    }
    
    update() {
        this.spawnTimer += Time.deltaTime();
        
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnEnemy();
            this.spawnTimer = 0;
            
            // Randomize next spawn interval (1-3 seconds)
            this.spawnInterval = Random.range(1, 3);
        }
    }
    
    spawnEnemy() {
        const enemy = new GameObject("Enemy");
        enemy.x = Random.range(0, 800);
        enemy.y = Random.range(0, 100);
        Instantiate.create(enemy);
    }
}
```

### Random Item Selection

```javascript
class LootDropper extends Component {
    constructor() {
        super();
        this.lootTable = [
            { name: "Sword", rarity: 1 },
            { name: "Shield", rarity: 2 },
            { name: "Potion", rarity: 5 },
            { name: "Gold", rarity: 10 }
        ];
    }
    
    dropLoot() {
        // Calculate total weight
        const totalWeight = this.lootTable.reduce((sum, item) => sum + item.rarity, 0);
        
        // Generate random number
        const roll = Random.range(1, totalWeight);
        
        // Select item based on weight
        let currentWeight = 0;
        for (const item of this.lootTable) {
            currentWeight += item.rarity;
            if (roll <= currentWeight) {
                console.log(`Dropped: ${item.name}`);
                break;
            }
        }
    }
}
```

### Random Positioning

```javascript
class ParticleSystem extends Component {
    constructor() {
        super();
        this.particles = [];
    }
    
    createParticle() {
        const particle = {
            x: this.gameObject.x + Random.range(-10, 10),
            y: this.gameObject.y + Random.range(-10, 10),
            velocityX: Random.range(-50, 50),
            velocityY: Random.range(-100, -50),
            life: Random.range(1, 3)
        };
        
        this.particles.push(particle);
    }
}
```

## Advanced Usage

### Weighted Random Selection

```javascript
class WeightedRandom {
    static select(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const randomValue = Random.range(1, totalWeight);
        
        let currentWeight = 0;
        for (let i = 0; i < items.length; i++) {
            currentWeight += weights[i];
            if (randomValue <= currentWeight) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }
}

// Usage
const colors = ["red", "blue", "green", "yellow"];
const weights = [1, 2, 3, 4]; // yellow is 4x more likely than red
const selectedColor = WeightedRandom.select(colors, weights);
```

### Random Boolean with Probability

```javascript
class RandomUtils {
    static chance(probability) {
        return Random.range(1, 100) <= probability;
    }
}

// 25% chance to trigger special ability
if (RandomUtils.chance(25)) {
    this.useSpecialAbility();
}
```

## Best Practices

1. **Use meaningful ranges** - Choose min/max values that make sense for your game mechanics
2. **Consider probability distributions** - For more realistic randomness, consider using weighted random selection
3. **Seed random values** - For reproducible randomness, consider implementing seeded random number generation
4. **Cache random values** - For expensive calculations, generate random values once and reuse them

## Common Patterns

### Random Color Generation

```javascript
class RandomColor {
    static generateRGB() {
        const r = Random.range(0, 255);
        const g = Random.range(0, 255);
        const b = Random.range(0, 255);
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    static generateHex() {
        const hex = Random.range(0, 16777215).toString(16);
        return `#${hex.padStart(6, '0')}`;
    }
}
```

### Random Array Element

```javascript
class ArrayUtils {
    static randomElement(array) {
        if (array.length === 0) return null;
        const index = Random.range(0, array.length - 1);
        return array[index];
    }
}

const fruits = ["apple", "banana", "orange", "grape"];
const randomFruit = ArrayUtils.randomElement(fruits);
```

## Related Classes

- [Time](../core/Time.md) - Often used together with Random for time-based random events
- [Component](../core/Component.md) - Base class where Random is commonly used
