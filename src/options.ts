import { App } from "./App";
import { Project } from "./common/project";
import { AppOption, AppOptionCategory } from "./types/enums";

export function initAppOptions(app: App) {
	const opts = app.options;
	const cat = AppOptionCategory;
	const opt = AppOption;
	const bool = opts.registerBoolean.bind(opts, App.NAMESPACE);
	const int = opts.registerInt.bind(opts, App.NAMESPACE);
	const float = opts.registerFloat.bind(opts, App.NAMESPACE);
	const string = opts.registerString.bind(opts, App.NAMESPACE);

	// General
	bool	(cat.GENERAL, opt.HELLO, 					true);
	string	(cat.GENERAL, opt.HELLO_MESSAGE, 			"Hello PIXMA!");
	int		(cat.GENERAL, opt.DEFAULT_CANVAS_WIDTH, 	Project.DEFAULT_CANVAS_WIDTH, 1, Project.MAX_CANVAS_SIZE);
	int		(cat.GENERAL, opt.DEFAULT_CANVAS_HEIGHT,	Project.DEFAULT_CANVAS_HEIGHT, 1, Project.MAX_CANVAS_SIZE);
}
