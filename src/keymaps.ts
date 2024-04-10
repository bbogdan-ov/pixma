import type { App } from "./App";
import { AppCommand } from "./types/enums";

const cmd = AppCommand;

export function initAppKeymaps(app: App) {
	const map = app.registerKeymap.bind(app);

	// App
	map("shift-1", 		cmd.HELLO);
	map("alt-1", 		cmd.ENTER_FIRST_TAB);
	map("alt-2", 		cmd.ENTER_SECOND_TAB);
	map("alt-3", 		cmd.ENTER_THIRD_TAB);
	map("alt-4", 		cmd.ENTER_FOURTH_TAB);
	map("alt-5", 		cmd.ENTER_FIFTH_TAB);
	map("alt-6", 		cmd.ENTER_SIXTH_TAB);
	map("alt-7", 		cmd.ENTER_SEVENTH_TAB);
	map("alt-8", 		cmd.ENTER_EIGHTH_TAB);
	map("alt-9", 		cmd.ENTER_NINETH_TAB);
	map("alt-0", 		cmd.ENTER_TENTH_TAB);

	// Project
	map("x", 			cmd.SWAP_COLORS);
	map("ctrl-l", 		cmd.ADD_DRAWING_LAYER_ABOVE);

	// Other
	map("f2",			cmd.RENAME_CURRENT_LAYER);
}
