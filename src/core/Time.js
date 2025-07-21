import { Game } from "./Game.js";

/**
 * Time provides static methods for accessing time-related information in the game.
 * Enhanced with Unity-style timing functionality using high-precision browser APIs.
 * 
 * @example
 * // Get the delta time for frame-rate independent movement
 * const moveSpeed = 100; // pixels per second
 * gameObject.x += moveSpeed * Time.deltaTime;
 * 
 * // Check if enough time has passed for an action
 * if (Time.time - lastActionTime > 2.0) {
 *     performAction();
 *     lastActionTime = Time.time;
 * }
 */
export class Time {
    static #startTime = performance.now();
    static #lastFrameTime = performance.now();
    static #frameCount = 0;
    static #fpsUpdateInterval = 1000; // Update FPS every second
    static #lastFpsUpdate = performance.now();
    static #currentFps = 60;
    static #timeScale = 1.0;

    /**
     * Returns the time elapsed since the last frame in seconds.
     * This is useful for creating frame-rate independent animations and movement.
     * 
     * @returns {number} The delta time in seconds
     * 
     * @example
     * // Move an object at 50 pixels per second regardless of frame rate
     * gameObject.x += 50 * Time.deltaTime;
     */
    static get deltaTime() {
        return Game.instance?._deltaTime || 0;
    }

    /**
     * The unscaled time elapsed since the last frame in seconds.
     * This is not affected by timeScale and is useful for UI animations.
     * 
     * @returns {number} The unscaled delta time in seconds
     */
    static get unscaleddeltaTime() {
        return (Game.instance?._deltaTime || 0) / this.#timeScale;
    }

    /**
     * The time at the beginning of this frame in seconds since the game started.
     * This is affected by timeScale.
     * 
     * @returns {number} The current game time in seconds
     */
    static get time() {
        return ((performance.now() - this.#startTime) / 1000) * this.#timeScale;
    }

    /**
     * The unscaled time at the beginning of this frame in seconds since the game started.
     * This is not affected by timeScale.
     * 
     * @returns {number} The current real time in seconds
     */
    static get unscaledTime() {
        return (performance.now() - this.#startTime) / 1000;
    }

    /**
     * The current frames per second (updated once per second).
     * 
     * @returns {number} The current FPS
     */
    static get fps() {
        return this.#currentFps;
    }

    /**
     * The total number of frames that have passed since the game started.
     * 
     * @returns {number} The frame count
     */
    static get frameCount() {
        return this.#frameCount;
    }

    /**
     * The scale at which time passes. This affects deltaTime and time.
     * 1.0 = normal speed, 0.5 = half speed, 2.0 = double speed, 0.0 = paused.
     * 
     * @returns {number} The current time scale
     */
    static get timeScale() {
        return this.#timeScale;
    }

    /**
     * Sets the time scale. Useful for slow motion, fast forward, or pause effects.
     * 
     * @param {number} value - The new time scale (0 = paused, 1 = normal, 2 = double speed, etc.)
     */
    static set timeScale(value) {
        this.#timeScale = Math.max(0, value); // Prevent negative time scale
    }

    /**
     * Returns the current high-precision timestamp in milliseconds.
     * Uses performance.now() for sub-millisecond accuracy.
     * 
     * @returns {number} The current timestamp in milliseconds
     */
    static get timestamp() {
        return performance.now();
    }

    /**
     * Returns the time since the Unix epoch in milliseconds.
     * Equivalent to Date.now() but more explicit.
     * 
     * @returns {number} The current Unix timestamp in milliseconds
     */
    static get realtimeSinceStartup() {
        return Date.now();
    }

    /**
     * Internal method called by the Game class to update time statistics.
     * This should not be called directly by user code.
     * 
     * @private
     */
    static _updateTimeStats() {
        const currentTime = performance.now();
        this.#frameCount++;

        // Update FPS calculation
        if (currentTime - this.#lastFpsUpdate >= this.#fpsUpdateInterval) {
            const deltaTime = currentTime - this.#lastFpsUpdate;
            const framesPassed = this.#frameCount - (this.#lastFpsUpdate === performance.now() ? 0 : Math.floor(deltaTime / 16.67)); // Approximate frames in interval
            this.#currentFps = Math.round(1000 / (deltaTime / framesPassed)) || 60;
            this.#lastFpsUpdate = currentTime;
        }

        this.#lastFrameTime = currentTime;
    }

    /**
     * Converts seconds to milliseconds.
     * 
     * @param {number} seconds - Time in seconds
     * @returns {number} Time in milliseconds
     */
    static secondsToMilliseconds(seconds) {
        return seconds * 1000;
    }

    /**
     * Converts milliseconds to seconds.
     * 
     * @param {number} milliseconds - Time in milliseconds
     * @returns {number} Time in seconds
     */
    static millisecondsToSeconds(milliseconds) {
        return milliseconds / 1000;
    }

    /**
     * Creates a simple timer that can be checked against.
     * 
     * @param {number} duration - Duration in seconds
     * @returns {function} A function that returns true when the timer expires
     * 
     * @example
     * const timer = Time.createTimer(2.0);
     * // Later in update loop:
     * if (timer()) {
     *     console.log('2 seconds have passed!');
     * }
     */
    static createTimer(duration) {
        const startTime = this.time;
        return () => this.time - startTime >= duration;
    }

    /**
     * Creates a repeating timer that triggers at regular intervals.
     * 
     * @param {number} interval - Interval in seconds
     * @returns {function} A function that returns true at each interval
     * 
     * @example
     * const intervalTimer = Time.createInterval(1.0);
     * // Later in update loop:
     * if (intervalTimer()) {
     *     console.log('Another second has passed!');
     * }
     */
    static createInterval(interval) {
        let lastTrigger = this.time;
        return () => {
            if (this.time - lastTrigger >= interval) {
                lastTrigger = this.time;
                return true;
            }
            return false;
        };
    }

    /**
     * Smoothly interpolates between two values over time.
     * 
     * @param {number} from - Starting value
     * @param {number} to - Target value  
     * @param {number} speed - Interpolation speed (higher = faster)
     * @returns {number} The interpolated value
     * 
     * @example
     * // Smooth camera follow
     * camera.x = Time.lerp(camera.x, player.x, 2.0);
     */
    static lerp(from, to, speed) {
        return from + (to - from) * (1 - Math.exp(-speed * this.deltaTime));
    }

    /**
     * Resets the time system. Called when starting a new game or scene.
     * This should not typically be called by user code.
     * 
     * @private
     */
    static _reset() {
        this.#startTime = performance.now();
        this.#lastFrameTime = performance.now();
        this.#frameCount = 0;
        this.#lastFpsUpdate = performance.now();
        this.#currentFps = 60;
        this.#timeScale = 1.0;
    }
}