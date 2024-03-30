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
import { KeymapBind, KeymapsManager } from "@base/managers/KeymapsManager";
import { initAppKeymaps } from "./keymaps";
import { KeyBind } from "@base/common/binds";

export const APP_NAMESPACE = "pixma";

export class App extends BaseApp<AppElement> {
	readonly commands: CommandsManager;
	readonly keymaps: KeymapsManager;
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
		this.keymaps = new KeymapsManager(this.commands);
        this.tabs = new TabsManager(this);
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.brushes = new BrushesManager(this);
        this.tools = new ToolsManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

		initAppCommands(this);
		initAppKeymaps(this);

		this._element = new AppElement(this);
    }

	/** Register a new command with "pixma" namespace */
	registerCommand(context: string, name: string, func: CommandFunc): boolean {
		return this.commands.register(APP_NAMESPACE, context, name, func);
	}
	/**
	 * Register a keymap
	 * See `keymapsManager.register()` for more info
	 */
	registerKeymap(binds: KeymapBind, command: string): boolean {
		return this.keymaps.register(binds, command);
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
