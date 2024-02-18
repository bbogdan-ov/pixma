import { Color } from "@base/common/misc";
import { BaseElement } from "@base/elements";
import { EventName } from "@base/types/enums";
import { DOM } from "@base/utils";
import App from "@source/App";

@BaseElement.define("brush-colors-bubble")
export default class BrushColorsBubble extends BaseElement {
    readonly app: App;
    
    readonly front = DOM.div("front");
    readonly back = DOM.div("back");
    
    constructor(app: App) {
        super();

        this.app = app;

        this.classList.add("brush-colors-bubble");

        this.append(this.back);
        this.append(this.front);
    }

    onMount(): void {
        super.onMount();

        this.listen(this.app.brushes.frontColorState, this._onFrontColorChange.bind(this), true);
        this.listen(this.app.brushes.backColorState, this._onBackColorChange.bind(this), true);

        // TEMP: click to swap colors
        this.listen(this, EventName.CLICK, this._onClick.bind(this));
    }
    protected _onFrontColorChange(color: Color) {
        this.style.setProperty("--front-color", color.getRgbString());
    }
    protected _onBackColorChange(color: Color) {
        this.style.setProperty("--back-color", color.getRgbString());
    }

    protected _onClick() {
        this.app.brushes.swapColors();
    }
}
