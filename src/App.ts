import AppElement from "@source/elements/AppElement";
import DragManager from "@base/managers/DragManager";
import { SelectionManager, TabsManager } from "@base/managers";
import { BrushesManager, PluginsManager, ProjectsManager, ToolsManager } from "./managers";
import type { Tool } from "./common/tools";

export class App {
    readonly tabs: TabsManager;
    readonly selection: SelectionManager;
    readonly drag: DragManager;
    readonly tools: ToolsManager;
    readonly brushes: BrushesManager;
    readonly projects: ProjectsManager;
    readonly plugins: PluginsManager;

    readonly element: AppElement;

    constructor() {
        this.tabs = new TabsManager();
        this.selection = new SelectionManager();
        this.drag = new DragManager();
        this.brushes = new BrushesManager(this);
        this.tools = new ToolsManager(this);
        this.projects = new ProjectsManager(this);
        this.plugins = new PluginsManager(this);

        this.element = new AppElement(this);
    }

    /** Alias to `app.toolsRegistries.register()` */
    registerTool(name: string, tool: Tool, override?: boolean): boolean {
		return this.tools.register(name, tool, override);
    }

	// Get
	/** Alias to `app.tools.current` */
	get currentTool(): Tool | null {
		return this.tools.current;
	}
}
