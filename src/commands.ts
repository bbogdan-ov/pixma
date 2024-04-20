import { App } from "./App";
import { AppCommand } from "./types/enums";

const cmd = AppCommand;

export function registerAppCommands(app: App) {
	const reg = app.registerCommand.bind(app);

	// App
	reg(cmd.HELLO);
	reg(cmd.ENTER_FIRST_TAB);
	reg(cmd.ENTER_SECOND_TAB);
	reg(cmd.ENTER_THIRD_TAB);
	reg(cmd.ENTER_FOURTH_TAB);
	reg(cmd.ENTER_FIFTH_TAB);
	reg(cmd.ENTER_SIXTH_TAB);
	reg(cmd.ENTER_SEVENTH_TAB);
	reg(cmd.ENTER_EIGHTH_TAB);
	reg(cmd.ENTER_NINETH_TAB);
	reg(cmd.ENTER_TENTH_TAB);

	// Editor
	reg(cmd.SWAP_COLORS);
	reg(cmd.ADD_DRAWING_LAYER_ABOVE);
	reg(cmd.ADD_DRAWING_LAYER_BELOW);
	reg(cmd.REMOVE_CURRENT_LAYER);

	// Windows
	reg(cmd.CLOSE_WINDOW);

	// Local
	reg(cmd.RENAME_CURRENT_LAYER);
}
