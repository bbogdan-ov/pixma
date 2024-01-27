import { SizeName } from "@base/types/enums";
import ElementBrick from "./ElementBrick";

export default class SizeBrick<P extends HTMLElement> extends ElementBrick<P> {
    protected _value!: SizeName;

    constructor(parent: P, defaultValue: SizeName) {
        super(parent);

        this.set(defaultValue);
    }

    // Set
    set(value: SizeName): P {
        this.parent.classList.remove("size-" + this._value);
        this.parent.classList.add("size-" + value);

        this._value = value;
        return this.parent;
    }

    // Get
    get value(): SizeName {
        return this._value;
    }
}
