import { Color } from "@base/common/misc";
import { BaseElement } from "@base/elements";
import { Icon } from "@base/elements/media";
import { EventName, IconName, MouseButton } from "@base/types/enums";
import { PaletteColor } from "@source/common/colors";

@BaseElement.define("palette-color")
export class PaletteColorElement extends BaseElement {
    readonly paletteColor: PaletteColor;
    
    constructor(paletteColor: PaletteColor) {
        super();

        this.paletteColor = paletteColor;

        this.classList.add("palette-color");
		this.append(
			new Icon(IconName.FOLD).addClassName("fold", "front-fold"),
			new Icon(IconName.FOLD).addClassName("fold", "back-fold"),
		)
    }

	protected _updateStyle() {
		this.classList.toggle("transparent-checkerboard", this.paletteColor.color.isTransparent);
		this.classList.toggle("front", this.paletteColor.isFront);
		this.classList.toggle("back", this.paletteColor.isBack);
        this.style.setProperty("--color", this.paletteColor.color.getRgbString());
	}

    // On
    onMount(): void {
        super.onMount();

        this.listen(this, EventName.DOWN, this._onDown.bind(this));

        this.listen(this.paletteColor.state, this._onStateChange.bind(this));
        this.listen(this.paletteColor.onDidRemoved, this._onRemove.bind(this));
		// FIX: this is very bad for performance
		// TODO: i should do something with this long lines
		this.listen(this.paletteColor.manager.project.app.brushes.frontColorState, this._onFrontColorChange.bind(this));
		this.listen(this.paletteColor.manager.project.app.brushes.backColorState, this._onBackColorChange.bind(this));

		this._updateStyle();
    }
    protected _onDown(event: MouseEvent) {
        if (event.button == MouseButton.LEFT)
            this.paletteColor.pickFront();
        if (event.button == MouseButton.RIGHT)
            this.paletteColor.pickBack();
        else if (event.button == MouseButton.MIDDLE)
            this.paletteColor.remove();
    }
	protected _onStateChange(color: Color) {
		this._updateStyle();
	}
	protected _onFrontColorChange(color: Color) {
		this._updateStyle();
	}
	protected _onBackColorChange(color: Color) {
		this._updateStyle();
	}
    protected _onRemove() {
        this.remove();
    }
}
