/**
 * Random Audio Generator for NityJS
 * Utility class for generating various types of random audio
 * 
 * @class RandomAudioGenerator
 */
import { ProceduralAudioClip } from './ProceduralAudioClip.js';

export class RandomAudioGenerator {
    /**
     * Generate a random beep sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomBeep(options = {}) {
        const frequency = options.frequency || (200 + Math.random() * 600);
        const duration = options.duration || (0.1 + Math.random() * 0.3);
        const waveType = options.waveType || ['sine', 'square', 'triangle'][Math.floor(Math.random() * 3)];
        
        return new ProceduralAudioClip(`random_beep_${Date.now()}`, {
            type: 'tone',
            frequency,
            duration,
            waveType,
            volume: 0.3 + Math.random() * 0.3,
            fadeIn: 0.01,
            fadeOut: duration * 0.3
        });
    }

    /**
     * Generate random ambient sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomAmbient(options = {}) {
        const noiseTypes = ['white', 'pink', 'brown'];
        const noiseType = options.noiseType || noiseTypes[Math.floor(Math.random() * noiseTypes.length)];
        const duration = options.duration || (2 + Math.random() * 8);
        
        return new ProceduralAudioClip(`random_ambient_${Date.now()}`, {
            type: 'noise',
            noiseType,
            duration,
            volume: 0.1 + Math.random() * 0.2,
            fadeIn: duration * 0.1,
            fadeOut: duration * 0.1
        });
    }

    /**
     * Generate random sweep/whoosh sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomSweep(options = {}) {
        const startFreq = options.startFreq || (100 + Math.random() * 500);
        const endFreq = options.endFreq || (200 + Math.random() * 800);
        const duration = options.duration || (0.3 + Math.random() * 0.7);
        
        // Sometimes reverse the sweep
        const reverse = Math.random() > 0.5;
        const actualStart = reverse ? endFreq : startFreq;
        const actualEnd = reverse ? startFreq : endFreq;
        
        return new ProceduralAudioClip(`random_sweep_${Date.now()}`, {
            type: 'sweep',
            startFreq: actualStart,
            endFreq: actualEnd,
            duration,
            volume: 0.2 + Math.random() * 0.3
        });
    }

    /**
     * Generate random complex harmonic sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomHarmonic(options = {}) {
        const baseFreq = options.frequency || (150 + Math.random() * 400);
        const duration = options.duration || (0.5 + Math.random() * 1.5);
        
        // Generate random harmonics
        const harmonics = [];
        const numHarmonics = 3 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numHarmonics; i++) {
            harmonics.push(Math.random() * (1 / (i + 1)));
        }
        
        return new ProceduralAudioClip(`random_harmonic_${Date.now()}`, {
            type: 'complex',
            frequency: baseFreq,
            duration,
            harmonics,
            volume: 0.3 + Math.random() * 0.2
        });
    }

    /**
     * Generate random percussion/hit sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomPercussion(options = {}) {
        const duration = options.duration || (0.05 + Math.random() * 0.15);
        const soundTypes = ['noise', 'tone'];
        const type = soundTypes[Math.floor(Math.random() * soundTypes.length)];
        
        const baseOptions = {
            duration,
            volume: 0.4 + Math.random() * 0.4,
            fadeIn: 0.001,
            fadeOut: duration * 0.7
        };
        
        if (type === 'noise') {
            return new ProceduralAudioClip(`random_percussion_${Date.now()}`, {
                ...baseOptions,
                type: 'noise',
                noiseType: 'white'
            });
        } else {
            return new ProceduralAudioClip(`random_percussion_${Date.now()}`, {
                ...baseOptions,
                type: 'tone',
                frequency: 80 + Math.random() * 200,
                waveType: 'square'
            });
        }
    }

    /**
     * Generate random musical note
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomNote(options = {}) {
        // Musical note frequencies (C4 to B5)
        const noteFreqs = [
            261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00,
            415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25,
            659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77
        ];
        
        const frequency = options.frequency || noteFreqs[Math.floor(Math.random() * noteFreqs.length)];
        const duration = options.duration || (0.5 + Math.random() * 1.0);
        const waveType = options.waveType || ['sine', 'triangle'][Math.floor(Math.random() * 2)];
        
        return new ProceduralAudioClip(`random_note_${Date.now()}`, {
            type: 'tone',
            frequency,
            duration,
            waveType,
            volume: 0.3 + Math.random() * 0.3,
            fadeIn: 0.05,
            fadeOut: duration * 0.2
        });
    }

    /**
     * Generate random laser/zap sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomLaser(options = {}) {
        const startFreq = options.startFreq || (400 + Math.random() * 600);
        const endFreq = options.endFreq || (50 + Math.random() * 200);
        const duration = options.duration || (0.2 + Math.random() * 0.3);
        
        return new ProceduralAudioClip(`random_laser_${Date.now()}`, {
            type: 'sweep',
            startFreq,
            endFreq,
            duration,
            volume: 0.4 + Math.random() * 0.3,
            fadeOut: duration * 0.5
        });
    }

    /**
     * Generate random coin/pickup sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomPickup(options = {}) {
        return new ProceduralAudioClip(`random_pickup_${Date.now()}`, {
            type: 'complex',
            frequency: 600 + Math.random() * 400,
            duration: 0.3 + Math.random() * 0.2,
            harmonics: [1, 0.6, 0.3, 0.1],
            volume: 0.4 + Math.random() * 0.2,
            fadeOut: 0.15
        });
    }

    /**
     * Generate random explosion sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomExplosion(options = {}) {
        const duration = options.duration || (0.5 + Math.random() * 1.0);
        
        return new ProceduralAudioClip(`random_explosion_${Date.now()}`, {
            type: 'noise',
            noiseType: 'brown',
            duration,
            volume: 0.5 + Math.random() * 0.3,
            fadeIn: 0.01,
            fadeOut: duration * 0.6
        });
    }

    /**
     * Generate completely random sound effect
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomAny(options = {}) {
        const generators = [
            this.randomBeep,
            this.randomSweep,
            this.randomHarmonic,
            this.randomPercussion,
            this.randomNote,
            this.randomLaser,
            this.randomPickup
        ];
        
        const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
        return randomGenerator.call(this, options);
    }

    /**
     * Generate a sequence of random sounds
     * @param {number} count - Number of sounds to generate
     * @param {Object} options - Generation options
     * @returns {Array<ProceduralAudioClip>}
     */
    static randomSequence(count = 5, options = {}) {
        const sounds = [];
        
        for (let i = 0; i < count; i++) {
            sounds.push(this.randomAny(options));
        }
        
        return sounds;
    }

    /**
     * Create a randomized version of a sound type
     * @param {string} type - Base sound type ('beep', 'sweep', 'harmonic', etc.)
     * @param {number} variations - Number of variations to create
     * @param {Object} baseOptions - Base options for all variations
     * @returns {Array<ProceduralAudioClip>}
     */
    static createVariations(type, variations = 3, baseOptions = {}) {
        const sounds = [];
        const methodName = `random${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        if (typeof this[methodName] === 'function') {
            for (let i = 0; i < variations; i++) {
                sounds.push(this[methodName](baseOptions));
            }
        } else {
            console.warn(`Unknown sound type: ${type}`);
            // Fallback to random sounds
            for (let i = 0; i < variations; i++) {
                sounds.push(this.randomAny(baseOptions));
            }
        }
        
        return sounds;
    }

    /**
     * Generate and download a random sound effect
     * @param {string} type - Sound type to generate
     * @param {Object} options - Generation options
     * @param {string} filename - Optional filename
     */
    static async generateAndDownload(type, options = {}, filename) {
        let sound;
        
        switch(type) {
            case 'beep':
                sound = this.randomBeep(options);
                break;
            case 'sweep':
                sound = this.randomSweep(options);
                break;
            case 'harmonic':
                sound = this.randomHarmonic(options);
                break;
            case 'percussion':
                sound = this.randomPercussion(options);
                break;
            case 'note':
                sound = this.randomNote(options);
                break;
            case 'laser':
                sound = this.randomLaser(options);
                break;
            case 'pickup':
                sound = this.randomPickup(options);
                break;
            case 'explosion':
                sound = this.randomExplosion(options);
                break;
            case 'ambient':
                sound = this.randomAmbient(options);
                break;
            default:
                sound = this.randomAny(options);
        }
        
        await sound.load();
        const downloadName = filename || `${type}_${Date.now()}.wav`;
        sound.downloadAsWAV(downloadName);
        
        return sound;
    }

    /**
     * Download multiple sound variations as a zip-like collection
     * @param {string} type - Base sound type
     * @param {number} count - Number of variations
     * @param {Object} options - Generation options
     */
    static async downloadVariations(type, count = 3, options = {}) {
        const sounds = this.createVariations(type, count, options);
        
        for (let i = 0; i < sounds.length; i++) {
            await sounds[i].load();
            const filename = `${type}_variation_${i + 1}_${Date.now()}.wav`;
            // Small delay between downloads to avoid browser blocking
            setTimeout(() => {
                sounds[i].downloadAsWAV(filename);
            }, i * 500);
        }
        
        return sounds;
    }
}
