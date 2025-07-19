# Vector2 & Vector3

The `Vector2` and `Vector3` classes provide comprehensive 2D and 3D vector mathematics for NityJS, mirroring Unity's Vector API for familiar usage patterns.

## Vector2

A 2D vector class with x and y components.

### Constructor

```javascript
const vector = new Vector2(x, y);
const origin = new Vector2();        // (0, 0)
const position = new Vector2(10, 5); // (10, 5)
```

### Static Constants

```javascript
Vector2.zero              // (0, 0)
Vector2.one               // (1, 1)
Vector2.up                // (0, 1)
Vector2.down              // (0, -1)
Vector2.left              // (-1, 0)
Vector2.right             // (1, 0)
Vector2.positiveInfinity  // (∞, ∞)
Vector2.negativeInfinity  // (-∞, -∞)
```

### Properties

```javascript
vector.magnitude          // Length of the vector
vector.sqrMagnitude      // Squared length (faster than magnitude)
vector.normalized        // Normalized copy of the vector
```

### Instance Methods

```javascript
// Basic operations
vector.add(other)         // Addition
vector.subtract(other)    // Subtraction  
vector.multiply(scalar)   // Scalar multiplication
vector.divide(scalar)     // Scalar division

// Modification
vector.normalize()        // Normalize in place
vector.set(x, y)         // Set components
vector.clone()           // Create copy
vector.equals(other)     // Equality check
vector.toString()        // String representation
```

### Static Methods

```javascript
// Distance and dot product
Vector2.distance(a, b)           // Distance between vectors
Vector2.sqrDistance(a, b)        // Squared distance (faster)
Vector2.dot(a, b)                // Dot product

// Interpolation
Vector2.lerp(a, b, t)            // Linear interpolation (clamped)
Vector2.lerpUnclamped(a, b, t)   // Linear interpolation (unclamped)

// Min/Max operations  
Vector2.min(a, b)                // Component-wise minimum
Vector2.max(a, b)                // Component-wise maximum

// Movement and reflection
Vector2.moveTowards(current, target, maxDelta)  // Move towards target
Vector2.reflect(direction, normal)              // Reflect off surface

// Angles and rotation
Vector2.angle(from, to)          // Angle between vectors (radians)
Vector2.signedAngle(from, to)    // Signed angle (radians)
Vector2.rotate(vector, angle)    // Rotate by angle
Vector2.perpendicular(vector)    // Perpendicular vector

// Utilities
Vector2.clampMagnitude(vector, maxLength)       // Clamp magnitude
Vector2.smoothDamp(current, target, velocity, smoothTime, maxSpeed, deltaTime)
```

## Vector3

A 3D vector class with x, y, and z components.

### Constructor

```javascript
const vector = new Vector3(x, y, z);
const origin = new Vector3();           // (0, 0, 0)
const position = new Vector3(10, 5, 2); // (10, 5, 2)
```

### Static Constants

```javascript
Vector3.zero              // (0, 0, 0)
Vector3.one               // (1, 1, 1)
Vector3.up                // (0, 1, 0)
Vector3.down              // (0, -1, 0)
Vector3.left              // (-1, 0, 0)
Vector3.right             // (1, 0, 0)
Vector3.forward           // (0, 0, 1)
Vector3.back              // (0, 0, -1)
Vector3.positiveInfinity  // (∞, ∞, ∞)
Vector3.negativeInfinity  // (-∞, -∞, -∞)
```

### Properties

Same as Vector2, but with z component support:

```javascript
vector.magnitude          // Length of the vector
vector.sqrMagnitude      // Squared length (faster than magnitude)
vector.normalized        // Normalized copy of the vector
```

### Instance Methods

Same as Vector2, but with z component support:

```javascript
// Basic operations
vector.add(other)         // Addition
vector.subtract(other)    // Subtraction  
vector.multiply(scalar)   // Scalar multiplication
vector.divide(scalar)     // Scalar division

// Modification
vector.normalize()        // Normalize in place
vector.set(x, y, z)      // Set components
vector.clone()           // Create copy
vector.equals(other)     // Equality check
vector.toString()        // String representation
```

### Static Methods

Includes all Vector2 methods plus 3D-specific operations:

```javascript
// 3D-specific operations
Vector3.cross(a, b)              // Cross product
Vector3.slerp(a, b, t)           // Spherical interpolation

// Projection
Vector3.project(vector, onNormal)        // Project onto vector
Vector3.projectOnPlane(vector, normal)   // Project onto plane

// Advanced rotation
Vector3.rotateTowards(current, target, maxRadians, maxMagnitude)

// Utilities
Vector3.orthonormalize(normal)   // Create orthonormal basis
```

## Unity Equivalents

These classes directly mirror Unity's Vector2 and Vector3 APIs:

| NityJS | Unity | Description |
|--------|-------|-------------|
| `Vector2.distance()` | `Vector2.Distance()` | Distance between vectors |
| `Vector2.dot()` | `Vector2.Dot()` | Dot product |
| `Vector2.lerp()` | `Vector2.Lerp()` | Linear interpolation |
| `Vector3.cross()` | `Vector3.Cross()` | Cross product |
| `Vector3.slerp()` | `Vector3.Slerp()` | Spherical interpolation |

## Examples

### Basic Vector Operations

```javascript
// Create vectors
const playerPos = new Vector2(100, 200);
const targetPos = new Vector2(150, 250);

// Calculate movement direction
const direction = targetPos.subtract(playerPos).normalized;
const speed = 50;
const velocity = direction.multiply(speed);

// Update position
const newPosition = playerPos.add(velocity.multiply(deltaTime));
```

### 3D Movement

```javascript
// Create 3D vectors
const position = new Vector3(0, 0, 0);
const target = new Vector3(10, 0, 10);

// Move towards target
const moveSpeed = 5;
const newPosition = Vector3.moveTowards(position, target, moveSpeed * deltaTime);
```

### Physics Calculations

```javascript
// Reflect a ball off a wall
const ballVelocity = new Vector2(-5, 3);
const wallNormal = Vector2.up; // Horizontal wall

const reflectedVelocity = Vector2.reflect(ballVelocity, wallNormal);
```

### Smooth Camera Follow

```javascript
// Smooth camera following
let cameraVelocity = { x: 0, y: 0 };

const smoothedPosition = Vector2.smoothDamp(
    cameraPosition,
    targetPosition, 
    cameraVelocity,
    0.3, // smooth time
    Infinity, // max speed
    deltaTime
);
```

## Performance Notes

- Use `sqrMagnitude` instead of `magnitude` when possible (avoids expensive sqrt)
- Use `sqrDistance` instead of `distance` for comparisons
- Vector operations create new vectors; modify existing vectors with instance methods for better performance
- Static constants are computed on access, consider caching for frequent use

## Best Practices

1. **Immutability**: Most operations return new vectors, preserving the original
2. **Method Chaining**: Instance methods return `this` for chaining: `vector.set(1, 2).normalize()`
3. **Unity Familiarity**: Use the same patterns as Unity for easy migration
4. **Performance**: Use appropriate methods based on performance needs
5. **Validation**: Methods include appropriate error checking and edge case handling
