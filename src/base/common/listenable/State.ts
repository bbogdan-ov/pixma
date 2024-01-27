import Listenable, { ListenableListener } from "./Listenable";

type StateCallbackOrValue<T> = T | ((old: T) => T);

class State<T> extends Listenable<T> {
    protected _value: T;

    apply: (value: T)=> T = v=> v;

    constructor(initValue: T) {
        super();

        this._value = initValue;
    }

    get value(): T {
        return this._value;
    }
    set(callbackOrValue: StateCallbackOrValue<T>, notify=true): this {
        this._value = this.apply(this._parseValue(callbackOrValue));

        if (notify) this.notify();
        return this;
    }

    listen(listener: ListenableListener<T>, invoke?: boolean, key?: string | undefined, override?: boolean): VoidFunction {
        if (invoke)
            listener(this.value);

        return super.listen(listener, invoke, key, override);
    }
    notify(): this {
        return this._notify(this.value);
    }

    //
    protected _parseValue(callbackOrValue: StateCallbackOrValue<T>): T {
        if (typeof callbackOrValue == "function") return (callbackOrValue as any)(this._value);
        return callbackOrValue;
    }
}
export default State;
