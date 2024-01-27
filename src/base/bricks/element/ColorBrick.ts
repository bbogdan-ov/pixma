import { AccentName, ColorName } from "@base/types/enums";
import ElementBrick from "./ElementBrick";

type ValueName = ColorName | AccentName;

export default class ColorBrick<P extends HTMLElement> extends ElementBrick<P> {
    protected _value!: ValueName;

    constructor(parent: P, defaultValue: ValueName) {
        super(parent);

        this.set(defaultValue);
    }

    // Set
    set(value: ValueName): P {
        this.parent.classList.remove("color-" + this._value);
        this.parent.classList.add("color-" + value);

        this._value = value;
        return this.parent;
    }

    // Get
    get value(): ValueName {
        return this._value;
    }
}
