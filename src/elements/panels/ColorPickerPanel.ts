import { ColorPicker } from "@base/elements/data";
import { Panel, PanelContent } from "@base/elements/panels";
import { Orientation } from "@base/types/enums";
import type { App } from "@source/App";

@Panel.define("color-picker-panel")
export class ColorPickerPanel extends Panel {
    readonly app: App;

    readonly colorPicker: ColorPicker;
    
    constructor(app: App) {
        super(Orientation.VERTICAL);

        this.app = app;

        this.colorPicker = new ColorPicker(app.brushes.frontColorState)
			.hideSaturationRange()
			.hideValueRange()
			.hideRgbInputs();

        this.classList.add("color-picker-panel");

        this.append(new PanelContent(this.colorPicker));
    }
}
