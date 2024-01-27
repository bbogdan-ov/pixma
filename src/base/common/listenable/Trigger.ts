import Listenable from "./Listenable";

class Trigger<T> extends Listenable<T> {
    constructor() {
        super();
    }

    trigger(value: T): this {
        return this._notify(value);
    }
}
export default Trigger;
