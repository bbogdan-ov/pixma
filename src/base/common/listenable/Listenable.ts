export type ListenableListener<T> = (value: T) => void;

export class Listenable<T> {
    listeners: ListenableListener<T>[] = [];

    constructor() {}

    listen(listener: ListenableListener<T>, invoke=false): VoidFunction {
        this.listeners.push(listener);
        return () => this.unlistenIndex(this.listeners.length-1);
    }
	/** Use `unlistenIndex()` instead if you know index of the listener */
	unlisten(listener: ListenableListener<T>): boolean {
		const index = this.listeners.indexOf(listener);
		if (index < 0) return false;
		return this.unlistenIndex(index);
	}
    unlistenIndex(index: number): boolean {
		if (index < 0 || index >= this.listeners.length)
			return false;
		this.listeners.splice(index, 1);
		return true;
    }
    protected _notify(value: T): this {
        for (const listener of this.listeners) {
            listener(value);
        }
        return this;
    }
}
