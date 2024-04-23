import { App } from "@source/App";
import { IconName } from "@base/types/enums";
import { ShapeTool } from "./ShapeTool";
import { MouseData } from "@base/managers";

export class LineTool extends ShapeTool {
	static readonly NAME = "line";

	constructor(app: App) {
		super(App.NAMESPACE, LineTool.NAME, app)

		this._iconName = IconName.LINE_TOOL;

		this.keymap(["3", "l"]);
	}

	draw(context: CanvasRenderingContext2D, mouse: MouseData): void {
		this.brush.drawLine(
			context,
			Math.floor(this.startX), Math.floor(this.startY),
			Math.floor(this.endX), Math.floor(this.endY)
		)
	}
}
