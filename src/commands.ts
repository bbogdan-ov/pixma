import type { App } from "./App";
import { DrawingLayer } from "./common/layers";
import { AppCommand, AppContext } from "./types/enums";

export function initAppCommands(app: App) {

	app.registerCommand(AppContext.APP, AppCommand.HELLO, ()=> alert("Hello, PIXMA!"));

	app.registerCommand(AppContext.PROJECT, AppCommand.ADD_DRAWING_LAYER_ABOVE, addDrawingLayerAboveCurrent);
	app.registerCommand(AppContext.PROJECT, AppCommand.ADD_DRAWING_LAYER_BELOW, addDrawingLayerBelowCurrent);

	//
	function addDrawingLayerAboveCurrent() {
		const layers = app.currentProject?.layers;
		if (!layers) return;
		layers.add(new DrawingLayer(layers), layers.currentIndex+1);
	}
	function addDrawingLayerBelowCurrent() {
		const layers = app.currentProject?.layers;
		if (!layers) return;
		layers.add(new DrawingLayer(layers), layers.currentIndex);
	}
}
