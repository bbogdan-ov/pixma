import { BaseApp } from "@base/BaseApp";
import AppElement from "@source/elements/AppElement";
import DragManager from "@base/managers/DragManager";
import { SelectionManager, TabsManager } from "@base/managers";
import { BrushesManager, PluginsManager, ProjectsManager, ToolsManager } from "./managers";
import type { Tool } from "./common/tools";
import type { Layer } from "./common/layers";
import type { Project } from "./common/project";
import { CommandFunc, CommandsManager } from "@base/managers/CommandsManager";
import { initAppCommands } from "./commands";
import { AppCommand } from "./types/enums";

export const APP_NAMESPACE = "pixma";

export class App extends BaseApp<AppElement> {
	readonly commands: CommandsManager;
    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;
    readonly plugins: PluginsManager;

    constructor() {
		super();

		this.commands = new CommandsManager(this);
        this.tabs = new TabsManager(this);
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.brushes = new BrushesManager(this);
        this.tools = new ToolsManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

		initAppCommands(this);

		addEventListener("keydown", e=> {
			if (e.code == "KeyA")
				this.commands.call(AppCommand.ADD_DRAWING_LAYER_BELOW);
			if (e.code == "KeyD")
				this.commands.call(AppCommand.ADD_DRAWING_LAYER_ABOVE);
			if (e.code == "KeyH")
				this.commands.call(AppCommand.HELLO);
		})

		this._element = new AppElement(this);
    }

	/** Register command with "pixma" namespace */
	registerCommand(context: string, name: string, func: CommandFunc): boolean {
		return this.commands.register(APP_NAMESPACE, context, name, func);
	}
    /** Alias to `app.toolsRegistries.register()` */
    registerTool(name: string, tool: Tool, override?: boolean): boolean {
		return this.tools.register(name, tool, override);
    }

	// Get
	get currentTool(): Tool | null {
		return this.tools.current;
	}
	get currentLayer(): Layer | null {
		return this.currentProject?.layers.current ?? null;
	}
	get currentProject(): Project | null {
		return this.projects.current;
	}
}
