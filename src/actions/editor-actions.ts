import { ActionAppContainedAttachable, AppContainedAction } from ".";
import { DrawingLayer } from "@source/common/layers";

// Swap colors
export class SwapColorsAction extends AppContainedAction {
	execute(): boolean {
	    super.execute();

		return this.app.brushes.swapColors();
	}
}

// Add drawing layer
export class AddDrawingLayerAction extends AppContainedAction {
	constructor(public above: boolean, attachable: ActionAppContainedAttachable) { super(attachable) }

	execute(): boolean {
	    super.execute();
		const layers = this.app.currentProject?.layers;
		if (!layers) return false;

		return layers.addNearCurrent(new DrawingLayer(layers), this.above);
	}
}

// Remove cur layer
export class RemoveCurrentLayer extends AppContainedAction {
	execute(): boolean {
	    super.execute();
		return this.app.currentProject?.layers.removeCurrent() ?? false;
	}
}
