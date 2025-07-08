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