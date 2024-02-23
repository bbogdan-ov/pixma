import { Dev } from "@base/utils";

export type RegistryRegistered<T> = Record<string, T>;

export default class Registry<T> {
    readonly registered: RegistryRegistered<T> = {};

    constructor() {}

    /**
     * Returns whether the item is registered or not\
     * Warns if item with `name` is already registered && `override` is `false`
     */
    register(name: string, item: T, override=false): boolean {
        if (!override && this.registered[name]) {
            Dev.warn(`Registry: cannot override existing item "${ name }"`);
            return false;
        }

        this.registered[name] = item;
        return true;
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
    /** Returns a list of names of registered items */
    getNames(): string[] {
        return Object.keys(this.registered);
    }
}
