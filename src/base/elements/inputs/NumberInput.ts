import { State } from "@base/common/listenable";
import { BaseInput } from "./BaseInput";
import { Dev, DOM, Utils } from "@base/utils";
import { Button } from "../buttons";
import { EventName, IconName } from "@base/types/enums";
import { KeyBind } from "@base/common/binds";
import { Clamped, Stepped } from "@base/types/types";

@BaseInput.define("number-input")
export class NumberInput extends BaseInput<number> implements Clamped, Stepped {
    static readonly WHEEL_THRESHOLD = 1;
    static readonly SHIFT_MUL = 5;

    protected _fixed = 2;
    protected _min = -Infinity;
    protected _max = Infinity;
    protected _step = 1;

    readonly increaseButton: Button;
    readonly decreaseButton: Button;

    constructor(state?: State<number>) {
        super(0, state);

        this.state.set(this.applyToValue(this.state.value), false);

        this.increaseButton = Button.compact(IconName.SMALL_ARROW_UP);
        this.increaseButton.classList.add("increase", "no-anim");
        this.decreaseButton = Button.compact(IconName.SMALL_ARROW_DOWN);
        this.decreaseButton.classList.add("decrease", "no-anim");

        this.classList.add("number-input");

        this.append(DOM.div("spin-buttons", this.increaseButton, this.decreaseButton));
    }

    increase(isShift=false): this {
        if (!this.allowIncrease) return this;

        this.setValue(this.value + this.step * (isShift ? NumberInput.SHIFT_MUL : 1));
        return this;
    }
    decrease(isShift=false): this {
        if (!this.allowDecrease) return this;

        this.setValue(this.value - this.step * (isShift ? NumberInput.SHIFT_MUL : 1));
        return this;
    }

    applyToValue(value: number): number {
        return Utils.clamp(value, this.min, this.max);
    }
    formatValue(value: string | number): number {
        return +Utils.safeEvalNumber(value.toString(), this.value).toFixed(this.fixed);
    }
    formatDisplayValue(value: number): string {
        return Utils.clamp(value, this.min, this.max).toFixed(this.fixed);
    }

    protected _updateButtonsState() {
        this.increaseButton.setIsEnabled(this.allowIncrease);
        this.decreaseButton.setIsEnabled(this.allowDecrease);
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.WHEEL, this._onWheel.bind(this));
        this.listen(this.increaseButton, EventName.DOWN, this._onIncreaseDown.bind(this));
        this.listen(this.decreaseButton, EventName.DOWN, this._onDecreaseDown.bind(this));
    }
    protected _onWheel(event: WheelEvent) {
        if (!this.isFocused) return;

        if (event.deltaY < -NumberInput.WHEEL_THRESHOLD)
            this.increase(event.shiftKey);
        else if (event.deltaY > NumberInput.WHEEL_THRESHOLD)
            this.decrease(event.shiftKey);
    }
    protected _onIncreaseDown(event: MouseEvent) {
        this.increase(event.shiftKey);
    }
    protected _onDecreaseDown(event: MouseEvent) {
        this.decrease(event.shiftKey);
    }

    protected _onKeyDown(event: KeyboardEvent): void {
        super._onKeyDown(event);
		// TODO: make it simple too
        if (KeyBind.ARROW_UP.setGentle().test(event)) {
            event.preventDefault();
            this.increase(event.shiftKey);
        } else if (KeyBind.ARROW_DOWN.setGentle().test(event)) {
            event.preventDefault();
            this.decrease(event.shiftKey);
        }
    }
    protected _onValueChange(value: number): void {
        super._onValueChange(value);

        this._updateButtonsState();
    }

    // Set
    setIsInt(): this {
        return this.setFixed(0);
    }
    setFixed(value: number): this {
        value = Math.floor(value);
        if (value < 0)
            Dev.throwError(`numberInput.fixed must be >= 0!`);
        if (value > 4)
            Dev.warn(`numberInput.fixed is too big (${ value }). A value of <= 4 is recommended`)

        this._fixed = value;
        return this;
    }
    setMin(value: number): this {
        if (!Dev.assert(value <= this.max, "value <= this.max")) return this;

        this._min = value;
        return this;
    }
    setMax(value: number): this {
        if (!Dev.assert(value >= this.min, "value >= this.min")) return this;

        this._max = value;
        return this;
    }
    setClamp(min: number, max: number): this {
        return this.setMin(min).setMax(max);
    }
    setStep(value: number): this {
        if (!Dev.assert(value <= 0, "value <= 0")) return this;
        
        this._step = value;
        return this;
    }

    // Get
    get fixed(): number {
        return this._fixed;
    }
    get min(): number {
        return this._min;
    }
    get max(): number {
        return this._max;
    }
    get step(): number {
        return this._step;
    }
    get isInt(): boolean {
        return this.fixed == 0;
    }
    get allowIncrease(): boolean {
        return this.state.value < this.max;
    }
    get allowDecrease(): boolean {
        return this.state.value > this.min;
    }
}
