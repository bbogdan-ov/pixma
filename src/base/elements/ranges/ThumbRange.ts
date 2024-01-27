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
        
        this.setClamp(0, 100);

        this.classList.add("thumb-range");
        this.classList.remove("focusable");

        this.draggableElement.append(DOM.div("range-track"));
        this.append(
            this.draggableElement,
            this.thumbElement
        );
    }

    protected _updateThumb() {
        const p = ((Utils.clamp(this._tempValue, this.min, this.max) - this.min) / (this.max - this.min) * 100);
        this.thumbElement.style.left = p + "%";
        // this.thumbElement.style.translate = `${ -p }% -50%`;
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this.draggableElement, EventName.DOWN, this._onDraggableDown.bind(this));

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
    protected _onWindowUp(event: PointerEvent): void {
        if (this._isChanging)
            this.setValue(this._tempValue);

        super._onWindowUp(event);
    }

    // Set
    protected _setTempValue(value: number): this {
        super._setTempValue(value);
        this._updateThumb();
        return this;
    }
}
