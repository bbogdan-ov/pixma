import { State } from "@base/common/listenable";
import { DrawingTool } from ".";
import type { App } from "@source/App";
import type { Layer } from "../layers";
import type { MouseData } from "@base/types/types";
import { ToolParams } from "@source/elements/tools";

export class PenLikeTool extends DrawingTool {
	readonly isPixelPerfectState = new State<boolean>(false);

	constructor(namespace: string, name: string, app: App) {
		super(namespace, name, app);
	}

	use(layer: Layer, mouse: MouseData): void {
	    if (this.isPixelPerfect)
			this.drawPixelPerfect(layer, mouse);
		else
			super.use(layer, mouse)
	}
	drawPixelPerfect(layer: Layer, mouse: MouseData) {
		// TODO:
	}

    createParams(): ToolParams {
		const params = super.createParams();
		params.addCheckboxToggle(this.isPixelPerfectState, "pixel perfect");

		return params;
    }

	// Get
	get isPixelPerfect(): boolean {
		return this.isPixelPerfectState.value;
	}
}
