import { Listenable } from "./Listenable";

export class Trigger<T> extends Listenable<T> {
    constructor() {
        super();
    }

    trigger(value: T): this {
        return this._notify(value);
    }
}
