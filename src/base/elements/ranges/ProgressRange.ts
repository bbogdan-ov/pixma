import { State } from "@base/common/listenable";
import { BaseRange } from ".";
import { NumberInput } from "../inputs";
import { DOM, Utils } from "@base/utils";
import { EventName } from "@base/types/enums";

@BaseRange.define("progress-range")
export default class ProgressRange extends BaseRange {
    protected _input: NumberInput | null;
    readonly progressElement: HTMLDivElement;
    readonly draggableElement: HTMLDivElement;

    constructor(state?: State<number>) {
        super(state);

        this._input = new NumberInput(this.state);
        this.progressElement = DOM.div("range-progress");
        this.draggableElement = DOM.div("range-draggable");

		this.setWidth(140);

        this.classList.add("progress-range");

        this.draggableElement.append(this.progressElement);
        this.append(
            this.draggableElement,
            this._input
        )
    }

    protected _updateProgress() {
        this.progressElement.style.width = ((Utils.clamp(this.value, this.min, this.max) - this.min) / (this.max - this.min) * 100) + "%";
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.draggableElement, EventName.DOWN, this._onDraggableDown.bind(this));

        this._updateProgress();
    }

	protected _onStateChange(value: number) {
		super._onStateChange(value);
		this._updateProgress();
	}

    protected _onDraggableDown(event: PointerEvent) {
        this._isChanging = true;
        this.setValueFromMouse(event);
    }
    protected _onWindowMove(event: PointerEvent) {
        super._onWindowMove(event);
        if (!this._isChanging) return;

        this.setValueFromMouse(event);
    }
    protected _onWheel(event: WheelEvent): void {
        if (this.input ? !this.input.isFocused : true)
            super._onWheel(event);
    }

    // Set
    removeInput(): this {
        this.input?.remove();
        this._input = null;
        return this;
    }
    setMin(value: number): this {
        this.input?.setMin(value);
        return super.setMin(value);
    }
    setMax(value: number): this {
        this.input?.setMax(value);
        return super.setMax(value);
    }
    setStep(value: number): this {
        this.input?.setStep(value);
        return super.setStep(value);
    }
    setFixed(value: number): this {
        this.input?.setFixed(value);
        return this;
    }
    setIsInt(): this {
        this.input?.setIsInt()
        return this;
    }

    // Get
    get input(): NumberInput | null {
        return this._input;
    }
}
