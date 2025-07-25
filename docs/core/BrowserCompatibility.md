# Browser Compatibility

NityJS is designed to work across all modern browsers with graceful degradation for older browsers. This document covers browser support, known limitations, and planned polyfill solutions.

## Current Browser Support

### ✅ Fully Supported (Recommended)

| Browser | Version | Layer System | All Features |
|---------|---------|--------------|--------------|
| **Chrome** | 69+ | ✅ | ✅ |
| **Edge** | 79+ | ✅ | ✅ |
| **Firefox** | 105+ | ✅ | ✅ |
| **Safari** | 16.4+ | ✅ | ✅ |

### ⚠️ Limited Support (Fallback Mode)

| Browser | Version | Layer System | Core Features |
|---------|---------|--------------|---------------|
| **Safari** | 12.0-16.3 | ❌ → 🔄 | ✅ |
| **iOS Safari** | 12.0-16.3 | ❌ → 🔄 | ✅ |
| **Android Browser** | 4.4+ | ⚠️ | ✅ |

**Legend:**
- ✅ Full native support
- ❌ → 🔄 Automatic fallback to single canvas
- ⚠️ May require polyfill

## Feature-Specific Compatibility

### LayerManager (OffscreenCanvas)

The LayerManager uses OffscreenCanvas for optimal performance, but falls back gracefully:

#### Native Support
```javascript
// Modern browsers - full layer system
game.configure({
    useLayerSystem: true  // Uses OffscreenCanvas layers
});
```

#### Fallback Mode
```javascript
// Older browsers - automatic fallback
game.configure({
    useLayerSystem: true  // Falls back to single canvas with layer simulation
});
```

#### Compatibility Detection
```javascript
// Check if full layer system is available
if (Game.instance.hasLayerSystem() && Game.instance.getLayerManager().hasOffscreenCanvas) {
    console.log('Full layer system with OffscreenCanvas');
} else {
    console.log('Fallback layer system');
}
```

### Performance API (Time System)

NityJS uses `performance.now()` for accurate timing:

#### Native Support
- **Chrome**: All versions
- **Firefox**: All versions  
- **Safari**: 8.0+
- **Edge**: All versions

#### Fallback
```javascript
// Automatic fallback to Date.now() if performance.now() unavailable
// Slightly less accurate but fully functional
```

### Canvas 2D Context

All browsers with HTML5 Canvas support work with NityJS:

#### Required Features
- `canvas.getContext('2d')` - Universal support
- `requestAnimationFrame` - IE10+ (polyfill available)
- ES6 Classes - Chrome 49+, Firefox 45+, Safari 9+ (transpilation available)

## Planned Polyfill Support (v1.1)

### OffscreenCanvas Polyfill

**Priority: High** - Enables full layer system on all browsers

```javascript
// Automatic polyfill detection and loading
if (!window.OffscreenCanvas) {
    // Load lightweight OffscreenCanvas polyfill
    // Provides identical API with canvas fallback
}
```

**Benefits:**
- Universal layer system support
- Identical API across all browsers
- Performance optimization where possible
- Graceful degradation when needed

### Performance API Polyfill

**Priority: Low** - Already has good browser support

```javascript
// Fallback for very old browsers
if (!window.performance || !window.performance.now) {
    window.performance = { now: () => Date.now() };
}
```

## Mobile Browser Considerations

### iOS Safari
- **Modern iOS** (16.4+): Full support including LayerManager
- **Older iOS** (12.0-16.3): Core features work, LayerManager falls back
- **Touch Events**: Full support for game input

### Android Browsers
- **Chrome Mobile**: Full support (mirrors desktop Chrome)
- **Samsung Internet**: Full support
- **Legacy Android Browser**: Core features work, may need polyfills

### Performance Notes
- **Memory Management**: Automatic cleanup for mobile memory constraints
- **Touch Input**: Optimized for mobile game controls
- **Battery Usage**: Efficient rendering to preserve battery life

## Development Recommendations

### For Maximum Compatibility

```javascript
// 1. Feature detection before using advanced features
if (Game.instance.hasLayerSystem()) {
    // Use layer-specific optimizations
} else {
    // Fallback to simpler rendering
}

// 2. Test on target browsers
// Include Safari, older mobile browsers in testing

// 3. Provide user feedback
if (!window.OffscreenCanvas) {
    console.warn('Using fallback rendering - upgrade browser for best performance');
}
```

### Build Targets

#### Modern Browsers (Recommended)
```javascript
// ES6+ syntax, modern APIs
import { Game, Scene, GameObject } from './dist/nity.module.min.js';
```

#### Legacy Support (If Needed)
```javascript
// ES5 transpiled version (planned for v1.1)
<script src="./dist/nity.legacy.min.js"></script>
```

## Testing Strategy

### Browser Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Core Engine | ✅ | ✅ | ✅ | ✅ | ✅ |
| LayerManager | ✅ | ✅ | ⚠️ | ✅ | ⚠️ |
| Physics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Input | ✅ | ✅ | ✅ | ✅ | ✅ |
| Animation | ✅ | ✅ | ✅ | ✅ | ✅ |

### Automated Testing
```bash
# Cross-browser testing (planned)
npm run test:browsers
npm run test:mobile
npm run test:compatibility
```

## Migration Guide

### From Fallback to Full Support

When browsers gain OffscreenCanvas support:

```javascript
// No code changes needed - automatic upgrade
game.configure({
    useLayerSystem: true  // Automatically uses best available method
});

// Optional: Detect upgrade
const layerManager = Game.instance.getLayerManager();
if (layerManager.hasOffscreenCanvas) {
    console.log('Upgraded to full layer system!');
}
```

## Known Issues & Workarounds

### Safari iOS < 16.4
- **Issue**: No OffscreenCanvas support
- **Workaround**: Automatic fallback to single canvas
- **Impact**: Slightly reduced performance, identical functionality

### Older Android Browsers
- **Issue**: ES6 class syntax not supported
- **Workaround**: Use ES5 build (planned for v1.1)
- **Impact**: Larger file size, identical functionality

### Internet Explorer
- **Status**: Not supported (lacks ES6 classes, modern Canvas APIs)
- **Alternative**: Consider ES5 transpilation for critical legacy support

## Future Compatibility Plans

### v1.1 (Coming Soon)
- OffscreenCanvas polyfill
- ES5 transpiled build
- Automated browser testing
- Performance optimization for mobile

### v1.2 (Future)
- WebAssembly acceleration (optional)
- Progressive Web App optimizations
- Enhanced mobile compatibility
- Automatic polyfill loading

## Contributing to Compatibility

Help improve browser support:

1. **Report Compatibility Issues** - Test on your target browsers
2. **Submit Browser-Specific Fixes** - Platform-specific optimizations
3. **Test Polyfill Integration** - Help validate fallback systems
4. **Document Edge Cases** - Share compatibility discoveries

## Resources

### Compatibility Checking Tools
- [Can I Use - OffscreenCanvas](https://caniuse.com/offscreencanvas)
- [Can I Use - Performance API](https://caniuse.com/high-resolution-time)
- [Browser Testing Services](https://www.browserstack.com)

### Polyfill Libraries
- [OffscreenCanvas Polyfill](https://github.com/Financial-Times/polyfill-library)
- [Performance API Polyfill](https://github.com/Financial-Times/polyfill-library)

NityJS prioritizes broad compatibility while leveraging modern browser features where available. The goal is to provide the best possible experience on every platform while maintaining a consistent API across all browsers.
