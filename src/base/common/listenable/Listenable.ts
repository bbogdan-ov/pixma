import { Dev } from "@base/utils";

export type ListenableListener<T> = (value: T) => void;
type ListenableListeners<T> = {
    [key: string]: ListenableListener<T>;
};

export class Listenable<T> {
    static key = 0;

    listeners: ListenableListeners<T> = {};

    constructor() {}

    listen(listener: ListenableListener<T>, invoke=false, key?: string, override=true): VoidFunction {
        key = key || (Listenable.key++).toString();

        if (!!this.listeners[key]) {
            if (override) {
                Dev.warn(`LISTENER with key (${key}) was override`);
            } else {
                Dev.throwError(`LISTENER with key (${key}) already exists`);
            }
        }

        this.listeners[key] = listener;
        return () => this.unlisten(key!);
    }
    unlisten(key: string): this {
        delete this.listeners[key];
        return this;
    }
    protected _notify(value: T): this {
        for (const listener of Object.values(this.listeners)) {
            listener(value);
        }
        return this;
    }
}
