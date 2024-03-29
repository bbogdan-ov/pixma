import { State } from "@base/common/listenable";
import { BaseRange } from ".";
import { DOM, Utils } from "@base/utils";
import { EventName } from "@base/types/enums";

@BaseRange.define("thumb-range")
export default class ThumbRange extends BaseRange {
    readonly thumbElement: HTMLDivElement;
    readonly draggableElement: HTMLDivElement;

    constructor(state?: State<number>) {
        super(state);

        this.thumbElement = DOM.div("range-thumb");
        this.draggableElement = DOM.div("range-draggable");
        
        this.classList.add("thumb-range");
        this.classList.remove("focusable");

        this.draggableElement.append(DOM.div("range-track"));
        this.append(
            this.draggableElement,
            this.thumbElement
        );
    }

    protected _updateThumb() {
        const p = ((Utils.clamp(this.value, this.min, this.max) - this.min) / (this.max - this.min) * 100);
        this.thumbElement.style.left = p + "%";
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.draggableElement, EventName.DOWN, this._onDraggableDown.bind(this));

        this._updateThumb();
    }

	protected _onStateChange(value: number): void {
	    super._onStateChange(value);
		this._updateThumb();
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
}
