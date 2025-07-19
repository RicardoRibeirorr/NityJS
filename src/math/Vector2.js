/**
 * Vector2 represents a 2D vector and provides operations for 2D math.
 * This class mimics Unity's Vector2 API for familiar usage patterns.
 * 
 * @example
 * // Creating vectors
 * const position = new Vector2(10, 20);
 * const velocity = Vector2.right.multiply(5);
 * 
 * // Vector operations
 * const newPosition = position.add(velocity);
 * const distance = Vector2.distance(position, target);
 */
export class Vector2 {
    /**
     * Creates a new Vector2.
     * @param {number} x - The x component (default: 0)
     * @param {number} y - The y component (default: 0)
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Static constants
    static get zero() { return new Vector2(0, 0); }
    static get one() { return new Vector2(1, 1); }
    static get up() { return new Vector2(0, 1); }
    static get down() { return new Vector2(0, -1); }
    static get left() { return new Vector2(-1, 0); }
    static get right() { return new Vector2(1, 0); }
    static get positiveInfinity() { return new Vector2(Infinity, Infinity); }
    static get negativeInfinity() { return new Vector2(-Infinity, -Infinity); }

    /**
     * Gets the magnitude (length) of this vector.
     * @returns {number} The magnitude of the vector
     */
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Gets the squared magnitude of this vector (faster than magnitude).
     * @returns {number} The squared magnitude of the vector
     */
    get sqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Gets the normalized version of this vector.
     * @returns {Vector2} A normalized copy of this vector
     */
    get normalized() {
        const mag = this.magnitude;
        if (mag === 0) return Vector2.zero;
        return new Vector2(this.x / mag, this.y / mag);
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector2} other - The vector to add
     * @returns {Vector2} A new vector representing the sum
     */
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector2} other - The vector to subtract
     * @returns {Vector2} A new vector representing the difference
     */
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /**
     * Multiplies this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector2} A new vector representing the product
     */
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    /**
     * Divides this vector by a scalar.
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector2} A new vector representing the quotient
     */
    divide(scalar) {
        if (scalar === 0) throw new Error("Cannot divide by zero");
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    /**
     * Normalizes this vector in place.
     * @returns {Vector2} This vector for chaining
     */
    normalize() {
        const mag = this.magnitude;
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }

    /**
     * Sets the components of this vector.
     * @param {number} x - The new x component
     * @param {number} y - The new y component
     * @returns {Vector2} This vector for chaining
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Creates a copy of this vector.
     * @returns {Vector2} A new vector with the same components
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * Checks if this vector equals another vector.
     * @param {Vector2} other - The vector to compare to
     * @returns {boolean} True if vectors are equal
     */
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Returns a string representation of this vector.
     * @returns {string} String representation
     */
    toString() {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    // Static methods

    /**
     * Calculates the dot product of two vectors.
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {number} The dot product
     */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Calculates the distance between two vectors.
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {number} The distance between the vectors
     */
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculates the squared distance between two vectors (faster than distance).
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {number} The squared distance between the vectors
     */
    static sqrDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx * dx + dy * dy;
    }

    /**
     * Linearly interpolates between two vectors.
     * @param {Vector2} a - Start vector
     * @param {Vector2} b - End vector
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Vector2} Interpolated vector
     */
    static lerp(a, b, t) {
        t = Math.max(0, Math.min(1, t)); // Clamp t to [0,1]
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        );
    }

    /**
     * Linearly interpolates between two vectors without clamping t.
     * @param {Vector2} a - Start vector
     * @param {Vector2} b - End vector
     * @param {number} t - Interpolation factor
     * @returns {Vector2} Interpolated vector
     */
    static lerpUnclamped(a, b, t) {
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        );
    }

    /**
     * Returns a vector with the minimum components of two vectors.
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {Vector2} Vector with minimum components
     */
    static min(a, b) {
        return new Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }

    /**
     * Returns a vector with the maximum components of two vectors.
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {Vector2} Vector with maximum components
     */
    static max(a, b) {
        return new Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    /**
     * Moves a point towards a target.
     * @param {Vector2} current - Current position
     * @param {Vector2} target - Target position
     * @param {number} maxDistanceDelta - Maximum distance to move
     * @returns {Vector2} New position
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
     * @param {Vector2} inDirection - The direction vector to reflect
     * @param {Vector2} inNormal - The normal of the surface
     * @returns {Vector2} The reflected vector
     */
    static reflect(inDirection, inNormal) {
        const factor = -2 * Vector2.dot(inNormal, inDirection);
        return new Vector2(
            factor * inNormal.x + inDirection.x,
            factor * inNormal.y + inDirection.y
        );
    }

    /**
     * Returns the angle in radians between two vectors.
     * @param {Vector2} from - First vector
     * @param {Vector2} to - Second vector
     * @returns {number} Angle in radians
     */
    static angle(from, to) {
        const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
        if (denominator < 1e-15) return 0;
        
        const dot = Math.max(-1, Math.min(1, Vector2.dot(from, to) / denominator));
        return Math.acos(dot);
    }

    /**
     * Returns the signed angle in radians between two vectors.
     * @param {Vector2} from - First vector
     * @param {Vector2} to - Second vector
     * @returns {number} Signed angle in radians
     */
    static signedAngle(from, to) {
        const unsignedAngle = Vector2.angle(from, to);
        const sign = Math.sign(from.x * to.y - from.y * to.x);
        return unsignedAngle * sign;
    }

    /**
     * Clamps the magnitude of a vector to a maximum length.
     * @param {Vector2} vector - The vector to clamp
     * @param {number} maxLength - The maximum length
     * @returns {Vector2} The clamped vector
     */
    static clampMagnitude(vector, maxLength) {
        const sqrMagnitude = vector.sqrMagnitude;
        if (sqrMagnitude > maxLength * maxLength) {
            const mag = Math.sqrt(sqrMagnitude);
            const normalizedX = vector.x / mag;
            const normalizedY = vector.y / mag;
            return new Vector2(normalizedX * maxLength, normalizedY * maxLength);
        }
        return vector.clone();
    }

    /**
     * Rotates a vector by an angle in radians.
     * @param {Vector2} vector - The vector to rotate
     * @param {number} angle - The angle in radians
     * @returns {Vector2} The rotated vector
     */
    static rotate(vector, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            vector.x * cos - vector.y * sin,
            vector.x * sin + vector.y * cos
        );
    }

    /**
     * Returns a perpendicular vector (rotated 90 degrees counterclockwise).
     * @param {Vector2} vector - The input vector
     * @returns {Vector2} The perpendicular vector
     */
    static perpendicular(vector) {
        return new Vector2(-vector.y, vector.x);
    }

    /**
     * Smoothly damps between vectors.
     * @param {Vector2} current - Current position
     * @param {Vector2} target - Target position
     * @param {Object} currentVelocity - Object with x, y velocity components (modified by reference)
     * @param {number} smoothTime - Approximate time to reach target
     * @param {number} maxSpeed - Maximum speed (optional)
     * @param {number} deltaTime - Time since last call
     * @returns {Vector2} Smoothly damped position
     */
    static smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime) {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        
        let changeX = current.x - target.x;
        let changeY = current.y - target.y;
        const originalTo = target.clone();
        
        const maxChange = maxSpeed * smoothTime;
        const maxChangeSq = maxChange * maxChange;
        const sqrMag = changeX * changeX + changeY * changeY;
        
        if (sqrMag > maxChangeSq) {
            const mag = Math.sqrt(sqrMag);
            changeX = changeX / mag * maxChange;
            changeY = changeY / mag * maxChange;
        }
        
        const targetX = current.x - changeX;
        const targetY = current.y - changeY;
        
        const tempX = (currentVelocity.x + omega * changeX) * deltaTime;
        const tempY = (currentVelocity.y + omega * changeY) * deltaTime;
        
        currentVelocity.x = (currentVelocity.x - omega * tempX) * exp;
        currentVelocity.y = (currentVelocity.y - omega * tempY) * exp;
        
        let outputX = targetX + (changeX + tempX) * exp;
        let outputY = targetY + (changeY + tempY) * exp;
        
        const origMinusCurrentX = originalTo.x - current.x;
        const origMinusCurrentY = originalTo.y - current.y;
        const outMinusOrigX = outputX - originalTo.x;
        const outMinusOrigY = outputY - originalTo.y;
        
        if (origMinusCurrentX * outMinusOrigX + origMinusCurrentY * outMinusOrigY > 0) {
            outputX = originalTo.x;
            outputY = originalTo.y;
            currentVelocity.x = (outputX - originalTo.x) / deltaTime;
            currentVelocity.y = (outputY - originalTo.y) / deltaTime;
        }
        
        return new Vector2(outputX, outputY);
    }
}
