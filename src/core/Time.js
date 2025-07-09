import { Game } from "./Game.js";

/**
 * Time provides static methods for accessing time-related information in the game.
 * It acts as a convenient interface to retrieve timing data from the Game instance.
 * 
 * @example
 * // Get the delta time for frame-rate independent movement
 * const moveSpeed = 100; // pixels per second
 * gameObject.x += moveSpeed * Time.deltaTime();
 */
export class Time{
    /**
     * Returns the time elapsed since the last frame in seconds.
     * This is useful for creating frame-rate independent animations and movement.
     * 
     * @returns {number} The delta time in seconds
     * 
     * @example
     * // Move an object at 50 pixels per second regardless of frame rate
     * gameObject.x += 50 * Time.deltaTime();
     */
    static deltaTime(){
        return Game.instance._deltaTime;
    }
}