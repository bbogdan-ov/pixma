import type { App } from "./App";
import { DrawingLayer } from "./common/layers";
import { AppCommand, AppContext } from "./types/enums";

export function initAppCommands(app: App) {

	app.registerCommand(AppContext.APP, AppCommand.HELLO, ()=> alert("Hello, PIXMA!"));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_FIRST_TAB,   ()=> enterTab(0));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_SECOND_TAB,  ()=> enterTab(1));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_THIRD_TAB,   ()=> enterTab(2));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_FOURTH_TAB,  ()=> enterTab(3));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_FIFTH_TAB,   ()=> enterTab(4));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_SIXTH_TAB,   ()=> enterTab(5));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_SEVENTH_TAB, ()=> enterTab(6));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_EIGHTH_TAB,  ()=> enterTab(7));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_NINETH_TAB,  ()=> enterTab(8));
	app.registerCommand(AppContext.APP, AppCommand.ENTER_TENTH_TAB,   ()=> enterTab(9));

	app.registerCommand(AppContext.PROJECT, AppCommand.ADD_DRAWING_LAYER_ABOVE, addDrawingLayerAboveCurrent);
	app.registerCommand(AppContext.PROJECT, AppCommand.ADD_DRAWING_LAYER_BELOW, addDrawingLayerBelowCurrent);

	// Commands
	// App
	function enterTab(num: number) {
		const tab = app.tabs.list[num];
		if (!tab) return;
		app.tabs.enter(tab);
	}
	// Project
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
