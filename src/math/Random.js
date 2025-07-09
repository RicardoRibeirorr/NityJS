/**
 * Random provides utility methods for generating random numbers and values.
 * This class contains static methods for common randomization needs in game development.
 * 
 * @example
 * // Generate a random number between 1 and 6 (like a dice roll)
 * const diceRoll = Random.range(1, 6);
 */
export class Random{

    /**
     * Generates a random number between min and max (inclusive).
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} A random number between min and max.
     */
    static range(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}