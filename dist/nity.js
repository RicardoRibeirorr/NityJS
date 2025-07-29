var Nity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/audio/AudioClip.js
  var AudioClip;
  var init_AudioClip = __esm({
    "src/audio/AudioClip.js"() {
      AudioClip = class _AudioClip {
        /**
         * Creates a new AudioClip with the specified name and URL.
         * 
         * Initializes the audio clip with basic properties and prepares it for loading.
         * The audio data is not loaded immediately - call load() to begin the loading
         * and decoding process. This allows for better control over when audio resources
         * are loaded and reduces initial page load time.
         * 
         * @param {string} name - Unique identifier for this audio clip
         * @param {string} url - Path to the audio file (relative or absolute)
         * 
         * @example
         * // Create clips for different audio types
         * const music = new AudioClip("background_music", "assets/music/theme.mp3");
         * const sfx = new AudioClip("explosion", "assets/sounds/explosion.wav");
         * const voice = new AudioClip("dialog_01", "assets/voice/intro.ogg");
         */
        constructor(name, url) {
          this.name = name;
          this.url = url;
          this.audioBuffer = null;
          this.length = 0;
          this.channels = 0;
          this.frequency = 0;
          this.isLoaded = false;
          this.isLoading = false;
          this.loadError = null;
          this.audioContext = _AudioClip.getAudioContext();
        }
        /**
         * Gets or creates the global Web Audio API context.
         * 
         * Creates a singleton AudioContext that all audio clips share. This ensures
         * optimal resource usage and prevents the creation of multiple audio contexts
         * which can cause performance issues. Handles browser compatibility for
         * AudioContext creation.
         * 
         * @static
         * @returns {AudioContext} The global audio context instance
         * 
         * @example
         * // Access global audio context
         * const context = AudioClip.getAudioContext();
         * console.log('Sample Rate:', context.sampleRate);
         */
        static getAudioContext() {
          if (!_AudioClip._audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
              throw new Error("Web Audio API not supported in this browser");
            }
            _AudioClip._audioContext = new AudioContextClass();
            if (_AudioClip._audioContext.state === "suspended") {
              document.addEventListener("click", () => {
                if (_AudioClip._audioContext.state === "suspended") {
                  _AudioClip._audioContext.resume();
                }
              }, { once: true });
            }
          }
          return _AudioClip._audioContext;
        }
        /**
         * Loads and decodes the audio file.
         * 
         * Fetches the audio file from the specified URL and decodes it using the Web
         * Audio API. This is an asynchronous operation that should be awaited. Once
         * loaded, the audio clip can be used by AudioSource components for playback.
         * 
         * @async
         * @returns {Promise<boolean>} True if loading succeeded, false if failed
         * 
         * @example
         * // Load audio with error handling
         * const clip = new AudioClip("jump", "assets/jump.wav");
         * const success = await clip.load();
         * if (success) {
         *     console.log("Audio loaded successfully");
         * } else {
         *     console.error("Failed to load audio:", clip.loadError);
         * }
         */
        async load() {
          if (this.isLoaded) return true;
          if (this.isLoading) {
            return new Promise((resolve) => {
              const checkLoaded = () => {
                if (!this.isLoading) {
                  resolve(this.isLoaded);
                } else {
                  setTimeout(checkLoaded, 10);
                }
              };
              checkLoaded();
            });
          }
          this.isLoading = true;
          this.loadError = null;
          try {
            const response = await fetch(this.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.length = this.audioBuffer.length / this.audioBuffer.sampleRate;
            this.channels = this.audioBuffer.numberOfChannels;
            this.frequency = this.audioBuffer.sampleRate;
            this.isLoaded = true;
            this.isLoading = false;
            console.log(`\u2705 Audio clip loaded: ${this.name} (${this.length.toFixed(2)}s, ${this.channels}ch, ${this.frequency}Hz)`);
            return true;
          } catch (error) {
            this.loadError = error.message;
            this.isLoading = false;
            this.isLoaded = false;
            console.error(`\u274C Failed to load audio clip '${this.name}':`, error);
            return false;
          }
        }
        /**
         * Creates an audio buffer source node for playback.
         * 
         * Generates a new AudioBufferSourceNode connected to the audio context. This
         * node can be configured and connected to other audio nodes (like gain nodes
         * or panners) before starting playback. Each playback requires a new source
         * node as they are single-use.
         * 
         * @returns {AudioBufferSourceNode|null} Audio source node or null if not loaded
         * 
         * @internal Used by AudioSource components for audio playback
         */
        createSourceNode() {
          if (!this.isLoaded || !this.audioBuffer) {
            console.warn(`Cannot create source node: Audio clip '${this.name}' not loaded`);
            return null;
          }
          const sourceNode = this.audioContext.createBufferSource();
          sourceNode.buffer = this.audioBuffer;
          return sourceNode;
        }
        /**
         * Checks if the audio clip is ready for playback.
         * 
         * @returns {boolean} True if the clip is loaded and ready to play
         */
        get isReady() {
          return this.isLoaded && this.audioBuffer !== null;
        }
        /**
         * Gets the current state of the audio clip.
         * 
         * @returns {string} Current state: 'unloaded', 'loading', 'loaded', or 'error'
         */
        get state() {
          if (this.loadError) return "error";
          if (this.isLoading) return "loading";
          if (this.isLoaded) return "loaded";
          return "unloaded";
        }
        /**
         * Preloads all audio clips in the provided array.
         * 
         * @static
         * @param {AudioClip[]} clips - Array of audio clips to preload
         * @returns {Promise<boolean[]>} Array of success states for each clip
         * 
         * @example
         * // Preload multiple clips
         * const clips = [jumpSound, shootSound, musicClip];
         * const results = await AudioClip.preloadAll(clips);
         * console.log(`${results.filter(r => r).length}/${clips.length} clips loaded`);
         */
        static async preloadAll(clips) {
          const loadPromises = clips.map((clip) => clip.load());
          return Promise.all(loadPromises);
        }
      };
      AudioClip._audioContext = null;
    }
  });

  // src/asset/AudioAsset.js
  var AudioAsset_exports = {};
  __export(AudioAsset_exports, {
    AudioAsset: () => AudioAsset
  });
  var AudioAsset;
  var init_AudioAsset = __esm({
    "src/asset/AudioAsset.js"() {
      init_AudioRegistry();
      init_AudioClip();
      AudioAsset = class _AudioAsset extends AudioClip {
        /**
         * Create a new audio asset and automatically register it
         * @param {string} name - Name to register the audio under
         * @param {string} audioPath - Path to the audio file
         * @param {Object} [config] - Optional configuration
         * @param {number} [config.volume=1.0] - Default volume (0.0 to 1.0)
         * @param {boolean} [config.loop=false] - Default loop setting
         * @param {string} [config.format] - Audio format hint (mp3, wav, ogg, etc.)
         */
        constructor(name, audioPath, config = {}) {
          super(name, audioPath);
          this.audioPath = audioPath;
          this.volume = config.volume !== void 0 ? config.volume : 1;
          this.loop = config.loop || false;
          this.format = config.format || this.#detectFormat(audioPath);
          this.#_registerSelf();
          this.load();
        }
        /**
         * Automatically register this audio asset
         * @private
         */
        #_registerSelf() {
          AudioRegistry._addAudio(this.name, this);
        }
        /**
         * Detect audio format from file extension
         * @param {string} path - Audio file path
         * @returns {string} Detected format
         * @private
         */
        #detectFormat(path) {
          const extension = path.split(".").pop().toLowerCase();
          return extension;
        }
        /**
         * Create a copy of this audio asset with different settings
         * @param {Object} config - Configuration overrides
         * @returns {AudioAsset} New audio asset instance
         */
        clone(config = {}) {
          return new _AudioAsset(this.name + "_copy", this.audioPath, {
            volume: config.volume !== void 0 ? config.volume : this.volume,
            loop: config.loop !== void 0 ? config.loop : this.loop,
            format: config.format || this.format,
            ...config
          });
        }
        /**
         * Get audio information as an object
         * @returns {Object} Audio information
         */
        getInfo() {
          return {
            name: this.name,
            path: this.audioPath,
            format: this.format,
            isLoaded: this.isLoaded,
            duration: this.length,
            // Use inherited property
            sampleRate: this.frequency,
            // Use inherited property  
            channels: this.channels,
            // Use inherited property
            volume: this.volume,
            loop: this.loop
          };
        }
        /**
         * Dispose of the audio asset and free memory
         */
        dispose() {
          this.audioBuffer = null;
          this.audioContext = null;
          this.isLoaded = false;
          AudioRegistry._removeAudio(this.name);
          console.log(`AudioAsset "${this.name}" disposed`);
        }
        /** 
         * Static method to create and load an audio asset
         * @param {string} name - Name to register the audio under
         * @param {string} audioPath - Path to the audio file
         * @param {Object} config - Optional configuration
         * @returns {Promise<AudioAsset>} Promise that resolves to the loaded audio asset
         */
        static async create(name, audioPath, config = {}) {
          const asset = new _AudioAsset(name, audioPath, config);
          await asset.load();
          return asset;
        }
        /**
         * Static method to preload multiple audio assets
         * @param {Array<Object>} audioList - Array of {name, path, config} objects
         * @returns {Promise<Array<AudioAsset>>} Promise that resolves to array of loaded assets
         */
        static async preloadMultiple(audioList) {
          const promises = audioList.map(
            (audio) => _AudioAsset.create(audio.name, audio.path, audio.config || {})
          );
          try {
            const assets = await Promise.all(promises);
            console.log(`Preloaded ${assets.length} audio assets`);
            return assets;
          } catch (error) {
            console.error("Failed to preload some audio assets:", error);
            throw error;
          }
        }
      };
    }
  });

  // src/asset/AudioRegistry.js
  var AudioRegistry;
  var init_AudioRegistry = __esm({
    "src/asset/AudioRegistry.js"() {
      AudioRegistry = class {
        static audioAssets = /* @__PURE__ */ new Map();
        // Storage for all audio assets
        /**
         * Internal method to add an audio asset (used by AudioAsset constructor)
         * @param {string} name - Name to register the audio under
         * @param {AudioAsset} audioAsset - The audio asset to register
         * @private
         */
        static _addAudio(name, audioAsset) {
          this.audioAssets.set(name, audioAsset);
          console.log(`AudioRegistry: Registered audio "${name}"`);
        }
        /**
         * Internal method to remove an audio asset
         * @param {string} name - Name of the audio to remove
         * @private
         */
        static _removeAudio(name) {
          const removed = this.audioAssets.delete(name);
          if (removed) {
            console.log(`AudioRegistry: Removed audio "${name}"`);
          }
        }
        /**
         * Get a registered audio asset
         * @param {string} name - Name of the audio asset
         * @returns {AudioAsset|null} The audio asset or null if not found
         */
        static getAudio(name) {
          const audio = this.audioAssets.get(name);
          if (!audio) {
            console.warn(`AudioRegistry: Audio "${name}" not found. Available audio:`, [...this.audioAssets.keys()]);
            return null;
          }
          return audio;
        }
        /**
         * Get an audio asset as an AudioClip (for compatibility with AudioSourceComponent)
         * @param {string} name - Name of the audio asset
         * @returns {Object|null} AudioClip-compatible object or null if not found
         */
        static getAudioClip(name) {
          const audio = this.getAudio(name);
          return audio ? audio.toAudioClip() : null;
        }
        /**
         * Check if an audio asset exists in the registry
         * @param {string} name - Name of the audio asset
         * @returns {boolean} True if the audio exists, false otherwise
         */
        static hasAudio(name) {
          return this.audioAssets.has(name);
        }
        /**
         * Get all registered audio asset names
         * @returns {Array<string>} Array of all registered audio names
         */
        static getAllAudioNames() {
          return [...this.audioAssets.keys()];
        }
        /**
         * Get all registered audio assets
         * @returns {Array<AudioAsset>} Array of all registered audio assets
         */
        static getAllAudio() {
          return [...this.audioAssets.values()];
        }
        /**
         * Get information about all registered audio assets
         * @returns {Array<Object>} Array of audio information objects
         */
        static getAllAudioInfo() {
          return this.getAllAudio().map((audio) => audio.getInfo());
        }
        /**
         * Check loading status of all audio assets
         * @returns {Object} Loading status summary
         */
        static getLoadingStatus() {
          const allAudio = this.getAllAudio();
          const loaded = allAudio.filter((audio) => audio.isReady());
          const loading = allAudio.filter((audio) => !audio.isReady());
          return {
            total: allAudio.length,
            loaded: loaded.length,
            loading: loading.length,
            progress: allAudio.length > 0 ? loaded.length / allAudio.length : 1,
            loadedAssets: loaded.map((audio) => audio.name),
            loadingAssets: loading.map((audio) => audio.name)
          };
        }
        /**
         * Preload all registered audio assets
         * This method is called internally by the Game class during initialization
         * @returns {Promise<void>} Promise that resolves when all audio assets are loaded
         * @private
         */
        static async preloadAll() {
          const allAudio = this.getAllAudio();
          const promises = allAudio.map((audio) => audio.load());
          try {
            await Promise.all(promises);
            console.log("AudioRegistry: All audio assets loaded successfully");
          } catch (error) {
            console.error("AudioRegistry: Some audio assets failed to load:", error);
            throw error;
          }
        }
        /**
         * Wait for all audio assets to finish loading (legacy method)
         * @returns {Promise} Promise that resolves when all audio is loaded
         * @deprecated Use preloadAll() instead
         */
        static async waitForAllToLoad() {
          return this.preloadAll();
        }
        /**
         * Load all registered audio assets (legacy method)
         * @returns {Promise} Promise that resolves when all audio is loaded
         * @deprecated Use preloadAll() instead
         */
        static async loadAll() {
          return this.preloadAll();
        }
        /**
         * Preload a list of audio files
         * @param {Array<Object>} audioList - Array of {name, path, config} objects
         * @returns {Promise<Array<AudioAsset>>} Promise that resolves to loaded assets
         */
        static async preloadAudio(audioList) {
          const { AudioAsset: AudioAsset2 } = await Promise.resolve().then(() => (init_AudioAsset(), AudioAsset_exports));
          return AudioAsset2.preloadMultiple(audioList);
        }
        /**
         * Clear all registered audio assets and free memory
         */
        static clear() {
          const allAudio = this.getAllAudio();
          allAudio.forEach((audio) => audio.dispose());
          this.audioAssets.clear();
          console.log("AudioRegistry: Cleared all audio assets");
        }
        /**
         * Remove a specific audio asset from the registry
         * @param {string} name - Name of the audio asset to remove
         * @returns {boolean} True if removed, false if not found
         */
        static removeAudio(name) {
          const audio = this.getAudio(name);
          if (audio) {
            audio.dispose();
            return true;
          }
          return false;
        }
        /**
         * Get memory usage information for all audio assets
         * @returns {Object} Memory usage information
         */
        static getMemoryUsage() {
          const allAudio = this.getAllAudio();
          let totalDuration = 0;
          let totalChannels = 0;
          let estimatedMemoryMB = 0;
          allAudio.forEach((audio) => {
            if (audio.isReady()) {
              const duration = audio.getDuration();
              const sampleRate = audio.getSampleRate();
              const channels = audio.getChannelCount();
              totalDuration += duration;
              totalChannels += channels;
              estimatedMemoryMB += sampleRate * channels * duration * 4 / (1024 * 1024);
            }
          });
          return {
            totalAssets: allAudio.length,
            loadedAssets: allAudio.filter((audio) => audio.isReady()).length,
            totalDurationSeconds: Math.round(totalDuration),
            averageChannels: allAudio.length > 0 ? totalChannels / allAudio.length : 0,
            estimatedMemoryMB: Math.round(estimatedMemoryMB * 100) / 100
          };
        }
        /**
         * Create a batch operation for loading multiple audio files
         * @param {Array<Object>} audioList - Array of {name, path, config} objects
         * @param {Function} onProgress - Optional progress callback (loaded, total)
         * @returns {Promise<Array<AudioAsset>>} Promise that resolves to loaded assets
         */
        static async loadBatch(audioList, onProgress = null) {
          const results = [];
          let loaded = 0;
          for (const audioInfo of audioList) {
            try {
              const { AudioAsset: AudioAsset2 } = await Promise.resolve().then(() => (init_AudioAsset(), AudioAsset_exports));
              const asset = await AudioAsset2.create(audioInfo.name, audioInfo.path, audioInfo.config || {});
              results.push(asset);
              loaded++;
              if (onProgress) {
                onProgress(loaded, audioList.length);
              }
            } catch (error) {
              console.error(`Failed to load audio "${audioInfo.name}":`, error);
              results.push(null);
            }
          }
          console.log(`AudioRegistry: Batch loaded ${results.filter((r) => r).length}/${audioList.length} audio assets`);
          return results;
        }
        /**
         * Debug method to log all registered audio information
         */
        static debug() {
          console.group("AudioRegistry Debug Information");
          console.log("Registered Audio Assets:", this.getAllAudioNames());
          console.log("Loading Status:", this.getLoadingStatus());
          console.log("Memory Usage:", this.getMemoryUsage());
          console.log("Detailed Info:", this.getAllAudioInfo());
          console.groupEnd();
        }
      };
    }
  });

  // src/input/mappings/Keyboard.js
  var Keyboard_exports = {};
  __export(Keyboard_exports, {
    Keyboard: () => Keyboard
  });
  var Keyboard;
  var init_Keyboard = __esm({
    "src/input/mappings/Keyboard.js"() {
      Keyboard = class _Keyboard {
        // Common keys with their possible representations
        static Space = ["Space", " "];
        static Enter = ["Enter"];
        static Escape = ["Escape"];
        static Tab = ["Tab"];
        static Backspace = ["Backspace"];
        static Delete = ["Delete"];
        static Insert = ["Insert"];
        static Home = ["Home"];
        static End = ["End"];
        static PageUp = ["PageUp"];
        static PageDown = ["PageDown"];
        // Arrow keys
        static ArrowUp = ["ArrowUp"];
        static ArrowDown = ["ArrowDown"];
        static ArrowLeft = ["ArrowLeft"];
        static ArrowRight = ["ArrowRight"];
        // Number keys (top row)
        static Digit0 = ["Digit0", "0"];
        static Digit1 = ["Digit1", "1"];
        static Digit2 = ["Digit2", "2"];
        static Digit3 = ["Digit3", "3"];
        static Digit4 = ["Digit4", "4"];
        static Digit5 = ["Digit5", "5"];
        static Digit6 = ["Digit6", "6"];
        static Digit7 = ["Digit7", "7"];
        static Digit8 = ["Digit8", "8"];
        static Digit9 = ["Digit9", "9"];
        // Letter keys
        static KeyA = ["KeyA", "a", "A"];
        static KeyB = ["KeyB", "b", "B"];
        static KeyC = ["KeyC", "c", "C"];
        static KeyD = ["KeyD", "d", "D"];
        static KeyE = ["KeyE", "e", "E"];
        static KeyF = ["KeyF", "f", "F"];
        static KeyG = ["KeyG", "g", "G"];
        static KeyH = ["KeyH", "h", "H"];
        static KeyI = ["KeyI", "i", "I"];
        static KeyJ = ["KeyJ", "j", "J"];
        static KeyK = ["KeyK", "k", "K"];
        static KeyL = ["KeyL", "l", "L"];
        static KeyM = ["KeyM", "m", "M"];
        static KeyN = ["KeyN", "n", "N"];
        static KeyO = ["KeyO", "o", "O"];
        static KeyP = ["KeyP", "p", "P"];
        static KeyQ = ["KeyQ", "q", "Q"];
        static KeyR = ["KeyR", "r", "R"];
        static KeyS = ["KeyS", "s", "S"];
        static KeyT = ["KeyT", "t", "T"];
        static KeyU = ["KeyU", "u", "U"];
        static KeyV = ["KeyV", "v", "V"];
        static KeyW = ["KeyW", "w", "W"];
        static KeyX = ["KeyX", "x", "X"];
        static KeyY = ["KeyY", "y", "Y"];
        static KeyZ = ["KeyZ", "z", "Z"];
        // Function keys
        static F1 = ["F1"];
        static F2 = ["F2"];
        static F3 = ["F3"];
        static F4 = ["F4"];
        static F5 = ["F5"];
        static F6 = ["F6"];
        static F7 = ["F7"];
        static F8 = ["F8"];
        static F9 = ["F9"];
        static F10 = ["F10"];
        static F11 = ["F11"];
        static F12 = ["F12"];
        // Modifier keys
        static ShiftLeft = ["ShiftLeft", "Shift"];
        static ShiftRight = ["ShiftRight", "Shift"];
        static ControlLeft = ["ControlLeft", "Control"];
        static ControlRight = ["ControlRight", "Control"];
        static AltLeft = ["AltLeft", "Alt"];
        static AltRight = ["AltRight", "Alt"];
        static MetaLeft = ["MetaLeft", "Meta"];
        static MetaRight = ["MetaRight", "Meta"];
        // Special characters
        static Minus = ["Minus", "-"];
        static Equal = ["Equal", "="];
        static BracketLeft = ["BracketLeft", "["];
        static BracketRight = ["BracketRight", "]"];
        static Backslash = ["Backslash", "\\"];
        static Semicolon = ["Semicolon", ";"];
        static Quote = ["Quote", "'"];
        static Comma = ["Comma", ","];
        static Period = ["Period", "."];
        static Slash = ["Slash", "/"];
        // Numpad keys
        static Numpad0 = ["Numpad0"];
        static Numpad1 = ["Numpad1"];
        static Numpad2 = ["Numpad2"];
        static Numpad3 = ["Numpad3"];
        static Numpad4 = ["Numpad4"];
        static Numpad5 = ["Numpad5"];
        static Numpad6 = ["Numpad6"];
        static Numpad7 = ["Numpad7"];
        static Numpad8 = ["Numpad8"];
        static Numpad9 = ["Numpad9"];
        static NumpadAdd = ["NumpadAdd", "+"];
        static NumpadSubtract = ["NumpadSubtract", "-"];
        static NumpadMultiply = ["NumpadMultiply", "*"];
        static NumpadDivide = ["NumpadDivide", "/"];
        static NumpadDecimal = ["NumpadDecimal", "."];
        static NumpadEnter = ["NumpadEnter"];
        /**
         * Map from physical key values to logical key names
         * This is built automatically from the above mappings
         */
        static _keyMapping = null;
        /**
         * Initialize the key mapping system
         */
        static initialize() {
          if (_Keyboard._keyMapping) return;
          _Keyboard._keyMapping = /* @__PURE__ */ new Map();
          for (const [logicalKey, physicalKeys] of Object.entries(_Keyboard)) {
            if (Array.isArray(physicalKeys)) {
              for (const physicalKey of physicalKeys) {
                _Keyboard._keyMapping.set(physicalKey.toLowerCase(), logicalKey);
              }
            }
          }
        }
        /**
         * Get the logical key name from a physical key
         * @param {string} physicalKey - The physical key from the event
         * @returns {string} The logical key name, or the original key if not mapped
         */
        static getLogicalKey(physicalKey) {
          if (!_Keyboard._keyMapping) _Keyboard.initialize();
          const logical = _Keyboard._keyMapping.get(physicalKey.toLowerCase());
          return logical || physicalKey;
        }
        /**
         * Check if a logical key matches any of its physical representations
         * @param {string} logicalKey - The logical key name (e.g., "Space", "KeyA")
         * @param {string} physicalKey - The physical key from the event
         * @returns {boolean} True if they match
         */
        static matches(logicalKey, physicalKey) {
          const physicalKeys = _Keyboard[logicalKey];
          if (!physicalKeys || !Array.isArray(physicalKeys)) return false;
          return physicalKeys.some((key) => key.toLowerCase() === physicalKey.toLowerCase());
        }
        /**
         * Get all physical representations of a logical key
         * @param {string} logicalKey - The logical key name
         * @returns {Array<string>} Array of physical key representations
         */
        static getPhysicalKeys(logicalKey) {
          return _Keyboard[logicalKey] || [];
        }
        /**
         * Get all available logical key names
         * @returns {Array<string>} Array of logical key names
         */
        static getAllLogicalKeys() {
          return Object.keys(_Keyboard).filter(
            (key) => Array.isArray(_Keyboard[key]) && !key.startsWith("_")
          );
        }
      };
    }
  });

  // src/asset/Tile.js
  var Tile;
  var init_Tile = __esm({
    "src/asset/Tile.js"() {
      Tile = class {
        /**
         * Create a new tile data container.
         * 
         * Initializes a tile with a unique name, sprite reference, and optional rendering/collision
         * properties. The tile serves as a data container that TilemapComponent uses to render
         * and manage collision for grid-based levels.
         * 
         * @param {string} name - Unique identifier for this tile type (used for debugging and identification)
         * @param {string} spriteName - Sprite reference supporting unified sprite notation
         *                             Format: "spriteName" for single sprites or "sheet:sprite" for spritesheets
         * @param {Object} [options={}] - Optional configuration for rendering and collision behavior
         * @param {number} [options.width] - Custom render width in pixels (null = use tilemap's tileWidth)
         * @param {number} [options.height] - Custom render height in pixels (null = use tilemap's tileHeight)
         * @param {number} [options.opacity=1] - Tile transparency (0.0 = fully transparent, 1.0 = fully opaque)
         * @param {string} [options.color="#FFFFFF"] - Color tint applied during rendering (hex or rgba format)
         * @param {boolean} [options.flipX=false] - Horizontally flip the sprite during rendering
         * @param {boolean} [options.flipY=false] - Vertically flip the sprite during rendering
         * @param {Object} [options.collider] - Collision detection configuration (null = no collision)
         * @param {number} [options.collider.width] - Collision box width in pixels
         * @param {number} [options.collider.height] - Collision box height in pixels  
         * @param {number} [options.collider.radius] - Collision circle radius in pixels (for circle type)
         * @param {boolean} [options.collider.trigger=false] - Whether collider is a trigger (no physics blocking)
         * @param {string} [options.collider.type="box"] - Collision shape type: "box" or "circle"
         * 
         * @throws {Error} Throws if name is not provided or is empty
         * @throws {Error} Throws if spriteName is not provided or is empty
         * 
         * @example
         * // Simple decorative tile
         * const flower = new Tile("flower", "nature:flower_red");
         * 
         * // Scaled tile with transparency
         * const cloud = new Tile("cloud", "weather:cloud", {
         *     width: 48,
         *     height: 32,
         *     opacity: 0.7
         * });
         * 
         * // Solid collision tile
         * const platform = new Tile("platform", "terrain:stone_block", {
         *     collider: {
         *         width: 32,
         *         height: 16,
         *         type: "box",
         *         trigger: false
         *     }
         * });
         * 
         * // Trigger tile with custom visuals
         * const powerup = new Tile("powerup", "items:star", {
         *     color: "#FFFF00",
         *     opacity: 0.9,
         *     collider: {
         *         radius: 12,
         *         type: "circle", 
         *         trigger: true
         *     }
         * });
         */
        constructor(name, spriteName, options = {}) {
          this.name = name;
          this.spriteName = spriteName;
          this.width = options.width || null;
          this.height = options.height || null;
          this.opacity = options.opacity !== void 0 ? options.opacity : 1;
          this.color = options.color || "#FFFFFF";
          this.flipX = options.flipX || false;
          this.flipY = options.flipY || false;
          this.collider = options.collider ? {
            width: options.collider.width || null,
            height: options.collider.height || null,
            radius: options.collider.radius || null,
            trigger: options.collider.trigger || false,
            type: options.collider.type || "box"
          } : null;
        }
        /**
         * Check if this tile has collision detection enabled.
         * 
         * Determines whether this tile has any collision configuration that would
         * allow it to interact with physics systems or trigger events.
         * 
         * @returns {boolean} True if tile has collision data configured, false otherwise
         * 
         * @example
         * const wall = new Tile("wall", "terrain:brick", {
         *     collider: { width: 32, height: 32 }
         * });
         * console.log(wall.hasCollision()); // true
         * 
         * const decoration = new Tile("flower", "nature:flower");
         * console.log(decoration.hasCollision()); // false
         */
        hasCollision() {
          return this.collider !== null;
        }
        /**
         * Check if this tile is configured as a trigger.
         * 
         * Trigger tiles can detect collisions but don't block movement, making them
         * ideal for pickups, switches, or detection zones.
         * 
         * @returns {boolean} True if tile is a trigger, false if solid or no collision
         * 
         * @example
         * const pickup = new Tile("coin", "items:coin", {
         *     collider: { radius: 8, trigger: true }
         * });
         * console.log(pickup.isTrigger()); // true
         * 
         * const wall = new Tile("wall", "terrain:stone", {
         *     collider: { width: 32, height: 32, trigger: false }
         * });
         * console.log(wall.isTrigger()); // false
         */
        isTrigger() {
          return this.collider && this.collider.trigger;
        }
        /**
         * Check if this tile is solid (has collision but is not a trigger).
         * 
         * Solid tiles block movement and provide physical barriers in the game world.
         * 
         * @returns {boolean} True if tile has collision and is not a trigger
         * 
         * @example
         * const platform = new Tile("platform", "terrain:wood", {
         *     collider: { width: 64, height: 16, trigger: false }
         * });
         * console.log(platform.isSolid()); // true
         * 
         * const sensor = new Tile("sensor", "tech:detector", {
         *     collider: { radius: 16, trigger: true }
         * });
         * console.log(sensor.isSolid()); // false
         */
        isSolid() {
          return this.collider && !this.collider.trigger;
        }
        /**
         * Get the collision detection type for this tile.
         * 
         * Returns the geometric shape used for collision detection, or null if
         * the tile has no collision configured.
         * 
         * @returns {string|null} "box", "circle", or null if no collider configured
         * 
         * @example
         * const boxTile = new Tile("crate", "objects:crate", {
         *     collider: { width: 32, height: 32, type: "box" }
         * });
         * console.log(boxTile.getColliderType()); // "box"
         * 
         * const ballTile = new Tile("ball", "objects:sphere", {
         *     collider: { radius: 16, type: "circle" }
         * });
         * console.log(ballTile.getColliderType()); // "circle"
         * 
         * const noCollision = new Tile("background", "bg:sky");
         * console.log(noCollision.getColliderType()); // null
         */
        getColliderType() {
          return this.collider ? this.collider.type : null;
        }
        /**
         * Create a copy of this tile with optional property overrides.
         * 
         * Performs a deep clone of the tile including all collision data, while allowing
         * specific properties to be overridden in the new instance. Useful for creating
         * variations of existing tiles.
         * 
         * @param {Object} [overrides={}] - Properties to override in the cloned tile
         * @param {string} [overrides.name] - New name for the cloned tile
         * @param {string} [overrides.spriteName] - New sprite reference for the cloned tile
         * @param {number} [overrides.width] - Override width property
         * @param {number} [overrides.height] - Override height property
         * @param {number} [overrides.opacity] - Override opacity property
         * @param {string} [overrides.color] - Override color property
         * @param {boolean} [overrides.flipX] - Override flipX property
         * @param {boolean} [overrides.flipY] - Override flipY property
         * @param {Object} [overrides.collider] - Override entire collider configuration
         * 
         * @returns {Tile} New tile instance with same properties plus any overrides
         * 
         * @example
         * // Create base tile
         * const grassTile = new Tile("grass", "terrain:grass", {
         *     width: 32,
         *     height: 32,
         *     opacity: 1.0
         * });
         * 
         * // Create darker variant
         * const darkGrass = grassTile.clone({
         *     name: "dark_grass",
         *     color: "#447744",
         *     opacity: 0.8
         * });
         * 
         * // Create solid version with collision
         * const solidGrass = grassTile.clone({
         *     name: "solid_grass",
         *     collider: {
         *         width: 32,
         *         height: 32,
         *         type: "box",
         *         trigger: false
         *     }
         * });
         */
        clone(overrides = {}) {
          const clonedOptions = {
            width: this.width,
            height: this.height,
            opacity: this.opacity,
            color: this.color,
            flipX: this.flipX,
            flipY: this.flipY,
            collider: this.collider ? { ...this.collider } : null,
            ...overrides
          };
          return new this.constructor(
            overrides.name || this.name,
            overrides.spriteName || this.spriteName,
            clonedOptions
          );
        }
        /**
         * Convert tile to a human-readable string representation.
         * 
         * Provides a concise description of the tile including its name, sprite reference,
         * and collision status for debugging and logging purposes.
         * 
         * @returns {string} Formatted string describing this tile
         * 
         * @example
         * const wall = new Tile("wall", "terrain:brick", {
         *     collider: { width: 32, height: 32, trigger: false }
         * });
         * console.log(wall.toString()); // "Tile[wall: terrain:brick (solid)]"
         * 
         * const pickup = new Tile("coin", "items:gold", {
         *     collider: { radius: 8, trigger: true }
         * });
         * console.log(pickup.toString()); // "Tile[coin: items:gold (trigger)]"
         * 
         * const decoration = new Tile("flower", "nature:rose");
         * console.log(decoration.toString()); // "Tile[flower: nature:rose]"
         */
        toString() {
          const collision = this.hasCollision() ? ` (${this.isTrigger() ? "trigger" : "solid"})` : "";
          return `Tile[${this.name}: ${this.spriteName}${collision}]`;
        }
      };
    }
  });

  // src/asset/TileRegistry.js
  var TileRegistry;
  var init_TileRegistry = __esm({
    "src/asset/TileRegistry.js"() {
      TileRegistry = class {
        static tiles = /* @__PURE__ */ new Map();
        // Storage for all registered tiles: name -> TileAsset
        /**
         * Internal method to add a tile asset (used by TileAsset constructor).
         * 
         * Registers a tile in the internal storage map, making it available for
         * retrieval by name. This method is called automatically during TileAsset
         * construction and should not be called directly by user code.
         * 
         * @param {string} name - Unique name to register the tile under
         * @param {TileAsset} tileAsset - The tile asset instance to register
         * 
         * @private
         * @since 1.0.0
         */
        static _addTile(name, tileAsset) {
          this.tiles.set(name, tileAsset);
        }
        /**
         * Get a registered tile asset by name.
         * 
         * Retrieves a tile from the registry using its unique name. Returns null
         * if the tile is not found, allowing for safe existence checking.
         * 
         * @param {string} name - Name of the tile to retrieve
         * @returns {TileAsset|null} The tile asset if found, null otherwise
         * 
         * @example
         * // Register a tile
         * const grassTile = new TileAsset("grass", "terrain:grass");
         * 
         * // Retrieve the tile
         * const retrievedTile = TileRegistry.getTile("grass");
         * console.log(retrievedTile.toString()); // "Tile[grass: terrain:grass]"
         * 
         * // Handle missing tiles safely
         * const missingTile = TileRegistry.getTile("nonexistent");
         * if (missingTile) {
         *     console.log("Found tile:", missingTile.name);
         * } else {
         *     console.log("Tile not found");
         * }
         * 
         * @since 1.0.0
         */
        static getTile(name) {
          return this.tiles.get(name) || null;
        }
        /**
         * Check if a tile is registered in the registry.
         * 
         * Performs a fast existence check without retrieving the actual tile object.
         * Useful for conditional logic and validation.
         * 
         * @param {string} name - Name of the tile to check
         * @returns {boolean} True if tile exists in registry, false otherwise
         * 
         * @example
         * // Check before using a tile
         * if (TileRegistry.hasTile("lava")) {
         *     const lavaTile = TileRegistry.getTile("lava");
         *     console.log("Lava tile is available");
         * } else {
         *     console.log("Lava tile needs to be created");
         *     new TileAsset("lava", "hazards:lava");
         * }
         * 
         * // Validate tile names in configuration
         * const requiredTiles = ["grass", "stone", "water"];
         * const missingTiles = requiredTiles.filter(name => !TileRegistry.hasTile(name));
         * if (missingTiles.length > 0) {
         *     console.error("Missing tiles:", missingTiles);
         * }
         * 
         * @since 1.0.0
         */
        static hasTile(name) {
          return this.tiles.has(name);
        }
        /**
         * Get all registered tile names
         * @returns {string[]} Array of all registered tile names
         */
        static getAllTileNames() {
          return Array.from(this.tiles.keys());
        }
        /**
         * Get all registered tiles
         * @returns {TileAsset[]} Array of all registered tile assets
         */
        static getAllTiles() {
          return Array.from(this.tiles.values());
        }
        /**
         * Remove a tile from the registry
         * @param {string} name - Name of the tile to remove
         * @returns {boolean} True if tile was removed, false if it didn't exist
         */
        static removeTile(name) {
          return this.tiles.delete(name);
        }
        /**
         * Clear all registered tiles
         * Useful for scene transitions or testing
         */
        static clear() {
          this.tiles.clear();
        }
        /**
         * Get the number of registered tiles
         * @returns {number} Number of registered tiles
         */
        static getCount() {
          return this.tiles.size;
        }
        /**
         * Register a tile manually (if not using TileAsset constructor)
         * @param {string} name - Name to register the tile under
         * @param {Tile|TileAsset} tile - The tile to register
         * @returns {boolean} True if registered successfully, false if name already exists
         */
        static registerTile(name, tile) {
          if (this.hasTile(name)) {
            console.warn(`TileRegistry: Tile "${name}" already exists. Use forceRegisterTile() to override.`);
            return false;
          }
          this.tiles.set(name, tile);
          return true;
        }
        /**
         * Register a tile, overriding any existing tile with the same name
         * @param {string} name - Name to register the tile under
         * @param {Tile|TileAsset} tile - The tile to register
         */
        static forceRegisterTile(name, tile) {
          this.tiles.set(name, tile);
        }
        /**
         * Create multiple tiles from metadata objects
         * @param {Object[]} tilesMetadata - Array of tile metadata objects
         * @returns {TileAsset[]} Array of created tile assets
         * 
         * @example
         * const tiles = TileRegistry.createTilesFromMetadata([
         *     { name: "grass", spriteName: "terrain:grass", options: {} },
         *     { name: "stone", spriteName: "terrain:stone", options: { collider: { width: 32, height: 32 } } }
         * ]);
         */
        static createTilesFromMetadata(tilesMetadata) {
          const { TileAsset: TileAsset2 } = (init_TileAsset(), __toCommonJS(TileAsset_exports));
          return tilesMetadata.map((metadata) => TileAsset2.meta(metadata));
        }
        /**
         * Export all registered tiles to metadata format
         * @returns {Object[]} Array of tile metadata objects
         */
        static exportAllToMetadata() {
          return Array.from(this.tiles.values()).map(
            (tile) => tile.toMeta ? tile.toMeta() : {
              name: tile.name,
              spriteName: tile.spriteName,
              options: {
                width: tile.width,
                height: tile.height,
                opacity: tile.opacity,
                color: tile.color,
                flipX: tile.flipX,
                flipY: tile.flipY,
                collider: tile.collider
              }
            }
          );
        }
        /**
         * Get tiles by filter criteria
         * @param {function} filterFn - Function to filter tiles (tile) => boolean
         * @returns {TileAsset[]} Array of tiles matching the filter
         * 
         * @example
         * // Get all solid tiles
         * const solidTiles = TileRegistry.getTilesByFilter(tile => tile.isSolid());
         * 
         * // Get all trigger tiles
         * const triggerTiles = TileRegistry.getTilesByFilter(tile => tile.isTrigger());
         * 
         * // Get tiles using specific sprite
         * const grassTiles = TileRegistry.getTilesByFilter(tile => tile.spriteName.includes("grass"));
         */
        static getTilesByFilter(filterFn) {
          return Array.from(this.tiles.values()).filter(filterFn);
        }
        /**
         * Debug method to print all registered tiles
         * @param {boolean} [detailed=false] - Whether to show detailed tile information
         */
        static debugPrint(detailed = false) {
          console.log(`TileRegistry: ${this.getCount()} tiles registered`);
          if (detailed) {
            this.tiles.forEach((tile, name) => {
              console.log(`  - ${name}: ${tile.toString()}`);
            });
          } else {
            console.log(`  Names: [${this.getAllTileNames().join(", ")}]`);
          }
        }
      };
    }
  });

  // src/asset/TileAsset.js
  var TileAsset_exports = {};
  __export(TileAsset_exports, {
    TileAsset: () => TileAsset
  });
  var TileAsset;
  var init_TileAsset = __esm({
    "src/asset/TileAsset.js"() {
      init_Tile();
      init_TileRegistry();
      TileAsset = class _TileAsset extends Tile {
        /**
         * Create a new tile asset and automatically register it in TileRegistry.
         * 
         * Initializes a new TileAsset with the specified configuration and immediately
         * registers it in the global TileRegistry for use in tilemaps. The tile name
         * must be unique and cannot contain colons (reserved for future notation).
         * 
         * @param {string} name - Unique identifier for registry registration (no colons allowed)
         * @param {string} spriteName - Sprite reference supporting unified notation ("sprite" or "sheet:sprite")
         * @param {Object} [options={}] - Tile configuration options (same as base Tile class)
         * @param {number} [options.width] - Custom render width in pixels
         * @param {number} [options.height] - Custom render height in pixels
         * @param {number} [options.opacity=1] - Tile transparency (0.0-1.0)
         * @param {string} [options.color="#FFFFFF"] - Color tint for rendering
         * @param {boolean} [options.flipX=false] - Horizontal flip during rendering
         * @param {boolean} [options.flipY=false] - Vertical flip during rendering
         * @param {Object} [options.collider] - Collision configuration
         * @param {number} [options.collider.width] - Collision box width
         * @param {number} [options.collider.height] - Collision box height
         * @param {number} [options.collider.radius] - Collision circle radius
         * @param {boolean} [options.collider.trigger=false] - Is collider a trigger
         * @param {string} [options.collider.type="box"] - Collision type: "box" or "circle"
         * 
         * @throws {Error} If name contains colons (reserved for future tile notation)
         * @throws {Error} If name is not provided or is empty
         * @throws {Error} If spriteName is not provided or is empty
         * 
         * @example
         * // Simple tile registration
         * const grass = new TileAsset("grass", "terrain:grass");
         * 
         * // Complex tile with all options
         * const lava = new TileAsset("lava", "hazards:lava_flow", {
         *     width: 32,
         *     height: 32,
         *     opacity: 0.9,
         *     color: "#FF6600",
         *     collider: {
         *         width: 30,
         *         height: 30,
         *         type: "box",
         *         trigger: true
         *     }
         * });
         */
        constructor(name, spriteName, options = {}) {
          if (name.includes(":")) {
            throw new Error(`TileAsset name "${name}" cannot contain colons. Colons are reserved for potential future tile notation.`);
          }
          super(name, spriteName, options);
          this._registerSelf();
        }
        /**
         * Automatically register this tile asset in the TileRegistry.
         * 
         * Internal method called during construction to ensure the tile is immediately
         * available for use in tilemaps and other systems.
         * 
         * @private
         * @since 1.0.0
         */
        _registerSelf() {
          TileRegistry._addTile(this.name, this);
        }
        /**
         * Create a tile asset from metadata configuration (factory method).
         * 
         * Provides a declarative way to create tiles from configuration objects,
         * ideal for loading tiles from JSON, visual editors, or serialized data.
         * 
         * @param {Object} metadata - Complete tile configuration object
         * @param {string} metadata.name - Unique tile identifier for registry
         * @param {string} metadata.spriteName - Sprite reference for rendering
         * @param {Object} [metadata.options] - Tile configuration options
         * @param {number} [metadata.options.width] - Custom render width
         * @param {number} [metadata.options.height] - Custom render height
         * @param {number} [metadata.options.opacity=1] - Tile transparency
         * @param {string} [metadata.options.color="#FFFFFF"] - Color tint
         * @param {boolean} [metadata.options.flipX=false] - Horizontal flip
         * @param {boolean} [metadata.options.flipY=false] - Vertical flip
         * @param {Object} [metadata.options.collider] - Collision configuration
         * 
         * @returns {TileAsset} New tile asset instance registered in TileRegistry
         * 
         * @throws {Error} If metadata.name is missing or invalid
         * @throws {Error} If metadata.spriteName is missing or invalid
         * 
         * @example
         * // Create from metadata object
         * const stoneTile = TileAsset.meta({
         *     name: "stone",
         *     spriteName: "terrain:stone_block",
         *     options: {
         *         width: 32,
         *         height: 32,
         *         collider: {
         *             width: 32,
         *             height: 32,
         *             type: "box"
         *         }
         *     }
         * });
         * 
         * // Load multiple tiles from JSON
         * const tilesConfig = [
         *     { name: "dirt", spriteName: "terrain:dirt", options: {} },
         *     { name: "water", spriteName: "liquids:water", options: { opacity: 0.7 } }
         * ];
         * const tiles = tilesConfig.map(config => TileAsset.meta(config));
         * 
         * @static
         * @since 1.0.0
         */
        static meta(metadata) {
          if (!metadata.name || typeof metadata.name !== "string" || metadata.name.trim() === "") {
            throw new Error("TileAsset.meta() requires a valid name string");
          }
          if (!metadata.spriteName || typeof metadata.spriteName !== "string" || metadata.spriteName.trim() === "") {
            throw new Error("TileAsset.meta() requires a valid spriteName string");
          }
          return new _TileAsset(metadata.name, metadata.spriteName, metadata.options || {});
        }
        /**
         * Get default metadata structure for TileAsset.
         * 
         * Returns a complete metadata template with all supported properties
         * and their default values, useful for documentation and tooling.
         * 
         * @returns {Object} Default metadata object with all properties
         * @returns {string} returns.name - Default empty name
         * @returns {string} returns.spriteName - Default empty sprite name
         * @returns {Object} returns.options - Default options configuration
         * @returns {number|null} returns.options.width - Default width (null = use tilemap size)
         * @returns {number|null} returns.options.height - Default height (null = use tilemap size)
         * @returns {number} returns.options.opacity - Default opacity (1.0 = fully opaque)
         * @returns {string} returns.options.color - Default color ('#FFFFFF' = white/no tint)
         * @returns {boolean} returns.options.flipX - Default horizontal flip (false)
         * @returns {boolean} returns.options.flipY - Default vertical flip (false)
         * @returns {Object|null} returns.options.collider - Default collision (null = no collision)
         * 
         * @example
         * // Get template for tile creation
         * const template = TileAsset.getDefaultMeta();
         * console.log(template);
         * // {
         * //   name: '',
         * //   spriteName: '',
         * //   options: {
         * //     width: null,
         * //     height: null,
         * //     opacity: 1,
         * //     color: '#FFFFFF',
         * //     flipX: false,
         * //     flipY: false,
         * //     collider: null
         * //   }
         * // }
         * 
         * // Use template for tile editor UI
         * const editorDefaults = TileAsset.getDefaultMeta();
         * editorDefaults.name = "new_tile";
         * editorDefaults.spriteName = "terrain:grass";
         * const newTile = TileAsset.meta(editorDefaults);
         * 
         * @static
         * @since 1.0.0
         */
        static getDefaultMeta() {
          return {
            name: "",
            spriteName: "",
            options: {
              width: null,
              height: null,
              opacity: 1,
              color: "#FFFFFF",
              flipX: false,
              flipY: false,
              collider: null
            }
          };
        }
        /**
         * Export this tile to metadata format for serialization.
         * 
         * Converts the tile asset to a plain object suitable for JSON serialization,
         * saving to files, or transmission over networks. The exported metadata can
         * be used with TileAsset.meta() to recreate the tile.
         * 
         * @returns {Object} Metadata object representing this tile's complete state
         * @returns {string} returns.name - Tile's registered name
         * @returns {string} returns.spriteName - Tile's sprite reference
         * @returns {Object} returns.options - Tile's configuration options
         * @returns {number|null} returns.options.width - Custom width or null
         * @returns {number|null} returns.options.height - Custom height or null
         * @returns {number} returns.options.opacity - Tile transparency
         * @returns {string} returns.options.color - Color tint value
         * @returns {boolean} returns.options.flipX - Horizontal flip state
         * @returns {boolean} returns.options.flipY - Vertical flip state
         * @returns {Object|null} returns.options.collider - Collision configuration or null
         * 
         * @example
         * // Create a tile and export it
         * const iceTile = new TileAsset("ice", "terrain:ice_block", {
         *     opacity: 0.8,
         *     color: "#AAFFFF",
         *     collider: { width: 32, height: 32, type: "box" }
         * });
         * 
         * const metadata = iceTile.toMeta();
         * console.log(JSON.stringify(metadata, null, 2));
         * // {
         * //   "name": "ice",
         * //   "spriteName": "terrain:ice_block",
         * //   "options": {
         * //     "width": null,
         * //     "height": null,
         * //     "opacity": 0.8,
         * //     "color": "#AAFFFF",
         * //     "flipX": false,
         * //     "flipY": false,
         * //     "collider": {
         * //       "width": 32,
         * //       "height": 32,
         * //       "type": "box",
         * //       "trigger": false
         * //     }
         * //   }
         * // }
         * 
         * // Recreate the tile from metadata
         * const recreatedTile = TileAsset.meta(metadata);
         * 
         * @since 1.0.0
         */
        toMeta() {
          return {
            name: this.name,
            spriteName: this.spriteName,
            options: {
              width: this.width,
              height: this.height,
              opacity: this.opacity,
              color: this.color,
              flipX: this.flipX,
              flipY: this.flipY,
              collider: this.collider ? { ...this.collider } : null
            }
          };
        }
        /**
         * Apply metadata to this tile at runtime (dynamic configuration).
         * 
         * Updates the tile's properties from a metadata object, allowing for
         * runtime reconfiguration without creating new instances. Useful for
         * tile editors, dynamic tile systems, or loading saved configurations.
         * 
         * @param {Object} metadata - Metadata object with properties to update
         * @param {string} [metadata.name] - New tile name (updates registry key)
         * @param {string} [metadata.spriteName] - New sprite reference
         * @param {Object} [metadata.options] - New configuration options
         * @param {number} [metadata.options.width] - New custom width
         * @param {number} [metadata.options.height] - New custom height
         * @param {number} [metadata.options.opacity] - New transparency value
         * @param {string} [metadata.options.color] - New color tint
         * @param {boolean} [metadata.options.flipX] - New horizontal flip state
         * @param {boolean} [metadata.options.flipY] - New vertical flip state
         * @param {Object|null} [metadata.options.collider] - New collision configuration
         * 
         * @example
         * // Create base tile
         * const stoneTile = new TileAsset("stone", "terrain:stone");
         * 
         * // Apply new configuration at runtime
         * stoneTile.applyMeta({
         *     spriteName: "terrain:marble",
         *     options: {
         *         opacity: 0.9,
         *         color: "#F0F0F0",
         *         collider: {
         *             width: 32,
         *             height: 32,
         *             type: "box",
         *             trigger: false
         *         }
         *     }
         * });
         * 
         * // Partial updates are supported
         * stoneTile.applyMeta({
         *     options: {
         *         opacity: 0.7  // Only changes opacity, keeps other properties
         *     }
         * });
         * 
         * @since 1.0.0
         */
        applyMeta(metadata) {
          if (metadata.name !== void 0) {
            this.name = metadata.name;
          }
          if (metadata.spriteName !== void 0) {
            this.spriteName = metadata.spriteName;
          }
          if (metadata.options) {
            const opts = metadata.options;
            if (opts.width !== void 0) this.width = opts.width;
            if (opts.height !== void 0) this.height = opts.height;
            if (opts.opacity !== void 0) this.opacity = opts.opacity;
            if (opts.color !== void 0) this.color = opts.color;
            if (opts.flipX !== void 0) this.flipX = opts.flipX;
            if (opts.flipY !== void 0) this.flipY = opts.flipY;
            if (opts.collider !== void 0) {
              this.collider = opts.collider ? { ...opts.collider } : null;
            }
          }
        }
      };
    }
  });

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    AudioAsset: () => AudioAsset,
    AudioClip: () => AudioClip,
    AudioListenerComponent: () => AudioListenerComponent,
    AudioSourceComponent: () => AudioSourceComponent,
    BoxColliderComponent: () => BoxColliderComponent,
    CameraComponent: () => CameraComponent,
    CircleColliderComponent: () => CircleColliderComponent,
    Component: () => Component,
    Destroy: () => Destroy,
    DestroyAll: () => DestroyAll,
    DestroyComponent: () => DestroyComponent,
    FollowTarget: () => FollowTarget,
    Game: () => Game,
    GameObject: () => GameObject,
    GamepadInput: () => GamepadInput,
    ImageComponent: () => ImageComponent,
    Instantiate: () => Instantiate,
    Keyboard: () => Keyboard,
    KeyboardInput: () => KeyboardInput,
    LayerManager: () => LayerManager,
    MonoBehaviour: () => MonoBehaviour,
    Mouse: () => Mouse,
    MouseInput: () => MouseInput,
    MovementComponent: () => MovementComponent,
    MovementController: () => MovementController,
    ProceduralAudioClip: () => ProceduralAudioClip,
    Random: () => Random,
    RandomAudioGenerator: () => RandomAudioGenerator,
    RigidbodyComponent: () => RigidbodyComponent,
    Scene: () => Scene,
    ShapeComponent: () => ShapeComponent,
    SpriteAnimationClip: () => SpriteAnimationClip,
    SpriteAnimationComponent: () => SpriteAnimationComponent,
    SpriteAsset: () => SpriteAsset,
    SpriteRegistry: () => SpriteRegistry,
    SpriteRendererComponent: () => SpriteRendererComponent,
    SpritesheetAsset: () => SpritesheetAsset,
    Tile: () => Tile,
    TileAsset: () => TileAsset,
    TileRegistry: () => TileRegistry,
    TilemapComponent: () => TilemapComponent,
    Time: () => Time,
    Vector2: () => Vector2,
    Vector3: () => Vector3,
    clearPendingDestructions: () => clearPendingDestructions,
    getPendingDestructionCount: () => getPendingDestructionCount
  });

  // src/asset/SpriteRegistry.js
  var SpriteRegistry = class {
    static sprites = /* @__PURE__ */ new Map();
    // Unified storage: "name" or "sheet:sprite"
    static spritesheets = /* @__PURE__ */ new Map();
    // Asset storage for spritesheet metadata
    /**
     * Internal method to add a sprite asset (used by SpriteAsset constructor)
     * @param {string} name - Name to register the sprite under
     * @param {SpriteAsset} spriteAsset - The sprite asset to register
     * @private
     */
    static _addSprite(name, spriteAsset) {
      this.sprites.set(name, spriteAsset);
    }
    /**
     * Internal method to add a spritesheet asset and register its individual sprites
     * @param {string} name - Name to register the spritesheet under
     * @param {SpritesheetAsset} spritesheetAsset - The spritesheet asset to register
     * @private
     */
    static _addSpritesheet(name, spritesheetAsset) {
      this.spritesheets.set(name, spritesheetAsset);
    }
    /**
     * Get a registered sprite asset (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {SpriteAsset|Object|null} The sprite asset or sprite wrapper, or null if not found
     */
    static getSprite(name) {
      return this.sprites.get(name) || null;
    }
    /**
     * Get a registered spritesheet asset
     * @param {string} name - Name of the spritesheet
     * @returns {SpritesheetAsset|null} The spritesheet asset or null if not found
     */
    static getSpritesheet(name) {
      return this.spritesheets.get(name) || null;
    }
    /**
     * Preload all registered sprites and spritesheets
     * This method should be called during the game's preload phase
     * @returns {Promise<void>} Promise that resolves when all assets are loaded
     */
    static async preloadAll() {
      const spritePromises = Array.from(this.sprites.values()).filter((sprite) => sprite.load && typeof sprite.load === "function").map((sprite) => sprite.isLoaded ? Promise.resolve() : sprite.load());
      const spritesheetPromises = Array.from(this.spritesheets.values()).map(
        (sheet) => sheet.isLoaded ? Promise.resolve() : sheet.load()
      );
      await Promise.all([...spritePromises, ...spritesheetPromises]);
    }
    /**
     * Check if a sprite is registered (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {boolean} True if sprite exists
     */
    static hasSprite(name) {
      return this.sprites.has(name);
    }
    /**
     * Check if a spritesheet is registered
     * @param {string} name - Name of the spritesheet
     * @returns {boolean} True if spritesheet exists
     */
    static hasSpritesheet(name) {
      return this.spritesheets.has(name);
    }
    /**
     * Get all registered sprite names
     * @returns {Array<string>} Array of sprite names
     */
    static getSpriteNames() {
      return Array.from(this.sprites.keys());
    }
    /**
     * Get all registered spritesheet names
     * @returns {Array<string>} Array of spritesheet names
     */
    static getSpritesheetNames() {
      return Array.from(this.spritesheets.keys());
    }
    /**
     * Get all sprite names from a specific spritesheet
     * @param {string} sheetName - Name of the spritesheet
     * @returns {Array<string>} Array of sprite keys with colon notation ("sheetName:spriteName")
     */
    static getSpritesFromSheet(sheetName) {
      const spriteKeys = [];
      for (const key of this.sprites.keys()) {
        if (key.startsWith(sheetName + ":")) {
          spriteKeys.push(key);
        }
      }
      return spriteKeys;
    }
    /**
     * Clear all registered sprites and spritesheets
     */
    static clear() {
      this.sprites.clear();
      this.spritesheets.clear();
    }
    /**
     * Remove a specific sprite from the registry (supports both single sprites and spritesheet sprites)
     * @param {string} name - Name of the sprite or "sheetName:spriteName" for spritesheet sprites
     * @returns {boolean} True if sprite was removed
     */
    static removeSprite(name) {
      return this.sprites.delete(name);
    }
    /**
     * Remove a specific spritesheet from the registry
     * @param {string} name - Name of the spritesheet to remove
     * @returns {boolean} True if spritesheet was removed
     */
    static removeSpritesheet(name) {
      return this.spritesheets.delete(name);
    }
    // Legacy instance-based methods for backward compatibility
    /**
     * Creates a new SpriteRegistry instance (legacy support)
     * @deprecated Use static methods instead
     */
    constructor() {
      this.sheets = /* @__PURE__ */ new Map();
      console.warn("SpriteRegistry instance methods are deprecated. Use static methods instead.");
    }
    /**
     * Adds a spritesheet to the registry (legacy support)
     * @deprecated Use new SpritesheetAsset() instead
     * @param {Object} sheet - The spritesheet to add
     */
    add(sheet) {
      console.warn("SpriteRegistry.add() is deprecated. Use new SpritesheetAsset() instead.");
      this.sheets.set(sheet.name, sheet);
    }
    /**
     * Preloads all registered spritesheets (legacy support)
     * @deprecated Use SpriteRegistry.preloadAll() instead
     * @returns {Promise<void>} Promise that resolves when all spritesheets are loaded
     */
    async preload() {
      console.warn("SpriteRegistry.preload() is deprecated. Use SpriteRegistry.preloadAll() instead.");
      for (const sheet of this.sheets.values()) {
        await sheet.load();
      }
    }
    /**
     * Retrieves a spritesheet by name (legacy support)
     * @deprecated Use SpriteRegistry.getSpritesheet() instead
     * @param {string} name - The name of the spritesheet
     * @returns {Object|undefined} The requested spritesheet or undefined if not found
     */
    getSheet(name) {
      console.warn("SpriteRegistry.getSheet() is deprecated. Use SpriteRegistry.getSpritesheet() instead.");
      return this.sheets.get(name);
    }
  };

  // src/core/Game.js
  init_AudioRegistry();

  // src/common/Component.js
  var Component = class {
    /**
     * Creates a new Component with metadata system initialization.
     * 
     * Initializes the component with essential properties and integrates with the
     * comprehensive metadata system. Sets up default values, GameObject reference
     * placeholder, gizmos integration, and processes any constructor arguments
     * through the metadata pipeline for consistent configuration handling.
     * 
     * **Initialization Process:**
     * 1. Sets up core component properties (gameObject, enabled, started state)
     * 2. Configures gizmos integration based on Game instance settings
     * 3. Initializes metadata system with component-specific defaults
     * 4. Processes constructor arguments through metadata pipeline
     * 5. Validates final configuration for type safety
     * 
     * **Properties Initialized:**
     * - `gameObject` - Reference to parent GameObject (set when attached)
     * - `enabled` - Component active state (true by default)
     * - `_started` - Internal lifecycle tracking
     * - `_internalGizmos` - Debug visualization integration
     * - `__meta` - Metadata configuration object
     * 
     * @example
     * // Direct component creation
     * const component = new MyComponent();
     * gameObject.addComponent(component);
     * 
     * @example
     * // Component with constructor arguments
     * class PlayerController extends Component {
     *     constructor(speed = 5) {
     *         super(); // Calls metadata initialization
     *         this.speed = speed;
     *     }
     * }
     * 
     * @example
     * // Metadata-aware component
     * class SpriteComponent extends Component {
     *     constructor(spriteName, options = {}) {
     *         super(); // Metadata system handles args automatically
     *     }
     *     
     *     _applyConstructorArgs(spriteName, options) {
     *         // Called automatically during super()
     *         this.applyMeta({ spriteName, ...options });
     *     }
     * }
     */
    constructor() {
      this.gameObject = null;
      this.enabled = true;
      this._started = false;
      this._internalGizmos = this._internalGizmos || (Game.instance?._internalGizmos ?? false);
      this.__meta = this.constructor.getDefaultMeta();
      if (arguments.length > 0) {
        this._applyConstructorArgs(...arguments);
      }
    }
    /**
     * Static method to create component instance from metadata
     * @param {Object} metadata - Component configuration object
     * @returns {Component} - Configured component instance
     */
    static meta(metadata) {
      const instance = new this();
      instance.applyMeta(metadata);
      return instance;
    }
    /**
     * Apply metadata to this component instance
     * @param {Object} metadata - Component configuration object
     */
    applyMeta(metadata) {
      const merged = { ...this.__meta, ...metadata };
      this.__meta = merged;
      this._updatePropertiesFromMeta();
      this._validateMeta();
    }
    /**
     * Get default metadata for this component type
     * Override in subclasses to define component-specific defaults
     * @returns {Object} Default metadata object
     */
    static getDefaultMeta() {
      return {};
    }
    /**
     * Apply constructor arguments to metadata format
     * Override in subclasses to map constructor args to metadata
     * @private
     */
    _applyConstructorArgs(...args) {
    }
    /**
     * Update component properties from current metadata
     * Override in subclasses to apply metadata to component properties
     * @private
     */
    _updatePropertiesFromMeta() {
    }
    /**
     * Validate current metadata
     * Override in subclasses to add component-specific validation
     * @private
     */
    _validateMeta() {
    }
    __lateStart() {
    }
    __update() {
    }
    __draw(ctx) {
      if (this.enabled && typeof this.draw === "function") {
        this.draw(ctx);
      }
      if (this._internalGizmos) {
        this.__internalGizmos(ctx);
      }
      if (this.OnDrawGizmos && typeof this.OnDrawGizmos === "function") {
        this.OnDrawGizmos(ctx);
      }
    }
    __preload() {
    }
    __internalGizmos(ctx) {
    }
    start() {
    }
    update() {
    }
    draw(ctx) {
    }
    async preload() {
    }
    destroy() {
    }
    lateUpdate() {
    }
  };
  var MonoBehaviour = class extends Component {
    constructor() {
      super();
    }
  };

  // src/math/Vector2.js
  var Vector2 = class _Vector2 {
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
    static get zero() {
      return new _Vector2(0, 0);
    }
    static get one() {
      return new _Vector2(1, 1);
    }
    static get up() {
      return new _Vector2(0, 1);
    }
    static get down() {
      return new _Vector2(0, -1);
    }
    static get left() {
      return new _Vector2(-1, 0);
    }
    static get right() {
      return new _Vector2(1, 0);
    }
    static get positiveInfinity() {
      return new _Vector2(Infinity, Infinity);
    }
    static get negativeInfinity() {
      return new _Vector2(-Infinity, -Infinity);
    }
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
      if (mag === 0) return _Vector2.zero;
      return new _Vector2(this.x / mag, this.y / mag);
    }
    /**
     * Adds another vector to this vector.
     * @param {Vector2} other - The vector to add
     * @returns {Vector2} A new vector representing the sum
     */
    add(other) {
      return new _Vector2(this.x + other.x, this.y + other.y);
    }
    /**
     * Subtracts another vector from this vector.
     * @param {Vector2} other - The vector to subtract
     * @returns {Vector2} A new vector representing the difference
     */
    subtract(other) {
      return new _Vector2(this.x - other.x, this.y - other.y);
    }
    /**
     * Multiplies this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector2} A new vector representing the product
     */
    multiply(scalar) {
      return new _Vector2(this.x * scalar, this.y * scalar);
    }
    /**
     * Divides this vector by a scalar.
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector2} A new vector representing the quotient
     */
    divide(scalar) {
      if (scalar === 0) throw new Error("Cannot divide by zero");
      return new _Vector2(this.x / scalar, this.y / scalar);
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
      return new _Vector2(this.x, this.y);
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
      t = Math.max(0, Math.min(1, t));
      return new _Vector2(
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
      return new _Vector2(
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
      return new _Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    /**
     * Returns a vector with the maximum components of two vectors.
     * @param {Vector2} a - First vector
     * @param {Vector2} b - Second vector
     * @returns {Vector2} Vector with maximum components
     */
    static max(a, b) {
      return new _Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
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
      const factor = -2 * _Vector2.dot(inNormal, inDirection);
      return new _Vector2(
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
      const dot = Math.max(-1, Math.min(1, _Vector2.dot(from, to) / denominator));
      return Math.acos(dot);
    }
    /**
     * Returns the signed angle in radians between two vectors.
     * @param {Vector2} from - First vector
     * @param {Vector2} to - Second vector
     * @returns {number} Signed angle in radians
     */
    static signedAngle(from, to) {
      const unsignedAngle = _Vector2.angle(from, to);
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
        return new _Vector2(normalizedX * maxLength, normalizedY * maxLength);
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
      return new _Vector2(
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
      return new _Vector2(-vector.y, vector.x);
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
      smoothTime = Math.max(1e-4, smoothTime);
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
      return new _Vector2(outputX, outputY);
    }
  };

  // src/common/components/CameraComponent.js
  var CameraComponent = class extends Component {
    constructor(canvas, zoom = 1) {
      super();
      this.canvas = canvas;
      this.zoom = zoom;
    }
    /**
     * Get default metadata configuration for CameraComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        zoom: 1
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(canvas, zoom = 1) {
      const metadata = {
        zoom
      };
      this.canvas = canvas;
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.zoom = this.__meta.zoom;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (typeof meta.zoom !== "number" || meta.zoom <= 0) {
        throw new Error("zoom must be a positive number");
      }
    }
    applyTransform(ctx) {
      const position = this.gameObject.getGlobalPosition();
      ctx.setTransform(
        this.zoom,
        0,
        0,
        this.zoom,
        -position.x * this.zoom + this.canvas.width / 2,
        -position.y * this.zoom + this.canvas.height / 2
      );
    }
  };

  // src/input/AbstractInputDevice.js
  var AbstractInputDevice = class {
    /**
     * Create a new input device
     * @param {string} name - The name of this input device (e.g., 'keyboard', 'mouse', 'gamepad')
     */
    constructor(name) {
      this.name = name;
      this.initialized = false;
    }
    /**
     * Initialize the input device - override in subclasses
     * @param {HTMLCanvasElement} canvas - Optional canvas for coordinate calculations
     */
    initialize(canvas = null) {
      throw new Error(`InputDevice '${this.name}' must implement initialize() method`);
    }
    /**
     * Update the input device state - called each frame
     * Override in subclasses to handle device-specific updates
     */
    update() {
      throw new Error(`InputDevice '${this.name}' must implement update() method`);
    }
    /**
     * Check if a key/button is currently being held down
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isDown(key) {
      throw new Error(`InputDevice '${this.name}' must implement isDown() method`);
    }
    /**
     * Check if a key/button was pressed this frame (click-like, only fires once)
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isPressed(key) {
      throw new Error(`InputDevice '${this.name}' must implement isPressed() method`);
    }
    /**
     * Check if a key/button was released this frame
     * @param {any} key - The key/button to check (device-specific format)
     * @returns {boolean}
     */
    isReleased(key) {
      throw new Error(`InputDevice '${this.name}' must implement isReleased() method`);
    }
    /**
     * Register an event callback for this device
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {any} key - The key/button to listen for
     * @param {function} callback - Callback function
     */
    onEvent(event, key, callback) {
      console.warn(`InputDevice '${this.name}' does not support event callbacks`);
    }
    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {any} key - The key/button to remove callback for
     */
    removeEvent(event, key) {
      console.warn(`InputDevice '${this.name}' does not support event callbacks`);
    }
    /**
     * Resolve a key value to its canonical form
     * Handles multi-value keys (e.g., Space = [" ", "Space", " "])
     * @param {any} key - The key to resolve
     * @returns {string|number} Canonical key value
     */
    resolveKey(key) {
      if (Array.isArray(key)) {
        return key[0];
      }
      return key;
    }
    /**
     * Check if a physical input matches a logical key definition
     * Supports multi-value keys
     * @param {any} physicalInput - The actual input received
     * @param {any} logicalKey - The logical key definition (may be array)
     * @returns {boolean}
     */
    matchesKey(physicalInput, logicalKey) {
      if (Array.isArray(logicalKey)) {
        return logicalKey.includes(physicalInput);
      }
      return physicalInput === logicalKey;
    }
    /**
     * Get device-specific information
     * @returns {Object}
     */
    getInfo() {
      return {
        name: this.name,
        initialized: this.initialized,
        type: this.constructor.name
      };
    }
  };

  // src/input/KeyboardInput.js
  var KeyboardInput = class extends AbstractInputDevice {
    constructor() {
      super("keyboard");
      this.keys = /* @__PURE__ */ new Set();
      this.pressedKeys = /* @__PURE__ */ new Set();
      this.releasedKeys = /* @__PURE__ */ new Set();
      this.previousKeys = /* @__PURE__ */ new Set();
      this.onKeyDown = /* @__PURE__ */ new Map();
      this.onKeyStay = /* @__PURE__ */ new Map();
      this.onKeyUp = /* @__PURE__ */ new Map();
      this.keyMapping = null;
    }
    /**
     * Initialize keyboard input
     * @param {HTMLCanvasElement} canvas - Optional canvas (not used for keyboard)
     */
    async initialize(canvas = null) {
      if (this.initialized) return;
      try {
        const { Keyboard: Keyboard2 } = await Promise.resolve().then(() => (init_Keyboard(), Keyboard_exports));
        this.keyMapping = Keyboard2;
        if (Keyboard2.initialize) {
          Keyboard2.initialize();
        }
        this.setupEventListeners();
        this.initialized = true;
        console.log("\u{1F3B9} Keyboard input initialized");
      } catch (error) {
        console.error("Failed to initialize keyboard input:", error);
      }
    }
    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
      window.addEventListener("keydown", (e) => {
        const logicalKey = this.getLogicalKey(e.key);
        if (!this.keys.has(logicalKey)) {
          this.pressedKeys.add(logicalKey);
          const callback = this.onKeyDown.get(logicalKey);
          if (callback) callback(logicalKey);
        }
        this.keys.add(logicalKey);
      });
      window.addEventListener("keyup", (e) => {
        const logicalKey = this.getLogicalKey(e.key);
        this.keys.delete(logicalKey);
        this.releasedKeys.add(logicalKey);
        const callback = this.onKeyUp.get(logicalKey);
        if (callback) callback(logicalKey);
      });
    }
    /**
     * Update keyboard state - called each frame
     */
    update() {
      if (!this.initialized) return;
      for (const key of this.keys) {
        if (this.previousKeys.has(key)) {
          const callback = this.onKeyStay.get(key);
          if (callback) callback(key);
        }
      }
      this.pressedKeys.clear();
      this.releasedKeys.clear();
      this.previousKeys = new Set(this.keys);
    }
    /**
     * Get logical key name from physical key input
     * @param {string} physicalKey - The physical key pressed
     * @returns {string} Logical key name
     */
    getLogicalKey(physicalKey) {
      if (this.keyMapping && this.keyMapping.getLogicalKey) {
        return this.keyMapping.getLogicalKey(physicalKey);
      }
      return physicalKey;
    }
    /**
     * Check if a key is currently being held down
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isDown(key) {
      const canonicalKey = this.resolveKey(key);
      return this.keys.has(canonicalKey);
    }
    /**
     * Check if a key was pressed this frame
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isPressed(key) {
      const canonicalKey = this.resolveKey(key);
      return this.pressedKeys.has(canonicalKey);
    }
    /**
     * Check if a key was released this frame
     * Supports multi-value keys
     * @param {string|Array} key - The key to check
     * @returns {boolean}
     */
    isReleased(key) {
      const canonicalKey = this.resolveKey(key);
      return this.releasedKeys.has(canonicalKey);
    }
    /**
     * Register an event callback for keyboard input
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {string|Array} key - The key to listen for
     * @param {function} callback - Callback function
     */
    onEvent(event, key, callback) {
      const canonicalKey = this.resolveKey(key);
      switch (event) {
        case "down":
          this.onKeyDown.set(canonicalKey, callback);
          break;
        case "stay":
          this.onKeyStay.set(canonicalKey, callback);
          break;
        case "up":
          this.onKeyUp.set(canonicalKey, callback);
          break;
        default:
          console.warn(`Unknown keyboard event: ${event}`);
      }
    }
    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay')
     * @param {string|Array} key - The key to remove callback for
     */
    removeEvent(event, key) {
      const canonicalKey = this.resolveKey(key);
      switch (event) {
        case "down":
          this.onKeyDown.delete(canonicalKey);
          break;
        case "stay":
          this.onKeyStay.delete(canonicalKey);
          break;
        case "up":
          this.onKeyUp.delete(canonicalKey);
          break;
      }
    }
    /**
     * Clear all event callbacks
     */
    clearAllEvents() {
      this.onKeyDown.clear();
      this.onKeyStay.clear();
      this.onKeyUp.clear();
    }
    /**
     * Get keyboard device information
     * @returns {Object}
     */
    getInfo() {
      return {
        ...super.getInfo(),
        keysHeld: this.keys.size,
        mappingSystem: this.keyMapping ? "Loaded" : "Not available",
        events: {
          down: this.onKeyDown.size,
          stay: this.onKeyStay.size,
          up: this.onKeyUp.size
        }
      };
    }
  };

  // src/input/MouseInput.js
  var MouseInput = class extends AbstractInputDevice {
    constructor() {
      super("mouse");
      this.buttons = /* @__PURE__ */ new Set();
      this.pressedButtons = /* @__PURE__ */ new Set();
      this.releasedButtons = /* @__PURE__ */ new Set();
      this.previousButtons = /* @__PURE__ */ new Set();
      this.position = { x: 0, y: 0 };
      this.lastPosition = { x: 0, y: 0 };
      this.onButtonDown = /* @__PURE__ */ new Map();
      this.onButtonStay = /* @__PURE__ */ new Map();
      this.onButtonUp = /* @__PURE__ */ new Map();
      this.onMove = /* @__PURE__ */ new Set();
      this.canvas = null;
    }
    /**
     * Initialize mouse input
     * @param {HTMLCanvasElement} canvas - Canvas for coordinate calculations
     */
    initialize(canvas = null) {
      if (this.initialized) return;
      this.canvas = canvas;
      this.setupEventListeners();
      this.initialized = true;
      console.log("\u{1F5B1}\uFE0F Mouse input initialized");
    }
    /**
     * Set up mouse event listeners
     */
    setupEventListeners() {
      const target = this.canvas || window;
      target.addEventListener("mousedown", (e) => {
        const button = e.button;
        if (!this.buttons.has(button)) {
          this.pressedButtons.add(button);
          const callback = this.onButtonDown.get(button);
          if (callback) callback(button, this.position);
        }
        this.buttons.add(button);
        this.updatePosition(e);
      });
      target.addEventListener("mouseup", (e) => {
        const button = e.button;
        this.buttons.delete(button);
        this.releasedButtons.add(button);
        const callback = this.onButtonUp.get(button);
        if (callback) callback(button, this.position);
        this.updatePosition(e);
      });
      target.addEventListener("mousemove", (e) => {
        this.updatePosition(e);
        for (const callback of this.onMove) {
          callback(this.position, this.lastPosition);
        }
      });
      if (this.canvas) {
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
      }
    }
    /**
     * Update mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     */
    updatePosition(e) {
      this.lastPosition = { ...this.position };
      if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.position.x = e.clientX - rect.left;
        this.position.y = e.clientY - rect.top;
      } else {
        this.position.x = e.clientX;
        this.position.y = e.clientY;
      }
    }
    /**
     * Update mouse state - called each frame
     */
    update() {
      if (!this.initialized) return;
      for (const button of this.buttons) {
        if (this.previousButtons.has(button)) {
          const callback = this.onButtonStay.get(button);
          if (callback) callback(button, this.position);
        }
      }
      this.pressedButtons.clear();
      this.releasedButtons.clear();
      this.previousButtons = new Set(this.buttons);
    }
    /**
     * Check if a mouse button is currently being held down
     * @param {number|Array} button - Button index (0=left, 1=middle, 2=right) or array of buttons
     * @returns {boolean}
     */
    isDown(button) {
      const canonicalButton = this.resolveKey(button);
      return this.buttons.has(canonicalButton);
    }
    /**
     * Check if a mouse button was pressed this frame
     * @param {number|Array} button - Button index or array of buttons
     * @returns {boolean}
     */
    isPressed(button) {
      const canonicalButton = this.resolveKey(button);
      return this.pressedButtons.has(canonicalButton);
    }
    /**
     * Check if a mouse button was released this frame
     * @param {number|Array} button - Button index or array of buttons
     * @returns {boolean}
     */
    isReleased(button) {
      const canonicalButton = this.resolveKey(button);
      return this.releasedButtons.has(canonicalButton);
    }
    /**
     * Get current mouse position
     * @returns {Object} {x, y} coordinates
     */
    getPosition() {
      return { ...this.position };
    }
    /**
     * Get mouse movement delta from last frame
     * @returns {Object} {x, y} movement delta
     */
    getDelta() {
      return {
        x: this.position.x - this.lastPosition.x,
        y: this.position.y - this.lastPosition.y
      };
    }
    /**
     * Register an event callback for mouse input
     * @param {string} event - Event type ('down', 'up', 'stay', 'move')
     * @param {number|function} buttonOrCallback - Button index for button events, or callback for move events
     * @param {function} callback - Callback function (for button events)
     */
    onEvent(event, buttonOrCallback, callback = null) {
      if (event === "move") {
        this.onMove.add(buttonOrCallback);
        return;
      }
      const button = buttonOrCallback;
      const canonicalButton = this.resolveKey(button);
      switch (event) {
        case "down":
          this.onButtonDown.set(canonicalButton, callback);
          break;
        case "stay":
          this.onButtonStay.set(canonicalButton, callback);
          break;
        case "up":
          this.onButtonUp.set(canonicalButton, callback);
          break;
        default:
          console.warn(`Unknown mouse event: ${event}`);
      }
    }
    /**
     * Remove an event callback
     * @param {string} event - Event type ('down', 'up', 'stay', 'move')
     * @param {number|function} buttonOrCallback - Button index for button events, or callback for move events
     */
    removeEvent(event, buttonOrCallback) {
      if (event === "move") {
        this.onMove.delete(buttonOrCallback);
        return;
      }
      const button = buttonOrCallback;
      const canonicalButton = this.resolveKey(button);
      switch (event) {
        case "down":
          this.onButtonDown.delete(canonicalButton);
          break;
        case "stay":
          this.onButtonStay.delete(canonicalButton);
          break;
        case "up":
          this.onButtonUp.delete(canonicalButton);
          break;
      }
    }
    /**
     * Clear all event callbacks
     */
    clearAllEvents() {
      this.onButtonDown.clear();
      this.onButtonStay.clear();
      this.onButtonUp.clear();
      this.onMove.clear();
    }
    /**
     * Get mouse device information
     * @returns {Object}
     */
    getInfo() {
      return {
        ...super.getInfo(),
        position: this.position,
        buttonsHeld: this.buttons.size,
        canvas: this.canvas ? "Connected" : "Global",
        events: {
          down: this.onButtonDown.size,
          stay: this.onButtonStay.size,
          up: this.onButtonUp.size,
          move: this.onMove.size
        }
      };
    }
  };
  var Mouse = {
    Left: [0, "left", "primary"],
    Middle: [1, "middle", "auxiliary"],
    Right: [2, "right", "secondary"],
    Back: [3, "back"],
    Forward: [4, "forward"]
  };

  // src/input/GamepadInput.js
  var GamepadInput = class extends AbstractInputDevice {
    constructor() {
      super("gamepad");
      this.gamepad = null;
      this.gamepadIndex = 0;
      this.buttons = /* @__PURE__ */ new Set();
      this.pressedButtons = /* @__PURE__ */ new Set();
      this.releasedButtons = /* @__PURE__ */ new Set();
      this.previousButtons = /* @__PURE__ */ new Set();
      this.leftStick = { x: 0, y: 0 };
      this.rightStick = { x: 0, y: 0 };
      this.deadzone = 0.1;
      this.triggers = { left: 0, right: 0 };
      this.onButtonDown = /* @__PURE__ */ new Map();
      this.onButtonStay = /* @__PURE__ */ new Map();
      this.onButtonUp = /* @__PURE__ */ new Map();
      this.onStickMove = /* @__PURE__ */ new Map();
      this.onTriggerMove = /* @__PURE__ */ new Map();
      this.onConnected = /* @__PURE__ */ new Set();
      this.onDisconnected = /* @__PURE__ */ new Set();
    }
    /**
     * Initialize gamepad input
     * @param {number} gamepadIndex - Which gamepad to use (default: 0)
     */
    initialize(gamepadIndex = 0) {
      if (this.initialized) return;
      this.gamepadIndex = gamepadIndex;
      this.setupEventListeners();
      this.updateGamepadState();
      this.initialized = true;
      console.log(`\u{1F3AE} Gamepad input initialized (index: ${gamepadIndex})`);
    }
    /**
     * Set up gamepad event listeners
     */
    setupEventListeners() {
      window.addEventListener("gamepadconnected", (e) => {
        if (e.gamepad.index === this.gamepadIndex) {
          this.gamepad = e.gamepad;
          console.log(`\u{1F3AE} Gamepad connected: ${e.gamepad.id}`);
          for (const callback of this.onConnected) {
            callback(e.gamepad);
          }
        }
      });
      window.addEventListener("gamepaddisconnected", (e) => {
        if (e.gamepad.index === this.gamepadIndex) {
          this.gamepad = null;
          console.log(`\u{1F3AE} Gamepad disconnected: ${e.gamepad.id}`);
          for (const callback of this.onDisconnected) {
            callback(e.gamepad);
          }
          this.buttons.clear();
          this.pressedButtons.clear();
          this.releasedButtons.clear();
          this.previousButtons.clear();
        }
      });
    }
    /**
     * Update gamepad state - called each frame
     */
    update() {
      if (!this.initialized) return;
      this.updateGamepadState();
      if (!this.gamepad) return;
      this.updateButtonStates();
      this.updateAnalogSticks();
      this.updateTriggers();
      for (const button of this.buttons) {
        if (this.previousButtons.has(button)) {
          const callback = this.onButtonStay.get(button);
          if (callback) callback(button);
        }
      }
      this.pressedButtons.clear();
      this.releasedButtons.clear();
      this.previousButtons = new Set(this.buttons);
    }
    /**
     * Update gamepad object from navigator.getGamepads()
     */
    updateGamepadState() {
      const gamepads = navigator.getGamepads();
      if (gamepads[this.gamepadIndex]) {
        this.gamepad = gamepads[this.gamepadIndex];
      }
    }
    /**
     * Update button states from gamepad
     */
    updateButtonStates() {
      if (!this.gamepad) return;
      for (let i = 0; i < this.gamepad.buttons.length; i++) {
        const isPressed = this.gamepad.buttons[i].pressed;
        if (isPressed && !this.buttons.has(i)) {
          this.pressedButtons.add(i);
          this.buttons.add(i);
          const callback = this.onButtonDown.get(i);
          if (callback) callback(i);
        } else if (!isPressed && this.buttons.has(i)) {
          this.releasedButtons.add(i);
          this.buttons.delete(i);
          const callback = this.onButtonUp.get(i);
          if (callback) callback(i);
        }
      }
    }
    /**
     * Update analog stick states
     */
    updateAnalogSticks() {
      if (!this.gamepad || this.gamepad.axes.length < 4) return;
      const newLeftStick = {
        x: this.applyDeadzone(this.gamepad.axes[0]),
        y: this.applyDeadzone(this.gamepad.axes[1])
      };
      const newRightStick = {
        x: this.applyDeadzone(this.gamepad.axes[2]),
        y: this.applyDeadzone(this.gamepad.axes[3])
      };
      if (this.stickMoved(this.leftStick, newLeftStick)) {
        this.leftStick = newLeftStick;
        const callback = this.onStickMove.get("left");
        if (callback) callback("left", this.leftStick);
      }
      if (this.stickMoved(this.rightStick, newRightStick)) {
        this.rightStick = newRightStick;
        const callback = this.onStickMove.get("right");
        if (callback) callback("right", this.rightStick);
      }
    }
    /**
     * Update trigger states
     */
    updateTriggers() {
      if (!this.gamepad) return;
      if (this.gamepad.buttons[6]) {
        const newLeftTrigger = this.gamepad.buttons[6].value;
        if (Math.abs(this.triggers.left - newLeftTrigger) > 0.01) {
          this.triggers.left = newLeftTrigger;
          const callback = this.onTriggerMove.get("left");
          if (callback) callback("left", newLeftTrigger);
        }
      }
      if (this.gamepad.buttons[7]) {
        const newRightTrigger = this.gamepad.buttons[7].value;
        if (Math.abs(this.triggers.right - newRightTrigger) > 0.01) {
          this.triggers.right = newRightTrigger;
          const callback = this.onTriggerMove.get("right");
          if (callback) callback("right", newRightTrigger);
        }
      }
    }
    /**
     * Apply deadzone to analog input
     * @param {number} value - Raw analog value
     * @returns {number} - Deadzone-adjusted value
     */
    applyDeadzone(value) {
      return Math.abs(value) < this.deadzone ? 0 : value;
    }
    /**
     * Check if analog stick has moved significantly
     * @param {Object} oldStick - Previous stick position
     * @param {Object} newStick - New stick position
     * @returns {boolean}
     */
    stickMoved(oldStick, newStick) {
      const threshold = 0.01;
      return Math.abs(oldStick.x - newStick.x) > threshold || Math.abs(oldStick.y - newStick.y) > threshold;
    }
    /**
     * Check if a gamepad button is currently being held down
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isDown(button) {
      const canonicalButton = this.resolveKey(button);
      return this.buttons.has(canonicalButton);
    }
    /**
     * Check if a gamepad button was pressed this frame
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isPressed(button) {
      const canonicalButton = this.resolveKey(button);
      return this.pressedButtons.has(canonicalButton);
    }
    /**
     * Check if a gamepad button was released this frame
     * @param {number|string|Array} button - Button index, name, or array of buttons
     * @returns {boolean}
     */
    isReleased(button) {
      const canonicalButton = this.resolveKey(button);
      return this.releasedButtons.has(canonicalButton);
    }
    /**
     * Get analog stick position
     * @param {string} stick - 'left' or 'right'
     * @returns {Object} {x, y} stick position (-1 to 1)
     */
    getStick(stick) {
      return stick === "left" ? { ...this.leftStick } : { ...this.rightStick };
    }
    /**
     * Get trigger value
     * @param {string} trigger - 'left' or 'right'
     * @returns {number} Trigger value (0 to 1)
     */
    getTrigger(trigger) {
      return this.triggers[trigger] || 0;
    }
    /**
     * Check if gamepad is connected
     * @returns {boolean}
     */
    isConnected() {
      return this.gamepad !== null;
    }
    /**
     * Set analog stick deadzone
     * @param {number} deadzone - Deadzone value (0 to 1)
     */
    setDeadzone(deadzone) {
      this.deadzone = Math.max(0, Math.min(1, deadzone));
    }
    /**
     * Register an event callback for gamepad input
     * @param {string} event - Event type ('down', 'up', 'stay', 'stick', 'trigger', 'connected', 'disconnected')
     * @param {number|string|function} buttonOrCallback - Button/stick/trigger identifier or callback
     * @param {function} callback - Callback function
     */
    onEvent(event, buttonOrCallback, callback = null) {
      if (event === "connected" || event === "disconnected") {
        const callbackSet = event === "connected" ? this.onConnected : this.onDisconnected;
        callbackSet.add(buttonOrCallback);
        return;
      }
      const identifier = buttonOrCallback;
      const canonicalIdentifier = this.resolveKey(identifier);
      switch (event) {
        case "down":
          this.onButtonDown.set(canonicalIdentifier, callback);
          break;
        case "stay":
          this.onButtonStay.set(canonicalIdentifier, callback);
          break;
        case "up":
          this.onButtonUp.set(canonicalIdentifier, callback);
          break;
        case "stick":
          this.onStickMove.set(canonicalIdentifier, callback);
          break;
        case "trigger":
          this.onTriggerMove.set(canonicalIdentifier, callback);
          break;
        default:
          console.warn(`Unknown gamepad event: ${event}`);
      }
    }
    /**
     * Remove an event callback
     * @param {string} event - Event type
     * @param {number|string|function} buttonOrCallback - Button/stick/trigger identifier or callback
     */
    removeEvent(event, buttonOrCallback) {
      if (event === "connected" || event === "disconnected") {
        const callbackSet = event === "connected" ? this.onConnected : this.onDisconnected;
        callbackSet.delete(buttonOrCallback);
        return;
      }
      const identifier = buttonOrCallback;
      const canonicalIdentifier = this.resolveKey(identifier);
      switch (event) {
        case "down":
          this.onButtonDown.delete(canonicalIdentifier);
          break;
        case "stay":
          this.onButtonStay.delete(canonicalIdentifier);
          break;
        case "up":
          this.onButtonUp.delete(canonicalIdentifier);
          break;
        case "stick":
          this.onStickMove.delete(canonicalIdentifier);
          break;
        case "trigger":
          this.onTriggerMove.delete(canonicalIdentifier);
          break;
      }
    }
    /**
     * Clear all event callbacks
     */
    clearAllEvents() {
      this.onButtonDown.clear();
      this.onButtonStay.clear();
      this.onButtonUp.clear();
      this.onStickMove.clear();
      this.onTriggerMove.clear();
      this.onConnected.clear();
      this.onDisconnected.clear();
    }
    /**
     * Get gamepad device information
     * @returns {Object}
     */
    getInfo() {
      return {
        ...super.getInfo(),
        connected: this.isConnected(),
        gamepadId: this.gamepad ? this.gamepad.id : "None",
        buttonsHeld: this.buttons.size,
        leftStick: this.leftStick,
        rightStick: this.rightStick,
        triggers: this.triggers,
        deadzone: this.deadzone,
        events: {
          down: this.onButtonDown.size,
          stay: this.onButtonStay.size,
          up: this.onButtonUp.size,
          stick: this.onStickMove.size,
          trigger: this.onTriggerMove.size,
          connected: this.onConnected.size,
          disconnected: this.onDisconnected.size
        }
      };
    }
  };

  // src/input/Input.js
  var Input = class _Input {
    // Device instances - accessible as Input.keyboard, Input.mouse, Input.gamepad
    static keyboard = new KeyboardInput();
    static mouse = new MouseInput();
    static gamepad = new GamepadInput();
    // Device registry for extensibility
    static devices = /* @__PURE__ */ new Map();
    static deviceMappings = /* @__PURE__ */ new Map();
    // Custom device key mappings
    static initialized = false;
    /**
     * Initialize the input system with all devices
     * @param {HTMLCanvasElement} canvas - Canvas for mouse coordinate calculations
     * @param {Object} options - Configuration options
     */
    static initialize(canvas = null, options = {}) {
      if (_Input.initialized) return;
      _Input.registerDevice("keyboard", _Input.keyboard);
      _Input.registerDevice("mouse", _Input.mouse);
      _Input.registerDevice("gamepad", _Input.gamepad);
      _Input.keyboard.initialize();
      _Input.mouse.initialize(canvas);
      _Input.gamepad.initialize(options.gamepadIndex || 0);
      _Input.initialized = true;
      console.log("\u{1F3AE} Input system initialized with devices:", [..._Input.devices.keys()]);
    }
    /**
     * Update all registered input devices - called each frame
     */
    static update() {
      if (!_Input.initialized) return;
      for (const device of _Input.devices.values()) {
        device.update();
      }
    }
    /**
     * Register a new input device
     * @param {string} name - Device name (e.g., 'keyboard', 'mouse', 'customController')
     * @param {InputDevice} device - Device instance
     */
    static registerDevice(name, device) {
      _Input.devices.set(name, device);
      if (!_Input.hasOwnProperty(name)) {
        _Input[name] = device;
      }
      console.log(`\u{1F4E5} Registered input device: ${name}`);
    }
    /**
     * Unregister an input device
     * @param {string} name - Device name to remove
     */
    static unregisterDevice(name) {
      if (_Input.devices.has(name)) {
        const device = _Input.devices.get(name);
        if (device.initialized) {
          device.clearAllEvents();
        }
        _Input.devices.delete(name);
        if (_Input.hasOwnProperty(name)) {
          delete _Input[name];
        }
        console.log(`\u{1F4E4} Unregistered input device: ${name}`);
      }
    }
    /**
     * Register custom key mappings for a device
     * Allows extending device mappings without modifying device classes
     * @param {string} deviceName - Name of the device
     * @param {Object} mappings - Key mappings object
     */
    static registerMapping(deviceName, mappings) {
      if (!_Input.deviceMappings.has(deviceName)) {
        _Input.deviceMappings.set(deviceName, /* @__PURE__ */ new Map());
      }
      const deviceMap = _Input.deviceMappings.get(deviceName);
      for (const [key, values] of Object.entries(mappings)) {
        deviceMap.set(key, Array.isArray(values) ? values : [values]);
      }
      console.log(`\u{1F5C2}\uFE0F Registered custom mappings for ${deviceName}:`, Object.keys(mappings));
    }
    /**
     * Get a specific input device
     * @param {string} name - Device name
     * @returns {InputDevice|null} - The device instance or null
     */
    static getDevice(name) {
      return _Input.devices.get(name) || null;
    }
    /**
     * Get all registered device names
     * @returns {Array<string>} - Array of device names
     */
    static getDeviceNames() {
      return [..._Input.devices.keys()];
    }
    /**
     * Check if a device is registered and initialized
     * @param {string} name - Device name
     * @returns {boolean}
     */
    static isDeviceReady(name) {
      const device = _Input.devices.get(name);
      return device && device.initialized;
    }
    /**
     * Get input system status and information
     * @returns {Object} - System status information
     */
    static getSystemInfo() {
      const deviceInfo = {};
      for (const [name, device] of _Input.devices.entries()) {
        deviceInfo[name] = device.getInfo();
      }
      return {
        initialized: _Input.initialized,
        totalDevices: _Input.devices.size,
        customMappings: _Input.deviceMappings.size,
        devices: deviceInfo
      };
    }
    /**
     * Clear all input state and events for all devices
     */
    static clearAll() {
      for (const device of _Input.devices.values()) {
        if (device.clearAllEvents) {
          device.clearAllEvents();
        }
      }
      console.log("\u{1F9F9} Cleared all input events and state");
    }
    /**
     * Shutdown the input system
     */
    static shutdown() {
      _Input.clearAll();
      _Input.devices.clear();
      _Input.deviceMappings.clear();
      delete _Input.keyboard;
      delete _Input.mouse;
      delete _Input.gamepad;
      _Input.initialized = false;
      console.log("\u{1F50C} Input system shutdown");
    }
    // ============================================
    // LEGACY COMPATIBILITY METHODS (DEPRECATED)
    // These methods maintain backward compatibility
    // but should be replaced with device-specific calls
    // ============================================
    /**
     * @deprecated Use Input.keyboard.isDown(key) instead
     */
    static isDown(key) {
      console.warn("\u26A0\uFE0F Input.isDown() is deprecated. Use Input.keyboard.isDown(key) instead.");
      return _Input.keyboard.isDown(key);
    }
    /**
     * @deprecated Use Input.keyboard.isPressed(key) instead
     */
    static isPressed(key) {
      console.warn("\u26A0\uFE0F Input.isPressed() is deprecated. Use Input.keyboard.isPressed(key) instead.");
      return _Input.keyboard.isPressed(key);
    }
    /**
     * @deprecated Use Input.keyboard.isReleased(key) instead
     */
    static isReleased(key) {
      console.warn("\u26A0\uFE0F Input.isReleased() is deprecated. Use Input.keyboard.isReleased(key) instead.");
      return _Input.keyboard.isReleased(key);
    }
    /**
     * @deprecated Use Input.mouse.isDown(button) instead
     */
    static isMouseDown(button) {
      console.warn("\u26A0\uFE0F Input.isMouseDown() is deprecated. Use Input.mouse.isDown(button) instead.");
      return _Input.mouse.isDown(button);
    }
    /**
     * @deprecated Use Input.mouse.getPosition() instead
     */
    static getMousePosition() {
      console.warn("\u26A0\uFE0F Input.getMousePosition() is deprecated. Use Input.mouse.getPosition() instead.");
      return _Input.mouse.getPosition();
    }
    /**
     * @deprecated Use Input.keyboard.onEvent() instead
     */
    static onEvent(event, key, callback) {
      console.warn("\u26A0\uFE0F Input.onEvent() is deprecated. Use Input.keyboard.onEvent() or Input.mouse.onEvent() instead.");
      _Input.keyboard.onEvent(event, key, callback);
    }
    // Additional legacy methods for compatibility
    static isKeyDown(key) {
      console.warn("\u26A0\uFE0F Input.isKeyDown() is deprecated. Use Input.keyboard.isDown(key) instead.");
      return _Input.keyboard.isDown(key);
    }
    static isKeyPressed(key) {
      console.warn("\u26A0\uFE0F Input.isKeyPressed() is deprecated. Use Input.keyboard.isPressed(key) instead.");
      return _Input.keyboard.isPressed(key);
    }
    static isMousePressed(button) {
      console.warn("\u26A0\uFE0F Input.isMousePressed() is deprecated. Use Input.mouse.isPressed(button) instead.");
      return _Input.mouse.isPressed(button);
    }
    static isLeftMouseDown() {
      console.warn("\u26A0\uFE0F Input.isLeftMouseDown() is deprecated. Use Input.mouse.isDown(0) instead.");
      return _Input.mouse.isDown(0);
    }
    static isRightMouseDown() {
      console.warn("\u26A0\uFE0F Input.isRightMouseDown() is deprecated. Use Input.mouse.isDown(2) instead.");
      return _Input.mouse.isDown(2);
    }
  };

  // src/physics/AbstractColliderComponent.js
  var AbstractColliderComponent = class extends Component {
    constructor() {
      super();
      this.trigger = false;
      this._lastCollisions = /* @__PURE__ */ new Set();
    }
    isTrigger() {
      return this.trigger === true;
    }
    start() {
      CollisionSystem.instance.register(this);
    }
    destroy() {
      CollisionSystem.instance.unregister(this);
    }
    checkCollisionWith(other) {
      throw new Error("checkCollisionWith must be implemented");
    }
    getBounds() {
      throw new Error("getBounds must be implemented");
    }
  };

  // src/bin/CollisionSystem.js
  var CollisionSystem = class _CollisionSystem {
    constructor() {
      this.colliders = /* @__PURE__ */ new Set();
      _CollisionSystem.instance = this;
    }
    register(collider) {
      this.colliders.add(collider);
    }
    unregister(collider) {
      this.colliders.delete(collider);
    }
    update() {
    }
    intersects(a, b) {
      if (a instanceof AbstractColliderComponent && b instanceof AbstractColliderComponent) {
        return a.checkCollisionWith(b);
      }
      console.warn("INTERNAL_ERROR:At least one object is not an collider component:", a, b);
      return false;
    }
  };
  CollisionSystem.instance = void 0;

  // src/common/GameObject.js
  var GameObject = class _GameObject {
    /**
     * Creates a new GameObject.
     * @param {number|Vector2} [x=0] - The initial x-coordinate or Vector2 position of the GameObject.
     * @param {number} [y=0] - The initial y-coordinate of the GameObject (ignored if x is Vector2).
     */
    constructor(x = 0, y = 0) {
      if (x instanceof Vector2) {
        this.position = x.clone();
      } else {
        this.position = new Vector2(x, y);
      }
      this.rotation = 0;
      this.components = [];
      this.children = [];
      this.parent = null;
      this.name = "";
      this.tags = /* @__PURE__ */ new Set();
      this.paused = false;
      this.layer = "default";
      this.zIndex = 0;
    }
    /**
     * Adds a component to the GameObject.
     * The component must be an instance of Component.
     * If a component of the same type already exists, it will throw an error.
     * @param {Component} component - The component to add.
     * @throws {Error} If the component is not an instance of Component or if a component of the same type already exists.
     */
    addComponent(component) {
      if (!(component instanceof Component)) {
        throw new Error('addComponent: property "component" must be an instance of Component');
      }
      const existing = this.getComponent(component.constructor);
      if (existing) throw new Error(`Component of type ${component.constructor.name} already exists on this GameObject.`);
      component.gameObject = this;
      this.components.push(component);
      return component;
    }
    /**
     * Adds multiple components to the GameObject at once.
     * Each component must be an instance of Component.
     * If any component of the same type already exists, it will throw an error.
     * This is a convenience method for adding multiple components efficiently.
     * 
     * @param {Component[]} components - Array of components to add
     * @returns {Component[]} Array of added components for chaining
     * @throws {Error} If any component is not an instance of Component
     * @throws {Error} If any component of the same type already exists
     * 
     * @example
     * // Add multiple components at once
     * const obj = new GameObject();
     * obj.addComponents([
     *     new SpriteRendererComponent("player"),
     *     new RigidbodyComponent(),
     *     new BoxColliderComponent(32, 48)
     * ]);
     * 
     * @example
     * // With method chaining
     * const components = obj.addComponents([
     *     SpriteRendererComponent.meta({ spriteName: "enemy", width: 64 }),
     *     new CircleColliderComponent(20)
     * ]);
     */
    addComponents(components) {
      if (!Array.isArray(components)) {
        throw new Error('addComponents: property "components" must be an array of Component instances');
      }
      for (const component of components) {
        if (!(component instanceof Component)) {
          throw new Error("addComponents: all items must be instances of Component");
        }
        const existing = this.getComponent(component.constructor);
        if (existing) {
          throw new Error(`Component of type ${component.constructor.name} already exists on this GameObject.`);
        }
      }
      const addedComponents = [];
      for (const component of components) {
        component.gameObject = this;
        this.components.push(component);
        addedComponents.push(component);
      }
      return addedComponents;
    }
    /**
     * Retrieves a component of the specified type from the GameObject.
     * @param {Function} type - The class of the component to retrieve.
     * @returns {Component|null} The component if found, otherwise null.
     * @throws {Error} If the type is not a class.
     */
    getComponent(type) {
      if (typeof type !== "function" || !type.prototype) {
        throw new Error('getComponent: property "type" must be a class');
      }
      return this.components.find((c) => c instanceof type);
    }
    /**
     * Checks if the GameObject has a component of the specified type.
     * @param {Function} type - The class of the component to check.
     * @return {boolean} True if the component exists, otherwise false.
     * @throws {Error} If the type is not a class.
     */
    hasComponent(type) {
      if (typeof type !== "function" || !type.prototype) {
        throw new Error('hasComponent: property "type" must be a class');
      }
      return !!this.getComponent(type);
    }
    /**
     * Removes a component of the specified type from the GameObject.
     * If the component is found, it will be destroyed if it has a destroy method.
     * @param {Function} type - The class of the component to remove.
     * @throws {Error} If the type is not a class.
     */
    removeComponent(type) {
      const index = this.components.findIndex((c) => c instanceof type);
      if (index !== -1) {
        this.components[index].destroy?.();
        this.components.splice(index, 1);
      }
    }
    // TODO: ADD ALL THE CHILD OPTIONS
    getComponentInChildren(type) {
      if (typeof type !== "function" || !type.prototype) {
        throw new Error('hasComponent: property "type" must be a class');
      }
      return this.children.find((c) => c.hasComponent(type)).getComponent(type);
    }
    /**
     * Checks if the GameObject has a specific tag.
     * @param {string} tag - The tag to check.
     * @return {boolean} True if the tag exists, otherwise false.
     */
    hasTag(tag) {
      return this.tags.has(tag);
    }
    /**
     * Adds a tag to the GameObject.
     * If the tag already exists, it will not be added again.
     * @param {string} tag - The tag to add.
     */
    addTag(tag) {
      this.tags.add(tag);
    }
    __addChild(child) {
      if (!(child instanceof _GameObject)) {
        throw new Error(`Nity2D: method 'addChild' only accepts GameObject, '${typeof child}' provided`);
      }
      this.children.push(child);
      child.parent = this;
    }
    addChild(child) {
      Instantiate.create(child, {
        // Don't override the child's position - keep it relative to parent
        parent: this,
        addToScene: true
      });
    }
    addChildren(children) {
      if (!Array.isArray(children)) throw new Error(`Nity2D: method 'addChildren' only accepts array '${typeof children}' provided`);
      children.forEach((child) => this.addChild(child));
    }
    /**
     * Removes a child GameObject from this GameObject.
     * If the child is not found, it will not throw an error.
     * @param {GameObject} child - The child GameObject to remove.
     */
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        child.parent = null;
        this.children.splice(index, 1);
      }
    }
    /**
     * Gets the global position of the GameObject as a Vector2.
     * @returns {Vector2} The global position of the GameObject.
     */
    getGlobalPosition() {
      if (this.parent) {
        return this.position.add(this.parent.getGlobalPosition());
      }
      return this.position.clone();
    }
    /**
     * Gets the global rotation of the GameObject in radians.
     * If the GameObject has a parent, it will add the parent's global rotation to its own rotation.
     * @returns {number} The global rotation of the GameObject in radians.
     */
    getGlobalRotation() {
      if (this.parent) {
        return this.rotation + this.parent.getGlobalRotation();
      }
      return this.rotation;
    }
    /**
     * Sets the position of the GameObject.
     * @param {number|Vector2} x - The new x-coordinate of the GameObject or Vector2 position.
     * @param {number} [y] - The new y-coordinate of the GameObject (ignored if x is Vector2).
     */
    setPosition(x, y) {
      if (x instanceof Vector2) {
        this.position.set(x.x, x.y);
      } else {
        this.position.set(x, y);
      }
    }
    /**
     * Sets the rotation of the GameObject.
     * @param {number} radians - The new rotation in radians.
     */
    setRotation(radians) {
      this.rotation = radians;
    }
    /**
     * Sets the rotation of the GameObject in degrees.
     * @param {number} degrees - The new rotation in degrees.
     */
    setRotationDegrees(degrees) {
      this.rotation = degrees * (Math.PI / 180);
    }
    /**
     * Gets the rotation of the GameObject in degrees.
     * @returns {number} The rotation in degrees.
     */
    getRotationDegrees() {
      return this.rotation * (180 / Math.PI);
    }
    /**
     * Gets the global rotation of the GameObject in degrees.
     * @returns {number} The global rotation in degrees.
     */
    getGlobalRotationDegrees() {
      return this.getGlobalRotation() * (180 / Math.PI);
    }
    /**
     * Rotates the GameObject by the given amount.
     * @param {number} radians - The rotation amount in radians to add.
     */
    rotate(radians) {
      this.rotation += radians;
    }
    /**
     * Rotates the GameObject by the given amount in degrees.
     * @param {number} degrees - The rotation amount in degrees to add.
     */
    rotateDegrees(degrees) {
      this.rotation += degrees * (Math.PI / 180);
    }
    /**
     * Translates the GameObject by the given offset.
     * @param {number|Vector2} x - The x offset or Vector2 offset.
     * @param {number} [y] - The y offset (ignored if x is Vector2).
     */
    translate(x, y) {
      if (x instanceof Vector2) {
        this.position = this.position.add(x);
      } else {
        this.position = this.position.add(new Vector2(x, y));
      }
    }
    async preload() {
      const promises = this.components.map((c) => c.preload?.());
      for (const child of this.children) {
        promises.push(child.preload?.());
      }
      await Promise.all(promises);
    }
    start() {
      for (const c of this.components) {
        if (c.enabled && typeof c.start === "function") c.start();
      }
      for (const child of this.children) {
        child.start();
      }
    }
    /** * Updates the GameObject and its components.
     * This method will call the update method of each
     * component that is enabled.
     * It will also recursively call the update method of each child GameObject.
     */
    update() {
      if (this.paused) return;
      for (const c of this.components) {
        if (c.enabled && typeof c.update === "function") c.update();
      }
      for (const child of this.children) {
        child.update();
      }
    }
    /** * Updates the GameObject and its components in the late update phase.
     * This method will call the lateUpdate method of each
     * component that is enabled.
     * It will also recursively call the lateUpdate method of each child GameObject.
     */
    lateUpdate() {
      if (this.paused) return;
      for (const c of this.components) {
        if (c.enabled && typeof c.lateUpdate === "function") c.lateUpdate();
      }
      for (const child of this.children) {
        child.lateUpdate();
      }
    }
    /** * Handles collision events for the GameObject.
     * This method will call the onCollisionEnter, onCollisionStay, and onCollisionExit methods
     * of each component that is enabled.
     * It will also recursively call these methods for each child GameObject.
     * @param {Object} other - The other GameObject involved in the collision.
     */
    onCollisionEnter(other) {
      for (const comp of this.components) {
        if (typeof comp.onCollisionEnter === "function") {
          comp.onCollisionEnter(other);
        }
      }
    }
    /** * Handles collision stay events for the GameObject.
     * This method will call the onCollisionStay method of each
     * component that is enabled.
     * It will also recursively call this method for each child GameObject.
     * @param {Object} other - The other GameObject involved in the collision.
     */
    onCollisionStay(other) {
      for (const comp of this.components) {
        if (typeof comp.onCollisionStay === "function") {
          comp.onCollisionStay(other);
        }
      }
    }
    /** * Handles collision exit events for the GameObject.
     * This method will call the onCollisionExit method of each
     * component that is enabled.
     * It will also recursively call this method for each child GameObject.
     * @param {Object} other - The other GameObject involved in the collision.
     */
    onCollisionExit(other) {
      for (const comp of this.components) {
        if (typeof comp.onCollisionExit === "function") {
          comp.onCollisionExit(other);
        }
      }
    }
    /** * Draws the GameObject and its components on the canvas.
     * This method will call the draw method of each component that is enabled.
     * It will also recursively call the draw method of each child GameObject.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    __draw(ctx) {
      if (this.paused) return;
      for (const c of this.components) {
        c.__draw(ctx);
      }
      for (const child of this.children) {
        child.__draw(ctx);
      }
    }
  };

  // src/core/Instantiate.js
  var Instantiate = class _Instantiate {
    /**
     * Creates a new GameObject instance and automatically registers its components.
     * @param {GameObject|Function} prefab - GameObject instance or class constructor
     * @param {Object} options - Instantiation options
     * @param {number} [options.x=0] - X position
     * @param {number} [options.y=0] - Y position
     * @param {GameObject} [options.parent=null] - Parent GameObject
     * @param {boolean} [options.addToScene=true] - Whether to add to current scene
     * @param {...any} args - Additional arguments for constructor if prefab is a class
     * @returns {GameObject} The instantiated GameObject
     */
    static create(prefab, options = {}, ...args) {
      const {
        x,
        y,
        parent = null,
        addToScene = true
      } = options;
      let gameObject;
      if (typeof prefab === "function") {
        gameObject = new prefab(x ?? 0, y ?? 0, ...args);
      } else if (prefab instanceof GameObject) {
        gameObject = prefab;
        if (x !== void 0) gameObject.x = x;
        if (y !== void 0) gameObject.y = y;
      } else {
        throw new Error("Instantiate.create: prefab must be a GameObject instance or constructor function");
      }
      if (parent) {
        if (!(parent instanceof GameObject)) {
          throw new Error("Instantiate.create: parent must be a GameObject instance");
        }
        parent.__addChild(gameObject);
      }
      if (addToScene && !parent && Game.instance?.scene) {
        Game.instance.scene.__addObjectToScene(gameObject);
        if (Game.instance.hasLayerSystem()) {
          const layerName = gameObject.layer || Game.instance.getDefaultLayer();
          Game.instance.addToLayer(layerName, gameObject);
        }
      }
      _Instantiate._registerGameObject(gameObject);
      return gameObject;
    }
    /**
     * Recursively registers a GameObject and all its components and children.
     * @param {GameObject} gameObject - The GameObject to register
     * @private
     */
    static _registerGameObject(gameObject) {
      for (const component of gameObject.components) {
        _Instantiate._registerComponent(component);
      }
      for (const child of gameObject.children) {
        _Instantiate._registerGameObject(child);
      }
    }
    /**
     * Registers a component with appropriate systems.
     * @param {Component} component - The component to register
     * @private
     */
    static _registerComponent(component) {
      if (component instanceof AbstractColliderComponent) {
        if (CollisionSystem.instance) {
          CollisionSystem.instance.register(component);
        } else {
          console.warn("CollisionSystem not initialized. Collider will be registered when system is available:", component);
          if (!_Instantiate._pendingColliders) {
            _Instantiate._pendingColliders = [];
          }
          _Instantiate._pendingColliders.push(component);
        }
      }
      if (typeof component.start === "function") {
        component.start();
      }
    }
    /**
     * Registers any pending colliders that were waiting for CollisionSystem initialization.
     * This should be called after CollisionSystem is created.
     */
    static registerPendingColliders() {
      if (_Instantiate._pendingColliders && CollisionSystem.instance) {
        for (const collider of _Instantiate._pendingColliders) {
          CollisionSystem.instance.register(collider);
        }
        _Instantiate._pendingColliders = [];
      }
    }
    /**
     * Destroys a GameObject and unregisters all its components.
     * @param {GameObject} gameObject - The GameObject to destroy
     */
    static destroy(gameObject) {
      if (!(gameObject instanceof GameObject)) {
        throw new Error("Instantiate.destroy: gameObject must be a GameObject instance");
      }
      for (const child of [...gameObject.children]) {
        _Instantiate.destroy(child);
      }
      for (const component of gameObject.components) {
        _Instantiate._unregisterComponent(component);
      }
      if (gameObject.parent) {
        gameObject.parent.removeChild(gameObject);
      }
      if (Game.instance?.scene) {
        const index = Game.instance.scene.objects.indexOf(gameObject);
        if (index !== -1) {
          Game.instance.scene.objects.splice(index, 1);
        }
      }
    }
    /**
     * Unregisters a component from appropriate systems.
     * @param {Component} component - The component to unregister
     * @private
     */
    static _unregisterComponent(component) {
      if (component instanceof AbstractColliderComponent) {
        if (CollisionSystem.instance) {
          CollisionSystem.instance.unregister(component);
        }
      }
      if (typeof component.destroy === "function") {
        component.destroy();
      }
    }
    /**
     * Clones a GameObject and all its components and children.
     * @param {GameObject} original - The GameObject to clone
     * @param {Object} options - Cloning options (same as create options)
     * @returns {GameObject} The cloned GameObject
     */
    static clone(original, options = {}) {
      if (!(original instanceof GameObject)) {
        throw new Error("Instantiate.clone: original must be a GameObject instance");
      }
      const clone = new GameObject(original.x, original.y);
      clone.name = original.name;
      clone.tags = new Set(original.tags);
      for (const component of original.components) {
        const ComponentClass = component.constructor;
        const newComponent = new ComponentClass();
        for (const key in component) {
          if (component.hasOwnProperty(key) && key !== "gameObject") {
            newComponent[key] = component[key];
          }
        }
        clone.addComponent(newComponent);
      }
      for (const child of original.children) {
        const childClone = _Instantiate.clone(child, { addToScene: false });
        clone.__addChild(childClone);
      }
      const {
        x = clone.x,
        y = clone.y,
        parent = null,
        addToScene = true
      } = options;
      clone.x = x;
      clone.y = y;
      if (parent) {
        parent.__addChild(clone);
      }
      if (addToScene && !parent && Game.instance?.scene) {
        Game.instance.scene.__addObjectToScene(clone);
      }
      _Instantiate._registerGameObject(clone);
      return clone;
    }
  };

  // src/core/Time.js
  var Time = class {
    static #startTime = performance.now();
    static #lastFrameTime = performance.now();
    static #frameCount = 0;
    static #fpsUpdateInterval = 1e3;
    // Update FPS every second
    static #lastFpsUpdate = performance.now();
    static #currentFps = 60;
    static #timeScale = 1;
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
      return (performance.now() - this.#startTime) / 1e3 * this.#timeScale;
    }
    /**
     * The unscaled time at the beginning of this frame in seconds since the game started.
     * This is not affected by timeScale.
     * 
     * @returns {number} The current real time in seconds
     */
    static get unscaledTime() {
      return (performance.now() - this.#startTime) / 1e3;
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
      this.#timeScale = Math.max(0, value);
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
      if (currentTime - this.#lastFpsUpdate >= this.#fpsUpdateInterval) {
        const deltaTime = currentTime - this.#lastFpsUpdate;
        const framesPassed = this.#frameCount - (this.#lastFpsUpdate === performance.now() ? 0 : Math.floor(deltaTime / 16.67));
        this.#currentFps = Math.round(1e3 / (deltaTime / framesPassed)) || 60;
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
      return seconds * 1e3;
    }
    /**
     * Converts milliseconds to seconds.
     * 
     * @param {number} milliseconds - Time in milliseconds
     * @returns {number} Time in seconds
     */
    static millisecondsToSeconds(milliseconds) {
      return milliseconds / 1e3;
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
      this.#timeScale = 1;
    }
  };

  // src/core/Destroy.js
  var _pendingDestructions = [];
  function Destroy(target, delay = 0) {
    if (delay <= 0) {
      _destroyImmediate(target);
    } else {
      const destructionTime = performance.now() + delay * 1e3;
      _pendingDestructions.push({
        target,
        time: destructionTime
      });
    }
  }
  function DestroyComponent(gameObject, componentType) {
    if (!gameObject || !gameObject.components) {
      console.warn("DestroyComponent: Invalid GameObject provided");
      return;
    }
    const component = gameObject.getComponent(componentType);
    if (component) {
      if (typeof component.destroy === "function") {
        component.destroy();
      }
      gameObject.removeComponent(componentType);
      console.log(`DestroyComponent: Removed ${componentType.name} from ${gameObject.name || "GameObject"}`);
    } else {
      console.warn(`DestroyComponent: Component ${componentType.name} not found on GameObject`);
    }
  }
  function DestroyAll() {
    const game = Game.instance;
    if (!game || !game.currentScene) {
      console.warn("DestroyAll: No active scene found");
      return;
    }
    const objectsToDestroy = [...game.currentScene.objects];
    objectsToDestroy.forEach((obj) => _destroyImmediate(obj));
    console.log(`DestroyAll: Destroyed ${objectsToDestroy.length} GameObjects`);
  }
  function _destroyImmediate(target) {
    if (!target) {
      console.warn("Destroy: Cannot destroy null or undefined target");
      return;
    }
    if (target.components && Array.isArray(target.components) && target.position) {
      _destroyGameObject(target);
    } else if (target.gameObject) {
      _destroyComponent(target);
    } else {
      console.warn("Destroy: Unknown target type, cannot destroy", target);
      console.warn("Target properties:", Object.keys(target));
    }
  }
  function _destroyGameObject(gameObject) {
    const game = Game.instance;
    if (!game || !game.currentScene) {
      console.warn("Destroy: No active scene found for GameObject destruction");
      return;
    }
    game.currentScene.remove(gameObject);
    console.log(`Destroy: Destroyed GameObject "${gameObject.name || "Unnamed"}"`);
  }
  function _destroyComponent(component) {
    if (!component.gameObject) {
      console.warn("Destroy: Component has no associated GameObject");
      return;
    }
    if (typeof component.destroy === "function") {
      component.destroy();
    }
    const componentType = component.constructor;
    component.gameObject.removeComponent(componentType);
    console.log(`Destroy: Destroyed Component ${componentType.name}`);
  }
  function _processPendingDestructions() {
    const currentTime = performance.now();
    const toDestroy = [];
    for (let i = _pendingDestructions.length - 1; i >= 0; i--) {
      const pending = _pendingDestructions[i];
      if (currentTime >= pending.time) {
        toDestroy.push(pending.target);
        _pendingDestructions.splice(i, 1);
      }
    }
    toDestroy.forEach((target) => _destroyImmediate(target));
  }
  function getPendingDestructionCount() {
    return _pendingDestructions.length;
  }
  function clearPendingDestructions() {
    _pendingDestructions = [];
  }

  // src/core/LayerManager.js
  var LayerManager = class {
    /**
     * Create a new internal layer manager with single canvas output
     * @param {HTMLCanvasElement} mainCanvas - Single visible canvas for output
     * @param {Object} config - Layer configuration
     * @param {string[]} [config.layers=['background', 'default', 'ui']] - Array of layer names in rendering order (back to front)
     * @param {string} [config.defaultLayer='default'] - Default layer name for GameObjects without specified layer
     * @param {number} [config.width=800] - Layer canvas width
     * @param {number} [config.height=600] - Layer canvas height
     */
    constructor(mainCanvas, config = {}) {
      this.mainCanvas = mainCanvas;
      this.mainCtx = mainCanvas.getContext("2d");
      this.config = {
        layers: config.layers || ["background", "default", "ui"],
        defaultLayer: config.defaultLayer || "default",
        width: config.width || mainCanvas.width || 800,
        height: config.height || mainCanvas.height || 600,
        ...config
      };
      this.layers = /* @__PURE__ */ new Map();
      this.layerContexts = /* @__PURE__ */ new Map();
      this.layerContents = /* @__PURE__ */ new Map();
      this.dirtyLayers = /* @__PURE__ */ new Set();
      this.layerOrder = [...this.config.layers];
      this.layerZIndex = /* @__PURE__ */ new Map();
      this.initializeLayers();
    }
    /**
     * Initialize all internal OffscreenCanvas layers
     * @private
     */
    initializeLayers() {
      this.config.layers.forEach((layerName, index) => {
        const canvas = new OffscreenCanvas(this.config.width, this.config.height);
        const ctx = canvas.getContext("2d");
        this.layers.set(layerName, canvas);
        this.layerContexts.set(layerName, ctx);
        this.layerContents.set(layerName, []);
        this.layerZIndex.set(layerName, index * 100);
        this.dirtyLayers.add(layerName);
      });
    }
    /**
     * Add content to a specific layer
     * @param {string} layerName - Name of the layer
     * @param {Object} object - Object to add (GameObject, Component, or renderable object)
     */
    addToLayer(layerName, object) {
      if (!this.layers.has(layerName)) {
        console.warn(`LayerManager: Layer "${layerName}" does not exist`);
        return;
      }
      const layerContents = this.layerContents.get(layerName);
      if (!layerContents.includes(object)) {
        layerContents.push(object);
        if (object.layer !== void 0) {
          object.layer = layerName;
        }
        this.markLayerDirty(layerName);
      }
    }
    /**
     * Remove content from a layer
     * @param {string} layerName - Name of the layer
     * @param {Object} object - Object to remove
     */
    removeFromLayer(layerName, object) {
      if (!this.layers.has(layerName)) return;
      const layerContents = this.layerContents.get(layerName);
      const index = layerContents.indexOf(object);
      if (index !== -1) {
        layerContents.splice(index, 1);
        this.markLayerDirty(layerName);
      }
    }
    /**
     * Mark a layer as needing redraw
     * @param {string} layerName - Layer to mark dirty
     */
    markLayerDirty(layerName) {
      this.dirtyLayers.add(layerName);
    }
    /**
     * Mark all layers as dirty (force full redraw)
     */
    markAllLayersDirty() {
      this.config.layers.forEach((layerName) => {
        this.dirtyLayers.add(layerName);
      });
    }
    /**
     * Render a specific layer to its OffscreenCanvas
     * @param {string} layerName - Layer to render
     * @private
     */
    renderLayer(layerName) {
      if (!this.dirtyLayers.has(layerName)) return;
      const ctx = this.layerContexts.get(layerName);
      const contents = this.layerContents.get(layerName);
      if (!ctx || !contents) return;
      ctx.clearRect(0, 0, this.config.width, this.config.height);
      const sortedContents = contents.slice().sort((a, b) => {
        const aZ = a.zIndex || 0;
        const bZ = b.zIndex || 0;
        return aZ - bZ;
      });
      sortedContents.forEach((object) => {
        if (object.active === false) return;
        ctx.save();
        if (typeof object.__draw === "function") {
          object.__draw(ctx);
        } else if (typeof object.draw === "function") {
          object.draw(ctx);
        }
        ctx.restore();
      });
      this.dirtyLayers.delete(layerName);
    }
    /**
     * Main render method - composites all layers to the single main canvas
     */
    render() {
      this.layerOrder.forEach((layerName) => {
        if (this.dirtyLayers.has(layerName)) {
          this.renderLayer(layerName);
        }
      });
      this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
      this.layerOrder.forEach((layerName) => {
        const layerCanvas = this.layers.get(layerName);
        if (layerCanvas) {
          this.mainCtx.drawImage(layerCanvas, 0, 0);
        }
      });
    }
    /**
     * Get layer z-index for sorting
     * @param {string} layerName - Layer name
     * @returns {number} Z-index value
     */
    getLayerZIndex(layerName) {
      return this.layerZIndex.get(layerName) || 0;
    }
    /**
     * Set layer z-index and reorder layers
     * @param {string} layerName - Layer name
     * @param {number} zIndex - New z-index
     */
    setLayerZIndex(layerName, zIndex) {
      this.layerZIndex.set(layerName, zIndex);
      this.layerOrder.sort((a, b) => this.getLayerZIndex(a) - this.getLayerZIndex(b));
    }
    /**
     * Get the default layer name
     * @returns {string} Default layer name
     */
    getDefaultLayer() {
      return this.config.defaultLayer;
    }
    /**
     * Clear a specific layer
     * @param {string} layerName - Layer to clear
     */
    clearLayer(layerName) {
      if (!this.layerContents.has(layerName)) return;
      this.layerContents.set(layerName, []);
      this.markLayerDirty(layerName);
    }
    /**
     * Clear all layers
     */
    clearAllLayers() {
      this.layerOrder.forEach((layerName) => {
        this.clearLayer(layerName);
      });
    }
    /**
     * Resize all layers and main canvas
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
      this.config.width = width;
      this.config.height = height;
      this.mainCanvas.width = width;
      this.mainCanvas.height = height;
      this.layers.forEach((canvas, layerName) => {
        const newCanvas = new OffscreenCanvas(width, height);
        const newCtx = newCanvas.getContext("2d");
        this.layers.set(layerName, newCanvas);
        this.layerContexts.set(layerName, newCtx);
        this.markLayerDirty(layerName);
      });
    }
    /**
     * Get objects on a specific layer
     * @param {string} layerName - Layer name
     * @returns {Array} Array of objects on the layer
     */
    getLayerContents(layerName) {
      return this.layerContents.get(layerName) || [];
    }
    /**
     * Check if a layer exists
     * @param {string} layerName - Layer name to check
     * @returns {boolean} True if layer exists
     */
    hasLayer(layerName) {
      return this.layers.has(layerName);
    }
    /**
     * Add a new layer at runtime
     * @param {string} layerName - Name of new layer
     * @param {number} [zIndex] - Z-index for layer ordering
     */
    addLayer(layerName, zIndex) {
      if (this.hasLayer(layerName)) {
        console.warn(`LayerManager: Layer "${layerName}" already exists`);
        return;
      }
      const canvas = new OffscreenCanvas(this.config.width, this.config.height);
      const ctx = canvas.getContext("2d");
      this.layers.set(layerName, canvas);
      this.layerContexts.set(layerName, ctx);
      this.layerContents.set(layerName, []);
      const finalZIndex = zIndex !== void 0 ? zIndex : this.layerOrder.length * 100;
      this.layerZIndex.set(layerName, finalZIndex);
      this.layerOrder.push(layerName);
      this.layerOrder.sort((a, b) => this.getLayerZIndex(a) - this.getLayerZIndex(b));
      this.markLayerDirty(layerName);
    }
    /**
     * Remove a layer
     * @param {string} layerName - Layer to remove
     */
    removeLayer(layerName) {
      if (!this.hasLayer(layerName)) return;
      this.layers.delete(layerName);
      this.layerContexts.delete(layerName);
      this.layerContents.delete(layerName);
      this.layerZIndex.delete(layerName);
      this.dirtyLayers.delete(layerName);
      const index = this.layerOrder.indexOf(layerName);
      if (index !== -1) {
        this.layerOrder.splice(index, 1);
      }
    }
    /**
     * Get memory usage statistics
     * @returns {Object} Memory usage info
     */
    getMemoryStats() {
      const layerCount = this.layers.size;
      const totalObjects = Array.from(this.layerContents.values()).reduce((total, contents) => total + contents.length, 0);
      const memoryPerLayer = this.config.width * this.config.height * 4;
      const totalMemory = layerCount * memoryPerLayer;
      return {
        layers: layerCount,
        objects: totalObjects,
        memoryMB: (totalMemory / (1024 * 1024)).toFixed(2),
        dirtyLayers: this.dirtyLayers.size,
        canvasElements: 1
        // Only main canvas in DOM
      };
    }
    /**
     * Debug info for development
     * @returns {string} Debug information
     */
    getDebugInfo() {
      const stats = this.getMemoryStats();
      return `LayerManager: ${stats.layers} internal layers, ${stats.objects} objects, ${stats.memoryMB}MB memory, ${stats.dirtyLayers} dirty layers, 1 DOM canvas`;
    }
  };

  // src/core/Game.js
  var Game = class _Game {
    #_forcedpaused = false;
    #_initialized = false;
    #_launching = false;
    // Flag to prevent multiple launches
    #_lastTime = 0;
    // For tracking the last frame time
    constructor(canvas) {
      _Game.instance = this;
      if (canvas != null) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Game constructor requires a valid HTMLCanvasElement.");
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      this.scene = null;
      this.mainCamera = null;
      this.layerManager = null;
      this.useLayerSystem = false;
      this.paused = false;
      this._internalGizmos = false;
      this._debugMode = false;
      this._deltaTime = 0;
      new CollisionSystem();
      Instantiate.registerPendingColliders();
    }
    configure(options = { canvas: null, mainCamera: null, debug: false, layers: null, defaultLayer: null, useLayerSystem: false }) {
      if (this.#_initialized || this.#_launching) {
        console.warn("Game is already initialized. Configuration changes will not take effect.");
        return;
      }
      if (options.canvas) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
      }
      if (options.mainCamera) this.mainCamera = options.mainCamera;
      if (options.debug) this.#_debugMode();
      if (options.useLayerSystem && this.canvas) {
        this.useLayerSystem = true;
        const layerConfig = {
          layers: options.layers || ["background", "default", "ui"],
          defaultLayer: options.defaultLayer || "default",
          width: this.canvas.width,
          height: this.canvas.height
        };
        this.layerManager = new LayerManager(this.canvas, layerConfig);
        console.log("LayerManager initialized with layers:", layerConfig.layers);
        console.log("Default layer:", layerConfig.defaultLayer);
      }
    }
    launch(scene) {
      if (!scene && !this.scene) throw new Error("No scene provided.");
      if (this.#_launching) {
        console.warn("Game is already launching or has been launched.");
        return;
      } else this.#_launching = true;
      if (!scene && !this.scene) throw new Error("No scene assigned to game.");
      this.#_initCanvas();
      this.#_launch(scene || this.scene);
    }
    async loadScene(scene) {
      if (!scene) throw new Error("No scene provided.");
      if (!this.#_initialized && !this.#_launching) {
        await this.#_loadScene(scene);
        return;
      }
      this.#_launch(scene);
    }
    pause() {
      this.paused = true;
    }
    resume() {
      this.paused = false;
    }
    async #_launch(scene) {
      await this.#_loadScene(scene);
      this.#_start();
    }
    #_start() {
      Time._reset();
      Input.initialize(this.canvas);
      this.#_initEventListeners();
      requestAnimationFrame(this.#_loop.bind(this));
    }
    #_loop(timestamp) {
      this._deltaTime = (timestamp - this.#_lastTime) / 1e3;
      if (this._deltaTime > 0.1) this._deltaTime = 0.1;
      this.#_lastTime = timestamp;
      Time._updateTimeStats();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.#_forcedpaused) {
        if (!this.paused) {
          Input.update();
          this.scene.__update();
          if (this.mainCamera) {
            const cam = this.mainCamera.getComponent(CameraComponent);
            if (cam) cam.applyTransform(this.ctx);
          }
        }
        this.scene.__lateUpdate();
        _processPendingDestructions();
        if (this.useLayerSystem && this.layerManager) {
          this.layerManager.render();
        } else {
          this.scene.__draw(this.ctx);
        }
      }
      requestAnimationFrame(this.#_loop.bind(this));
    }
    async #_loadScene(scene) {
      if (!scene) throw new Error("No scene provided.");
      this.scene = scene;
      this.currentScene = scene;
      await Promise.all([
        SpriteRegistry.preloadAll(),
        AudioRegistry.preloadAll()
      ]);
      await this.scene.preload();
      await this.scene.start();
    }
    #_forcedPause() {
      if (this.#_forcedpaused === true) return;
      this.#_forcedpaused = true;
      console.log("Game fullscale pause");
    }
    #_forcedResume() {
      if (this.#_forcedpaused === false) return;
      this.#_forcedpaused = false;
      this.#_lastTime = performance.now();
      console.log("Game fullscale resume");
    }
    #_initEventListeners() {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.#_forcedPause();
        } else {
          this.#_forcedResume();
        }
      });
    }
    #_initCanvas() {
      if (!this.canvas) {
        console.warn("No canvas element provided.");
        return;
      }
      if (!this.ctx) {
        console.error("Failed to get 2D context from canvas.");
      }
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      if (this.useLayerSystem && !this.layerManager) {
        const layerConfig = {
          layers: ["background", "environment", "gameplay", "effects", "ui"],
          width: this.canvas.width,
          height: this.canvas.height
        };
        this.layerManager = new LayerManager(this.canvas, layerConfig);
        console.log("LayerManager initialized in _initCanvas with default layers");
      }
    }
    #_debugMode() {
      this._debugMode = true;
      this._internalGizmos = true;
    }
    /**
     * Add a GameObject to a specific layer (only works when layer system is enabled)
     * @param {string} layerName - Name of the layer
     * @param {GameObject} gameObject - GameObject to add to the layer
     */
    addToLayer(layerName, gameObject) {
      if (!this.useLayerSystem || !this.layerManager) {
        console.warn("LayerManager not enabled. Use configure({ useLayerSystem: true }) to enable layers.");
        return;
      }
      this.layerManager.addToLayer(layerName, gameObject);
    }
    /**
     * Remove a GameObject from a layer
     * @param {string} layerName - Name of the layer
     * @param {GameObject} gameObject - GameObject to remove from the layer
     */
    removeFromLayer(layerName, gameObject) {
      if (!this.useLayerSystem || !this.layerManager) {
        console.warn("LayerManager not enabled.");
        return;
      }
      this.layerManager.removeFromLayer(layerName, gameObject);
    }
    /**
     * Get access to the LayerManager instance
     * @returns {LayerManager|null} The LayerManager instance or null if not enabled
     */
    getLayerManager() {
      return this.layerManager;
    }
    /**
     * Check if layer system is enabled
     * @returns {boolean} True if layer system is enabled
     */
    hasLayerSystem() {
      return this.useLayerSystem && this.layerManager !== null;
    }
    /**
     * Gets the default layer name.
     * @returns {string} The default layer name, or 'default' if no layer system is active.
     */
    getDefaultLayer() {
      return this.layerManager ? this.layerManager.getDefaultLayer() : "default";
    }
  };
  Game.instance = null;

  // src/animations/SpriteAnimationClip.js
  var SpriteAnimationClip = class _SpriteAnimationClip {
    /**
     * Creates a new SpriteAnimationClip.
     * 
     * @param {string} name - Unique identifier for the animation clip
     * @param {string[]} [spriteNames=[]] - Array of sprite names that make up the animation sequence
     * @param {number} [fps=10] - Frames per second for the animation playback
     * @param {boolean} [loop=true] - Whether the animation should loop when it reaches the end
     */
    constructor(name, spriteNames = [], fps = 10, loop = true) {
      this.name = name;
      this.spriteNames = spriteNames;
      this.fps = fps;
      this.loop = loop;
    }
    /**
     * Creates a SpriteAnimationClip from metadata configuration.
     * 
     * @param {Object} metadata - Configuration object for the animation clip
     * @param {string} metadata.name - Unique identifier for the animation clip
     * @param {string[]} [metadata.spriteNames=[]] - Array of sprite names that make up the animation sequence
     * @param {number} [metadata.fps=10] - Frames per second for the animation playback
     * @param {boolean} [metadata.loop=true] - Whether the animation should loop when it reaches the end
     * @returns {SpriteAnimationClip} New SpriteAnimationClip instance
     * 
     * @example
     * const walkClip = SpriteAnimationClip.meta({
     *     name: "walk",
     *     spriteNames: ["walk_0", "walk_1", "walk_2", "walk_3"],
     *     fps: 8,
     *     loop: true
     * });
     */
    static meta(metadata = {}) {
      const defaults = this.getDefaultMeta();
      const config = { ...defaults, ...metadata };
      this.validateMeta(config);
      return new this(
        config.name,
        config.spriteNames,
        config.fps,
        config.loop
      );
    }
    /**
     * Returns the default metadata configuration for SpriteAnimationClip.
     * 
     * @returns {Object} Default metadata object
     */
    static getDefaultMeta() {
      return {
        name: "",
        spriteNames: [],
        fps: 10,
        loop: true
      };
    }
    /**
     * Validates metadata configuration for SpriteAnimationClip.
     * 
     * @param {Object} metadata - Metadata to validate
     * @throws {Error} If metadata is invalid
     */
    static validateMeta(metadata) {
      if (typeof metadata.name !== "string") {
        throw new Error("SpriteAnimationClip metadata: name must be a string");
      }
      if (metadata.name.trim() === "") {
        throw new Error("SpriteAnimationClip metadata: name cannot be empty");
      }
      if (!Array.isArray(metadata.spriteNames)) {
        throw new Error("SpriteAnimationClip metadata: spriteNames must be an array");
      }
      if (metadata.spriteNames.some((name) => typeof name !== "string")) {
        throw new Error("SpriteAnimationClip metadata: all spriteNames must be strings");
      }
      if (typeof metadata.fps !== "number" || metadata.fps <= 0) {
        throw new Error("SpriteAnimationClip metadata: fps must be a positive number");
      }
      if (typeof metadata.loop !== "boolean") {
        throw new Error("SpriteAnimationClip metadata: loop must be a boolean");
      }
    }
    /**
     * Applies metadata to this SpriteAnimationClip instance.
     * 
     * @param {Object} metadata - Metadata to apply
     */
    applyMeta(metadata) {
      const defaults = this.constructor.getDefaultMeta();
      const config = { ...defaults, ...metadata };
      this.constructor.validateMeta(config);
      this.name = config.name;
      this.spriteNames = config.spriteNames;
      this.fps = config.fps;
      this.loop = config.loop;
    }
    /**
     * Converts this SpriteAnimationClip to a metadata object.
     * 
     * @returns {Object} Metadata representation of this clip
     */
    toMeta() {
      return {
        name: this.name,
        spriteNames: [...this.spriteNames],
        // Create a copy
        fps: this.fps,
        loop: this.loop
      };
    }
    /**
     * Creates a copy of this SpriteAnimationClip.
     * 
     * @returns {SpriteAnimationClip} New SpriteAnimationClip instance with the same properties
     */
    clone() {
      return new _SpriteAnimationClip(
        this.name,
        [...this.spriteNames],
        // Create a copy of the array
        this.fps,
        this.loop
      );
    }
  };

  // src/renderer/components/SpriteRendererComponent.js
  var SpriteRendererComponent = class extends Component {
    /**
     * Creates a new SpriteRendererComponent instance.
     * 
     * Initializes the component with a sprite reference and rendering options. The sprite
     * is referenced by key from the SpriteRegistry, supporting both single sprites and
     * spritesheet notation ("sheet:sprite"). All rendering options are optional and will
     * fall back to sensible defaults.
     * 
     * @param {string} spriteName - Unified sprite key for SpriteRegistry lookup
     *                             Format: "spriteName" for single sprites or "sheet:sprite" for spritesheets
     * @param {Object} [options={}] - Rendering configuration options
     * @param {number} [options.width] - Custom width override in pixels (null = use sprite's natural width)
     * @param {number} [options.height] - Custom height override in pixels (null = use sprite's natural height)  
     * @param {number} [options.opacity=1.0] - Sprite transparency/alpha value (0.0 = fully transparent, 1.0 = fully opaque)
     * @param {string} [options.color="#FFFFFF"] - Color tint to apply to sprite (hex "#FF0000" or rgba "rgba(255,0,0,0.5)")
     * @param {boolean} [options.flipX=false] - Horizontally flip the sprite (mirror effect)
     * @param {boolean} [options.flipY=false] - Vertically flip the sprite (upside-down effect)
     * 
     * @throws {Error} Will throw during preload() if the specified sprite is not found in SpriteRegistry
     * 
     * @example
     * // Basic sprite with natural dimensions
     * const basic = new SpriteRendererComponent("player");
     * 
     * @example
     * // Scaled sprite with transparency
     * const scaled = new SpriteRendererComponent("enemy", {
     *     width: 64,
     *     height: 64, 
     *     opacity: 0.7
     * });
     * 
     * @example
     * // Tinted and flipped sprite from spritesheet
     * const advanced = new SpriteRendererComponent("characters:warrior", {
     *     color: "#FF6B6B",
     *     flipX: true,
     *     opacity: 0.9
     * });
     */
    constructor(spriteName, options = {}) {
      super();
      this.spriteKey = spriteName;
      this.sprite = null;
      this.options = {
        width: options.width || null,
        height: options.height || null,
        opacity: options.opacity !== void 0 ? options.opacity : 1,
        color: options.color || "#FFFFFF",
        flipX: options.flipX || false,
        flipY: options.flipY || false
      };
    }
    /**
     * Returns the default metadata configuration for SpriteRendererComponent.
     * 
     * This static method provides the baseline configuration used by the metadata system
     * for creating components declaratively. These defaults ensure consistent behavior
     * across all SpriteRendererComponent instances when properties are not explicitly specified.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.spriteName - Empty string (must be set during creation)
     * @returns {number|null} returns.width - null (use sprite's natural width)
     * @returns {number|null} returns.height - null (use sprite's natural height)  
     * @returns {number} returns.opacity - 1.0 (fully opaque)
     * @returns {string} returns.color - "#FFFFFF" (white, no tinting)
     * @returns {boolean} returns.flipX - false (no horizontal flip)
     * @returns {boolean} returns.flipY - false (no vertical flip)
     * 
     * @example
     * // Get defaults for property panel generation
     * const defaults = SpriteRendererComponent.getDefaultMeta();
     * console.log(defaults.opacity); // 1.0
     * 
     * @example
     * // Use in metadata creation with partial overrides
     * const sprite = SpriteRendererComponent.meta({
     *     ...SpriteRendererComponent.getDefaultMeta(),
     *     spriteName: "player",
     *     opacity: 0.8
     * });
     */
    static getDefaultMeta() {
      return {
        spriteName: "",
        width: null,
        height: null,
        opacity: 1,
        color: "#FFFFFF",
        flipX: false,
        flipY: false
      };
    }
    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor-based creation
     * and the metadata system. It takes constructor arguments and converts them to a
     * standardized metadata object that can be validated and applied consistently.
     * Used internally by the component's metadata system integration.
     * 
     * @private
     * @param {string} spriteName - The sprite key for SpriteRegistry lookup
     * @param {Object} [options={}] - Constructor options object
     * @param {number} [options.width] - Custom width override
     * @param {number} [options.height] - Custom height override
     * @param {number} [options.opacity] - Opacity value (0.0 to 1.0)
     * @param {string} [options.color] - Color tint
     * @param {boolean} [options.flipX] - Horizontal flip state
     * @param {boolean} [options.flipY] - Vertical flip state
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(spriteName, options = {}) {
      const metadata = {
        spriteName: spriteName || "",
        width: options.width || null,
        height: options.height || null,
        opacity: options.opacity !== void 0 ? options.opacity : 1,
        color: options.color || "#FFFFFF",
        flipX: options.flipX || false,
        flipY: options.flipY || false
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      if (this.__meta.spriteName) {
        this.spriteKey = this.__meta.spriteName;
      }
      this.options = {
        width: this.__meta.width,
        height: this.__meta.height,
        opacity: this.__meta.opacity,
        color: this.__meta.color,
        flipX: this.__meta.flipX,
        flipY: this.__meta.flipY
      };
    }
    /**
     * Validates current metadata configuration.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and value ranges. Called automatically when metadata is applied or updated.
     * Provides clear error messages for invalid configurations to aid debugging.
     * Part of the metadata system's type safety and validation infrastructure.
     * 
     * @private
     * @throws {Error} If spriteName is not a string
     * @throws {Error} If width is not null or a positive number
     * @throws {Error} If height is not null or a positive number
     * @throws {Error} If opacity is not between 0 and 1
     * @throws {Error} If color is not a string
     * @throws {Error} If flipX is not a boolean
     * @throws {Error} If flipY is not a boolean
     * 
     * @internal Part of metadata validation system
     */
    _validateMeta() {
      const meta = this.__meta;
      if (typeof meta.spriteName !== "string") {
        throw new Error("spriteName must be a string");
      }
      if (meta.width !== null && (typeof meta.width !== "number" || meta.width <= 0)) {
        throw new Error("width must be null or a positive number");
      }
      if (meta.height !== null && (typeof meta.height !== "number" || meta.height <= 0)) {
        throw new Error("height must be null or a positive number");
      }
      if (typeof meta.opacity !== "number" || meta.opacity < 0 || meta.opacity > 1) {
        throw new Error("opacity must be a number between 0 and 1");
      }
      if (typeof meta.color !== "string") {
        throw new Error("color must be a string");
      }
      if (typeof meta.flipX !== "boolean") {
        throw new Error("flipX must be a boolean");
      }
      if (typeof meta.flipY !== "boolean") {
        throw new Error("flipY must be a boolean");
      }
    }
    /**
     * Preloads the sprite from the unified registry.
     * 
     * This method retrieves the sprite resource from SpriteRegistry using the configured
     * sprite key. Called automatically during GameObject preload phase to ensure all
     * required assets are available before rendering begins. Supports both individual
     * sprites and spritesheet sprites using the unified colon notation system.
     * 
     * @throws {Error} If the sprite is not found in SpriteRegistry
     * 
     * @example
     * // Preload is called automatically, but the process loads:
     * // - Individual sprites: "player_idle"
     * // - Spritesheet sprites: "characters:player_idle"
     * 
     * @see {@link SpriteRegistry} For sprite registration and management
     */
    preload() {
      this.sprite = SpriteRegistry.getSprite(this.spriteKey);
      if (!this.sprite) {
        throw new Error(`Sprite '${this.spriteKey}' not found in SpriteRegistry. Make sure the sprite or spritesheet is loaded.`);
      }
    }
    /**
     * Renders the sprite to the canvas with full feature support.
     * 
     * This is the core rendering method that draws the sprite at the GameObject's
     * global position with support for:
     * - Custom dimensions (width/height overrides)
     * - Opacity/transparency rendering
     * - Color tinting with multiple format support
     * - Horizontal and vertical flipping
     * - Rotation following GameObject transform
     * - Automatic sprite center-point alignment
     * 
     * Called automatically during the engine's render phase. Handles missing or
     * unloaded sprites gracefully with debug logging. Uses canvas transform
     * operations for efficient rendering with proper state management.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     * 
     * @example
     * // Rendering happens automatically, but this method provides:
     * // - Sprite positioning at GameObject.position
     * // - Rotation from GameObject.rotation
     * // - Custom scaling from width/height options
     * // - Opacity blending from opacity option
     * // - Color tinting from color option
     * // - Sprite flipping from flipX/flipY options
     * 
     * @see {@link GameObject#getGlobalPosition} For position calculation
     * @see {@link GameObject#getGlobalRotation} For rotation handling
     */
    __draw(ctx) {
      if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) {
        console.log(`Sprite '${this.spriteKey}' is not loaded or does not exist.`);
        return;
      }
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      const width = this.options.width || this.sprite.width;
      const height = this.options.height || this.sprite.height;
      const needsOpacity = this.options.opacity !== 1;
      const needsTinting = this.options.color !== "#FFFFFF";
      if (needsOpacity) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.options.opacity));
      }
      let scaleX = 1, scaleY = 1;
      if (this.options.flipX) scaleX = -1;
      if (this.options.flipY) scaleY = -1;
      this.sprite.draw(ctx, position.x, position.y, width, height, rotation, scaleX, scaleY);
      if (needsTinting) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = this.options.color;
        if (rotation !== 0) {
          ctx.translate(position.x, position.y);
          ctx.rotate(rotation);
          ctx.fillRect(-width / 2, -height / 2, width, height);
        } else {
          ctx.fillRect(position.x - width / 2, position.y - height / 2, width, height);
        }
        ctx.restore();
      }
      if (needsOpacity) {
        ctx.restore();
      }
    }
    /**
     * Changes the sprite being rendered using unified sprite key.
     * 
     * Dynamically updates the sprite resource while preserving all other rendering
     * options like scale, opacity, color tinting, and flipping. Supports both
     * individual sprites and spritesheet sprites using the unified colon notation.
     * Useful for sprite swapping, animation frame changes, or state-based visuals.
     * 
     * @param {string} newSpriteKey - New sprite key for SpriteRegistry lookup
     *   - Individual sprite: "player_idle"
     *   - Spritesheet sprite: "characters:player_idle"
     * 
     * @example
     * // Change to different sprite
     * spriteRenderer.setSprite("player_running");
     * 
     * @example
     * // Change to spritesheet sprite
     * spriteRenderer.setSprite("characters:enemy_walk");
     * 
     * @example
     * // Dynamic sprite switching based on game state
     * if (player.isMoving) {
     *     spriteRenderer.setSprite("player_walk");
     * } else {
     *     spriteRenderer.setSprite("player_idle");
     * }
     */
    setSprite(newSpriteKey) {
      this.spriteKey = newSpriteKey;
      this.sprite = SpriteRegistry.getSprite(newSpriteKey);
      if (!this.sprite) {
        console.warn(`Sprite '${newSpriteKey}' not found in SpriteRegistry.`);
      }
    }
    /**
     * Sets custom scale dimensions for the sprite.
     * 
     * Overrides the sprite's natural dimensions with custom width and height values.
     * Useful for consistent sizing across different sprite assets or dynamic scaling
     * effects. Does not affect the sprite's aspect ratio unless both dimensions
     * are provided. Set to null to revert to natural sprite dimensions.
     * 
     * @param {number} width - Custom width in pixels (or null for natural width)
     * @param {number} height - Custom height in pixels (or null for natural height)
     * 
     * @example
     * // Set custom dimensions
     * spriteRenderer.setScale(64, 64);
     * 
     * @example
     * // Scale sprite to 2x size while maintaining aspect ratio
     * const sprite = spriteRenderer.sprite;
     * spriteRenderer.setScale(sprite.width * 2, sprite.height * 2);
     * 
     * @example
     * // Dynamic scaling based on game state
     * const scale = player.powerLevel * 1.2;
     * spriteRenderer.setScale(32 * scale, 32 * scale);
     */
    setScale(width, height) {
      this.options.width = width;
      this.options.height = height;
    }
    /**
     * Updates sprite rendering options with new values.
     * 
     * Merges new options with existing configuration, allowing partial updates
     * of rendering properties. Useful for batch updates or when you want to
     * change multiple properties at once while preserving others. Accepts the
     * same options object structure as the constructor.
     * 
     * @param {Object} newOptions - New options to merge with existing configuration
     * @param {number} [newOptions.width] - Custom width override
     * @param {number} [newOptions.height] - Custom height override
     * @param {number} [newOptions.opacity] - Opacity value (0.0 to 1.0)
     * @param {string} [newOptions.color] - Color tint
     * @param {boolean} [newOptions.flipX] - Horizontal flip state
     * @param {boolean} [newOptions.flipY] - Vertical flip state
     * 
     * @example
     * // Update multiple properties at once
     * spriteRenderer.setOptions({
     *     opacity: 0.8,
     *     color: "#FF6B6B",
     *     flipX: true
     * });
     * 
     * @example
     * // Conditional property updates
     * const damageEffect = { color: "#FF0000", opacity: 0.6 };
     * if (player.isHurt) {
     *     spriteRenderer.setOptions(damageEffect);
     * }
     */
    setOptions(newOptions) {
      this.options = { ...this.options, ...newOptions };
    }
    /**
     * Gets the actual rendered width of the sprite.
     * 
     * Returns the effective width that will be used for rendering, which is either
     * the custom width override (if set) or the sprite's natural width. Useful for
     * collision detection, UI layout calculations, or positioning other elements
     * relative to the sprite's visual bounds.
     * 
     * @returns {number} The rendered width in pixels, or 0 if no sprite is loaded
     * 
     * @example
     * // Get current rendered size for positioning
     * const width = spriteRenderer.getRenderedWidth();
     * const height = spriteRenderer.getRenderedHeight();
     * 
     * @example
     * // Center another object relative to this sprite
     * const spriteWidth = spriteRenderer.getRenderedWidth();
     * otherObject.position.x = this.gameObject.position.x + spriteWidth / 2;
     * 
     * @see {@link getRenderedHeight} For height equivalent
     */
    getRenderedWidth() {
      if (!this.sprite) return 0;
      return this.options.width || this.sprite.width;
    }
    /**
     * Gets the actual rendered height of the sprite.
     * 
     * Returns the effective height that will be used for rendering, which is either
     * the custom height override (if set) or the sprite's natural height. Useful for
     * collision detection, UI layout calculations, or positioning other elements
     * relative to the sprite's visual bounds.
     * 
     * @returns {number} The rendered height in pixels, or 0 if no sprite is loaded
     * 
     * @example
     * // Get current rendered size for collision bounds
     * const width = spriteRenderer.getRenderedWidth();
     * const height = spriteRenderer.getRenderedHeight();
     * const bounds = { width, height };
     * 
     * @example
     * // Stack objects vertically with proper spacing
     * const spriteHeight = spriteRenderer.getRenderedHeight();
     * nextObject.position.y = this.gameObject.position.y + spriteHeight + padding;
     * 
     * @see {@link getRenderedWidth} For width equivalent
     */
    getRenderedHeight() {
      if (!this.sprite) return 0;
      return this.options.height || this.sprite.height;
    }
    /**
     * Gets the current opacity of the sprite.
     * 
     * Returns the transparency level being applied to the sprite during rendering.
     * Opacity affects how transparent or opaque the sprite appears, with 1.0 being
     * fully opaque and 0.0 being fully transparent. Useful for fade effects,
     * UI state indication, or visual feedback systems.
     * 
     * @returns {number} The opacity value between 0.0 (transparent) and 1.0 (opaque)
     * 
     * @example
     * // Check current visibility level
     * const currentOpacity = spriteRenderer.getOpacity();
     * if (currentOpacity < 0.5) {
     *     console.log("Sprite is fading out");
     * }
     * 
     * @example
     * // Fade effect implementation
     * const fadeSpeed = 2.0 * Time.deltaTime;
     * const newOpacity = Math.max(0, spriteRenderer.getOpacity() - fadeSpeed);
     * spriteRenderer.setOpacity(newOpacity);
     * 
     * @see {@link setOpacity} For updating opacity
     */
    getOpacity() {
      return this.options.opacity;
    }
    /**
     * Sets the opacity of the sprite.
     * 
     * Controls the transparency level for sprite rendering. Values are automatically
     * clamped to the valid range of 0.0 to 1.0. Opacity affects the entire sprite
     * uniformly and can be combined with color tinting. Commonly used for fade
     * effects, UI state changes, damage indication, or object highlighting.
     * 
     * @param {number} opacity - Opacity value between 0.0 (transparent) and 1.0 (opaque)
     *   Values outside this range are automatically clamped
     * 
     * @example
     * // Fade out effect
     * spriteRenderer.setOpacity(0.3);
     * 
     * @example
     * // Dynamic opacity based on health
     * const healthPercent = player.health / player.maxHealth;
     * spriteRenderer.setOpacity(0.3 + (healthPercent * 0.7)); // 30% to 100% opacity
     * 
     * @example
     * // Blinking effect for invincibility
     * const blinkSpeed = 5.0;
     * const opacity = Math.abs(Math.sin(Time.time * blinkSpeed));
     * spriteRenderer.setOpacity(opacity);
     * 
     * @see {@link getOpacity} For reading current opacity
     */
    setOpacity(opacity) {
      this.options.opacity = Math.max(0, Math.min(1, opacity));
    }
    /**
     * Gets the current tint color of the sprite.
     * 
     * Returns the color being applied as a tint overlay to the sprite during
     * rendering. The tint color modifies the sprite's appearance while preserving
     * its original transparency and details. White (#FFFFFF) means no tinting
     * is applied, while other colors will blend with the sprite's pixels.
     * 
     * @returns {string} The tint color in the format it was set (hex, rgb, rgba, or color name)
     * 
     * @example
     * // Check current tint state
     * const currentColor = spriteRenderer.getColor();
     * if (currentColor !== "#FFFFFF") {
     *     console.log("Sprite is currently tinted");
     * }
     * 
     * @example
     * // Save and restore color state
     * const originalColor = spriteRenderer.getColor();
     * spriteRenderer.setColor("#FF0000"); // Apply damage effect
     * setTimeout(() => {
     *     spriteRenderer.setColor(originalColor); // Restore
     * }, 500);
     * 
     * @see {@link setColor} For updating the tint color
     */
    getColor() {
      return this.options.color;
    }
    /**
     * Sets the tint color of the sprite.
     * 
     * Applies a color overlay to the sprite during rendering, allowing for visual
     * effects like damage indication, power-ups, team colors, or environmental
     * lighting. Supports multiple color formats including hex, rgb, rgba, and
     * named colors. The tinting preserves the sprite's original alpha channel
     * and detail while blending the color multiplicatively.
     * 
     * @param {string} color - Tint color in various formats:
     *   - Hex: "#FF0000", "#F00"
     *   - RGB: "rgb(255, 0, 0)"
     *   - RGBA: "rgba(255, 0, 0, 0.8)"
     *   - Named: "red", "blue", "green"
     *   - No tint: "#FFFFFF" or "white"
     * 
     * @example
     * // Apply red damage tint
     * spriteRenderer.setColor("#FF0000");
     * 
     * @example
     * // Team-based coloring
     * const teamColors = { red: "#FF6B6B", blue: "#4ECDC4", green: "#45B7D1" };
     * spriteRenderer.setColor(teamColors[player.team]);
     * 
     * @example
     * // Dynamic environmental tinting
     * const timeOfDay = Game.getTimeOfDay();
     * if (timeOfDay === "night") {
     *     spriteRenderer.setColor("rgba(100, 100, 200, 0.7)"); // Blue night tint
     * } else {
     *     spriteRenderer.setColor("#FFFFFF"); // No tint during day
     * }
     * 
     * @example
     * // Power-up glow effect
     * spriteRenderer.setColor("#FFD700"); // Golden tint for power-up
     * 
     * @see {@link getColor} For reading current tint color
     */
    setColor(color) {
      this.options.color = color;
    }
    /**
     * Gets the current horizontal flip state of the sprite.
     * 
     * Returns whether the sprite is currently being rendered flipped horizontally
     * (mirrored along the Y-axis). Horizontal flipping is commonly used for
     * character facing direction, creating sprite variations, or mirror effects
     * without requiring separate sprite assets.
     * 
     * @returns {boolean} True if the sprite is flipped horizontally, false otherwise
     * 
     * @example
     * // Check current facing direction
     * const facingLeft = spriteRenderer.getFlipX();
     * if (facingLeft) {
     *     console.log("Character is facing left");
     * }
     * 
     * @example
     * // Conditional movement logic based on flip state
     * const isFlipped = spriteRenderer.getFlipX();
     * const moveDirection = isFlipped ? -1 : 1;
     * this.gameObject.position.x += moveSpeed * moveDirection;
     * 
     * @see {@link setFlipX} For updating horizontal flip state
     * @see {@link getFlipY} For vertical flip state
     */
    getFlipX() {
      return this.options.flipX;
    }
    /**
     * Sets the horizontal flip state of the sprite.
     * 
     * Controls whether the sprite is rendered flipped horizontally (mirrored along
     * the Y-axis). This is an efficient way to create directional sprites without
     * needing separate left/right facing assets. Commonly used for character
     * movement, projectile direction, or creating mirror effects.
     * 
     * @param {boolean} flipX - True to flip horizontally, false for normal orientation
     * 
     * @example
     * // Character facing direction
     * const movingRight = velocity.x > 0;
     * spriteRenderer.setFlipX(!movingRight); // Flip when moving left
     * 
     * @example
     * // Projectile direction based on shooter's facing
     * const bullet = new GameObject();
     * const bulletSprite = bullet.addComponent(SpriteRendererComponent, "bullet");
     * bulletSprite.setFlipX(shooter.facingLeft);
     * 
     * @example
     * // Mirror effect for reflections
     * const reflection = player.clone();
     * const reflectionSprite = reflection.getComponent(SpriteRendererComponent);
     * reflectionSprite.setFlipX(true);
     * reflectionSprite.setOpacity(0.5);
     * 
     * @see {@link getFlipX} For reading current horizontal flip state
     * @see {@link setFlipY} For vertical flip control
     */
    setFlipX(flipX) {
      this.options.flipX = flipX;
    }
    /**
     * Gets the current vertical flip state of the sprite.
     * 
     * Returns whether the sprite is currently being rendered flipped vertically
     * (mirrored along the X-axis). Vertical flipping is useful for effects like
     * upside-down states, gravity inversion, reflection effects, or creating
     * sprite variations without additional assets.
     * 
     * @returns {boolean} True if the sprite is flipped vertically, false otherwise
     * 
     * @example
     * // Check if sprite is upside down
     * const upsideDown = spriteRenderer.getFlipY();
     * if (upsideDown) {
     *     console.log("Sprite is inverted");
     * }
     * 
     * @example
     * // Gravity-based flipping logic
     * const gravityReversed = spriteRenderer.getFlipY();
     * const gravityDirection = gravityReversed ? -1 : 1;
     * 
     * @see {@link setFlipY} For updating vertical flip state
     * @see {@link getFlipX} For horizontal flip state
     */
    getFlipY() {
      return this.options.flipY;
    }
    /**
     * Sets the vertical flip state of the sprite.
     * 
     * Controls whether the sprite is rendered flipped vertically (mirrored along
     * the X-axis). This creates an upside-down effect and is useful for gravity
     * inversion mechanics, ceiling walking, reflection effects, or special game
     * states. Can be combined with horizontal flipping for complete orientation.
     * 
     * @param {boolean} flipY - True to flip vertically, false for normal orientation
     * 
     * @example
     * // Gravity inversion effect
     * if (player.gravityReversed) {
     *     spriteRenderer.setFlipY(true);
     * } else {
     *     spriteRenderer.setFlipY(false);
     * }
     * 
     * @example
     * // Ceiling walking mechanic
     * const onCeiling = player.position.y < ceilingThreshold;
     * spriteRenderer.setFlipY(onCeiling);
     * 
     * @example
     * // Water reflection effect
     * const waterReflection = player.clone();
     * const reflectionSprite = waterReflection.getComponent(SpriteRendererComponent);
     * reflectionSprite.setFlipY(true);
     * reflectionSprite.setOpacity(0.3);
     * waterReflection.position.y = waterSurface + (waterSurface - player.position.y);
     * 
     * @see {@link getFlipY} For reading current vertical flip state
     * @see {@link setFlipX} For horizontal flip control
     */
    setFlipY(flipY) {
      this.options.flipY = flipY;
    }
    /**
     * Draws visual debugging gizmos for the sprite renderer.
     * 
     * This internal method renders debugging information to help developers visualize
     * sprite bounds, positioning, and configuration. Shows a magenta dashed rectangle
     * around the sprite's rendered area, a center point indicator, the sprite key
     * label, and actual dimensions. Only visible when internal gizmos are enabled
     * in the Game instance settings.
     * 
     * Gizmo elements displayed:
     * - Dashed magenta rectangle showing rendered sprite bounds
     * - Solid center point circle for position reference
     * - Sprite key text label above the sprite
     * - Dimensions text below the sprite
     * - Proper rotation handling to match sprite orientation
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context for drawing gizmos
     * 
     * @private
     * @internal This method is part of the debugging visualization system
     * 
     * @example
     * // Gizmos are automatically drawn when enabled:
     * // Game.instance._internalGizmos = true;
     * // - Magenta dashed border shows sprite bounds
     * // - Center dot shows exact position
     * // - Labels show sprite key and dimensions
     * 
     * @see {@link Game#_internalGizmos} For enabling gizmo rendering
     */
    __internalGizmos(ctx) {
      if (!this.sprite || !this.sprite.image || !this.sprite.isLoaded) return;
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      ctx.save();
      ctx.translate(position.x, position.y);
      if (rotation !== 0) ctx.rotate(rotation);
      ctx.strokeStyle = "#FF00FF";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 2]);
      const width = this.getRenderedWidth();
      const height = this.getRenderedHeight();
      ctx.strokeRect(-width / 2, -height / 2, width, height);
      ctx.setLineDash([]);
      ctx.fillStyle = "#FF00FF";
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#FF00FF";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(this.spriteKey, 0, -height / 2 - 8);
      ctx.fillText(`${width}x${height}`, 0, height / 2 + 15);
      ctx.restore();
    }
  };

  // src/animations/components/SpriteAnimationComponent.js
  var SpriteAnimationComponent = class extends Component {
    /**
     * Creates a new SpriteAnimationComponent.
     * 
     * @param {string} [defaultClipName=null] - Name of the default animation clip to play on start
     */
    constructor(defaultClipName = null) {
      super();
      this.clips = /* @__PURE__ */ new Map();
      this.currentClip = null;
      this.currentFrame = 0;
      this.autoPlay = true;
      this.time = 0;
      this.defaultClipName = defaultClipName;
    }
    /**
     * Get default metadata configuration for SpriteAnimationComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        defaultClipName: null,
        autoPlay: true
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(defaultClipName = null) {
      const metadata = {
        defaultClipName,
        autoPlay: true
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.defaultClipName = this.__meta.defaultClipName;
      this.autoPlay = this.__meta.autoPlay;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (meta.defaultClipName !== null && typeof meta.defaultClipName !== "string") {
        throw new Error("defaultClipName must be null or a string");
      }
      if (typeof meta.autoPlay !== "boolean") {
        throw new Error("autoPlay must be a boolean");
      }
    }
    /**
     * Called when the GameObject starts. Automatically plays the default clip if autoPlay is enabled.
     */
    start() {
      if (this.autoPlay && this.defaultClipName) {
        this.play(this.defaultClipName);
      }
    }
    /**
     * Adds an animation clip to this component.
     * 
     * @param {SpriteAnimationClip} clip - The animation clip to add
     */
    addClip(clip) {
      this.clips.set(clip.name, clip);
    }
    /**
     * Plays the specified animation clip.
     * 
     * @param {string} name - Name of the animation clip to play
     * @throws {Error} If the animation clip is not found
     */
    play(name) {
      const clip = this.clips.get(name);
      if (!clip) throw new Error(`Animation clip '${name}' not found.`);
      this.currentClip = clip;
      this.currentFrame = 0;
      this.time = 0;
      this._applyFrame();
    }
    /**
     * Updates the animation playback. Called automatically each frame.
     */
    update() {
      if (!this.currentClip) return;
      this.time += Time.deltaTime;
      const frameDuration = 1 / this.currentClip.fps;
      if (this.time >= frameDuration) {
        this.time -= frameDuration;
        this.currentFrame++;
        if (this.currentFrame >= this.currentClip.spriteNames.length) {
          if (this.currentClip.loop) {
            this.currentFrame = 0;
          } else {
            this.currentFrame = this.currentClip.spriteNames.length - 1;
            return;
          }
        }
        this._applyFrame();
      }
    }
    /**
     * Applies the current frame's sprite to the SpriteRendererComponent using unified sprite keys.
     * @private
     */
    _applyFrame() {
      if (!this.currentClip || !this.currentClip.spriteNames[this.currentFrame]) return;
      const spriteKey = this.currentClip.spriteNames[this.currentFrame];
      const spriteRenderer = this.gameObject.getComponent(SpriteRendererComponent);
      if (spriteRenderer) {
        spriteRenderer.setSprite(spriteKey);
      }
    }
  };

  // src/index.js
  init_Tile();
  init_TileAsset();
  init_TileRegistry();

  // src/common/Scene.js
  var Scene = class {
    /**
     * Creates a new Scene with optional creation function.
     * 
     * Supports two patterns for scene creation:
     * 1. Constructor-based: Pass a create function in options
     * 2. Class-based: Extend Scene and implement create method
     * 
     * The create function/method allows for deferred object instantiation, ensuring proper 
     * game initialization order and preventing premature object creation.
     * 
     * @param {Object} [options={}] - Scene configuration options
     * @param {Function} [options.create] - Function called during preload to create scene objects
     *   - Receives the scene instance as parameter
     *   - Should contain all initial GameObject creation and setup logic
     *   - Called only once during scene preload phase
     * 
     * @example
     * // Pattern 1: Constructor-based scene creation
     * const gameScene = new Scene({
     *     create: function(scene) {
     *         const player = new GameObject(400, 300);
     *         player.name = "Player";
     *         player.addComponent(new SpriteRendererComponent("player_idle"));
     *         scene.add(player);
     *     }
     * });
     * 
     * @example
     * // Pattern 2: Class-based scene creation
     * class GameScene extends Scene {
     *     create(scene) {
     *         const player = new GameObject(400, 300);
     *         player.name = "Player";
     *         player.addComponent(new SpriteRendererComponent("player_idle"));
     *         scene.add(player);
     *     }
     * }
     * const gameScene = new GameScene();
     * 
     * @example
     * // Empty scene for manual management
     * const emptyScene = new Scene();
     */
    constructor({ create } = {}) {
      this.objects = [];
      this._createFn = create;
    }
    /**
     * Scene creation method that can be overridden in extended classes.
     * 
     * This method is called automatically during the preload phase and provides
     * a way to define scene objects when extending the Scene class. It receives
     * the scene instance as a parameter and should contain all GameObject
     * creation and initial setup logic.
     * 
     * @param {Scene} scene - The scene instance (this)
     * 
     * @example
     * // Implementing create method in extended Scene class
     * class GameScene extends Scene {
     *     create(scene) {
     *         // Create player
     *         const player = new GameObject(400, 300);
     *         player.name = "Player";
     *         player.addComponent(new SpriteRendererComponent("player_idle"));
     *         scene.add(player);
     *         
     *         // Create enemies
     *         for (let i = 0; i < 3; i++) {
     *             const enemy = new GameObject(100 + i * 200, 200);
     *             enemy.addTag("enemy");
     *             enemy.addComponent(new SpriteRendererComponent("enemy"));
     *             scene.add(enemy);
     *         }
     *     }
     * }
     * 
     * @virtual Override this method in Scene subclasses for scene setup
     */
    create(scene) {
    }
    /**
     * Adds a GameObject to the scene before the game starts.
     * 
     * This method is designed for adding objects during scene creation or before
     * the game loop begins. It delegates to Instantiate.create() to ensure proper
     * object registration and lifecycle management. For adding objects during
     * gameplay, use Instantiate.create() directly for better performance and
     * immediate integration with running systems.
     * 
     * When the layer system is enabled, GameObjects are automatically added to
     * their specified layer. If no layer is set, they use the "Default" layer.
     * 
     * The added GameObject will go through the complete lifecycle:
     * 1. Added to scene objects array
     * 2. Preload phase (asset loading)
     * 3. Start phase (initialization)
     * 4. Update/render phases (ongoing)
     * 
     * @param {GameObject} obj - The GameObject to add to the scene
     *   Must be a valid GameObject instance with components
     * 
     * @example
     * // Adding objects during scene creation
     * const scene = new Scene({
     *     create: function(scene) {
     *         const player = new GameObject(400, 300);
     *         player.layer = 'gameplay'; // Set layer for layer system
     *         player.addComponent(new SpriteRendererComponent("player"));
     *         scene.add(player); // Proper scene addition
     *     }
     * });
     * 
     * @example
     * // Manual scene building with layers
     * const scene = new Scene();
     * const background = new GameObject(0, 0);
     * background.layer = 'background'; // Background layer
     * background.addComponent(new ImageComponent("./assets/bg.png"));
     * scene.add(background);
     * 
     * @see {@link Instantiate.create} For adding objects during gameplay
     * @see {@link GameObject} For GameObject creation and component management
     */
    add(obj) {
      Instantiate.create(obj);
      if (Game.instance && Game.instance.hasLayerSystem()) {
        const layerName = obj.layer || Game.instance.getDefaultLayer();
        Game.instance.addToLayer(layerName, obj);
      }
    }
    /**
     * Removes a GameObject from the scene with proper cleanup.
     * 
     * This method provides comprehensive GameObject removal including cleanup of
     * all components, lifecycle method calls, and parent-child relationship management.
     * It ensures no memory leaks or orphaned references remain after object removal.
     * For gameplay object destruction, prefer using the global Destroy() function
     * which provides Unity-compatible destruction patterns.
     * 
     * **Cleanup Process:**
     * 1. Calls GameObject.destroy() if method exists
     * 2. Iterates through all components and calls their destroy() methods
     * 3. Removes from scene objects array
     * 4. Clears parent reference to prevent orphaned objects
     * 
     * @param {GameObject} obj - The GameObject to remove from the scene
     *   Must be a GameObject instance currently in this scene
     * 
     * @example
     * // Manual object removal
     * const enemy = scene.findByName("Enemy1");
     * if (enemy) {
     *     scene.remove(enemy); // Complete cleanup
     * }
     * 
     * @example
     * // Removing all enemies
     * const enemies = scene.findByTag("enemy");
     * enemies.forEach(enemy => scene.remove(enemy));
     * 
     * @see {@link Destroy} For Unity-compatible destruction during gameplay
     * @see {@link GameObject#destroy} For GameObject-specific cleanup logic
     */
    remove(obj) {
      const index = this.objects.indexOf(obj);
      if (index > -1) {
        if (typeof obj.destroy === "function") {
          obj.destroy();
        }
        if (obj.components) {
          obj.components.forEach((component) => {
            if (typeof component.destroy === "function") {
              component.destroy();
            }
          });
        }
        this.objects.splice(index, 1);
        obj.scene = null;
      }
    }
    /**
     * Internal method for adding GameObjects directly to the scene array.
     * 
     * This is a low-level method used by the Instantiate system for direct object
     * registration. It performs type validation to ensure only GameObject instances
     * are added to the scene, maintaining scene integrity and preventing runtime
     * errors from invalid object types.
     * 
     * **Important:** This method should only be called by internal engine systems
     * like Instantiate.create(). Use scene.add() or Instantiate.create() for
     * regular GameObject addition.
     * 
     * @private
     * @param {GameObject} obj - The GameObject to add to the scene's objects array
     * @throws {Error} If obj is not a GameObject instance
     * 
     * @internal Used by Instantiate system for direct object registration
     */
    __addObjectToScene(obj) {
      if (!(obj instanceof GameObject)) throw new Error(`[Nity] Forbidden object '${obj ? obj.constructor.name : null}' added to the scene. Accepts only 'GameObject'.`);
      this.objects.push(obj);
    }
    /**
     * Finds the first GameObject in the scene with the specified name.
     * 
     * Searches through all GameObjects in the scene and returns the first one
     * whose name property matches the provided string. Useful for accessing
     * specific objects when you know their name. Returns null if no GameObject
     * with the specified name is found.
     * 
     * **Performance Note:** This method performs a linear search through all
     * objects. For frequently accessed objects, consider caching the reference.
     * 
     * @param {string} name - The name to search for
     * @returns {GameObject|null} The first GameObject with matching name, or null if not found
     * 
     * @example
     * // Find player object
     * const player = scene.findByName("Player");
     * if (player) {
     *     player.position.x += 10;
     * }
     * 
     * @example
     * // Find specific enemy
     * const boss = scene.findByName("BossEnemy");
     * if (boss) {
     *     boss.getComponent(SpriteRendererComponent).setColor("#FF0000");
     * }
     * 
     * @see {@link GameObject#name} For setting GameObject names
     * @see {@link findByTag} For finding objects by tag
     */
    findByName(name) {
      return this.objects.find((obj) => obj.name === name);
    }
    /**
     * Finds all GameObjects in the scene with the specified tag.
     * 
     * Searches through all GameObjects in the scene and returns an array of all
     * objects that have the specified tag. Useful for working with groups of
     * objects that share common functionality or behavior. Returns an empty
     * array if no GameObjects with the specified tag are found.
     * 
     * **Common Use Cases:**
     * - Finding all enemies: `scene.findByTag("enemy")`
     * - Finding all pickups: `scene.findByTag("pickup")`
     * - Finding all UI elements: `scene.findByTag("ui")`
     * 
     * @param {string} tag - The tag to search for
     * @returns {GameObject[]} Array of GameObjects with the specified tag (empty if none found)
     * 
     * @example
     * // Find and damage all enemies
     * const enemies = scene.findByTag("enemy");
     * enemies.forEach(enemy => {
     *     const health = enemy.getComponent(HealthComponent);
     *     if (health) health.takeDamage(10);
     * });
     * 
     * @example
     * // Collect all pickups
     * const pickups = scene.findByTag("pickup");
     * pickups.forEach(pickup => {
     *     // Apply pickup effect
     *     pickup.getComponent(PickupComponent).collect();
     * });
     * 
     * @example
     * // Hide all UI elements
     * const uiElements = scene.findByTag("ui");
     * uiElements.forEach(ui => {
     *     ui.getComponent(SpriteRendererComponent).setOpacity(0);
     * });
     * 
     * @see {@link GameObject#addTag} For adding tags to GameObjects
     * @see {@link GameObject#hasTag} For checking if GameObject has a tag
     * @see {@link findByName} For finding objects by name
     */
    findByTag(tag) {
      return this.objects.filter((obj) => obj.hasTag(tag));
    }
    /**
     * Asynchronously preloads all scene assets and executes the creation function.
     * 
     * This is the first phase of scene initialization that handles:
     * 1. Executing the optional creation function to instantiate GameObjects
     * 2. Preloading all assets for every GameObject and their components
     * 3. Ensuring all required resources are loaded before game starts
     * 
     * The creation function is called only once and then cleared to prevent
     * memory leaks. All GameObjects are preloaded in parallel for optimal
     * performance using Promise.all().
     * 
     * @async
     * @returns {Promise<void>} Resolves when all assets are loaded and scene is ready
     * 
     * @example
     * // Preload is called automatically by the Game engine
     * await scene.preload();
     * console.log("All scene assets loaded");
     */
    async preload() {
      if (typeof this._createFn === "function") {
        await this._createFn(this);
        this._createFn = null;
      }
      if (typeof this.create === "function" && this.create !== this._createFn) {
        await this.create(this);
      }
      const preloadPromises = this.objects.map((obj) => obj?.preload?.());
      await Promise.all(preloadPromises);
    }
    /**
     * Initializes all GameObjects in the scene after preloading is complete.
     * 
     * Calls the start() method on every GameObject that has one, providing
     * a Unity-compatible initialization phase. This occurs after all assets
     * are loaded but before the game loop begins, ensuring all objects can
     * safely access their dependencies and perform initial setup.
     * 
     * @async
     * @returns {Promise<void>} Resolves when all GameObjects have been initialized
     * 
     * @example
     * // Start is called automatically by the Game engine after preload
     * await scene.start();
     * console.log("All GameObjects initialized");
     */
    async start() {
      for (let obj of this.objects) {
        if (typeof obj?.start === "function") {
          obj?.start();
        }
      }
      setTimeout(() => {
      }, 500);
    }
    /**
     * Scene-specific update logic called every frame.
     * 
     * Override this method in scene subclasses to implement custom scene-level
     * logic that should run every frame. This is called after all GameObject
     * updates but before collision detection, making it ideal for scene-wide
     * systems, camera management, or global game state updates.
     * 
     * @example
     * // Custom scene with update logic
     * class GameScene extends Scene {
     *     update() {
     *         // Update camera following player
     *         this.updateCamera();
     *         
     *         // Check win conditions
     *         this.checkWinCondition();
     *     }
     * }
     */
    update() {
    }
    /**
     * Scene-specific late update logic called every frame.
     * 
     * Override this method in scene subclasses to implement custom scene-level
     * logic that should run after all GameObject updates and collision detection.
     * Ideal for UI updates, camera finalization, or cleanup operations that
     * need to happen after all game logic has processed.
     * 
     * @example
     * // Custom scene with late update logic
     * class GameScene extends Scene {
     *     lateUpdate() {
     *         // Update UI elements
     *         this.updateUI();
     *         
     *         // Finalize camera position
     *         this.finalizeCamera();
     *     }
     * }
     */
    lateUpdate() {
    }
    __update() {
      for (let obj of this.objects) {
        if (typeof obj?.update === "function") {
          obj?.update();
        }
      }
      if (CollisionSystem.instance) {
        CollisionSystem.instance?.update();
      } else {
        console.warn("Scene: CollisionSystem.instance is null!");
      }
      this?.update();
    }
    __lateUpdate() {
      for (let obj of this.objects) {
        if (typeof obj.lateUpdate === "function") {
          obj?.lateUpdate();
        }
      }
      this?.lateUpdate();
    }
    __draw(ctx) {
      for (let obj of this.objects) {
        obj.__draw(ctx);
      }
    }
  };

  // src/physics/components/GravityComponent.js
  var GravityComponent = class extends Component {
    /**
     * Creates a new GravityComponent.
     * 
     * @param {Object} [options={ gravityScale: 300 }] - Configuration options
     * @param {number} [options.gravityScale=300] - The scale of the gravity effect (pixels per second squared)
     */
    constructor(options = { gravityScale: 300 }) {
      super();
      this.gravity = true;
      this.gravityScale = options.gravityScale || 300;
      this.velocity = new Vector2(0, 0);
    }
    /**
     * Get default metadata configuration for GravityComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        gravityScale: 300
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(options = {}) {
      const metadata = {
        gravityScale: options.gravityScale || 300
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.gravityScale = this.__meta.gravityScale;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (typeof meta.gravityScale !== "number" || meta.gravityScale < 0) {
        throw new Error("gravityScale must be a non-negative number");
      }
    }
    /**
     * Updates the gravity effect. Called automatically each frame.
     * Increases the Y velocity based on gravity scale and delta time.
     */
    update() {
      if (this.gravity) {
        this.velocity.y += this.gravityScale * Time.deltaTime;
      }
    }
    /**
     * Moves the GameObject by the specified offset.
     * @private
     * 
     * @param {number|Vector2} dx - X offset or Vector2 offset
     * @param {number} [dy] - Y offset (ignored if dx is Vector2)
     */
    _doMove(dx, dy) {
      if (dx instanceof Vector2) {
        this.gameObject.translate(dx);
      } else {
        this.gameObject.translate(dx, dy);
      }
    }
  };

  // src/physics/components/RigidbodyComponent.js
  var RigidbodyComponent = class _RigidbodyComponent extends GravityComponent {
    #_collider;
    #_lastCollisions = /* @__PURE__ */ new Set();
    bounciness = 0;
    // 0 = no bounce, 1 = full bounce
    gravity = false;
    gravityScale = 300;
    constructor(options = {
      gravity: false,
      gravityScale: 300,
      bounciness: 0
    }) {
      super(options);
      this.gravity = options.gravity != null ? options.gravity : false;
      this.bounciness = options.bounciness || 0;
    }
    /**
     * Get default metadata configuration for RigidbodyComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        gravity: false,
        gravityScale: 300,
        bounciness: 0
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(options = {}) {
      const metadata = {
        gravity: options.gravity !== null ? options.gravity : false,
        gravityScale: options.gravityScale || 300,
        bounciness: options.bounciness || 0
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.gravity = this.__meta.gravity;
      this.gravityScale = this.__meta.gravityScale;
      this.bounciness = this.__meta.bounciness;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (typeof meta.gravity !== "boolean") {
        throw new Error("gravity must be a boolean");
      }
      if (typeof meta.gravityScale !== "number" || meta.gravityScale < 0) {
        throw new Error("gravityScale must be a non-negative number");
      }
      if (typeof meta.bounciness !== "number" || meta.bounciness < 0 || meta.bounciness > 1) {
        throw new Error("bounciness must be a number between 0 and 1");
      }
    }
    /**
     * Initializes the RigidbodyComponent, ensuring it has a collider.
     * @returns {void}
     */
    start() {
      this.#_collider = this.gameObject.getComponent(AbstractColliderComponent);
      if (!this.#_collider) {
        console.warn("RigidbodyComponent requires a collider.");
      }
    }
    /**
     * Updates the RigidbodyComponent, applying gravity and moving the GameObject.
     */
    update() {
      super.update();
      const movement = this.velocity.multiply(Time.deltaTime);
      this.move(movement.x, movement.y);
    }
    /**
     * Moves the GameObject and handles collision resolution.
     * @param {number|Vector2} dx - The change in x position or Vector2 movement.
     * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
     * @returns {boolean} - Returns true if the movement was successful.
     */
    move(dx, dy) {
      let moveX, moveY;
      if (dx instanceof Vector2) {
        moveX = dx.x;
        moveY = dx.y;
      } else {
        moveX = dx;
        moveY = dy;
      }
      const maxSpeed = Math.max(Math.abs(moveX), Math.abs(moveY));
      const steps = Math.max(1, Math.ceil(maxSpeed / 0.25));
      const stepX = moveX / steps;
      const stepY = moveY / steps;
      let currentCollisions = /* @__PURE__ */ new Set();
      let resolved = false;
      let totalMoved = new Vector2(0, 0);
      for (let i = 0; i < steps; i++) {
        const prevPos = this.gameObject.position.clone();
        this._doMove(stepX, stepY);
        totalMoved = totalMoved.add(new Vector2(stepX, stepY));
        if (this.#_collider) {
          for (const other of CollisionSystem.instance.colliders) {
            if (other === this.#_collider) continue;
            if (!this.#_collider.checkCollisionWith(other)) continue;
            const otherObj = other.gameObject;
            currentCollisions.add(otherObj);
            const wasColliding = this.#_lastCollisions.has(otherObj);
            const isTrigger = this.#_collider.isTrigger() || other.isTrigger();
            if (!wasColliding) {
              this.#eventEnter(this.gameObject, otherObj);
              if (!otherObj.hasComponent?.(_RigidbodyComponent))
                this.#eventEnter(otherObj, this.gameObject);
            } else {
              this.#eventStay(this.gameObject, otherObj);
              if (!otherObj.hasComponent?.(_RigidbodyComponent))
                this.#eventStay(otherObj, this.gameObject);
            }
            if (!isTrigger && !resolved) {
              this.gameObject.setPosition(prevPos);
              if (Math.abs(stepY) > Math.abs(stepX)) {
                this.velocity.y *= -this.bounciness;
              } else {
                this.velocity.x *= -this.bounciness;
              }
              resolved = true;
              break;
            }
          }
        }
        if (resolved) break;
        this.#handleExitEvents(currentCollisions);
        this.#_lastCollisions = currentCollisions;
      }
      return true;
    }
    /**
     * Handle exit events with improved stability for edge cases
     * @param {Set} currentCollisions - Set of currently colliding objects
     */
    #handleExitEvents(currentCollisions) {
      for (const obj of this.#_lastCollisions) {
        if (!currentCollisions.has(obj)) {
          const otherCollider = obj.getComponent(AbstractColliderComponent);
          if (otherCollider) {
            if (!this.#isNearCollision(otherCollider, 2.5)) {
              this.#eventExit(this.gameObject, obj);
              if (!obj?.hasComponent?.(_RigidbodyComponent))
                this.#eventExit(obj, this.gameObject);
            } else {
              currentCollisions.add(obj);
            }
          } else {
            this.#eventExit(this.gameObject, obj);
            if (!obj?.hasComponent?.(_RigidbodyComponent))
              this.#eventExit(obj, this.gameObject);
          }
        }
      }
    }
    /**
     * Check if two colliders are near each other within tolerance
     * @param {AbstractColliderComponent} other - The other collider
     * @param {number} tolerance - Distance tolerance
     * @returns {boolean} True if objects are within tolerance distance
     */
    #isNearCollision(other, tolerance = 2) {
      const myBounds = this.#_collider.getBounds();
      const otherBounds = other.getBounds();
      return myBounds.x < otherBounds.x + otherBounds.width + tolerance && myBounds.x + myBounds.width + tolerance > otherBounds.x && myBounds.y < otherBounds.y + otherBounds.height + tolerance && myBounds.y + myBounds.height + tolerance > otherBounds.y;
    }
    #eventEnter(gameObject, otherGameObject) {
      const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
      if (selfCol?.isTrigger()) {
        gameObject?.onTriggerEnter?.(otherGameObject);
      } else {
        gameObject?.onCollisionEnter?.(otherGameObject);
      }
    }
    #eventStay(gameObject, otherGameObject) {
      const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
      if (selfCol?.isTrigger()) {
        gameObject?.onTriggerStay?.(otherGameObject);
      } else {
        gameObject?.onCollisionStay?.(otherGameObject);
      }
    }
    #eventExit(gameObject, otherGameObject) {
      const selfCol = gameObject?.getComponent?.(AbstractColliderComponent);
      if (selfCol?.isTrigger()) {
        gameObject?.onTriggerExit?.(otherGameObject);
      } else {
        gameObject?.onCollisionExit?.(otherGameObject);
      }
    }
    /**
     * Directly moves the GameObject without collision checking.
     * @param {number|Vector2} dx - The change in x position or Vector2 movement.
     * @param {number} [dy] - The change in y position (ignored if dx is Vector2).
     */
    _doMove(dx, dy) {
      if (dx instanceof Vector2) {
        this.gameObject.translate(dx);
      } else {
        this.gameObject.translate(dx, dy);
      }
    }
  };

  // src/extensions/movement/MovementController.js
  var MovementComponent = class extends Component {
    rigidbody;
    constructor(speed = 100) {
      super();
      this.speed = speed;
    }
    start() {
      this.rigidbody = this.gameObject.getComponent(RigidbodyComponent);
      if (!this.rigidbody) {
        console.warn("MovementComponent requires RigidbodyComponent to function properly.");
      }
    }
    update() {
      const movement = new Vector2(0, 0);
      if (Input.keyboard.isDown("ArrowRight") || Input.keyboard.isDown("d") || Input.keyboard.isDown("D")) movement.x += this.speed * Time.deltaTime;
      if (Input.keyboard.isDown("ArrowLeft") || Input.keyboard.isDown("a") || Input.keyboard.isDown("A")) movement.x -= this.speed * Time.deltaTime;
      if (Input.keyboard.isDown("ArrowDown") || Input.keyboard.isDown("s") || Input.keyboard.isDown("S")) movement.y += this.speed * Time.deltaTime;
      if (Input.keyboard.isDown("ArrowUp") || Input.keyboard.isDown("w") || Input.keyboard.isDown("W")) movement.y -= this.speed * Time.deltaTime;
      if (movement.magnitude > 0) {
        this.rigidbody.move(movement);
      }
    }
  };
  var MovementController = class extends MovementComponent {
  };

  // src/index.js
  init_Keyboard();

  // src/asset/SpriteAsset.js
  var SpriteAsset = class _SpriteAsset {
    /**
     * Create a new sprite asset and automatically register it
     * @param {string} name - Name to register the sprite under (cannot contain colons)
     * @param {string} imagePath - Path to the sprite image
     * @param {Object} [config] - Optional configuration
     * @param {number} [config.width] - Override width
     * @param {number} [config.height] - Override height
     * @param {number} [config.pivotX=0.5] - Pivot point X (0-1)
     * @param {number} [config.pivotY=0.5] - Pivot point Y (0-1)
     */
    constructor(name, imagePath, config = {}) {
      if (name.includes(":")) {
        throw new Error(`SpriteAsset name "${name}" cannot contain colons. Colons are reserved for spritesheet sprite notation (e.g., "sheet:sprite").`);
      }
      this.name = name;
      this.imagePath = imagePath;
      this.image = null;
      this.isLoaded = false;
      this.width = config.width || null;
      this.height = config.height || null;
      this.pivotX = config.pivotX || 0.5;
      this.pivotY = config.pivotY || 0.5;
      this.#_registerSelf();
      this.load();
    }
    /**
     * Automatically register this sprite asset
     * @private
     */
    #_registerSelf() {
      SpriteRegistry._addSprite(this.name, this);
    }
    /**
     * Load the sprite image
     * @returns {Promise} Promise that resolves when image is loaded
     */
    load() {
      return new Promise((resolve, reject) => {
        this.image = new Image();
        this.image.onload = () => {
          this.isLoaded = true;
          if (!this.width) this.width = this.image.width;
          if (!this.height) this.height = this.image.height;
          resolve(this);
        };
        this.image.onerror = reject;
        this.image.src = this.imagePath;
      });
    }
    /**
     * Draw the sprite to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position to draw at
     * @param {number} y - Y position to draw at
     * @param {number} [width] - Width to draw (defaults to sprite width)
     * @param {number} [height] - Height to draw (defaults to sprite height)
     * @param {number} [rotation=0] - Rotation in radians
     * @param {number} [scaleX=1] - X scale factor
     * @param {number} [scaleY=1] - Y scale factor
     */
    draw(ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) {
      if (!this.isLoaded) return;
      const drawWidth = width || this.width;
      const drawHeight = height || this.height;
      ctx.save();
      ctx.translate(x, y);
      if (rotation !== 0) ctx.rotate(rotation);
      ctx.scale(scaleX, scaleY);
      const offsetX = -drawWidth * this.pivotX;
      const offsetY = -drawHeight * this.pivotY;
      ctx.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    }
    /**
     * Get sprite bounds for collision detection
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} [width] - Width override
     * @param {number} [height] - Height override
     * @returns {Object} Bounds object with x, y, width, height
     */
    getBounds(x, y, width, height) {
      const w = width || this.width;
      const h = height || this.height;
      return {
        x: x - w * this.pivotX,
        y: y - h * this.pivotY,
        width: w,
        height: h
      };
    }
    /**
     * Clone this sprite asset with different configuration
     * @param {Object} [newConfig] - New configuration options
     * @returns {SpriteAsset} New sprite asset instance
     */
    clone(newConfig = {}) {
      const config = {
        width: this.width,
        height: this.height,
        pivotX: this.pivotX,
        pivotY: this.pivotY,
        ...newConfig
      };
      return new _SpriteAsset(this.imagePath, config);
    }
  };

  // src/asset/SpritesheetAsset.js
  var SpritesheetAsset = class {
    /**
     * Create a new spritesheet asset and automatically register it
     * @param {string} name - Name to register the spritesheet under (cannot contain colons)
     * @param {string} imagePath - Path to the spritesheet image
     * @param {Object} spriteData - Configuration for individual sprites
     * @param {number} [spriteData.spriteWidth] - Width of each sprite (for grid-based)
     * @param {number} [spriteData.spriteHeight] - Height of each sprite (for grid-based)
     * @param {number} [spriteData.columns] - Number of columns in the sheet (for grid-based)
     * @param {number} [spriteData.rows] - Number of rows in the sheet (for grid-based)
     * @param {Array} [spriteData.sprites] - Array of pixel coordinate-based sprite definitions: 
     *                                        [{name, startX, startY, endX, endY}, ...]
     * @param {Object} [spriteData.namedSprites] - Object of named sprite definitions (legacy support)
     */
    constructor(name, imagePath, spriteData) {
      if (name.includes(":")) {
        throw new Error(`SpritesheetAsset name "${name}" cannot contain colons. Colons are reserved for sprite notation within sheets.`);
      }
      this.name = name;
      this.imagePath = imagePath;
      this.spriteData = spriteData;
      this.image = null;
      this.isLoaded = false;
      this.sprites = /* @__PURE__ */ new Map();
      this.generateSprites();
      this._registerSelf();
      this.load();
    }
    /**
     * Automatically register this spritesheet asset and its individual sprites
     * @private
     */
    _registerSelf() {
      SpriteRegistry._addSpritesheet(this.name, this);
      this._registerIndividualSprites();
    }
    /**
     * Load the spritesheet image
     * @returns {Promise} Promise that resolves when image is loaded
     */
    load() {
      return new Promise((resolve, reject) => {
        this.image = new Image();
        this.image.onload = () => {
          this.isLoaded = true;
          this._updateSpriteWrappers();
          resolve(this);
        };
        this.image.onerror = reject;
        this.image.src = this.imagePath;
      });
    }
    /**
     * Generate sprite definitions from the spritesheet and register them in the unified registry
     * Supports both grid-based and pixel coordinate-based sprite definitions
     * @private
     */
    generateSprites() {
      const { spriteWidth, spriteHeight, columns, rows, sprites, namedSprites } = this.spriteData;
      if (columns != null && rows != null && spriteWidth != null && spriteHeight != null) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const index = row * columns + col;
            const spriteName = `sprite_${index}`;
            const spriteConfig = {
              x: col * spriteWidth,
              y: row * spriteHeight,
              width: spriteWidth,
              height: spriteHeight
            };
            this.sprites.set(spriteName, spriteConfig);
          }
        }
      }
      if (sprites != null && Array.isArray(sprites)) {
        sprites.forEach((sprite) => {
          if (sprite.name && sprite.startX != null && sprite.startY != null && sprite.endX != null && sprite.endY != null) {
            const spriteConfig = {
              x: sprite.startX,
              y: sprite.startY,
              width: sprite.endX - sprite.startX,
              height: sprite.endY - sprite.startY
            };
            this.sprites.set(sprite.name, spriteConfig);
          } else {
            console.warn(`Invalid sprite definition in "${this.name}":`, sprite);
          }
        });
      }
      if (namedSprites != null && typeof namedSprites === "object" && !Array.isArray(namedSprites)) {
        Object.entries(namedSprites).forEach(([name, config]) => {
          this.sprites.set(name, config);
        });
      }
    }
    /**
     * Update sprite wrappers after image loads
     * @private
     */
    _updateSpriteWrappers() {
      for (const spriteName of this.sprites.keys()) {
        const unifiedKey = `${this.name}:${spriteName}`;
        const spriteWrapper = SpriteRegistry.getSprite(unifiedKey);
        if (spriteWrapper) {
          spriteWrapper.image = this.image;
          spriteWrapper.isLoaded = this.isLoaded;
        }
      }
    }
    /**
     * Register individual sprites in the unified SpriteRegistry using colon notation
     * @private
     */
    _registerIndividualSprites() {
      for (const spriteName of this.sprites.keys()) {
        const unifiedKey = `${this.name}:${spriteName}`;
        SpriteRegistry._addSprite(unifiedKey, this._createSpriteWrapper(spriteName));
      }
    }
    /**
     * Create a sprite wrapper that acts like a SpriteAsset for individual spritesheet sprites
     * @param {string} spriteName - Name of the sprite within the sheet
     * @returns {Object} Sprite wrapper object
     * @private
     */
    _createSpriteWrapper(spriteName) {
      const spriteConfig = this.sprites.get(spriteName);
      if (!spriteConfig) return null;
      return {
        name: `${this.name}:${spriteName}`,
        image: this.image,
        // Will be null initially, updated when image loads
        isLoaded: this.isLoaded,
        // Will be false initially, updated when image loads
        width: spriteConfig.width,
        height: spriteConfig.height,
        pivotX: 0.5,
        // Default pivot for spritesheet sprites
        pivotY: 0.5,
        sourceX: spriteConfig.x,
        sourceY: spriteConfig.y,
        sourceWidth: spriteConfig.width,
        sourceHeight: spriteConfig.height,
        // Draw method for individual sprite from sheet
        draw: (ctx, x, y, width, height, rotation = 0, scaleX = 1, scaleY = 1) => {
          if (!this.isLoaded || !this.image) return;
          const drawWidth = width || spriteConfig.width;
          const drawHeight = height || spriteConfig.height;
          ctx.save();
          ctx.translate(x, y);
          if (rotation !== 0) ctx.rotate(rotation);
          ctx.scale(scaleX, scaleY);
          const offsetX = -drawWidth * 0.5;
          const offsetY = -drawHeight * 0.5;
          ctx.drawImage(
            this.image,
            spriteConfig.x,
            spriteConfig.y,
            spriteConfig.width,
            spriteConfig.height,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight
          );
          ctx.restore();
        },
        // Get bounds method for collision detection
        getBounds: (x, y, width, height) => {
          const w = width || spriteConfig.width;
          const h = height || spriteConfig.height;
          return {
            x: x - w * 0.5,
            y: y - h * 0.5,
            width: w,
            height: h
          };
        }
      };
    }
    /**
     * Get a specific sprite from the sheet
     * @param {string} spriteName - Name or index of the sprite
     * @returns {Object|null} Sprite configuration object
     */
    getSprite(spriteName) {
      return this.sprites.get(spriteName) || null;
    }
    /**
     * Get all available sprite names
     * @returns {Array<string>} Array of sprite names
     */
    getSpriteNames() {
      return Array.from(this.sprites.keys());
    }
    /**
     * Draw a specific sprite to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} spriteName - Name of the sprite to draw
     * @param {number} x - X position to draw at
     * @param {number} y - Y position to draw at
     * @param {number} [width] - Width to draw (defaults to sprite width)
     * @param {number} [height] - Height to draw (defaults to sprite height)
     */
    drawSprite(ctx, spriteName, x, y, width, height) {
      if (!this.isLoaded) return;
      const sprite = this.getSprite(spriteName);
      if (!sprite) return;
      const drawWidth = width || sprite.width;
      const drawHeight = height || sprite.height;
      ctx.drawImage(
        this.image,
        sprite.x,
        sprite.y,
        sprite.width,
        sprite.height,
        x,
        y,
        drawWidth,
        drawHeight
      );
    }
  };

  // src/index.js
  init_AudioAsset();

  // src/renderer/components/ImageComponent.js
  var ImageComponent = class extends Component {
    /**
     * Creates a new ImageComponent with specified source URL and optional dimensions.
     * 
     * Initializes the component with a source URL for image loading and optional custom
     * dimensions. If width/height are not provided, the component will use the image's
     * natural dimensions after loading. The component integrates with the metadata system
     * for configuration management and validation.
     * 
     * The image is not loaded immediately - call preload() or let the GameObject's
     * preload phase handle it automatically. This allows for proper async loading
     * management and prevents blocking the main thread.
     * 
     * @param {string} src - The source URL of the image to be loaded
     *   - Relative paths: "./assets/image.png"
     *   - Absolute URLs: "https://example.com/image.jpg"  
     *   - Data URLs: "data:image/png;base64,..."
     * @param {number} [width=null] - Custom width for rendering (pixels)
     *   - If null, uses image's natural width after loading
     *   - If specified, scales the image to this width
     * @param {number} [height=null] - Custom height for rendering (pixels)
     *   - If null, uses image's natural height after loading
     *   - If specified, scales the image to this height
     * 
     * @example
     * // Basic image with natural dimensions
     * const logo = obj.addComponent(ImageComponent, "./assets/logo.png");
     * 
     * @example
     * // Scaled image with custom dimensions
     * const banner = obj.addComponent(ImageComponent, "./assets/banner.jpg", 400, 100);
     * 
     * @example
     * // External image with aspect ratio preservation
     * const avatar = obj.addComponent(ImageComponent, avatarUrl, 64, 64);
     * 
     * @throws {Error} Via metadata validation if parameters are invalid types
     * 
     * @see {@link preload} For async image loading
     * @see {@link ImageComponent.meta} For metadata-based creation
     */
    constructor(src, width = null, height = null) {
      super();
      this.src = src;
      this.image = null;
      this.width = width;
      this.height = height;
    }
    /**
     * Provides default metadata configuration for ImageComponent instances.
     * 
     * This static method returns the baseline configuration that defines the structure
     * and default values for all ImageComponent metadata. Used by the metadata system
     * for initialization, validation, and ensuring consistent component configuration.
     * Forms the foundation for both constructor-based and factory-based component creation.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.src - Default empty source URL ("")
     * @returns {number|null} returns.width - Default width (null = use natural width)
     * @returns {number|null} returns.height - Default height (null = use natural height)
     * 
     * @example
     * // Get default configuration structure
     * const defaults = ImageComponent.getDefaultMeta();
     * console.log(defaults); // { src: "", width: null, height: null }
     * 
     * @example
     * // Use as template for custom configuration
     * const config = { ...ImageComponent.getDefaultMeta(), src: "./my-image.png" };
     * const imageComp = ImageComponent.meta(config);
     */
    static getDefaultMeta() {
      return {
        src: "",
        width: null,
        height: null
      };
    }
    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor calls and
     * the metadata system. It takes the constructor parameters and converts them to
     * a standardized metadata object that can be validated and applied consistently.
     * Essential for ensuring constructor-based creation works seamlessly with the
     * metadata infrastructure.
     * 
     * @private
     * @param {string} src - The source URL of the image to be loaded
     * @param {number} [width=null] - Optional custom width for rendering
     * @param {number} [height=null] - Optional custom height for rendering
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(src, width = null, height = null) {
      const metadata = {
        src: src || "",
        width,
        height
      };
      this.applyMeta(metadata);
    }
    /**
     * Updates component properties from current metadata configuration.
     * 
     * This private method synchronizes the component's internal properties with the
     * current metadata state. Called automatically when metadata is applied or updated,
     * ensuring the component reflects the latest configuration. Handles image resource
     * management by resetting the loaded image when the source URL changes.
     * 
     * @private
     * 
     * @internal Handles automatic image reset when src changes to prevent stale resources
     */
    _updatePropertiesFromMeta() {
      this.src = this.__meta.src;
      this.width = this.__meta.width;
      this.height = this.__meta.height;
      if (this.image && this.image.src !== this.src) {
        this.image = null;
      }
    }
    /**
     * Validates current metadata configuration for type safety and value ranges.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and valid value ranges. Called automatically when metadata is applied or updated
     * to provide immediate feedback on configuration errors. Essential for maintaining
     * component integrity and preventing runtime errors during rendering.
     * 
     * @private
     * @throws {Error} If src is not a string
     * @throws {Error} If width is not null or a positive number  
     * @throws {Error} If height is not null or a positive number
     * 
     * @internal Part of metadata validation system for type safety
     */
    _validateMeta() {
      const meta = this.__meta;
      if (typeof meta.src !== "string") {
        throw new Error("src must be a string");
      }
      if (meta.width !== null && (typeof meta.width !== "number" || meta.width <= 0)) {
        throw new Error("width must be null or a positive number");
      }
      if (meta.height !== null && (typeof meta.height !== "number" || meta.height <= 0)) {
        throw new Error("height must be null or a positive number");
      }
    }
    /**
     * Asynchronously preloads the image from the source URL.
     * 
     * This method handles the async loading of the image resource, creating a new Image
     * object and waiting for it to fully load before resolving. Called automatically
     * during the GameObject's preload phase, but can also be called manually for
     * explicit loading control. Sets up automatic fallback to natural dimensions
     * if custom width/height were not specified.
     * 
     * The loading is promise-based to ensure proper async handling and prevent
     * rendering attempts on unloaded images. Essential for smooth gameplay and
     * preventing visual glitches from missing assets.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the image is fully loaded
     *   and ready for rendering
     * 
     * @example
     * // Manual preloading with error handling
     * try {
     *     await imageComponent.preload();
     *     console.log("Image loaded successfully");
     * } catch (error) {
     *     console.error("Failed to load image:", error);
     * }
     * 
     * @example
     * // Preload before adding to scene
     * const imageComp = new ImageComponent("./assets/player.png");
     * await imageComp.preload();
     * gameObject.addComponent(imageComp);
     * 
     * @throws {Error} Implicitly if the image fails to load (network error, invalid URL, etc.)
     * 
     * @see {@link GameObject#preload} For automatic preloading during scene setup
     */
    async preload() {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = this.src;
        img.onload = () => {
          this.image = img;
          if (this.width === null) this.width = img.width;
          if (this.height === null) this.height = img.height;
          resolve();
        };
      });
    }
    /**
     * Renders the image to the canvas with full transform support.
     * 
     * This is the core rendering method that draws the loaded image at the GameObject's
     * global position with complete transform support including rotation. The image is
     * drawn centered on the position (Unity-style) rather than from the top-left corner,
     * providing intuitive positioning behavior for game objects.
     * 
     * Features:
     * - Center-based positioning for intuitive object placement
     * - Full rotation support following GameObject transform
     * - Custom or natural dimension rendering
     * - Proper canvas state management with save/restore
     * - Graceful handling of unloaded images
     * 
     * Called automatically during the engine's render phase. Only renders if the
     * image has been successfully loaded via preload().
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on
     * 
     * @example
     * // Drawing happens automatically, but this method provides:
     * // - Image positioning at GameObject.position (center-based)
     * // - Rotation from GameObject.rotation  
     * // - Scaling from width/height properties
     * // - Proper layering with canvas state management
     * 
     * @see {@link GameObject#getGlobalPosition} For position calculation
     * @see {@link GameObject#getGlobalRotation} For rotation handling
     * @see {@link preload} For ensuring image is loaded before rendering
     */
    draw(ctx) {
      if (this.image) {
        const position = this.gameObject.getGlobalPosition();
        const rotation = this.gameObject.getGlobalRotation();
        ctx.save();
        ctx.translate(position.x, position.y);
        if (rotation !== 0) {
          ctx.rotate(rotation);
        }
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
    }
    /**
     * Draws visual debugging gizmos for the image component.
     * 
     * This internal method renders debugging information to help developers visualize
     * image bounds, positioning, and configuration. Shows a magenta dashed rectangle
     * around the image's rendered area, a center point indicator, the filename label,
     * and actual dimensions. Only visible when internal gizmos are enabled in the
     * Game instance settings.
     * 
     * Gizmo elements displayed:
     * - Dashed magenta rectangle showing rendered image bounds
     * - Solid center point circle for position reference  
     * - Filename text label above the image (extracted from src URL)
     * - Dimensions text below the image showing current width x height
     * - Proper rotation handling to match image orientation
     * 
     * Uses a distinctive dash pattern (4,2) to differentiate from other component gizmos
     * while maintaining the standard magenta color scheme for visual consistency.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context for drawing gizmos
     * 
     * @private
     * @internal This method is part of the debugging visualization system
     * 
     * @example
     * // Gizmos are automatically drawn when enabled:
     * // Game.instance._internalGizmos = true;
     * // - Magenta dashed border shows image bounds
     * // - Center dot shows exact position
     * // - Filename and dimensions provide asset information
     * 
     * @see {@link Game#_internalGizmos} For enabling gizmo rendering
     */
    __internalGizmos(ctx) {
      if (!this.image) return;
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      ctx.save();
      ctx.translate(position.x, position.y);
      if (rotation !== 0) ctx.rotate(rotation);
      ctx.strokeStyle = "#FF00FF";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.setLineDash([]);
      ctx.fillStyle = "#FF00FF";
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#FF00FF";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      const filename = this.src.split("/").pop();
      ctx.fillText(filename, 0, -this.height / 2 - 8);
      ctx.fillText(`${this.width}x${this.height}`, 0, this.height / 2 + 15);
      ctx.restore();
    }
  };

  // src/renderer/components/ShapeComponent.js
  var ShapeComponent = class extends Component {
    /**
     * Creates a new ShapeComponent with specified shape type and rendering options.
     * 
     * Initializes the component with a shape type and comprehensive rendering options.
     * Supports multiple geometric shapes including rectangles, circles, ellipses, lines,
     * triangles, and custom polygons. Each shape type has its own specific options
     * while sharing common properties like color. Integrates with the metadata system
     * for configuration management and validation.
     * 
     * The component provides an efficient way to render geometric shapes without
     * requiring image assets, making it ideal for prototyping, UI elements, debug
     * visualization, and simple graphics.
     * 
     * @param {string} shape - Type of shape to render
     *   - "rectangle" - Rectangular shape with width/height
     *   - "square" - Square shape (uses width for both dimensions)
     *   - "circle" - Circular shape with radius
     *   - "ellipse" - Elliptical shape with radiusX/radiusY
     *   - "line" - Line segment with start/end coordinates
     *   - "triangle" - Triangular shape with size
     *   - "polygon" - Custom polygon with points array
     * 
     * @param {Object} [options={ width:10, height:10, color:'white' }] - Shape-specific rendering options
     * @param {number} [options.width=10] - Width for rectangles and squares
     * @param {number} [options.height=10] - Height for rectangles  
     * @param {string} [options.color='white'] - Fill color for the shape (any CSS color)
     * @param {number} [options.radius=10] - Radius for circles
     * @param {number} [options.radiusX=10] - X radius for ellipses
     * @param {number} [options.radiusY=5] - Y radius for ellipses
     * @param {number} [options.x2] - End X coordinate for lines (relative to shape position)
     * @param {number} [options.y2] - End Y coordinate for lines (relative to shape position)
     * @param {number} [options.size=20] - Size for triangles
     * @param {Array<{x: number, y: number}>} [options.points=[]] - Points array for polygons
     * 
     * @example
     * // Basic rectangle
     * const rect = obj.addComponent(ShapeComponent, "rectangle", { 
     *     width: 50, height: 30, color: "red" 
     * });
     * 
     * @example
     * // Circle with custom radius
     * const circle = obj.addComponent(ShapeComponent, "circle", {
     *     radius: 25, color: "#4ECDC4"
     * });
     * 
     * @example
     * // Custom polygon shape
     * const star = obj.addComponent(ShapeComponent, "polygon", {
     *     points: [[0,-20], [6,-6], [20,-6], [10,2], [16,14], [0,8], [-16,14], [-10,2], [-20,-6], [-6,-6]],
     *     color: "gold"
     * });
     * 
     * @throws {Error} Via metadata validation if parameters are invalid
     */
    constructor(shape, options = { radius: 10, width: 10, height: 10, color: "white" }) {
      super();
      this.__meta = this.constructor.getDefaultMeta();
      if (shape || Object.keys(options).length > 0) {
        this._applyConstructorArgs(shape, options);
      } else {
        this._updatePropertiesFromMeta();
      }
    }
    /**
     * Provides default metadata configuration for ShapeComponent instances.
     * 
     * This static method returns the baseline configuration that defines the structure
     * and default values for all ShapeComponent metadata. Includes comprehensive
     * options for all supported shape types to ensure consistent configuration
     * regardless of which shape type is selected.
     * 
     * @static
     * @returns {Object} Default metadata configuration object
     * @returns {string} returns.shape - Default shape type ("rectangle")
     * @returns {Object} returns.options - Shape rendering options
     * @returns {number} returns.options.width - Default width for rectangles (10)
     * @returns {number} returns.options.height - Default height for rectangles (10)
     * @returns {string} returns.options.color - Default fill color ("white")
     * @returns {number} returns.options.radius - Default radius for circles (10)
     * @returns {number} returns.options.radiusX - Default X radius for ellipses (10)
     * @returns {number} returns.options.radiusY - Default Y radius for ellipses (5)
     * @returns {number} returns.options.x2 - Default end X coordinate for lines (10)
     * @returns {number} returns.options.y2 - Default end Y coordinate for lines (0)
     * @returns {number} returns.options.size - Default size for triangles (20)
     * @returns {Array} returns.options.points - Default points array for polygons ([])
     */
    static getDefaultMeta() {
      return {
        shape: "rectangle",
        options: {
          width: 10,
          height: 10,
          color: "white",
          radius: 10,
          radiusX: 10,
          radiusY: 5,
          x2: 10,
          y2: 0,
          size: 20,
          points: []
        }
      };
    }
    /**
     * Converts constructor arguments to metadata format for internal processing.
     * 
     * This private method bridges the gap between traditional constructor calls and
     * the metadata system. It takes the constructor parameters and converts them to
     * a standardized metadata object that can be validated and applied consistently.
     * Handles the complex options object by merging with default options.
     * 
     * @private
     * @param {string} shape - The shape type to render
     * @param {Object} [options={}] - Shape-specific rendering options
     * 
     * @internal This method is part of the metadata system infrastructure
     */
    _applyConstructorArgs(shape, options = {}) {
      const metadata = {
        shape: shape || "rectangle",
        options: { ...this.__meta.options, ...options }
      };
      this.applyMeta(metadata);
    }
    /**
     * Updates component properties from current metadata configuration.
     * 
     * This private method synchronizes the component's internal properties with the
     * current metadata state. Called automatically when metadata is applied or updated,
     * ensuring the component reflects the latest configuration. Creates a new options
     * object to prevent unwanted mutations of the metadata.
     * 
     * @private
     * 
     * @internal Ensures proper isolation between metadata and component properties
     */
    _updatePropertiesFromMeta() {
      this.shape = this.__meta.shape;
      this.options = { ...this.__meta.options };
    }
    /**
     * Validates current metadata configuration for type safety and shape-specific requirements.
     * 
     * This private method ensures all metadata properties conform to expected types
     * and valid value ranges for each shape type. Called automatically when metadata
     * is applied or updated to provide immediate feedback on configuration errors.
     * Includes comprehensive validation for all supported shape types and their
     * specific requirements.
     * 
     * @private
     * @throws {Error} If shape type is not supported
     * @throws {Error} If color is not a string
     * @throws {Error} If rectangle/square dimensions are invalid
     * @throws {Error} If circle radius is invalid
     * @throws {Error} If ellipse radii are invalid
     * @throws {Error} If triangle size is invalid
     * @throws {Error} If polygon has insufficient points
     * 
     * @internal Part of metadata validation system for comprehensive shape validation
     */
    _validateMeta() {
      const validShapes = ["rectangle", "square", "circle", "ellipse", "line", "triangle", "polygon"];
      if (!validShapes.includes(this.__meta.shape)) {
        throw new Error(`ShapeComponent: Invalid shape type "${this.__meta.shape}". Valid types: ${validShapes.join(", ")}`);
      }
      if (typeof this.__meta.options.color !== "string") {
        throw new Error("ShapeComponent: options.color must be a string");
      }
      if (["rectangle", "square"].includes(this.__meta.shape)) {
        if (this.__meta.options.width <= 0 || this.__meta.options.height <= 0) {
          throw new Error("ShapeComponent: width and height must be greater than 0 for rectangles");
        }
      }
      if (this.__meta.shape === "circle" && this.__meta.options.radius <= 0) {
        throw new Error("ShapeComponent: radius must be greater than 0 for circles");
      }
    }
    // Getter and setter methods for easy property access
    get color() {
      return this.options.color || "black";
    }
    set color(color) {
      this.options.color = color;
    }
    get width() {
      return this.options.width || 10;
    }
    set width(width) {
      this.options.width = width;
    }
    get height() {
      return this.options.height || 10;
    }
    set height(height) {
      this.options.height = height;
    }
    get radius() {
      return this.options.radius || 10;
    }
    set radius(radius) {
      this.options.radius = radius;
    }
    get radiusX() {
      return this.options.radiusX || 10;
    }
    set radiusX(radiusX) {
      this.options.radiusX = radiusX;
    }
    get radiusY() {
      return this.options.radiusY || 5;
    }
    set radiusY(radiusY) {
      this.options.radiusY = radiusY;
    }
    get points() {
      return this.options.points || [];
    }
    set points(points) {
      this.options.points = points;
    }
    get x2() {
      return this.options.x2 || 10;
    }
    set x2(x2) {
      this.options.x2 = x2;
    }
    get y2() {
      return this.options.y2 || 0;
    }
    set y2(y2) {
      this.options.y2 = y2;
    }
    get size() {
      return this.options.size || 20;
    }
    set size(size) {
      this.options.size = size;
    }
    /**
     * Draws the shape on the canvas. Called automatically during the render phase.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __draw(ctx) {
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      ctx.save();
      if (rotation !== 0) {
        ctx.translate(position.x, position.y);
        ctx.rotate(rotation);
        this.drawShape(ctx, 0, 0);
      } else {
        this.drawShape(ctx, position.x, position.y);
      }
      ctx.restore();
    }
    /**
     * Draws the actual shape based on the type.
     * @private
     */
    drawShape(ctx, x, y) {
      switch (this.shape) {
        case "rectangle":
        case "square":
          this.drawRect(ctx, x, y);
          break;
        case "circle":
          this.drawCircle(ctx, x, y);
          break;
        case "ellipse":
          this.drawEllipse(ctx, x, y);
          break;
        case "line":
          this.drawLine(ctx, x, y);
          break;
        case "triangle":
          this.drawTriangle(ctx, x, y);
          break;
        case "polygon":
          this.drawPolygon(ctx, x, y);
          break;
        default:
          throw new Error(`ShapeComponent: Unsupported shape type "${this.shape}"`);
          break;
      }
    }
    /**
     * Draws a rectangle.
     * @private
     */
    drawRect(ctx, x, y) {
      const { width = 10, height = 10, color = "black" } = this.options;
      ctx.fillStyle = color;
      ctx.fillRect(x - width / 2, y - height / 2, width, height);
    }
    /**
     * Draws a circle.
     * @private
     */
    drawCircle(ctx, x, y) {
      const { radius = 10, color = "black" } = this.options;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    /**
     * Draws an ellipse.
     * @private
     */
    drawEllipse(ctx, x, y) {
      const { radiusX = 10, radiusY = 5, color = "black" } = this.options;
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    /**
     * Draws a line.
     * @private
     */
    drawLine(ctx, x, y) {
      const { x2 = x + 10, y2 = y, color = "black", width = 2 } = this.options;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    /**
     * Draws a triangle.
     * @private
     */
    drawTriangle(ctx, x, y) {
      const { size = 20, color = "black" } = this.options;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size / 2, y - size);
      ctx.closePath();
      ctx.fill();
    }
    /**
     * Draws a polygon from an array of points.
     * @private
     */
    drawPolygon(ctx, x, y) {
      const { points = [], color = "black" } = this.options;
      if (points.length < 3) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + points[0][0], y + points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(x + points[i][0], y + points[i][1]);
      }
      ctx.closePath();
      ctx.fill();
    }
    /**
     * Draws gizmos for shape visualization
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw with
     * @private
     */
    __internalGizmos(ctx) {
      if (!this.gameObject) return;
      const position = this.gameObject.getGlobalPosition();
      const rotation = this.gameObject.getGlobalRotation();
      ctx.save();
      ctx.translate(position.x, position.y);
      if (rotation !== 0) ctx.rotate(rotation);
      ctx.strokeStyle = "#FF00FF";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 2]);
      const { shape, size = 10, width = 10, height = 10 } = this.options;
      switch (shape) {
        case "rectangle":
          ctx.strokeRect(-width / 2, -height / 2, width, height);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case "triangle":
          const triangleHeight = size;
          ctx.beginPath();
          ctx.moveTo(0, -triangleHeight / 2);
          ctx.lineTo(-size / 2, triangleHeight / 2);
          ctx.lineTo(size / 2, triangleHeight / 2);
          ctx.closePath();
          ctx.stroke();
          break;
        case "polygon":
          const { points = [] } = this.options;
          if (points.length >= 3) {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.stroke();
          }
          break;
      }
      ctx.setLineDash([]);
      ctx.fillStyle = "#FF00FF";
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#FF00FF";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Shape: ${shape || "none"}`, 0, -Math.max(size, height) / 2 - 8);
      let sizeText = "";
      switch (shape) {
        case "rectangle":
          sizeText = `${width}x${height}`;
          break;
        case "circle":
          sizeText = `r:${size}`;
          break;
        case "triangle":
          sizeText = `s:${size}`;
          break;
        case "polygon":
          sizeText = `${this.options.points?.length || 0} pts`;
          break;
      }
      if (sizeText) {
        ctx.fillText(sizeText, 0, Math.max(size, height) / 2 + 15);
      }
      ctx.restore();
    }
  };

  // src/renderer/components/TilemapComponent.js
  init_TileRegistry();
  init_Tile();
  var TilemapComponent = class extends Component {
    /**
     * Create a new tilemap component with the specified configuration.
     * 
     * Initializes a tilemap with tile definitions, grid layout, and rendering options.
     * The tilemap supports mixed tile references, allowing tiles from the registry,
     * direct tile objects, and empty spaces to be used together in a single map.
     * 
     * @param {Object} config - Complete tilemap configuration object
     * @param {number} [config.tileSize=32] - Default size for both width and height of tiles in pixels
     * @param {number} [config.tileWidth] - Custom tile width in pixels (overrides tileSize)
     * @param {number} [config.tileHeight] - Custom tile height in pixels (overrides tileSize)
     * @param {Object} config.tiles - Tile mapping defining available tiles by ID
     *                               Format: { id: tileReference } where tileReference can be:
     *                               - null/undefined: Empty space
     *                               - string: Tile name from TileRegistry
     *                               - Tile: Direct tile object
     * @param {Array[]} config.grid - 2D array defining tile placement using tile IDs
     *                               Format: [[row0_tiles], [row1_tiles], ...]
     * @param {number} [config.zIndex=0] - Rendering layer depth for sorting
     * @param {boolean} [config.enableCollision=true] - Whether to generate collision metadata for tiles
     * @param {string} [config.sortingLayer="Default"] - Sorting layer name for rendering organization
     * 
     * @throws {Error} If config.tiles is not provided
     * @throws {Error} If config.grid is not provided or is empty
     * 
     * @example
     * // Basic tilemap configuration
     * const simpleTilemap = new TilemapComponent({
     *     tileSize: 16,
     *     tiles: {
     *         0: null,           // Empty space
     *         1: "grass",        // Registry reference
     *         2: "stone"         // Registry reference
     *     },
     *     grid: [
     *         [2,2,2,2],
     *         [2,1,1,2],
     *         [2,2,2,2]
     *     ]
     * });
     * 
     * // Advanced tilemap with mixed references
     * const advancedTilemap = new TilemapComponent({
     *     tileWidth: 32,
     *     tileHeight: 24,        // Non-square tiles
     *     tiles: {
     *         0: null,
     *         1: "grass",        // From registry
     *         2: new Tile("custom", "special:tile", { opacity: 0.8 }), // Direct object
     *         3: "water"         // From registry
     *     },
     *     grid: [
     *         [1,1,1,1,1],
     *         [1,2,0,2,1],
     *         [3,3,3,3,3]
     *     ],
     *     enableCollision: true,
     *     zIndex: 1,
     *     sortingLayer: "Environment"
     * });
     */
    constructor(config = {}) {
      super();
      this.tileSize = config.tileSize || 32;
      this.tileWidth = config.tileWidth || this.tileSize;
      this.tileHeight = config.tileHeight || this.tileSize;
      this.tiles = config.tiles || {};
      this.grid = config.grid || [];
      this.zIndex = config.zIndex || 0;
      this.sortingLayer = config.sortingLayer || "Default";
      this.enableCollision = config.enableCollision !== false;
      this.resolvedTiles = /* @__PURE__ */ new Map();
      this.resolvedSprites = /* @__PURE__ */ new Map();
      this.colliders = [];
      this.gridWidth = this.grid.length > 0 ? this.grid[0].length : 0;
      this.gridHeight = this.grid.length;
    }
    /**
     * Initialize the tilemap component when added to a GameObject.
     * 
     * Performs initial setup including tile resolution from the TileRegistry
     * and SpriteRegistry, and collision generation. This method is called
     * automatically by the component system.
     * 
     * @since 1.0.0
     */
    start() {
      this.resolveTiles();
      this.createColliders();
    }
    /**
     * Resolve all tile references to actual tile and sprite objects.
     * 
     * Processes the tile mapping to convert string references into actual tile objects
     * from the TileRegistry and resolves their sprites from the SpriteRegistry.
     * Invalid references are logged as warnings but don't stop processing.
     * 
     * @private
     * @since 1.0.0
     */
    resolveTiles() {
      this.resolvedTiles.clear();
      this.resolvedSprites.clear();
      for (const [id, tileRef] of Object.entries(this.tiles)) {
        if (tileRef === null || tileRef === void 0) {
          this.resolvedTiles.set(id, null);
          continue;
        }
        let tile = null;
        if (typeof tileRef === "string") {
          tile = TileRegistry.getTile(tileRef);
          if (!tile) {
            console.warn(`TilemapComponent: Tile "${tileRef}" not found in TileRegistry`);
            continue;
          }
        } else if (tileRef instanceof Tile) {
          tile = tileRef;
        } else {
          console.warn(`TilemapComponent: Invalid tile reference for id "${id}":`, tileRef);
          continue;
        }
        this.resolvedTiles.set(id, tile);
        const sprite = SpriteRegistry.getSprite(tile.spriteName);
        if (!sprite) {
          console.warn(`TilemapComponent: Sprite "${tile.spriteName}" not found for tile "${tile.name}"`);
        } else {
          this.resolvedSprites.set(id, sprite);
        }
      }
    }
    /**
     * Create colliders for solid tiles
     * @private
     */
    createColliders() {
      if (!this.enableCollision) return;
      this.clearColliders();
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          const tileId = this.grid[row][col];
          const tile = this.resolvedTiles.get(String(tileId));
          if (tile && tile.hasCollision()) {
            this.createTileCollider(tile, col, row);
          }
        }
      }
    }
    /**
     * Create a collider for a specific tile
     * @param {Tile} tile - The tile to create collision for
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @private
     */
    createTileCollider(tile, col, row) {
      const worldX = this.gameObject.x + col * this.tileWidth;
      const worldY = this.gameObject.y + row * this.tileHeight;
      const colliderData = {
        x: worldX,
        y: worldY,
        width: tile.collider.width || this.tileWidth,
        height: tile.collider.height || this.tileHeight,
        radius: tile.collider.radius,
        type: tile.collider.type || "box",
        trigger: tile.collider.trigger || false,
        tile,
        gridX: col,
        gridY: row
      };
      this.colliders.push(colliderData);
    }
    /**
     * Clear all tile colliders
     * @private
     */
    clearColliders() {
      this.colliders = [];
    }
    /**
     * Render the tilemap
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    __draw(ctx) {
      ctx.save();
      ctx.translate(this.gameObject.x, this.gameObject.y);
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          this.renderTile(ctx, col, row);
        }
      }
      ctx.restore();
    }
    draw(ctx) {
    }
    /**
     * Render a single tile
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @private
     */
    renderTile(ctx, col, row) {
      const tileId = this.grid[row][col];
      const tile = this.resolvedTiles.get(String(tileId));
      const sprite = this.resolvedSprites.get(String(tileId));
      if (!tile || !sprite) return;
      const x = col * this.tileWidth;
      const y = row * this.tileHeight;
      ctx.save();
      if (tile.opacity !== 1) {
        ctx.globalAlpha = tile.opacity;
      }
      if (tile.color !== "#FFFFFF") {
        ctx.fillStyle = tile.color;
        ctx.globalCompositeOperation = "multiply";
      }
      if (tile.flipX || tile.flipY) {
        ctx.translate(x + this.tileWidth / 2, y + this.tileHeight / 2);
        ctx.scale(tile.flipX ? -1 : 1, tile.flipY ? -1 : 1);
        ctx.translate(-this.tileWidth / 2, -this.tileHeight / 2);
      } else {
        ctx.translate(x, y);
      }
      const renderWidth = tile.width || this.tileWidth;
      const renderHeight = tile.height || this.tileHeight;
      if (sprite.image && sprite.image.complete) {
        sprite.draw(ctx, renderWidth / 2, renderHeight / 2, renderWidth, renderHeight, 0);
      }
      ctx.restore();
    }
    /**
     * Get the tile at specific grid coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @returns {Tile|null} The tile at the position or null
     */
    getTileAt(col, row) {
      if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
        return null;
      }
      const tileId = this.grid[row][col];
      return this.resolvedTiles.get(String(tileId)) || null;
    }
    /**
     * Set a tile at specific grid coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @param {string|number} tileId - Tile ID to set
     */
    setTileAt(col, row, tileId) {
      if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
        return;
      }
      this.grid[row][col] = tileId;
      if (this.enableCollision) {
        this.createColliders();
      }
    }
    /**
     * Convert world coordinates to grid coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} { col, row } grid coordinates
     */
    worldToGrid(worldX, worldY) {
      const localX = worldX - this.gameObject.x;
      const localY = worldY - this.gameObject.y;
      return {
        col: Math.floor(localX / this.tileWidth),
        row: Math.floor(localY / this.tileHeight)
      };
    }
    /**
     * Convert grid coordinates to world coordinates
     * @param {number} col - Grid column
     * @param {number} row - Grid row
     * @returns {Object} { x, y } world coordinates
     */
    gridToWorld(col, row) {
      return {
        x: this.gameObject.x + col * this.tileWidth,
        y: this.gameObject.y + row * this.tileHeight
      };
    }
    /**
     * Get all tiles matching a filter
     * @param {function} filterFn - Filter function (tile, col, row) => boolean
     * @returns {Array} Array of { tile, col, row } objects
     */
    getTilesWhere(filterFn) {
      const results = [];
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          const tile = this.getTileAt(col, row);
          if (tile && filterFn(tile, col, row)) {
            results.push({ tile, col, row });
          }
        }
      }
      return results;
    }
    /**
     * Update tilemap (called every frame)
     */
    update(deltaTime) {
    }
    /**
     * Clean up tilemap resources
     */
    destroy() {
      this.clearColliders();
      this.resolvedTiles.clear();
      this.resolvedSprites.clear();
      super.destroy();
    }
  };

  // src/physics/components/CircleColliderComponent.js
  var CircleColliderComponent = class _CircleColliderComponent extends AbstractColliderComponent {
    /**
     * Creates a new CircleColliderComponent.
     * 
     * @param {number} [radius=null] - Radius of the collider in pixels. If null, uses sprite width/2
     * @param {boolean} [trigger=false] - Whether this collider acts as a trigger (no physics response)
     */
    constructor(radius = null, trigger = false) {
      super();
      this.radius = radius;
      this.trigger = trigger;
    }
    /**
     * Get default metadata configuration for CircleColliderComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        radius: null,
        trigger: false
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(radius = null, trigger = false) {
      const metadata = {
        radius,
        trigger
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.radius = this.__meta.radius;
      this.trigger = this.__meta.trigger;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (meta.radius !== null && (typeof meta.radius !== "number" || meta.radius <= 0)) {
        throw new Error("radius must be null or a positive number");
      }
      if (typeof meta.trigger !== "boolean") {
        throw new Error("trigger must be a boolean");
      }
    }
    /**
     * Checks collision with another collider component.
     * 
     * @param {AbstractColliderComponent} other - The other collider to check against
     * @returns {boolean} True if colliding, false otherwise
     */
    checkCollisionWith(other) {
      if (other instanceof _CircleColliderComponent) {
        const a = this.getBounds();
        const b = other.getBounds();
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        return distance < a.radius + b.radius;
      } else {
        return this.circleBoxCollision(other);
      }
    }
    /**
     * Performs circle-box collision detection.
     * 
     * @param {BoxColliderComponent} box - The box collider to check against
     * @returns {boolean} True if colliding, false otherwise
     */
    circleBoxCollision(box) {
      const circle = this.getBounds();
      const b = box.getBounds();
      const closestX = Math.max(b.x, Math.min(circle.x, b.x + b.width));
      const closestY = Math.max(b.y, Math.min(circle.y, b.y + b.height));
      const dx = circle.x - closestX;
      const dy = circle.y - closestY;
      return dx * dx + dy * dy < circle.radius * circle.radius;
    }
    /**
     * Gets the bounds of this collider for collision detection.
     * 
     * @returns {Object} Bounds object with x, y, and radius properties
     */
    getBounds() {
      const position = this.gameObject.getGlobalPosition();
      let r = this.radius;
      return { x: position.x, y: position.y, radius: r };
    }
    /**
     * Draws gizmos for the circle collider bounds.
     * This method is called automatically by the engine for debugging visualization.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __internalGizmos(ctx) {
      const bounds = this.getBounds();
      ctx.save();
      ctx.strokeStyle = this.trigger ? "#00ffddff" : "#00FF00";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(bounds.x, bounds.y, bounds.radius, 0, Math.PI * 2);
      ctx.stroke();
      const crossSize = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(bounds.x - crossSize, bounds.y);
      ctx.lineTo(bounds.x + crossSize, bounds.y);
      ctx.moveTo(bounds.x, bounds.y - crossSize);
      ctx.lineTo(bounds.x, bounds.y + crossSize);
      ctx.stroke();
      ctx.restore();
    }
  };

  // src/physics/components/BoxColliderComponent.js
  var BoxColliderComponent = class _BoxColliderComponent extends AbstractColliderComponent {
    constructor(width = null, height = null, trigger = false) {
      super();
      this.width = width;
      this.height = height;
      this.trigger = trigger;
    }
    /**
     * Get default metadata configuration for BoxColliderComponent
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        width: null,
        height: null,
        trigger: false
      };
    }
    /**
     * Apply constructor arguments to metadata format
     * @private
     */
    _applyConstructorArgs(width = null, height = null, trigger = false) {
      const metadata = {
        width,
        height,
        trigger
      };
      this.applyMeta(metadata);
    }
    /**
     * Update component properties from current metadata
     * @private
     */
    _updatePropertiesFromMeta() {
      this.width = this.__meta.width;
      this.height = this.__meta.height;
      this.trigger = this.__meta.trigger;
    }
    /**
     * Validate current metadata
     * @private
     */
    _validateMeta() {
      const meta = this.__meta;
      if (meta.width !== null && (typeof meta.width !== "number" || meta.width <= 0)) {
        throw new Error("width must be null or a positive number");
      }
      if (meta.height !== null && (typeof meta.height !== "number" || meta.height <= 0)) {
        throw new Error("height must be null or a positive number");
      }
      if (typeof meta.trigger !== "boolean") {
        throw new Error("trigger must be a boolean");
      }
    }
    checkCollisionWith(other) {
      if (other instanceof _BoxColliderComponent) {
        return this.checkBoxBoxCollision(other);
      } else if (other instanceof CircleColliderComponent) {
        return other.checkCollisionWith(this);
      }
      return false;
    }
    checkBoxBoxCollision(other) {
      const a = this.getBounds();
      const b = other.getBounds();
      const tolerance = 0.01;
      return a.x < b.x + b.width + tolerance && a.x + a.width + tolerance > b.x && a.y < b.y + b.height + tolerance && a.y + a.height + tolerance > b.y;
    }
    getBounds() {
      const position = this.gameObject.getGlobalPosition();
      let w = this.width;
      let h = this.height;
      return {
        x: position.x - w / 2,
        y: position.y - h / 2,
        width: w,
        height: h
      };
    }
    /**
     * Draws gizmos for the box collider bounds.
     * This method is called automatically by the engine for debugging visualization.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    __internalGizmos(ctx) {
      const bounds = this.getBounds();
      ctx.save();
      ctx.strokeStyle = this.trigger ? "#00ffddff" : "#00FF00";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;
      const crossSize = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(centerX - crossSize, centerY);
      ctx.lineTo(centerX + crossSize, centerY);
      ctx.moveTo(centerX, centerY - crossSize);
      ctx.lineTo(centerX, centerY + crossSize);
      ctx.stroke();
      ctx.restore();
    }
  };

  // src/math/Random.js
  var Random = class {
    /**
     * Generates a random number between min and max (inclusive).
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} A random number between min and max.
     */
    static range(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  };

  // src/math/Vector3.js
  var Vector3 = class _Vector3 {
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
    static get zero() {
      return new _Vector3(0, 0, 0);
    }
    static get one() {
      return new _Vector3(1, 1, 1);
    }
    static get up() {
      return new _Vector3(0, 1, 0);
    }
    static get down() {
      return new _Vector3(0, -1, 0);
    }
    static get left() {
      return new _Vector3(-1, 0, 0);
    }
    static get right() {
      return new _Vector3(1, 0, 0);
    }
    static get forward() {
      return new _Vector3(0, 0, 1);
    }
    static get back() {
      return new _Vector3(0, 0, -1);
    }
    static get positiveInfinity() {
      return new _Vector3(Infinity, Infinity, Infinity);
    }
    static get negativeInfinity() {
      return new _Vector3(-Infinity, -Infinity, -Infinity);
    }
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
      if (mag === 0) return _Vector3.zero;
      return new _Vector3(this.x / mag, this.y / mag, this.z / mag);
    }
    /**
     * Adds another vector to this vector.
     * @param {Vector3} other - The vector to add
     * @returns {Vector3} A new vector representing the sum
     */
    add(other) {
      return new _Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    /**
     * Subtracts another vector from this vector.
     * @param {Vector3} other - The vector to subtract
     * @returns {Vector3} A new vector representing the difference
     */
    subtract(other) {
      return new _Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    /**
     * Multiplies this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector3} A new vector representing the product
     */
    multiply(scalar) {
      return new _Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    /**
     * Divides this vector by a scalar.
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector3} A new vector representing the quotient
     */
    divide(scalar) {
      if (scalar === 0) throw new Error("Cannot divide by zero");
      return new _Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
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
      return new _Vector3(this.x, this.y, this.z);
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
      return new _Vector3(
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
      t = Math.max(0, Math.min(1, t));
      return new _Vector3(
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
      return new _Vector3(
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
      t = Math.max(0, Math.min(1, t));
      const dot = _Vector3.dot(a.normalized, b.normalized);
      const clampedDot = Math.max(-1, Math.min(1, dot));
      if (Math.abs(clampedDot) > 0.9995) {
        return _Vector3.lerp(a, b, t);
      }
      const theta = Math.acos(Math.abs(clampedDot));
      const sinTheta = Math.sin(theta);
      const factorA = Math.sin((1 - t) * theta) / sinTheta;
      const factorB = Math.sin(t * theta) / sinTheta;
      if (clampedDot < 0) {
        return new _Vector3(
          factorA * a.x - factorB * b.x,
          factorA * a.y - factorB * b.y,
          factorA * a.z - factorB * b.z
        );
      }
      return new _Vector3(
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
      return new _Vector3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    /**
     * Returns a vector with the maximum components of two vectors.
     * @param {Vector3} a - First vector
     * @param {Vector3} b - Second vector
     * @returns {Vector3} Vector with maximum components
     */
    static max(a, b) {
      return new _Vector3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
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
      const factor = -2 * _Vector3.dot(inNormal, inDirection);
      return new _Vector3(
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
      const dot = Math.max(-1, Math.min(1, _Vector3.dot(from, to) / denominator));
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
      if (sqrMag < 1e-15) return _Vector3.zero;
      const dot = _Vector3.dot(vector, onNormal);
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
      const dot = _Vector3.dot(vector, planeNormal);
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
        return new _Vector3(normalizedX * maxLength, normalizedY * maxLength, normalizedZ * maxLength);
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
        const angle = _Vector3.angle(currentNorm, targetNorm);
        if (angle > 1e-15) {
          const t = Math.min(1, maxRadiansDelta / angle);
          const newDirection = _Vector3.slerp(currentNorm, targetNorm, t);
          const newMagnitude2 = currentMag + Math.max(-maxMagnitudeDelta, Math.min(maxMagnitudeDelta, targetMag - currentMag));
          return newDirection.multiply(newMagnitude2);
        }
      }
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
      smoothTime = Math.max(1e-4, smoothTime);
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
      return new _Vector3(outputX, outputY, outputZ);
    }
    /**
     * Returns an orthonormal basis from a single vector.
     * @param {Vector3} normal - The normal vector (will be normalized)
     * @returns {Object} Object containing {normal, tangent, binormal}
     */
    static orthonormalize(normal) {
      const norm = normal.normalized;
      let tangent;
      if (Math.abs(norm.x) < 0.9) {
        tangent = _Vector3.cross(norm, _Vector3.right).normalized;
      } else {
        tangent = _Vector3.cross(norm, _Vector3.up).normalized;
      }
      const binormal = _Vector3.cross(norm, tangent).normalized;
      return {
        normal: norm,
        tangent,
        binormal
      };
    }
  };

  // src/extensions/movement/FollowTarget.js
  var FollowTarget = class extends Component {
    constructor(target) {
      super();
      this.target = target;
    }
    update() {
      if (!this.target) return;
      if (this.target instanceof Vector2) {
        this.gameObject.setPosition(this.target);
      } else if (this.target.position) {
        this.gameObject.setPosition(this.target.position);
      } else {
        this.gameObject.setPosition(this.target.x, this.target.y);
      }
    }
  };

  // src/index.js
  init_AudioClip();

  // src/audio/components/AudioListenerComponent.js
  var AudioListenerComponent = class _AudioListenerComponent extends Component {
    /**
     * Creates a new AudioListener component.
     * 
     * Initializes the audio listener with default settings and attempts to set
     * itself as the main listener. If another listener is already active, this
     * one will be inactive until the main listener is removed or this listener
     * is explicitly activated.
     * 
     * @example
     * // Basic listener setup
     * const listener = new AudioListenerComponent();
     * cameraObject.addComponent(listener);
     */
    constructor() {
      super();
      this.masterVolume = 1;
      this.dopplerFactor = 1;
      this.rolloffFactor = 1;
      this.isActive = false;
      if (!_AudioListenerComponent.main) {
        this.setAsMainListener();
      }
      console.log(`\u{1F3A7} AudioListener created ${this.isActive ? "(ACTIVE)" : "(inactive)"}`);
    }
    /**
     * Activates this listener as the main audio listener.
     * 
     * Sets this listener as the main audio receiver and deactivates any other
     * listeners in the scene. Only one listener should be active at a time to
     * avoid audio processing conflicts.
     * 
     * @example
     * // Switch to this listener
     * const newListener = camera2.getComponent(AudioListenerComponent);
     * newListener.setAsMainListener();
     */
    setAsMainListener() {
      if (_AudioListenerComponent.main && _AudioListenerComponent.main !== this) {
        _AudioListenerComponent.main.isActive = false;
        console.log("\u{1F3A7} Previous AudioListener deactivated");
      }
      _AudioListenerComponent.main = this;
      this.isActive = true;
      console.log("\u{1F3A7} AudioListener activated as main listener");
    }
    /**
     * Calculates 3D audio parameters based on listener and source positions.
     * 
     * Determines volume attenuation and stereo panning for an audio source based
     * on its position relative to this listener. This creates realistic 3D audio
     * positioning where distant sounds are quieter and sounds to the left/right
     * are panned accordingly.
     * 
     * @param {Vector2} sourcePosition - World position of the audio source
     * @param {number} maxDistance - Maximum audible distance for the source
     * @param {number} rolloffMode - Distance rolloff mode ('linear', 'logarithmic', 'custom')
     * @returns {Object} Audio parameters for 3D positioning
     * @returns {number} returns.volume - Volume multiplier (0.0 to 1.0)
     * @returns {number} returns.pan - Stereo pan value (-1.0 to 1.0, left to right)
     * @returns {number} returns.distance - Distance between listener and source
     * 
     * @example
     * // Calculate audio parameters for a sound source
     * const audioParams = listener.calculate3DAudio(
     *     sourcePosition, 
     *     500,        // Max distance
     *     'linear'    // Rolloff mode
     * );
     * console.log(`Volume: ${audioParams.volume}, Pan: ${audioParams.pan}`);
     */
    calculate3DAudio(sourcePosition, maxDistance = 500, rolloffMode = "linear") {
      if (!this.isActive || !this.gameObject) {
        return { volume: 0, pan: 0, distance: Infinity };
      }
      const listenerPosition = this.gameObject.position;
      const deltaX = sourcePosition.x - listenerPosition.x;
      const deltaY = sourcePosition.y - listenerPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      let volume = 1;
      if (distance > 0 && maxDistance > 0) {
        switch (rolloffMode) {
          case "linear":
            volume = Math.max(0, 1 - distance / maxDistance);
            break;
          case "logarithmic":
            volume = Math.max(0, 1 / (1 + distance / maxDistance));
            break;
          case "inverse":
            volume = Math.max(0, maxDistance / (maxDistance + distance));
            break;
          default:
            volume = Math.max(0, 1 - distance / maxDistance);
        }
      }
      volume *= this.rolloffFactor * this.masterVolume;
      let pan = 0;
      if (distance > 0) {
        const maxPanDistance = maxDistance * 0.5;
        pan = Math.max(-1, Math.min(1, deltaX / maxPanDistance));
      }
      return {
        volume: Math.max(0, Math.min(1, volume)),
        pan: Math.max(-1, Math.min(1, pan)),
        distance
      };
    }
    /**
     * Sets the global master volume for all audio.
     * 
     * @param {number} volume - Master volume (0.0 to 1.0)
     * 
     * @example
     * // Set master volume to 50%
     * listener.setMasterVolume(0.5);
     */
    setMasterVolume(volume) {
      this.masterVolume = Math.max(0, Math.min(1, volume));
      console.log(`\u{1F50A} Master volume set to ${(this.masterVolume * 100).toFixed(0)}%`);
    }
    /**
     * Gets the current world position of the listener.
     * 
     * @returns {Vector2|null} Listener position or null if no GameObject attached
     */
    get position() {
      return this.gameObject ? this.gameObject.position : null;
    }
    /**
     * Called when the component is destroyed.
     * Removes this listener as main if it was active.
     */
    destroy() {
      if (_AudioListenerComponent.main === this) {
        _AudioListenerComponent.main = null;
        console.log("\u{1F3A7} Main AudioListener removed");
      }
      super.destroy();
    }
    /**
     * Component metadata support for visual editors.
     * 
     * @static
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        masterVolume: 1,
        dopplerFactor: 1,
        rolloffFactor: 1
      };
    }
    /**
     * Updates component properties from metadata.
     * 
     * @private
     */
    _updatePropertiesFromMeta() {
      this.masterVolume = this.__meta.masterVolume;
      this.dopplerFactor = this.__meta.dopplerFactor;
      this.rolloffFactor = this.__meta.rolloffFactor;
    }
    /**
     * Validates metadata configuration.
     * 
     * @private
     */
    _validateMeta() {
      if (typeof this.__meta.masterVolume !== "number" || this.__meta.masterVolume < 0 || this.__meta.masterVolume > 1) {
        throw new Error("AudioListener masterVolume must be a number between 0 and 1");
      }
      if (typeof this.__meta.dopplerFactor !== "number" || this.__meta.dopplerFactor < 0) {
        throw new Error("AudioListener dopplerFactor must be a non-negative number");
      }
      if (typeof this.__meta.rolloffFactor !== "number" || this.__meta.rolloffFactor < 0) {
        throw new Error("AudioListener rolloffFactor must be a non-negative number");
      }
    }
  };
  AudioListenerComponent.main = null;

  // src/audio/components/AudioSourceComponent.js
  init_AudioRegistry();
  var AudioSourceComponent = class extends Component {
    /**
     * Creates a new AudioSource component.
     * 
     * Initializes the audio source with default settings for 3D spatial audio.
     * The component is ready to play audio clips once a clip is assigned and
     * the necessary Web Audio API nodes are created.
     * 
     * @param {AudioClip} [clip=null] - Audio clip to play
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.spatial=true] - Whether to use 3D spatial audio
     * @param {boolean} [options.autoPlay=false] - Start playing immediately when clip is set
     * @param {boolean} [options.loop=false] - Loop the audio clip
     * @param {number} [options.volume=1.0] - Volume level (0.0 to 1.0)
     * @param {number} [options.pitch=1.0] - Playback pitch (0.5 to 2.0)
     * 
     * @example
     * // Create configured audio source
     * const audioSource = new AudioSourceComponent(jumpClip, {
     *     spatial: true,
     *     volume: 0.8,
     *     maxDistance: 200
     * });
     */
    constructor(clip = null, options = {}) {
      super();
      this.__meta = this.constructor.getDefaultMeta();
      if (clip || Object.keys(options).length > 0) {
        this._applyConstructorArgs(clip, options);
      } else {
        this._updatePropertiesFromMeta();
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.currentTime = 0;
      this.sourceNode = null;
      this.gainNode = null;
      this.pannerNode = null;
      this.audioContext = null;
      this.startTime = 0;
      this.pauseTime = 0;
      console.log(`\u{1F50A} AudioSource created (${this.spatial ? "3D" : "2D"} audio)`);
    }
    /**
     * Provides default metadata configuration for AudioSource instances.
     * 
     * @static
     * @returns {Object} Default metadata configuration
     */
    static getDefaultMeta() {
      return {
        clip: null,
        spatial: true,
        autoPlay: false,
        loop: false,
        volume: 1,
        pitch: 1,
        maxDistance: 500,
        minDistance: 1,
        rolloffMode: "linear"
      };
    }
    /**
     * Applies constructor arguments to metadata format.
     * 
     * @private
     */
    _applyConstructorArgs(clip, options = {}) {
      const metadata = {
        ...this.__meta,
        clip,
        ...options
      };
      this.applyMeta(metadata);
    }
    /**
     * Updates component properties from metadata.
     * 
     * @private
     */
    _updatePropertiesFromMeta() {
      this._setClip(this.__meta.clip);
      this.spatial = this.__meta.spatial;
      this.autoPlay = this.__meta.autoPlay;
      this.loop = this.__meta.loop;
      this.volume = this.__meta.volume;
      this.pitch = this.__meta.pitch;
      this.maxDistance = this.__meta.maxDistance;
      this.minDistance = this.__meta.minDistance;
      this.rolloffMode = this.__meta.rolloffMode;
      if (this.autoPlay && this.clip && this.clip.isReady) {
        this.play();
      }
    }
    /**
     * Validates metadata configuration.
     * 
     * @private
     */
    _validateMeta() {
      if (this.__meta.volume < 0 || this.__meta.volume > 1) {
        throw new Error("AudioSource volume must be between 0 and 1");
      }
      if (this.__meta.pitch < 0.1 || this.__meta.pitch > 3) {
        throw new Error("AudioSource pitch must be between 0.1 and 3");
      }
      if (this.__meta.maxDistance <= 0) {
        throw new Error("AudioSource maxDistance must be positive");
      }
      const validRolloffModes = ["linear", "logarithmic", "inverse"];
      if (!validRolloffModes.includes(this.__meta.rolloffMode)) {
        throw new Error(`AudioSource rolloffMode must be one of: ${validRolloffModes.join(", ")}`);
      }
    }
    /**
     * Set the audio clip for this source.
     * Supports both direct clip objects and string names (looks up in AudioRegistry).
     * 
     * @param {Object|string|null} clipOrName - Audio clip object or name to lookup
     * @private
     */
    _setClip(clipOrName) {
      if (!clipOrName) {
        this.clip = null;
        return;
      }
      if (typeof clipOrName === "string") {
        const audioAsset = AudioRegistry.getAudio(clipOrName);
        if (audioAsset) {
          this.clip = audioAsset;
          this.clipName = clipOrName;
        } else {
          console.warn(`AudioSourceComponent: Audio "${clipOrName}" not found in AudioRegistry`);
          this.clip = null;
          this.clipName = null;
        }
      } else {
        this.clip = clipOrName;
        this.clipName = clipOrName.name || "unknown";
      }
    }
    /**
     * Set the audio clip for this audio source.
     * Supports both direct AudioClip objects and string names from AudioRegistry.
     * 
     * @param {Object|string|null} clipOrName - Audio clip object or registry name
     * 
     * @example
     * // Using AudioRegistry name
     * audioSource.setClip("jump_sound");
     * 
     * @example
     * // Using direct clip object
     * audioSource.setClip(myAudioClip);
     */
    setClip(clipOrName) {
      this._setClip(clipOrName);
      this.__meta.clip = clipOrName;
    }
    /**
     * Get the current audio clip name (if available)
     * @returns {string|null} The clip name or null if no clip
     */
    getClipName() {
      return this.clipName || (this.clip ? this.clip.name : null);
    }
    /**
     * Starts playback of the assigned audio clip.
     * 
     * Creates the necessary Web Audio API nodes and begins playback. For 3D audio,
     * calculates spatial positioning based on the current GameObject position and
     * the active AudioListener. Handles both immediate playback and resuming from
     * a paused state.
     * 
     * @param {number} [delay=0] - Delay before starting playback (in seconds)
     * @returns {boolean} True if playback started successfully
     * 
     * @example
     * // Play immediately
     * audioSource.play();
     * 
     * @example
     * // Play with delay
     * audioSource.play(0.5); // Start after 500ms
     * 
     * @example
     * // Check if playback started
     * if (audioSource.play()) {
     *     console.log("Audio started playing");
     * }
     */
    play(delay = 0) {
      if (!this.clip || !this.clip.isReady) {
        console.warn("Cannot play: AudioClip not loaded or not assigned");
        return false;
      }
      this.stop();
      try {
        this.audioContext = this.clip.audioContext;
        this.sourceNode = this.clip.createSourceNode();
        if (!this.sourceNode) {
          console.error("Failed to create audio source node");
          return false;
        }
        this.sourceNode.loop = this.loop;
        this.sourceNode.playbackRate.value = this.pitch;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.sourceNode.connect(this.gainNode);
        if (this.spatial && this.gameObject) {
          this._setup3DAudio();
        } else {
          this.gainNode.connect(this.audioContext.destination);
        }
        this.sourceNode.onended = () => {
          if (!this.loop) {
            this.isPlaying = false;
            this.currentTime = 0;
            this._cleanup();
          }
        };
        const startTime = this.audioContext.currentTime + delay;
        const offset = this.isPaused ? this.pauseTime : 0;
        this.sourceNode.start(startTime, offset);
        this.isPlaying = true;
        this.isPaused = false;
        this.startTime = startTime - offset;
        console.log(`\u{1F3B5} Audio started: ${this.clip.name} (${this.spatial ? "3D" : "2D"})`);
        return true;
      } catch (error) {
        console.error("Failed to play audio:", error);
        this._cleanup();
        return false;
      }
    }
    /**
     * Pauses audio playback.
     * 
     * Stops the current audio source and records the current playback position
     * so that playback can be resumed from the same point using play().
     * 
     * @example
     * // Pause and resume audio
     * audioSource.pause();
     * setTimeout(() => audioSource.play(), 1000); // Resume after 1 second
     */
    pause() {
      if (!this.isPlaying) return;
      this.pauseTime = this.audioContext.currentTime - this.startTime;
      if (this.sourceNode) {
        try {
          this.sourceNode.stop();
        } catch (error) {
        }
      }
      this.isPlaying = false;
      this.isPaused = true;
      this._cleanup();
      console.log(`\u23F8\uFE0F Audio paused: ${this.clip ? this.clip.name : "unknown"}`);
    }
    /**
     * Stops audio playback and resets to the beginning.
     * 
     * Completely stops audio playback and resets the playback position to the
     * start of the clip. Unlike pause(), this cannot be resumed from the same
     * position.
     * 
     * @example
     * // Stop audio completely
     * audioSource.stop();
     */
    stop() {
      if (!this.isPlaying && !this.isPaused) return;
      if (this.sourceNode) {
        try {
          this.sourceNode.stop();
        } catch (error) {
        }
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.currentTime = 0;
      this.pauseTime = 0;
      this._cleanup();
      console.log(`\u23F9\uFE0F Audio stopped: ${this.clip ? this.clip.name : "unknown"}`);
    }
    /**
     * Sets up 3D spatial audio using Web Audio API.
     * 
     * @private
     */
    _setup3DAudio() {
      if (!this.spatial || !this.gameObject || !AudioListenerComponent.main) {
        this.gainNode.connect(this.audioContext.destination);
        return;
      }
      const listener = AudioListenerComponent.main;
      const audioParams = listener.calculate3DAudio(
        this.gameObject.position,
        this.maxDistance,
        this.rolloffMode
      );
      this.pannerNode = this.audioContext.createStereoPanner();
      this.pannerNode.pan.value = audioParams.pan;
      this.gainNode.gain.value = this.volume * audioParams.volume;
      this.gainNode.connect(this.pannerNode);
      this.pannerNode.connect(this.audioContext.destination);
      console.log(`\u{1F3AF} 3D Audio: vol=${audioParams.volume.toFixed(2)}, pan=${audioParams.pan.toFixed(2)}, dist=${audioParams.distance.toFixed(1)}`);
    }
    /**
     * Updates 3D audio parameters during playback.
     * Called automatically if the GameObject or listener moves.
     */
    update() {
      if (this.isPlaying && this.spatial && this.pannerNode && this.gameObject && AudioListenerComponent.main) {
        const listener = AudioListenerComponent.main;
        const audioParams = listener.calculate3DAudio(
          this.gameObject.position,
          this.maxDistance,
          this.rolloffMode
        );
        this.gainNode.gain.value = this.volume * audioParams.volume;
        this.pannerNode.pan.value = audioParams.pan;
      }
      if (this.isPlaying && this.audioContext) {
        this.currentTime = this.audioContext.currentTime - this.startTime;
      }
    }
    /**
     * Cleans up Web Audio API nodes.
     * 
     * @private
     */
    _cleanup() {
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.pannerNode) {
        this.pannerNode.disconnect();
        this.pannerNode = null;
      }
    }
    /**
     * Sets the volume of this audio source.
     * 
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume));
      if (this.gainNode) {
        if (this.spatial && this.gameObject && AudioListenerComponent.main) {
          const listener = AudioListenerComponent.main;
          const audioParams = listener.calculate3DAudio(
            this.gameObject.position,
            this.maxDistance,
            this.rolloffMode
          );
          this.gainNode.gain.value = this.volume * audioParams.volume;
        } else {
          this.gainNode.gain.value = this.volume;
        }
      }
    }
    /**
     * Sets the pitch/playback rate of this audio source.
     * 
     * @param {number} pitch - Pitch multiplier (0.1 to 3.0)
     */
    setPitch(pitch) {
      this.pitch = Math.max(0.1, Math.min(3, pitch));
      if (this.sourceNode) {
        this.sourceNode.playbackRate.value = this.pitch;
      }
    }
    /**
     * Gets the current playback time in seconds.
     * 
     * @returns {number} Current playback time
     */
    get time() {
      return this.currentTime;
    }
    /**
     * Sets the current playback time (seeking).
     * Note: Requires stopping and restarting playback.
     * 
     * @param {number} time - Time to seek to in seconds
     */
    set time(time) {
      if (this.clip && time >= 0 && time <= this.clip.length) {
        const wasPlaying = this.isPlaying;
        this.stop();
        this.pauseTime = time;
        this.isPaused = true;
        if (wasPlaying) {
          this.play();
        }
      }
    }
    /**
     * Called when the component is destroyed.
     */
    destroy() {
      this.stop();
      super.destroy();
    }
  };

  // src/audio/ProceduralAudioClip.js
  var ProceduralAudioClip = class _ProceduralAudioClip {
    /**
     * Create a procedural audio clip
     * @param {string} name - Name identifier for the clip
     * @param {Object} options - Generation options
     */
    constructor(name, options = {}) {
      this.name = name;
      this.options = {
        type: "tone",
        // 'tone', 'noise', 'sweep', 'complex', 'random'
        frequency: 440,
        // Base frequency in Hz
        duration: 1,
        // Duration in seconds
        volume: 0.5,
        // Volume (0.0 to 1.0)
        sampleRate: 44100,
        // Sample rate
        fadeIn: 0.01,
        // Fade in time
        fadeOut: 0.1,
        // Fade out time
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
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        case "tone":
          this.generateTone(data, length);
          break;
        case "noise":
          this.generateNoise(data, length);
          break;
        case "sweep":
          this.generateSweep(data, length);
          break;
        case "complex":
          this.generateComplex(data, length);
          break;
        case "random":
          this.generateRandom(data, length);
          break;
        default:
          this.generateTone(data, length);
      }
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
      const waveType = this.options.waveType || "sine";
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate * frequency * 2 * Math.PI;
        switch (waveType) {
          case "sine":
            data[i] = Math.sin(t);
            break;
          case "square":
            data[i] = Math.sin(t) > 0 ? 1 : -1;
            break;
          case "sawtooth":
            data[i] = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
            break;
          case "triangle":
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
      const noiseType = this.options.noiseType || "white";
      switch (noiseType) {
        case "white":
          for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          break;
        case "pink":
          this.generatePinkNoise(data, length);
          break;
        case "brown":
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
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
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
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
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
        const t = i / sampleRate * currentFreq * 2 * Math.PI;
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
          const t = i / sampleRate * harmFreq * 2 * Math.PI;
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
      const effects = ["tone", "noise", "sweep"];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      const originalOptions = { ...this.options };
      this.options.frequency = 100 + Math.random() * 800;
      this.options.waveType = ["sine", "square", "sawtooth", "triangle"][Math.floor(Math.random() * 4)];
      this.options.noiseType = ["white", "pink", "brown"][Math.floor(Math.random() * 3)];
      switch (randomEffect) {
        case "tone":
          this.generateTone(data, length);
          break;
        case "noise":
          this.generateNoise(data, length);
          break;
        case "sweep":
          this.options.startFreq = 50 + Math.random() * 200;
          this.options.endFreq = 200 + Math.random() * 800;
          this.generateSweep(data, length);
          break;
      }
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
        if (i < fadeInSamples) {
          amplitude *= i / fadeInSamples;
        }
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
      const defaults = _ProceduralAudioClip.getDefaultMeta();
      const config = { ...defaults, ...metadata };
      if (!config.name || config.name.trim() === "") {
        throw new Error("ProceduralAudioClip metadata must include a valid name");
      }
      return new _ProceduralAudioClip(config.name, config);
    }
    /**
     * Get default metadata configuration
     * @returns {Object}
     */
    static getDefaultMeta() {
      return {
        name: "",
        type: "tone",
        frequency: 440,
        duration: 1,
        volume: 0.5,
        sampleRate: 44100,
        fadeIn: 0.01,
        fadeOut: 0.1,
        waveType: "sine",
        noiseType: "white",
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
        console.error("Cannot download audio: ProceduralAudioClip not loaded");
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
      const bytesPerSample = 2;
      const blockAlign = numberOfChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = length * blockAlign;
      const bufferSize = 44 + dataSize;
      const arrayBuffer = new ArrayBuffer(bufferSize);
      const view = new DataView(arrayBuffer);
      const writeString = (offset2, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset2 + i, string.charCodeAt(i));
        }
      };
      writeString(0, "RIFF");
      view.setUint32(4, bufferSize - 8, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, dataSize, true);
      let offset = 44;
      for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = buffer.getChannelData(channel)[i];
          const intSample = Math.max(-1, Math.min(1, sample));
          view.setInt16(offset, intSample * 32767, true);
          offset += 2;
        }
      }
      return new Blob([arrayBuffer], { type: "audio/wav" });
    }
    /**
     * Download a blob as a file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - Filename for download
     */
    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      console.log(`\u{1F4E5} Downloaded: ${filename}`);
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
        throw new Error("Audio must be loaded before converting to Base64");
      }
      const wavBlob = this.audioBufferToWAV(this.audioBuffer);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(wavBlob);
      });
    }
    /**
     * Static factory methods for common sound types
     */
    static createBeep(frequency = 800, duration = 0.2) {
      return _ProceduralAudioClip.meta({
        name: `beep_${frequency}`,
        type: "tone",
        frequency,
        duration,
        waveType: "sine",
        volume: 0.3
      });
    }
    static createClick(duration = 0.1) {
      return _ProceduralAudioClip.meta({
        name: "click",
        type: "noise",
        duration,
        noiseType: "white",
        volume: 0.2,
        fadeOut: duration * 0.8
      });
    }
    static createWhoosh(duration = 0.5) {
      return _ProceduralAudioClip.meta({
        name: "whoosh",
        type: "sweep",
        startFreq: 1e3,
        endFreq: 200,
        duration,
        volume: 0.4
      });
    }
    static createZap(duration = 0.3) {
      return _ProceduralAudioClip.meta({
        name: "zap",
        type: "complex",
        frequency: 300,
        duration,
        harmonics: [1, 0.8, 0.6, 0.4, 0.2],
        volume: 0.5
      });
    }
    static createRandomSFX(duration = 0.5) {
      return _ProceduralAudioClip.meta({
        name: `random_sfx_${Date.now()}`,
        type: "random",
        duration,
        volume: 0.4
      });
    }
  };

  // src/audio/RandomAudioGenerator.js
  var RandomAudioGenerator = class {
    /**
     * Generate a simple beep sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static generateBeep(options = {}) {
      const frequency = options.frequency || 800;
      const duration = options.duration || 0.3;
      const volume = options.volume || 0.5;
      return new ProceduralAudioClip(`beep_${Date.now()}`, {
        type: "tone",
        frequency,
        duration,
        waveType: "sine",
        volume,
        fadeIn: 0.01,
        fadeOut: 0.05
      });
    }
    /**
     * Generate a simple tone
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static generateTone(options = {}) {
      const frequency = options.frequency || 440;
      const duration = options.duration || 1;
      const volume = options.volume || 0.4;
      const waveType = options.waveType || "sine";
      return new ProceduralAudioClip(`tone_${Date.now()}`, {
        type: "tone",
        frequency,
        duration,
        waveType,
        volume,
        fadeIn: 0.05,
        fadeOut: 0.1
      });
    }
    /**
     * Generate white/pink noise
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static generateNoise(options = {}) {
      const duration = options.duration || 0.5;
      const volume = options.volume || 0.3;
      const type = options.type || "white";
      return new ProceduralAudioClip(`noise_${Date.now()}`, {
        type: "noise",
        noiseType: type,
        duration,
        volume,
        fadeIn: 0.02,
        fadeOut: 0.1
      });
    }
    /**
     * Generate a frequency sweep (chirp)
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static generateChirp(options = {}) {
      const startFreq = options.startFreq || 200;
      const endFreq = options.endFreq || 800;
      const duration = options.duration || 1;
      const volume = options.volume || 0.5;
      return new ProceduralAudioClip(`chirp_${Date.now()}`, {
        type: "sweep",
        startFreq,
        endFreq,
        duration,
        volume,
        fadeIn: 0.02,
        fadeOut: 0.1
      });
    }
    /**
     * Generate a completely random sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static generateRandom(options = {}) {
      const duration = options.duration || 0.5 + Math.random() * 1.5;
      const volume = options.volume || 0.3 + Math.random() * 0.4;
      const soundTypes = ["tone", "noise", "sweep"];
      const randomType = soundTypes[Math.floor(Math.random() * soundTypes.length)];
      switch (randomType) {
        case "tone":
          return this.generateTone({
            frequency: 200 + Math.random() * 600,
            duration,
            volume,
            waveType: ["sine", "square", "triangle", "sawtooth"][Math.floor(Math.random() * 4)]
          });
        case "noise":
          return this.generateNoise({
            duration,
            volume,
            type: ["white", "pink"][Math.floor(Math.random() * 2)]
          });
        case "sweep":
          return this.generateChirp({
            startFreq: 100 + Math.random() * 400,
            endFreq: 400 + Math.random() * 800,
            duration,
            volume
          });
        default:
          return this.generateBeep({ duration, volume });
      }
    }
    /**
     * Generate a random beep sound
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomBeep(options = {}) {
      const frequency = options.frequency || 200 + Math.random() * 600;
      const duration = options.duration || 0.1 + Math.random() * 0.3;
      const waveType = options.waveType || ["sine", "square", "triangle"][Math.floor(Math.random() * 3)];
      return new ProceduralAudioClip(`random_beep_${Date.now()}`, {
        type: "tone",
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
      const noiseTypes = ["white", "pink", "brown"];
      const noiseType = options.noiseType || noiseTypes[Math.floor(Math.random() * noiseTypes.length)];
      const duration = options.duration || 2 + Math.random() * 8;
      return new ProceduralAudioClip(`random_ambient_${Date.now()}`, {
        type: "noise",
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
      const startFreq = options.startFreq || 100 + Math.random() * 500;
      const endFreq = options.endFreq || 200 + Math.random() * 800;
      const duration = options.duration || 0.3 + Math.random() * 0.7;
      const reverse = Math.random() > 0.5;
      const actualStart = reverse ? endFreq : startFreq;
      const actualEnd = reverse ? startFreq : endFreq;
      return new ProceduralAudioClip(`random_sweep_${Date.now()}`, {
        type: "sweep",
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
      const baseFreq = options.frequency || 150 + Math.random() * 400;
      const duration = options.duration || 0.5 + Math.random() * 1.5;
      const harmonics = [];
      const numHarmonics = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numHarmonics; i++) {
        harmonics.push(Math.random() * (1 / (i + 1)));
      }
      return new ProceduralAudioClip(`random_harmonic_${Date.now()}`, {
        type: "complex",
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
      const duration = options.duration || 0.05 + Math.random() * 0.15;
      const soundTypes = ["noise", "tone"];
      const type = soundTypes[Math.floor(Math.random() * soundTypes.length)];
      const baseOptions = {
        duration,
        volume: 0.4 + Math.random() * 0.4,
        fadeIn: 1e-3,
        fadeOut: duration * 0.7
      };
      if (type === "noise") {
        return new ProceduralAudioClip(`random_percussion_${Date.now()}`, {
          ...baseOptions,
          type: "noise",
          noiseType: "white"
        });
      } else {
        return new ProceduralAudioClip(`random_percussion_${Date.now()}`, {
          ...baseOptions,
          type: "tone",
          frequency: 80 + Math.random() * 200,
          waveType: "square"
        });
      }
    }
    /**
     * Generate random musical note
     * @param {Object} options - Generation options
     * @returns {ProceduralAudioClip}
     */
    static randomNote(options = {}) {
      const noteFreqs = [
        261.63,
        277.18,
        293.66,
        311.13,
        329.63,
        349.23,
        369.99,
        392,
        415.3,
        440,
        466.16,
        493.88,
        523.25,
        554.37,
        587.33,
        622.25,
        659.25,
        698.46,
        739.99,
        783.99,
        830.61,
        880,
        932.33,
        987.77
      ];
      const frequency = options.frequency || noteFreqs[Math.floor(Math.random() * noteFreqs.length)];
      const duration = options.duration || 0.5 + Math.random() * 1;
      const waveType = options.waveType || ["sine", "triangle"][Math.floor(Math.random() * 2)];
      return new ProceduralAudioClip(`random_note_${Date.now()}`, {
        type: "tone",
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
      const startFreq = options.startFreq || 400 + Math.random() * 600;
      const endFreq = options.endFreq || 50 + Math.random() * 200;
      const duration = options.duration || 0.2 + Math.random() * 0.3;
      return new ProceduralAudioClip(`random_laser_${Date.now()}`, {
        type: "sweep",
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
        type: "complex",
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
      const duration = options.duration || 0.5 + Math.random() * 1;
      return new ProceduralAudioClip(`random_explosion_${Date.now()}`, {
        type: "noise",
        noiseType: "brown",
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
      if (typeof this[methodName] === "function") {
        for (let i = 0; i < variations; i++) {
          sounds.push(this[methodName](baseOptions));
        }
      } else {
        console.warn(`Unknown sound type: ${type}`);
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
      switch (type) {
        case "beep":
          sound = this.randomBeep(options);
          break;
        case "sweep":
          sound = this.randomSweep(options);
          break;
        case "harmonic":
          sound = this.randomHarmonic(options);
          break;
        case "percussion":
          sound = this.randomPercussion(options);
          break;
        case "note":
          sound = this.randomNote(options);
          break;
        case "laser":
          sound = this.randomLaser(options);
          break;
        case "pickup":
          sound = this.randomPickup(options);
          break;
        case "explosion":
          sound = this.randomExplosion(options);
          break;
        case "ambient":
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
        setTimeout(() => {
          sounds[i].downloadAsWAV(filename);
        }, i * 500);
      }
      return sounds;
    }
  };
  return __toCommonJS(index_exports);
})();
