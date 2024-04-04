import type { App } from "./App";
import { DrawingLayer } from "./common/layers";
import { AppCommand, AppContext } from "./types/enums";

const cmd = AppCommand;

export function initAppCommands(app: App) {
	const regApp = app.registerCommand.bind(app, AppContext.APP);
	const regProject = app.registerCommand.bind(app, AppContext.PROJECT);

	regApp(cmd.HELLO, 							()=> app.hello());
	regApp(cmd.ENTER_FIRST_TAB,   				()=> app.tabs.enterByIndex(0));
	regApp(cmd.ENTER_SECOND_TAB,  				()=> app.tabs.enterByIndex(1));
	regApp(cmd.ENTER_THIRD_TAB,   				()=> app.tabs.enterByIndex(2));
	regApp(cmd.ENTER_FOURTH_TAB,  				()=> app.tabs.enterByIndex(3));
	regApp(cmd.ENTER_FIFTH_TAB,   				()=> app.tabs.enterByIndex(4));
	regApp(cmd.ENTER_SIXTH_TAB,   				()=> app.tabs.enterByIndex(5));
	regApp(cmd.ENTER_SEVENTH_TAB, 				()=> app.tabs.enterByIndex(6));
	regApp(cmd.ENTER_EIGHTH_TAB,  				()=> app.tabs.enterByIndex(7));
	regApp(cmd.ENTER_NINETH_TAB,  				()=> app.tabs.enterByIndex(8));
	regApp(cmd.ENTER_TENTH_TAB,   				()=> app.tabs.enterByIndex(9));

	regProject(cmd.SWAP_COLORS, 				()=> app.brushes.swapColors());
	regProject(cmd.ADD_DRAWING_LAYER_ABOVE, 	()=> addDrawingLayerBelowCurrent(1));
	regProject(cmd.ADD_DRAWING_LAYER_BELOW, 	()=> addDrawingLayerBelowCurrent(0));

	// Project
	function addDrawingLayerBelowCurrent(offset: number) {
		const layers = app.currentProject?.layers;
		if (!layers) return;
		layers.add(new DrawingLayer(layers), layers.currentIndex+offset);
	}
}
