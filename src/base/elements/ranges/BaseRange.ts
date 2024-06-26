import { State } from "@base/common/listenable";
import { FocusableElement } from "../FocusableElement";
import { Utils } from "@base/utils";
import { EventName } from "@base/types/enums";
import { Clamped, StateValueContained, Stepped } from "@base/types/types";
import { KeyBind } from "@base/common/binds";

@FocusableElement.define("base-range")
export class BaseRange
	extends FocusableElement
	implements StateValueContained<number>, Clamped, Stepped
{
    static readonly WHEEL_THRESHOLD = 1;
    static readonly SHIFT_MUL = 5;
	static readonly CHANGE_DEBOUNCE_DURATION = 200;

    readonly state: State<number>;

    protected _isChanging = false;
    protected _min = 0;
    protected _max = 100;
    protected _step = 1;

	protected _changeTimeout = -1;

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
        this._onChange(event);
    }
    protected _onWheel(event: WheelEvent) {
        if (event.deltaY < -BaseRange.WHEEL_THRESHOLD)
            this.increase(event.shiftKey);
        else if (event.deltaY > BaseRange.WHEEL_THRESHOLD)
            this.decrease(event.shiftKey);
        else
			return;

		clearTimeout(this._changeTimeout);
		this._changeTimeout = setTimeout(()=> {
			this._onChange(event);
		}, BaseRange.CHANGE_DEBOUNCE_DURATION);
    }
	protected _onKeyDown(event: KeyboardEvent) {
		if (KeyBind.test(event, KeyBind.ARROW_UP, KeyBind.ARROW_RIGHT))
			this.increase();
		else if (KeyBind.test(event, KeyBind.ARROW_DOWN, KeyBind.ARROW_LEFT))
			this.decrease();
		else
			return;

		this._onChange(event);
	}

	protected _onChange(event: Event) {
        this.dispatchEvent(new InputEvent(EventName.CHANGE));
	}
	protected _onInput(event: Event) {
        this.dispatchEvent(new InputEvent(EventName.INPUT));
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
        this._onInput(event);
    }
    setWidth(value: string | number): this {
        return this.setStyle("width", value);
    }
    setValue(value: number): this {
        this.state.set(Utils.clamp(value, this.min, this.max));
        return this;
    }
    setMin(value: number): this {
        this._min = Math.min(value, this.max);
        return this;
    }
    setMax(value: number): this {
        this._max = Math.max(value, this.min);
        return this;
    }
    setClamp(min: number, max: number): this {
        return this.setMin(min).setMax(max);
    }
    setStep(value: number): this {
        this._step = Math.max(value, 0);
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
