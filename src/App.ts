import { BaseApp } from "@base/BaseApp";
import { SelectionManager, TabsManager, KeymapBind, DragManager, KeymapCondition, CommandFunc } from "@base/managers";
import { BrushesManager, PluginsManager, ProjectsManager, ToolsManager } from "./managers";
import { AppOption } from "./types/enums";
import AppElement from "@source/elements/AppElement";
import type { Tool } from "./common/tools";
import type { Layer } from "./common/layers";
import type { Project } from "./common/project";
import { initAppCommands } from "./commands";
import { initAppKeymaps } from "./keymaps";
import { initAppOptions } from "./options";

export class App extends BaseApp<AppElement> {
    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;
    readonly plugins: PluginsManager;

    constructor() {
		super();

        this.tabs = new TabsManager(this);
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.brushes = new BrushesManager(this);
        this.tools = new ToolsManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

		initAppOptions(this);
		initAppCommands(this);
		initAppKeymaps(this);

		this._element = new AppElement(this);
    }

	hello(): boolean {
		if (!this.options.getBoolean(AppOption.HELLO)) {
			alert("goodbye pixma...");
			return false;
		}

		const msg = this.options.getString(AppOption.HELLO_MESSAGE) ?? "no message...";
		alert(msg);
		return true;
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
	get isToolUsing(): boolean {
		return this.tools.isUsing;
	}
}
