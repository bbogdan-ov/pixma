import { Listenable, ListenableListener } from "./Listenable";

type StateCallbackOrValue<T> = T | ((old: T) => T);

export class State<T> extends Listenable<T> {
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
        if (typeof callbackOrValue == "function")
			this._value = (callbackOrValue as any)(this._value);
		else
			this._value = callbackOrValue;

        if (notify) this.notify();
        return this;
    }

    listen(listener: ListenableListener<T>, invoke?: boolean): VoidFunction {
        if (invoke)
            listener(this.value);

        return super.listen(listener, invoke);
    }
    notify(): this {
        return this._notify(this.value);
    }
}
