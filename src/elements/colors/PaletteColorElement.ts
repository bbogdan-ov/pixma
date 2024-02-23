import { BaseElement } from "@base/elements";
import { EventName, MouseButton } from "@base/types/enums";
import { PaletteColor } from "@source/common/colors";

@BaseElement.define("palette-color")
export default class PaletteColorElement extends BaseElement {
    readonly paletteColor: PaletteColor;
    
    constructor(paletteColor: PaletteColor) {
        super();

        this.paletteColor = paletteColor;
        this.setStyle("background", paletteColor.getRgbString());

        this.classList.add("palette-color");
    }

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.DOWN, this._onDown.bind(this));

        this.listen(this.paletteColor.onDidRemoved, this._onRemove.bind(this));
    }
    protected _onDown(event: MouseEvent) {
        if (event.button == MouseButton.LEFT)
            this.paletteColor.pick();
        else if (event.button == MouseButton.MIDDLE)
            this.paletteColor.remove();
    }
    protected _onRemove() {
        this.remove();
    }
}
