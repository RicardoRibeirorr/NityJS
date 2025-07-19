/**
 * Vector3 represents a 3D vector and provides operations for 3D math.
 * This class mimics Unity's Vector3 API for familiar usage patterns.
 * 
 * @example
 * // Creating vectors
 * const position = new Vector3(10, 20, 5);
 * const velocity = Vector3.forward.multiply(5);
 * 
 * // Vector operations
 * const newPosition = position.add(velocity);
 * const distance = Vector3.distance(position, target);
 */
export class Vector3 {
    /**
     * Creates a new Vector3.
     * @param {number} x - The x component (default: 0)
     * @param {number} y - The y component (default: 0)
     * @param {number} z - The z component (default: 0)
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Static constants
    static get zero() { return new Vector3(0, 0, 0); }
    static get one() { return new Vector3(1, 1, 1); }
    static get up() { return new Vector3(0, 1, 0); }
    static get down() { return new Vector3(0, -1, 0); }
    static get left() { return new Vector3(-1, 0, 0); }
    static get right() { return new Vector3(1, 0, 0); }
    static get forward() { return new Vector3(0, 0, 1); }
    static get back() { return new Vector3(0, 0, -1); }
    static get positiveInfinity() { return new Vector3(Infinity, Infinity, Infinity); }
    static get negativeInfinity() { return new Vector3(-Infinity, -Infinity, -Infinity); }

    /**
     * Gets the magnitude (length) of this vector.
     * @returns {number} The magnitude of the vector
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Gets the squared magnitude of this vector (faster than magnitude).
     * @returns {number} The squared magnitude of the vector
     */
    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * Gets the normalized version of this vector.
     * @returns {Vector3} A normalized copy of this vector
     */
    get normalized() {
        const mag = this.magnitude;
        if (mag === 0) return Vector3.zero;
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector3} other - The vector to add
     * @returns {Vector3} A new vector representing the sum
     */
    add(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector3} other - The vector to subtract
     * @returns {Vector3} A new vector representing the difference
     */
    subtract(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    /**
     * Multiplies this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector3} A new vector representing the product
     */
    multiply(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * Divides this vector by a scalar.
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector3} A new vector representing the quotient
     */
    divide(scalar) {
        if (scalar === 0) throw new Error("Cannot divide by zero");
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    /**
     * Normalizes this vector in place.
     * @returns {Vector3} This vector for chaining
     */
    normalize() {
        const mag = this.magnitude;
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else {
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }
        return this;
    }

    /**
     * Sets the components of this vector.
     * @param {number} x - The new x component
     * @param {number} y - The new y component
     * @param {number} z - The new z component
     * @returns {Vector3} This vector for chaining
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Creates a copy of this vector.
     * @returns {Vector3} A new vector with the same components
     */
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Checks if this vector equals another vector.
     * @param {Vector3} other - The vector to compare to
     * @returns {boolean} True if vectors are equal
     */
    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    /**
     * Returns a string representation of this vector.
     * @returns {string} String representation
     */
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }

    // Static methods

    /**
     * Calculates the dot product of two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {number} The dot product
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Calculates the cross product of two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {Vector3} The cross product
     */
    static cross(a, b) {
        return new Vector3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    /**
     * Calculates the distance between two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {number} The distance between the vectors
     */
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Calculates the squared distance between two vectors (faster than distance).
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {number} The squared distance between the vectors
     */
    static sqrDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Linearly interpolates between two vectors.
     * @param {Vector3} a - Start vector
     * @param {Vector3} b - End vector
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Vector3} Interpolated vector
     */
    static lerp(a, b, t) {
        t = Math.max(0, Math.min(1, t)); // Clamp t to [0,1]
        return new Vector3(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        );
    }

    /**
     * Linearly interpolates between two vectors without clamping t.
     * @param {Vector3} a - Start vector
     * @param {Vector3} b - End vector
     * @param {number} t - Interpolation factor
     * @returns {Vector3} Interpolated vector
     */
    static lerpUnclamped(a, b, t) {
        return new Vector3(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        );
    }

    /**
     * Spherically interpolates between two vectors.
     * @param {Vector3} a - Start vector
     * @param {Vector3} b - End vector
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Vector3} Spherically interpolated vector
     */
    static slerp(a, b, t) {
        t = Math.max(0, Math.min(1, t)); // Clamp t to [0,1]
        
        const dot = Vector3.dot(a.normalized, b.normalized);
        const clampedDot = Math.max(-1, Math.min(1, dot));
        
        if (Math.abs(clampedDot) > 0.9995) {
            // Vectors are nearly parallel, use linear interpolation
            return Vector3.lerp(a, b, t);
        }
        
        const theta = Math.acos(Math.abs(clampedDot));
        const sinTheta = Math.sin(theta);
        
        const factorA = Math.sin((1 - t) * theta) / sinTheta;
        const factorB = Math.sin(t * theta) / sinTheta;
        
        if (clampedDot < 0) {
            // Take the shorter path
            return new Vector3(
                factorA * a.x - factorB * b.x,
                factorA * a.y - factorB * b.y,
                factorA * a.z - factorB * b.z
            );
        }
        
        return new Vector3(
            factorA * a.x + factorB * b.x,
            factorA * a.y + factorB * b.y,
            factorA * a.z + factorB * b.z
        );
    }

    /**
     * Returns a vector with the minimum components of two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {Vector3} Vector with minimum components
     */
    static min(a, b) {
        return new Vector3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }

    /**
     * Returns a vector with the maximum components of two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {Vector3} Vector with maximum components
     */
    static max(a, b) {
        return new Vector3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }

    /**
     * Moves a point towards a target.
     * @param {Vector3} current - Current position
     * @param {Vector3} target - Target position
     * @param {number} maxDistanceDelta - Maximum distance to move
     * @returns {Vector3} New position
     */
    static moveTowards(current, target, maxDistanceDelta) {
        const diff = target.subtract(current);
        const distance = diff.magnitude;
        
        if (distance <= maxDistanceDelta || distance === 0) {
            return target.clone();
        }
        
        return current.add(diff.divide(distance).multiply(maxDistanceDelta));
    }

    /**
     * Reflects a vector off a plane defined by a normal.
     * @param {Vector3} inDirection - The direction vector to reflect
     * @param {Vector3} inNormal - The normal of the surface
     * @returns {Vector3} The reflected vector
     */
    static reflect(inDirection, inNormal) {
        const factor = -2 * Vector3.dot(inNormal, inDirection);
        return new Vector3(
            factor * inNormal.x + inDirection.x,
            factor * inNormal.y + inDirection.y,
            factor * inNormal.z + inDirection.z
        );
    }

    /**
     * Returns the angle in radians between two vectors.
     * @param {Vector3} from - First vector
     * @param {Vector3} to - Second vector
     * @returns {number} Angle in radians
     */
    static angle(from, to) {
        const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
        if (denominator < 1e-15) return 0;
        
        const dot = Math.max(-1, Math.min(1, Vector3.dot(from, to) / denominator));
        return Math.acos(dot);
    }

    /**
     * Projects a vector onto another vector.
     * @param {Vector3} vector - The vector to project
     * @param {Vector3} onNormal - The vector to project onto
     * @returns {Vector3} The projected vector
     */
    static project(vector, onNormal) {
        const sqrMag = onNormal.sqrMagnitude;
        if (sqrMag < 1e-15) return Vector3.zero;
        
        const dot = Vector3.dot(vector, onNormal);
        return onNormal.multiply(dot / sqrMag);
    }

    /**
     * Projects a vector onto a plane defined by a normal.
     * @param {Vector3} vector - The vector to project
     * @param {Vector3} planeNormal - The normal of the plane
     * @returns {Vector3} The projected vector
     */
    static projectOnPlane(vector, planeNormal) {
        const sqrMag = planeNormal.sqrMagnitude;
        if (sqrMag < 1e-15) return vector.clone();
        
        const dot = Vector3.dot(vector, planeNormal);
        return vector.subtract(planeNormal.multiply(dot / sqrMag));
    }

    /**
     * Clamps the magnitude of a vector to a maximum length.
     * @param {Vector3} vector - The vector to clamp
     * @param {number} maxLength - The maximum length
     * @returns {Vector3} The clamped vector
     */
    static clampMagnitude(vector, maxLength) {
        const sqrMagnitude = vector.sqrMagnitude;
        if (sqrMagnitude > maxLength * maxLength) {
            const mag = Math.sqrt(sqrMagnitude);
            const normalizedX = vector.x / mag;
            const normalizedY = vector.y / mag;
            const normalizedZ = vector.z / mag;
            return new Vector3(normalizedX * maxLength, normalizedY * maxLength, normalizedZ * maxLength);
        }
        return vector.clone();
    }

    /**
     * Rotates a vector towards another vector.
     * @param {Vector3} current - Current direction
     * @param {Vector3} target - Target direction
     * @param {number} maxRadiansDelta - Maximum rotation in radians
     * @param {number} maxMagnitudeDelta - Maximum magnitude change
     * @returns {Vector3} The rotated vector
     */
    static rotateTowards(current, target, maxRadiansDelta, maxMagnitudeDelta) {
        const currentMag = current.magnitude;
        const targetMag = target.magnitude;
        
        if (currentMag > 1e-15 && targetMag > 1e-15) {
            const currentNorm = current.divide(currentMag);
            const targetNorm = target.divide(targetMag);
            
            const angle = Vector3.angle(currentNorm, targetNorm);
            
            if (angle > 1e-15) {
                const t = Math.min(1, maxRadiansDelta / angle);
                const newDirection = Vector3.slerp(currentNorm, targetNorm, t);
                const newMagnitude = currentMag + Math.max(-maxMagnitudeDelta, Math.min(maxMagnitudeDelta, targetMag - currentMag));
                return newDirection.multiply(newMagnitude);
            }
        }
        
        // Vectors are parallel or one is zero
        const newMagnitude = currentMag + Math.max(-maxMagnitudeDelta, Math.min(maxMagnitudeDelta, targetMag - currentMag));
        return target.normalized.multiply(newMagnitude);
    }

    /**
     * Smoothly damps between vectors.
     * @param {Vector3} current - Current position
     * @param {Vector3} target - Target position
     * @param {Object} currentVelocity - Object with x, y, z velocity components (modified by reference)
     * @param {number} smoothTime - Approximate time to reach target
     * @param {number} maxSpeed - Maximum speed (optional)
     * @param {number} deltaTime - Time since last call
     * @returns {Vector3} Smoothly damped position
     */
    static smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime) {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        
        let changeX = current.x - target.x;
        let changeY = current.y - target.y;
        let changeZ = current.z - target.z;
        const originalTo = target.clone();
        
        const maxChange = maxSpeed * smoothTime;
        const maxChangeSq = maxChange * maxChange;
        const sqrMag = changeX * changeX + changeY * changeY + changeZ * changeZ;
        
        if (sqrMag > maxChangeSq) {
            const mag = Math.sqrt(sqrMag);
            changeX = changeX / mag * maxChange;
            changeY = changeY / mag * maxChange;
            changeZ = changeZ / mag * maxChange;
        }
        
        const targetX = current.x - changeX;
        const targetY = current.y - changeY;
        const targetZ = current.z - changeZ;
        
        const tempX = (currentVelocity.x + omega * changeX) * deltaTime;
        const tempY = (currentVelocity.y + omega * changeY) * deltaTime;
        const tempZ = (currentVelocity.z + omega * changeZ) * deltaTime;
        
        currentVelocity.x = (currentVelocity.x - omega * tempX) * exp;
        currentVelocity.y = (currentVelocity.y - omega * tempY) * exp;
        currentVelocity.z = (currentVelocity.z - omega * tempZ) * exp;
        
        let outputX = targetX + (changeX + tempX) * exp;
        let outputY = targetY + (changeY + tempY) * exp;
        let outputZ = targetZ + (changeZ + tempZ) * exp;
        
        const origMinusCurrentX = originalTo.x - current.x;
        const origMinusCurrentY = originalTo.y - current.y;
        const origMinusCurrentZ = originalTo.z - current.z;
        const outMinusOrigX = outputX - originalTo.x;
        const outMinusOrigY = outputY - originalTo.y;
        const outMinusOrigZ = outputZ - originalTo.z;
        
        if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY + origMinusCurrentZ * outMinusOrigZ > 0) {
            outputX = originalTo.x;
            outputY = originalTo.y;
            outputZ = originalTo.z;
            currentVelocity.x = (outputX - originalTo.x) / deltaTime;
            currentVelocity.y = (outputY - originalTo.y) / deltaTime;
            currentVelocity.z = (outputZ - originalTo.z) / deltaTime;
        }
        
        return new Vector3(outputX, outputY, outputZ);
    }

    /**
     * Returns an orthonormal basis from a single vector.
     * @param {Vector3} normal - The normal vector (will be normalized)
     * @returns {Object} Object containing {normal, tangent, binormal}
     */
    static orthonormalize(normal) {
        const norm = normal.normalized;
        
        // Find a vector that's not parallel to normal
        let tangent;
        if (Math.abs(norm.x) < 0.9) {
            tangent = Vector3.cross(norm, Vector3.right).normalized;
        } else {
            tangent = Vector3.cross(norm, Vector3.up).normalized;
        }
        
        const binormal = Vector3.cross(norm, tangent).normalized;
        
        return {
            normal: norm,
            tangent: tangent,
            binormal: binormal
        };
    }
}
