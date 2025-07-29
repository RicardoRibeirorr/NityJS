/**
 * ProceduralAudioClip - Generate random audio using Web Audio API
 * Supports various sound types: tones, noise, sweeps, and complex sounds
 * 
 * @class ProceduralAudioClip
 */
export class ProceduralAudioClip {
    /**
     * Create a procedural audio clip
     * @param {string} name - Name identifier for the clip
     * @param {Object} options - Generation options
     */
    constructor(name, options = {}) {
        this.name = name;
        this.options = {
            type: 'tone',           // 'tone', 'noise', 'sweep', 'complex', 'random'
            frequency: 440,         // Base frequency in Hz
            duration: 1.0,          // Duration in seconds
            volume: 0.5,           // Volume (0.0 to 1.0)
            sampleRate: 44100,     // Sample rate
            fadeIn: 0.01,          // Fade in time
            fadeOut: 0.1,          // Fade out time
            ...options
        };

        this.audioBuffer = null;
        this.audioContext = null;
        this._isLoaded = false;
    }

    /**
     * Generate and load the procedural audio
     * @returns {Promise<void>}
     */
    async load() {
        try {
            // Initialize audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Generate audio data
            this.audioBuffer = await this.generateAudio();
            this._isLoaded = true;
            
            console.log(`ProceduralAudioClip "${this.name}" generated successfully`);
        } catch (error) {
            console.error(`Failed to generate ProceduralAudioClip "${this.name}":`, error);
            throw error;
        }
    }

    /**
     * Generate audio buffer based on type
     * @returns {AudioBuffer}
     */
    async generateAudio() {
        const { duration, sampleRate } = this.options;
        const length = Math.floor(duration * sampleRate);
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        switch (this.options.type) {
            case 'tone':
                this.generateTone(data, length);
                break;
            case 'noise':
                this.generateNoise(data, length);
                break;
            case 'sweep':
                this.generateSweep(data, length);
                break;
            case 'complex':
                this.generateComplex(data, length);
                break;
            case 'random':
                this.generateRandom(data, length);
                break;
            default:
                this.generateTone(data, length);
        }

        // Apply envelope
        this.applyEnvelope(data, length);

        return buffer;
    }

    /**
     * Generate simple tone wave
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateTone(data, length) {
        const { frequency, sampleRate } = this.options;
        const waveType = this.options.waveType || 'sine';
        
        for (let i = 0; i < length; i++) {
            const t = (i / sampleRate) * frequency * 2 * Math.PI;
            
            switch (waveType) {
                case 'sine':
                    data[i] = Math.sin(t);
                    break;
                case 'square':
                    data[i] = Math.sin(t) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    data[i] = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
                    break;
                case 'triangle':
                    data[i] = 2 * Math.abs(2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5))) - 1;
                    break;
                default:
                    data[i] = Math.sin(t);
            }
        }
    }

    /**
     * Generate white/pink/brown noise
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateNoise(data, length) {
        const noiseType = this.options.noiseType || 'white';
        
        switch (noiseType) {
            case 'white':
                for (let i = 0; i < length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                break;
            case 'pink':
                this.generatePinkNoise(data, length);
                break;
            case 'brown':
                this.generateBrownNoise(data, length);
                break;
        }
    }

    /**
     * Generate pink noise (1/f noise)
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generatePinkNoise(data, length) {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // Normalize
            b6 = white * 0.115926;
        }
    }

    /**
     * Generate brown noise (random walk)
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateBrownNoise(data, length) {
        let lastOut = 0;
        
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate for low volume
        }
    }

    /**
     * Generate frequency sweep
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateSweep(data, length) {
        const startFreq = this.options.startFreq || this.options.frequency;
        const endFreq = this.options.endFreq || this.options.frequency * 2;
        const { sampleRate } = this.options;
        
        for (let i = 0; i < length; i++) {
            const progress = i / length;
            const currentFreq = startFreq + (endFreq - startFreq) * progress;
            const t = (i / sampleRate) * currentFreq * 2 * Math.PI;
            data[i] = Math.sin(t);
        }
    }

    /**
     * Generate complex multi-harmonic sound
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateComplex(data, length) {
        const { frequency, sampleRate } = this.options;
        const harmonics = this.options.harmonics || [1, 0.5, 0.25, 0.125];
        
        for (let i = 0; i < length; i++) {
            let sample = 0;
            
            for (let h = 0; h < harmonics.length; h++) {
                const harmFreq = frequency * (h + 1);
                const t = (i / sampleRate) * harmFreq * 2 * Math.PI;
                sample += Math.sin(t) * harmonics[h];
            }
            
            data[i] = sample / harmonics.length;
        }
    }

    /**
     * Generate completely random sound (useful for sound effects)
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    generateRandom(data, length) {
        const effects = ['tone', 'noise', 'sweep'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        // Randomize parameters
        const originalOptions = { ...this.options };
        this.options.frequency = 100 + Math.random() * 800;
        this.options.waveType = ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];
        this.options.noiseType = ['white', 'pink', 'brown'][Math.floor(Math.random() * 3)];
        
        switch (randomEffect) {
            case 'tone':
                this.generateTone(data, length);
                break;
            case 'noise':
                this.generateNoise(data, length);
                break;
            case 'sweep':
                this.options.startFreq = 50 + Math.random() * 200;
                this.options.endFreq = 200 + Math.random() * 800;
                this.generateSweep(data, length);
                break;
        }
        
        // Restore original options
        this.options = originalOptions;
    }

    /**
     * Apply volume envelope to prevent clicks/pops
     * @param {Float32Array} data - Audio data array
     * @param {number} length - Buffer length
     */
    applyEnvelope(data, length) {
        const { volume, fadeIn, fadeOut, sampleRate } = this.options;
        const fadeInSamples = Math.floor(fadeIn * sampleRate);
        const fadeOutSamples = Math.floor(fadeOut * sampleRate);
        
        for (let i = 0; i < length; i++) {
            let amplitude = volume;
            
            // Fade in
            if (i < fadeInSamples) {
                amplitude *= i / fadeInSamples;
            }
            
            // Fade out
            if (i > length - fadeOutSamples) {
                amplitude *= (length - i) / fadeOutSamples;
            }
            
            data[i] *= amplitude;
        }
    }

    /**
     * Check if audio is loaded and ready
     * @returns {boolean}
     */
    isLoaded() {
        return this._isLoaded && this.audioBuffer !== null;
    }

    /**
     * Create procedural audio clip using metadata pattern
     * @param {Object} metadata - Configuration metadata
     * @returns {ProceduralAudioClip}
     */
    static meta(metadata) {
        const defaults = ProceduralAudioClip.getDefaultMeta();
        const config = { ...defaults, ...metadata };
        
        if (!config.name || config.name.trim() === '') {
            throw new Error('ProceduralAudioClip metadata must include a valid name');
        }
        
        return new ProceduralAudioClip(config.name, config);
    }

    /**
     * Get default metadata configuration
     * @returns {Object}
     */
    static getDefaultMeta() {
        return {
            name: '',
            type: 'tone',
            frequency: 440,
            duration: 1.0,
            volume: 0.5,
            sampleRate: 44100,
            fadeIn: 0.01,
            fadeOut: 0.1,
            waveType: 'sine',
            noiseType: 'white',
            startFreq: null,
            endFreq: null,
            harmonics: [1, 0.5, 0.25, 0.125]
        };
    }

    /**
     * Apply metadata to existing instance
     * @param {Object} metadata - Metadata to apply
     */
    applyMeta(metadata) {
        Object.assign(this.options, metadata);
        if (metadata.name) this.name = metadata.name;
        
        // Force regeneration if audio was already loaded
        if (this._isLoaded) {
            this._isLoaded = false;
            this.audioBuffer = null;
        }
    }

    /**
     * Export current configuration as metadata
     * @returns {Object}
     */
    toMeta() {
        return {
            name: this.name,
            ...this.options
        };
    }

    /**
     * Download the generated audio as a WAV file
     * @param {string} filename - Optional filename (defaults to clip name)
     */
    downloadAsWAV(filename = null) {
        if (!this.isLoaded()) {
            console.error('Cannot download audio: ProceduralAudioClip not loaded');
            return;
        }

        const actualFilename = filename || `${this.name}.wav`;
        const wavBlob = this.audioBufferToWAV(this.audioBuffer);
        this.downloadBlob(wavBlob, actualFilename);
    }

    /**
     * Convert AudioBuffer to WAV format
     * @param {AudioBuffer} buffer - Audio buffer to convert
     * @returns {Blob} WAV file blob
     */
    audioBufferToWAV(buffer) {
        const length = buffer.length;
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const bytesPerSample = 2; // 16-bit
        const blockAlign = numberOfChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;
        const bufferSize = 44 + dataSize;

        // Create WAV file buffer
        const arrayBuffer = new ArrayBuffer(bufferSize);
        const view = new DataView(arrayBuffer);

        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        // RIFF header
        writeString(0, 'RIFF');
        view.setUint32(4, bufferSize - 8, true);
        writeString(8, 'WAVE');

        // fmt chunk
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true);  // PCM format
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true); // bits per sample

        // data chunk
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        // Convert audio data
        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                // Convert float32 [-1, 1] to int16 [-32768, 32767]
                const intSample = Math.max(-1, Math.min(1, sample));
                view.setInt16(offset, intSample * 0x7FFF, true);
                offset += 2;
            }
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }

    /**
     * Download a blob as a file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - Filename for download
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        console.log(`📥 Downloaded: ${filename}`);
    }

    /**
     * Get the audio data as a WAV blob (without downloading)
     * @returns {Blob|null} WAV blob or null if not loaded
     */
    getWAVBlob() {
        if (!this.isLoaded()) {
            return null;
        }
        return this.audioBufferToWAV(this.audioBuffer);
    }

    /**
     * Get audio data as Base64 encoded WAV
     * @returns {Promise<string>} Base64 encoded WAV data
     */
    async getAsBase64WAV() {
        if (!this.isLoaded()) {
            throw new Error('Audio must be loaded before converting to Base64');
        }

        const wavBlob = this.audioBufferToWAV(this.audioBuffer);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(wavBlob);
        });
    }

    /**
     * Static factory methods for common sound types
     */
    static createBeep(frequency = 800, duration = 0.2) {
        return ProceduralAudioClip.meta({
            name: `beep_${frequency}`,
            type: 'tone',
            frequency,
            duration,
            waveType: 'sine',
            volume: 0.3
        });
    }

    static createClick(duration = 0.1) {
        return ProceduralAudioClip.meta({
            name: 'click',
            type: 'noise',
            duration,
            noiseType: 'white',
            volume: 0.2,
            fadeOut: duration * 0.8
        });
    }

    static createWhoosh(duration = 0.5) {
        return ProceduralAudioClip.meta({
            name: 'whoosh',
            type: 'sweep',
            startFreq: 1000,
            endFreq: 200,
            duration,
            volume: 0.4
        });
    }

    static createZap(duration = 0.3) {
        return ProceduralAudioClip.meta({
            name: 'zap',
            type: 'complex',
            frequency: 300,
            duration,
            harmonics: [1, 0.8, 0.6, 0.4, 0.2],
            volume: 0.5
        });
    }

    static createRandomSFX(duration = 0.5) {
        return ProceduralAudioClip.meta({
            name: `random_sfx_${Date.now()}`,
            type: 'random',
            duration,
            volume: 0.4
        });
    }
}
