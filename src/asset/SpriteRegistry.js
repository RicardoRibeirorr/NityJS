// === SpriteRegistry.js ===
export class SpriteRegistry {
    constructor() {
        this.sheets = new Map();
    }

    add(sheet) {
        this.sheets.set(sheet.name, sheet);
    }

    async preload() {
        for (const sheet of this.sheets.values()) {
            await sheet.load();
        }
    }

    getSheet(name) {
        return this.sheets.get(name);
    }
}