// === Input.js ===
export class Input {
    static keys = new Set();

    static initialize() {
        window.addEventListener('keydown', e => Input.keys.add(e.key));
        window.addEventListener('keyup', e => Input.keys.delete(e.key));
    }

    static isKeyDown(key) {
        return Input.keys.has(key);
    }
}