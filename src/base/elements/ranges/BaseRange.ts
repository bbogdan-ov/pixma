import { State } from "@base/common/listenable";
import { FocusableElement } from "../FocusableElement";
import { Dev, Utils } from "@base/utils";
import { EventName } from "@base/types/enums";
import { Clamped, Stepped } from "@base/types/types";

@FocusableElement.define("base-range")
export class BaseRange extends FocusableElement implements Clamped, Stepped {
    static readonly WHEEL_THRESHOLD = 1;
    static readonly SHIFT_MUL = 5;

    readonly state: State<number>;

    protected _isChanging = false;
    protected _min = 0;
    protected _max = 100;
    protected _step = 1;

    constructor(state?: State<number>) {
        super();

        this.state = state || new State(0);
		this.setClamp(0, 100);

        this.classList.add("range");
    }

    increase(isShift=false): this {
        if (!this.allowIncrease) return this;

        this.setValue(this.value + this.step * (isShift ? BaseRange.SHIFT_MUL : 1));
        return this;
    }
    decrease(isShift=false): this {
        if (!this.allowDecrease) return this;

        this.setValue(this.value - this.step * (isShift ? BaseRange.SHIFT_MUL : 1));
        return this;
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(window, EventName.UP, this._onWindowUp.bind(this));
        this.listen(window, EventName.MOVE, this._onWindowMove.bind(this));
        this.listen(this, EventName.WHEEL, this._onWheel.bind(this));

		this.listen(this.state, this._onStateChange.bind(this));
    }

    protected _onWindowMove(event: PointerEvent) {}
    protected _onWindowUp(event: PointerEvent) {
        if (!this.isChanging) return;

        this._isChanging = false;
        this._onChange();
    }
    protected _onWheel(event: WheelEvent) {
        if (event.deltaY < -BaseRange.WHEEL_THRESHOLD) {
            this.increase(event.shiftKey);
            this._onInput();
        } else if (event.deltaY > BaseRange.WHEEL_THRESHOLD) {
            this.decrease(event.shiftKey);
            this._onInput();
        }
    }

	protected _onChange() {
        this.dispatchEvent(new InputEvent("change"));
	}
	protected _onInput() {
        this.dispatchEvent(new InputEvent("input"));
	}

	protected _onStateChange(value: number) {}

    // Set
    setValueFromMouse(event: MouseEvent) {
        const bounds = this.getBoundingClientRect();
        const alpha = (event.clientX - bounds.left) / bounds.width;
        const min = this.min;
        const max = this.max;
        const step = this.step;

        this.setValue(min + Math.ceil(alpha * (max - min) / step) * step);
        this._onInput();
    }
    setWidth(value: string | number): this {
        return this.setStyle("width", value);
    }
    setValue(value: number): this {
        this.state.set(Utils.clamp(value, this.min, this.max));
        return this;
    }
    setMin(value: number): this {
        if (!Dev.assert(value <= this.max, "value <= this.max")) return this;
        if (!Dev.assert(Math.abs(value) < Infinity, "value != +-Infinity")) return this;

        this._min = value;
        return this;
    }
    setMax(value: number): this {
        if (!Dev.assert(value >= this.min, "value >= this.min")) return this;
        if (!Dev.assert(Math.abs(value) < Infinity, "value != +-Infinity")) return this;

        this._max = value;
        return this;
    }
    setClamp(min: number, max: number): this {
        return this.setMin(min).setMax(max);
    }
    setStep(value: number): this {
        if (!Dev.assert(value > 0, "value > 0")) return this;
        if (!Dev.assert(Math.abs(value) < Infinity, "value != +-Infinity")) return this;
        
        this._step = value;
        return this;
    }

    // Get
    get value(): number {
        return this.state.value;
    }
    get max(): number {
        return this._max;
    }
    get min(): number {
        return this._min;
    }
    get step(): number {
        return this._step;
    }
    get allowIncrease(): boolean {
        return this.value < this.max;
    }
    get allowDecrease(): boolean {
        return this.value > this.min;
    }
    get isChanging(): boolean {
        return this._isChanging;
    }
}
