import { App } from "@source/App";
import { ColorfulTool } from "./ColorfulTool";
import { IconName } from "@base/types/enums";
import { MouseData } from "@base/types/types";
import { Layer } from "../layers";
import { Algorithms, ImageUtils } from "@source/utils";
import { Point } from "@base/common/math";

export class FillTool extends ColorfulTool {
	static readonly NAME = "fill";

	constructor(app: App) {
		super(App.NAMESPACE, FillTool.NAME, app);

		this._iconName = IconName.FILL_TOOL;

		this.keymap(["3", "f"])
	}

	onDown(layer: Layer, mouse: MouseData): void {
	    super.onDown(layer, mouse);

		const x = Math.floor(mouse.pos.x);
		const y = Math.floor(mouse.pos.y);
		const color = this.getColor(mouse.pressedButton);

		const data = layer.canvas.getImageData().data;

		const c = ImageUtils.getColorAt(data, (x + y * layer.width)*4);

		layer.context.fillStyle = color.getRgbString();
		Algorithms.linearFill(data, layer.width, layer.height, x, y, c, false, (x, y)=> {
			layer.context.fillRect(x, y, 1, 1);
		})
	}
}
