import { Color } from "@base/common/misc";
import { BaseElement } from "@base/elements";
import { EventName, MouseButton } from "@base/types/enums";
import { PaletteColor } from "@source/common/colors";

@BaseElement.define("palette-color")
export class PaletteColorElement extends BaseElement {
    readonly paletteColor: PaletteColor;
    
    constructor(paletteColor: PaletteColor) {
        super();

        this.paletteColor = paletteColor;

        this.classList.add("palette-color");
    }

	protected _updateStyle() {
		this.classList.toggle("transparent", this.paletteColor.isTransparent);
        this.style.setProperty("--color", this.paletteColor.getRgbString());
	}

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.DOWN, this._onDown.bind(this));

        this.listen(this.paletteColor.state, this._onStateChange.bind(this));
        this.listen(this.paletteColor.onDidRemoved, this._onRemove.bind(this));

		this._updateStyle();
    }
    protected _onDown(event: MouseEvent) {
        if (event.button == MouseButton.LEFT)
            this.paletteColor.pick();
        else if (event.button == MouseButton.MIDDLE)
            this.paletteColor.remove();
    }
	protected _onStateChange(color: Color) {
		this._updateStyle();
	}
    protected _onRemove() {
        this.remove();
    }
}
