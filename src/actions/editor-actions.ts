import { DrawingLayer } from "@source/common/layers";
import { AppActionAttachable, AppContainedAction, type Command } from "@base/managers";
import type { App } from "@source/App";

// Swap colors
export class SwapColorsAction extends AppContainedAction<App> {
	execute(command: Command): boolean {
	    super.execute(command);

		return this.app.brushes.swapColors();
	}
}

// Add drawing layer
export class AddDrawingLayerAction extends AppContainedAction<App> {
	constructor(public above: boolean, attachable: AppActionAttachable<App>) { super(attachable) }

	execute(command: Command): boolean {
	    super.execute(command);
		const layers = this.app.currentProject?.layers;
		if (!layers) return false;

		return layers.addNearCurrent(new DrawingLayer(layers), this.above);
	}
}

// Remove cur layer
export class RemoveCurrentLayer extends AppContainedAction<App> {
	execute(command: Command): boolean {
	    super.execute(command);
		return this.app.currentProject?.layers.removeCurrent() ?? false;
	}
}
