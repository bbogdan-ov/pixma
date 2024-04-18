import { ColorPicker } from "@base/elements/data";
import { Panel, WindowContent } from "@base/elements/windows";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";

@Panel.define("color-picker-panel")
export class ColorPickerPanel extends Panel<App> {
	static readonly NAME = "color-picker";

    readonly colorPicker: ColorPicker;
    
    constructor(app: App) {
        super(ColorPickerPanel.NAME, app.windows, Orientation.VERTICAL);

        this.colorPicker = new ColorPicker(app.brushes.frontColorState)
			.hideSaturationRange()
			.hideValueRange()
			.hideRgbInputs();

        this.append(new WindowContent(this.colorPicker));
    }
}
