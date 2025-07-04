// === GameObject.js ===
export class GameObject {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.components = [];
        this.children = [];
        this.parent = null;
        this.name = '';
        this.tags = new Set();
        this.paused = false;
    }

    addComponent(component) {
        const existing = this.getComponent(component.constructor);
        if (existing) throw new Error(`Component of type ${component.constructor.name} already exists on this GameObject.`);
        component.gameObject = this;
        this.components.push(component);
        component.start?.();
    }

    getComponent(type) {
        return this.components.find(c => c instanceof type);
    }

    hasComponent(type) {
        return !!this.getComponent(type);
    }

    removeComponent(type) {
        const index = this.components.findIndex(c => c instanceof type);
        if (index !== -1) {
            this.components[index].destroy?.();
            this.components.splice(index, 1);
        }
    }

    hasTag(tag) {
        return this.tags.has(tag);
    }

    addTag(tag) {
        this.tags.add(tag);
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    getGlobalX() {
        return this.parent ? this.x + this.parent.getGlobalX() : this.x;
    }

    getGlobalY() {
        return this.parent ? this.y + this.parent.getGlobalY() : this.y;
    }

    async preload() {
        const promises = this.components.map(c => c.preload?.());
        for (const child of this.children) {
            promises.push(child.preload?.());
        }
        await Promise.all(promises);
    }

    update(deltaTime) {
        if (this.paused) return;

        for (const c of this.components) {
            if (c.enabled && typeof c.update === 'function') c.update(deltaTime);
        }
        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

    lateUpdate(deltaTime) {
        if (this.paused) return;

        for (const c of this.components) {
            if (c.enabled && typeof c.lateUpdate === 'function') c.lateUpdate(deltaTime);
        }
        for (const child of this.children) {
            child.lateUpdate(deltaTime);
        }
    }

    onCollisionEnter(other) {
    for (const comp of this.components) {
        if (typeof comp.onCollisionEnter === 'function') {
            comp.onCollisionEnter(other);
        }
    }
}

onCollisionStay(other) {
    for (const comp of this.components) {
        if (typeof comp.onCollisionStay === 'function') {
            comp.onCollisionStay(other);
        }
    }
}

onCollisionExit(other) {
    for (const comp of this.components) {
        if (typeof comp.onCollisionExit === 'function') {
            comp.onCollisionExit(other);
        }
    }
}

    draw(ctx) {
        if (this.paused) return;

        for (const c of this.components) {
            if (c.enabled && typeof c.draw === 'function') c.draw(ctx);
        }
        for (const child of this.children) {
            child.draw(ctx);
        }
    }
}