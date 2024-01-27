export type RegistryRegistered<T> = { [name: string]: T }

export default class Registry<T> {
    readonly registered: RegistryRegistered<T> = {};

    constructor() {}

    register(name: string, item: T): boolean {
        const exists = !!this.registered[name]

        this.registered[name] = item;
        return exists;
    }
    get(name: string): T | null {
        return this.registered[name] || null;
    }

    getFirstItem(): T | null {
        return this.getItems()[0] || null;
    }
    getItems(): T[] {
        return Object.values(this.registered);
    }
    getNames(): string[] {
        return Object.keys(this.registered);
    }
}
