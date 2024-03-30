import { ColorState } from "@base/common/listenable";
import { Color } from "@base/common/misc";
import { BaseElement } from "@base/elements";
import { EventName } from "@base/types/enums";
import { DOM } from "@base/utils";

@BaseElement.define("brush-colors-bubble")
export class BrushColorsBubble extends BaseElement {
    readonly frontState: ColorState;
    readonly backState: ColorState;
    
    readonly frontBubble = DOM.div("front");
    readonly backBubble = DOM.div("back");
    
    constructor(frontState: ColorState, backState: ColorState) {
        super();

        this.frontState = frontState;
        this.backState = backState;

        this.classList.add("brush-colors-bubble");

        this.append(this.backBubble);
        this.append(this.frontBubble);
    }

    swap() {
        const front = this.frontState.color.clone();
        this.frontState.set(this.backState.color.clone());
        this.backState.set(front);
    }
    
    // On
    onMount(): void {
        super.onMount();

        this.listen(this.frontState, this._onFrontChange.bind(this), true);
        this.listen(this.backState, this._onBackChange.bind(this), true);

        // TEMP: click to swap colors
        this.listen(this, EventName.CLICK, this._onClick.bind(this));
    }
    protected _onFrontChange(color: Color) {
        this.style.setProperty("--front-color", color.getRgbString());
    }
    protected _onBackChange(color: Color) {
        this.style.setProperty("--back-color", color.getRgbString());
    }

    protected _onClick() {
        this.swap();
    }
}
